# Send Blog Email - Supabase Edge Function

This edge function sends email notifications to subscribers whenever a new blog post is published.

## Setup Instructions

### 1. Set Up Supabase Secrets

You need to configure the following secrets in your Supabase project:

```bash
# Set SMTP credentials
supabase secrets set SMTP_HOST=smtp.gmail.com  # Your SMTP server
supabase secrets set SMTP_PORT=587              # SMTP port (usually 587 for TLS or 465 for SSL)
supabase secrets set SMTP_USER=your-email@gmail.com
supabase secrets set SMTP_PASSWORD=your-app-password
supabase secrets set SMTP_FROM_EMAIL=your-email@gmail.com
supabase secrets set SMTP_FROM_NAME="Taia Blog"
supabase secrets set PUBLIC_SITE_URL=https://yoursite.com
```

### 2. Deploy the Function

```bash
# Deploy to Supabase
supabase functions deploy send-blog-email
```

### 3. Set Up Database Trigger

Create a database webhook to trigger this function when a new blog post is inserted:

#### Option A: Using Supabase Dashboard

1. Go to Database → Webhooks
2. Create a new webhook:
   - **Name**: send-blog-email-trigger
   - **Table**: your_blog_posts_table
   - **Events**: INSERT
   - **Type**: HTTP Request
   - **Method**: POST
   - **URL**: `https://[your-project-ref].supabase.co/functions/v1/send-blog-email`
   - **HTTP Headers**: 
     ```
     Authorization: Bearer [your-anon-key]
     Content-Type: application/json
     ```

#### Option B: Using SQL

```sql
-- Create a function that calls the edge function
CREATE OR REPLACE FUNCTION notify_new_blog_post()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://[your-project-ref].supabase.co/functions/v1/send-blog-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer [your-service-role-key]'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_blog_post_created
  AFTER INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_blog_post();
```

### 4. Update Your Database Schema

Make sure your users table has a column to track blog notification preferences:

```sql
-- Add blog_notifications column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS blog_notifications BOOLEAN DEFAULT false;

-- Update existing users who want notifications
UPDATE users 
SET blog_notifications = true 
WHERE email IS NOT NULL;
```

### 5. Test the Function

You can test the function manually:

```bash
# Create a test payload
curl -i --location --request POST \
  'https://[your-project-ref].supabase.co/functions/v1/send-blog-email' \
  --header 'Authorization: Bearer [your-anon-key]' \
  --header 'Content-Type: application/json' \
  --data '{
    "record": {
      "id": "test-id",
      "title": "Test Blog Post",
      "slug": "test-blog-post",
      "excerpt": "This is a test blog post excerpt",
      "author": "Test Author",
      "created_at": "2026-01-27T00:00:00Z"
    }
  }'
```

## SMTP Provider Configuration

### Gmail
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Enable 2FA and create an App Password
- Use the App Password as SMTP_PASSWORD

### SendGrid
- Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: Your SendGrid API key

### Amazon SES
- Host: `email-smtp.[region].amazonaws.com`
- Port: `587`
- Generate SMTP credentials from AWS Console

### Mailgun
- Host: `smtp.mailgun.org`
- Port: `587`
- Use your Mailgun SMTP credentials

## Customization

### Email Template

The email template is defined in the `generateEmailHtml()` function. You can customize:
- Colors and styling
- Logo and branding
- Content layout
- Footer links

### Subscriber Query

Update the subscriber query in `index.ts` to match your database schema:

```typescript
const { data: subscribers } = await supabase
  .from("users")
  .select("email, name")
  .eq("blog_notifications", true);
```

### Blog Post Fields

Adjust the blog post fields used in the email template:
- `record.title` - Blog post title
- `record.slug` - URL slug
- `record.excerpt` - Short description
- `record.author` - Author name
- `record.created_at` - Publication date

## Monitoring

View function logs:

```bash
supabase functions logs send-blog-email
```

Or in the Supabase Dashboard: Edge Functions → send-blog-email → Logs

## Troubleshooting

### Emails not sending
- Check SMTP credentials are correct
- Verify SMTP port (587 for TLS, 465 for SSL)
- Check function logs for errors
- Test SMTP credentials with a simple email client

### No subscribers
- Verify users have `blog_notifications = true`
- Check the subscriber query matches your schema

### Trigger not firing
- Verify the database trigger/webhook is active
- Check the table name matches your blog posts table
- Verify the webhook URL is correct

## Security Notes

- Never commit SMTP credentials to version control
- Use Supabase secrets for all sensitive data
- Use service role key for database operations
- Consider rate limiting for production use
- Implement unsubscribe functionality
