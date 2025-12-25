# Quick Start: Supabase Authentication Setup

Follow these steps to get authentication up and running quickly.

## 1. Supabase Project Setup (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Choose organization and create project
4. Wait for project to finish provisioning

### Get Credentials
1. Go to **Project Settings** → **API**
2. Copy your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key (under "Project API keys")

### Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Save changes

## 2. Configure Application (2 minutes)

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
VITE_GA_MEASUREMENT_ID=YOUR_MEASUREMENT_ID_HERE
```

## 3. Run Database Migration (3 minutes)

### Option A: Using Supabase SQL Editor (Recommended)
1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy contents from `migrations/auth-enrollment-migration.sql`
4. Paste and click **Run**
5. Verify "Success. No rows returned" message

### Option B: Using CLI
```bash
# If you have Supabase CLI installed
supabase db push

# Or connect directly with psql
psql -h db.xxxxx.supabase.co -U postgres -d postgres -f migrations/auth-enrollment-migration.sql
```

## 4. Install Dependencies (1 minute)

```bash
npm install
```

## 5. Start Development Server

```bash
npm run dev
```

## 6. Test Authentication (5 minutes)

### Test Sign Up
1. Open http://localhost:5173
2. Click "Courses" in navigation
3. Click on any course
4. Click "Start Learning" button
5. Click "Sign up" in the modal
6. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
7. Click "Sign Up"

### Confirm Email
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find your test user
3. Click the three dots → "Send verification email"
4. Or use the magic link in the dashboard to verify

### Test Sign In
1. Click "Sign In" in navigation
2. Enter credentials
3. Click "Sign In"
4. Verify you're logged in (see user menu in top right)

### Test Enrollment
1. While signed in, go to a course page
2. Click "Start Learning"
3. Should automatically enroll and redirect to first module
4. Verify enrollment in Supabase Dashboard:
   - Go to **Table Editor** → **course_enrollments**
   - See your enrollment record

## 7. Verify Setup

Run through this checklist:

- [ ] Can create new account
- [ ] Can sign in with email/password
- [ ] User menu appears in navigation when signed in
- [ ] Can enroll in courses
- [ ] Enrollment persists after refresh
- [ ] Can sign out
- [ ] Cannot access enrolled course after sign out
- [ ] Can sign back in and access enrolled courses

## Common Issues & Solutions

### "Missing Supabase environment variables"
- **Solution**: Check `.env` file exists and has correct variables
- Restart dev server after changing `.env`

### "Invalid login credentials"
- **Solution**: Check email is verified in Supabase Dashboard
- Go to Auth → Users → Click user → Verify email manually

### "Row Level Security policy violation"
- **Solution**: Ensure migration ran successfully
- Check SQL Editor for any errors
- Re-run migration if needed

### Email not sending
- **Solution**: For development, manually verify users in Supabase Dashboard
- For production, configure SMTP settings in Supabase

## Next Steps

Once basic auth is working:

1. **Customize Email Templates**
   - Go to Auth → Email Templates
   - Edit confirmation and reset password emails

2. **Configure Site URL**
   - Go to Auth → URL Configuration  
   - Add your production URL

3. **Set Password Requirements**
   - Go to Auth → Policies
   - Adjust minimum password length if needed

4. **Add OAuth Providers** (Optional)
   - Enable Google, GitHub, etc. in Auth → Providers
   - Configure OAuth apps in respective platforms

5. **Test in Production**
   - Deploy to hosting platform
   - Update Supabase URL configuration
   - Test full auth flow in production

## Resources

- [Full Setup Guide](./AUTH-SETUP.md) - Detailed documentation
- [Supabase Docs](https://supabase.com/docs/guides/auth) - Official auth guide
- [Migration File](../migrations/auth-enrollment-migration.sql) - Database schema

## Need Help?

1. Check Supabase Dashboard logs (Auth → Logs)
2. Check browser console for errors
3. Review [AUTH-SETUP.md](./AUTH-SETUP.md) for detailed troubleshooting
4. Visit Supabase Discord for community support
