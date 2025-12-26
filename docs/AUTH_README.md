# Authentication System Documentation

## Overview

This application features a complete authentication system built with **Supabase** and **React**. The system includes user registration, login, password reset, protected routes, and user profile management.

## Features

- ✅ **Email/Password Authentication**
- ✅ **User Registration with Email Verification**
- ✅ **Secure Login**
- ✅ **Password Reset via Email**
- ✅ **Protected Routes**
- ✅ **User Profile Management**
- ✅ **Session Management**
- ✅ **Automatic Route Protection**

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-public-key-here
```

You can find these values in your [Supabase Dashboard](https://app.supabase.com) under:
`Settings → API → Project URL` and `Project API keys → anon/public`

### 2. Set Up Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Ensure **Email** provider is enabled
4. Configure **Email Templates** (optional but recommended):
   - Confirmation email
   - Password reset email
   - Magic link email

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

## File Structure

```
src/
├── context/
│   └── auth-context.tsx          # Auth context and hooks
├── components/
│   ├── auth/
│   │   ├── login-form.tsx        # Login component
│   │   ├── signup-form.tsx       # Registration component
│   │   ├── forgot-password-form.tsx   # Password reset request
│   │   ├── reset-password-form.tsx    # Password update form
│   │   └── protected-route.tsx   # Route protection wrapper
│   └── ui/                       # Reusable UI components
├── routes/
│   ├── index.tsx                 # Home page
│   ├── login.tsx                 # Login route
│   ├── signup.tsx                # Signup route
│   ├── forgot-password.tsx       # Password reset request route
│   ├── reset-password.tsx        # Password update route
│   └── profile.tsx               # Protected user profile
└── lib/
    └── supabase.ts               # Supabase client configuration
```

## Usage

### Using the Auth Context

The `AuthContext` provides authentication state and methods throughout your app:

```tsx
import { useAuth } from '@/context/auth-context';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome, {user.email}!</div>;
}
```

### Available Auth Methods

```tsx
const {
  user,              // Current user object or null
  session,           // Current session object or null
  loading,           // Loading state (true during initial auth check)
  signUp,            // (email, password, metadata?) => Promise
  signIn,            // (email, password) => Promise
  signOut,           // () => Promise
  resetPassword,     // (email) => Promise
  updatePassword,    // (newPassword) => Promise
} = useAuth();
```

### Protecting Routes

Wrap any component with `ProtectedRoute` to require authentication:

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <YourProtectedContent />
    </ProtectedRoute>
  );
}
```

### Sign Up Example

```tsx
const { signUp } = useAuth();

const handleSignUp = async () => {
  const { error } = await signUp(
    'user@example.com',
    'password123',
    { fullName: 'John Doe' }
  );

  if (error) {
    console.error('Sign up failed:', error.message);
  } else {
    console.log('Check your email for verification!');
  }
};
```

### Sign In Example

```tsx
const { signIn } = useAuth();

const handleSignIn = async () => {
  const { error } = await signIn('user@example.com', 'password123');

  if (error) {
    console.error('Sign in failed:', error.message);
  } else {
    console.log('Successfully signed in!');
  }
};
```

### Password Reset Flow

1. User requests password reset at `/forgot-password`
2. Supabase sends reset email with magic link
3. Link redirects to `/reset-password`
4. User enters new password
5. Password is updated and user is redirected to profile

## Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Home page with auth status | No |
| `/login` | Login form | No |
| `/signup` | Registration form | No |
| `/forgot-password` | Request password reset | No |
| `/reset-password` | Update password (from email link) | No |
| `/profile` | User profile page | ✅ Yes |

## User Profile Data

User metadata is stored in the `user_metadata` field:

```tsx
const { user } = useAuth();

// Access user data
const email = user?.email;
const fullName = user?.user_metadata?.fullName;
const userId = user?.id;
const createdAt = user?.created_at;
```

## Security Features

- **Secure password handling** - Passwords never stored in plain text
- **Email verification** - Users must verify email before full access
- **Session management** - Automatic token refresh
- **Protected routes** - Unauthorized users redirected to login
- **Password reset** - Secure email-based password recovery

## Supabase Configuration

### Email Templates

Customize email templates in Supabase Dashboard:
1. Go to **Authentication** → **Email Templates**
2. Edit templates for:
   - Confirm signup
   - Reset password
   - Magic link

### Redirect URLs

Configure allowed redirect URLs in Supabase:
1. Go to **Authentication** → **URL Configuration**
2. Add your local and production URLs:
   ```
   http://localhost:5173/**
   https://yourdomain.com/**
   ```

## Troubleshooting

### Users Not Receiving Emails

1. Check Supabase email service status
2. Verify email provider settings in Supabase
3. Check spam folder
4. Consider configuring custom SMTP

### "Invalid credentials" Error

- Verify email is confirmed
- Check password meets minimum requirements (6+ characters)
- Ensure environment variables are correctly set

### Session Not Persisting

- Check browser localStorage is enabled
- Verify Supabase URL and keys are correct
- Check for CORS issues in production

## Next Steps

### Extend Authentication

- Add OAuth providers (Google, GitHub, etc.)
- Implement role-based access control (RBAC)
- Add two-factor authentication (2FA)
- Create user profile editing
- Add avatar upload functionality

### Database Integration

Create a `user_profiles` table in Supabase:

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Support

For issues or questions:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [TanStack Router Documentation](https://tanstack.com/router)

## License

This authentication system is part of your application and follows your project's license.
