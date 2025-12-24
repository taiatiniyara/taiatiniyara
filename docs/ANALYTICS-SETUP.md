# Setup Instructions for Google Analytics 4

## Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** (gear icon in the bottom left)
3. In the **Account** column, select or create an account
4. In the **Property** column, click **Create Property**
5. Enter property details:
   - Property name: `Taia Tiniyara Website`
   - Time zone: Your timezone
   - Currency: Your currency
6. Click **Next** and configure business information
7. Click **Create** and accept the Terms of Service

## Step 2: Get Your Measurement ID

1. After creating the property, you'll see **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website URL: `https://taia.blog`
4. Stream name: `Taia Tiniyara Website`
5. Click **Create stream**
6. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 3: Configure Your Local Environment

1. Create a `.env` file in your project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace `YOUR_MEASUREMENT_ID_HERE` with your actual Measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Important**: Add `.env` to your `.gitignore` file (it should already be there)

## Step 4: Configure for Firebase Hosting

Since you're using Firebase, you need to configure the environment variable for production:

### Option A: Build-time Environment Variable
Before building for production, set the environment variable:

```bash
# Windows
set VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX && npm run build

# Linux/Mac
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

### Option B: Create .env.production
Create a `.env.production` file:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Then build normally:
```bash
npm run build
```

## Step 5: Deploy

After building with your Measurement ID:
```bash
firebase deploy
```

## What's Been Implemented

✅ Google Analytics 4 tracking script added to `index.html`
✅ Custom analytics hook (`useAnalytics`) for automatic page view tracking
✅ Integration in root layout for app-wide tracking
✅ Environment variable configuration for easy setup
✅ TypeScript definitions for gtag

## What Will Be Tracked

Once deployed, you'll be able to see in Google Analytics:

- **Page Views**: Every page visit with path, title, and URL
- **User Count**: Total visitors, new vs returning
- **Session Duration**: How long users stay
- **Traffic Sources**: Where visitors come from
- **Geographic Data**: Countries, cities where users are located
- **Device Information**: Desktop vs mobile, browsers, OS
- **Popular Pages**: Which pages get the most visits
- **Real-time**: Live visitors on your site right now

## Testing Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to your site
3. Go to Google Analytics → **Reports** → **Realtime**
4. You should see yourself as an active user!
5. Navigate between pages and watch the page views update

## Custom Event Tracking (Optional)

You can also track custom events using the `trackEvent` function:

```typescript
import { trackEvent } from '@/hooks/useAnalytics';

// Example: Track button clicks
trackEvent('button_click', {
  button_name: 'Contact Me',
  page: '/about'
});

// Example: Track form submissions
trackEvent('form_submit', {
  form_name: 'Contact Form',
  success: true
});
```

## Troubleshooting

### Analytics not working?
- Check that your Measurement ID is correct (starts with `G-`)
- Verify `.env` file is in project root
- Restart your dev server after creating/updating `.env`
- Check browser console for errors
- Disable ad blockers (they may block GA)

### Not seeing data in Google Analytics?
- Wait 24-48 hours for data to fully populate
- Check **Realtime** reports for immediate validation
- Ensure you're looking at the correct property/stream

## Privacy & GDPR Compliance

Consider adding a cookie consent banner if you have EU visitors. Popular options:
- [CookieBot](https://www.cookiebot.com/)
- [OneTrust](https://www.onetrust.com/)
- DIY solution with local storage

## Next Steps

Once analytics is working, explore:
- **Conversion tracking**: Track specific goals (newsletter signups, downloads, etc.)
- **E-commerce tracking**: If you sell anything
- **Custom dashboards**: Create views for specific metrics
- **Link GA4 to Google Search Console**: See search performance data
