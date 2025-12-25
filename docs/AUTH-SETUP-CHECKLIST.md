# Supabase Authentication Setup Checklist

Use this checklist to ensure your authentication system is properly set up.

## Prerequisites Setup
- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] New Supabase project created
- [ ] Project finished provisioning (takes 1-2 minutes)

## Configuration Steps

### 1. Supabase Dashboard Setup
- [ ] Opened project in Supabase Dashboard
- [ ] Copied Project URL from Settings → API
- [ ] Copied Anon/Public Key from Settings → API
- [ ] Enabled Email provider in Authentication → Providers
- [ ] Configured site URL in Authentication → URL Configuration

### 2. Local Environment Setup
- [ ] Created `.env` file in project root
- [ ] Added `VITE_SUPABASE_URL` to `.env`
- [ ] Added `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` to `.env`
- [ ] Restarted development server

### 3. Database Migration
- [ ] Opened SQL Editor in Supabase Dashboard
- [ ] Copied contents of `migrations/auth-enrollment-migration.sql`
- [ ] Pasted and executed SQL in editor
- [ ] Verified "Success. No rows returned" message
- [ ] Checked Tables Editor for new columns

### 4. Email Configuration (Optional)
- [ ] Customized "Confirm signup" email template
- [ ] Customized "Reset password" email template
- [ ] Customized "Magic link" email template (if using)
- [ ] Set up custom SMTP (for production)

## Testing Phase

### User Registration
- [ ] Opened application in browser
- [ ] Clicked "Sign In" button
- [ ] Switched to "Sign Up" mode
- [ ] Entered name, email, password
- [ ] Clicked "Sign Up" button
- [ ] Saw success message about email confirmation
- [ ] Went to Supabase Dashboard → Auth → Users
- [ ] Found test user in list
- [ ] Manually verified email in dashboard (for testing)

### User Login
- [ ] Clicked "Sign In" button
- [ ] Entered test user credentials
- [ ] Successfully signed in
- [ ] Saw user menu in navigation
- [ ] Profile dropdown shows user email

### Course Enrollment
- [ ] Navigated to a course page while signed in
- [ ] Clicked "Start Learning" button
- [ ] Successfully enrolled (no errors)
- [ ] Redirected to first module
- [ ] Checked Supabase Dashboard → Table Editor → course_enrollments
- [ ] Verified enrollment record exists with correct user_id

### Persistence
- [ ] Refreshed page while signed in
- [ ] Still signed in after refresh
- [ ] Enrollment status persists
- [ ] Can access enrolled course modules

### Sign Out
- [ ] Clicked user menu
- [ ] Clicked "Sign Out"
- [ ] Successfully signed out
- [ ] User menu disappeared
- [ ] Cannot access enrolled courses when signed out

### Password Reset (Optional)
- [ ] Clicked "Sign In" button
- [ ] Clicked "Forgot password?"
- [ ] Entered email address
- [ ] Saw success message
- [ ] Checked email for reset link
- [ ] Clicked reset link
- [ ] Entered new password
- [ ] Successfully signed in with new password

## Production Deployment

### Environment Variables
- [ ] Added Supabase URL to production environment
- [ ] Added Supabase Anon Key to production environment
- [ ] Verified variables are loading correctly

### Supabase Configuration
- [ ] Updated site URL in Auth → URL Configuration
- [ ] Added production domain to allowed redirect URLs
- [ ] Set up custom SMTP for email delivery
- [ ] Configured rate limiting (if needed)
- [ ] Set password requirements policy

### Security Review
- [ ] RLS policies are enabled on all tables
- [ ] Test user can only access their own data
- [ ] Email verification is required
- [ ] Password minimum length is appropriate
- [ ] API keys are not exposed in client code

## Verification

### Functionality Tests
- [ ] New users can sign up
- [ ] Email verification works
- [ ] Users can sign in
- [ ] Users can reset password
- [ ] Users can enroll in courses
- [ ] Enrollments are user-specific
- [ ] Users can sign out
- [ ] Session persists across page refreshes

### Security Tests
- [ ] Cannot access other users' enrollments
- [ ] Cannot enroll as another user
- [ ] Cannot access paid modules without enrollment
- [ ] Cannot update other users' data
- [ ] Passwords are not visible in network requests
- [ ] Auth tokens are stored securely

### UI/UX Tests
- [ ] Auth modal displays correctly
- [ ] Error messages are clear and helpful
- [ ] Success messages are shown
- [ ] Loading states work properly
- [ ] Mobile navigation works
- [ ] Form validation works
- [ ] Password visibility toggle works

## Common Issues Checklist

If something isn't working:

- [ ] Check browser console for errors
- [ ] Verify environment variables are set
- [ ] Confirm development server was restarted after .env changes
- [ ] Check Supabase Dashboard → Auth → Logs for errors
- [ ] Verify SQL migration ran without errors
- [ ] Check that email is verified in Supabase Dashboard
- [ ] Confirm RLS policies are enabled
- [ ] Check network tab for failed API requests

## Documentation Review
- [ ] Read [QUICK-START-AUTH.md](./QUICK-START-AUTH.md) for setup guide
- [ ] Read [AUTH-SETUP.md](./AUTH-SETUP.md) for detailed documentation
- [ ] Review [AUTH-IMPLEMENTATION-SUMMARY.md](./AUTH-IMPLEMENTATION-SUMMARY.md)
- [ ] Bookmark Supabase documentation for reference

## Next Steps
- [ ] Customize email templates for branding
- [ ] Set up OAuth providers (Google, GitHub, etc.)
- [ ] Add analytics tracking for auth events
- [ ] Implement profile management page
- [ ] Add course completion tracking
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts

## Sign-Off

- [ ] All tests passed
- [ ] Documentation reviewed
- [ ] Team members trained (if applicable)
- [ ] Production environment verified
- [ ] Ready for launch! 🚀

---

**Setup Date**: _______________

**Tested By**: _______________

**Production Deploy Date**: _______________

**Notes**:
_______________________________
_______________________________
_______________________________
