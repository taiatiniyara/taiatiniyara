# Admin Access Fix Guide

## Problem
You're logged in but can't access admin pages (`/blog/admin`, `/projects/admin`, `/courses/admin`) because your user account doesn't have the admin role in the database.

## Quick Diagnosis
Check your current user profile and role by adding this temporary code to any page:

```tsx
const { userProfile, isAdmin } = useAuth();
console.log('User Profile:', userProfile);
console.log('Is Admin:', isAdmin);
```

If `isAdmin` is `false` or `userProfile.role` is `'user'`, you need to update your role to `'admin'`.

---

## Solution Options

### Option 1: Use the Seed Admin Script (Recommended)

1. Create a `.env` file in the project root (if it doesn't exist) with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_EMAIL=your_email@example.com
   ADMIN_PASSWORD=your_password
   ADMIN_FULL_NAME=Your Name
   ```

2. Run the seed script:
   ```bash
   npm run seed-admin
   ```

3. Log out and log back in with the credentials above.

### Option 2: Update via Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **user_profiles**
3. Find your user record (search by email)
4. Click to edit the row
5. Change the `role` field from `'user'` to `'admin'`
6. Save changes
7. In your app, refresh the page or log out and log back in

### Option 3: Run SQL Query Directly

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this query (replace with your email):
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE email = 'your_email@example.com';
   ```

### Option 4: Create a Temporary Admin Component

If you want to change your role from within the app (requires service role key):

Create `src/components/MakeAdmin.tsx`:
```tsx
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function MakeAdmin() {
  const { user, refreshProfile } = useAuth();

  const makeAdmin = async () => {
    if (!user) return;
    
    // Note: This requires updating RLS policies to allow users to update their own role
    // Or you need to use a service role key
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (error) {
      console.error('Error:', error);
      alert('Failed to update role. Use Supabase dashboard instead.');
    } else {
      alert('Role updated! Refreshing...');
      await refreshProfile();
      window.location.reload();
    }
  };

  return (
    <Button onClick={makeAdmin}>
      Make Me Admin (Development Only)
    </Button>
  );
}
```

**Note**: This won't work without modifying RLS policies. Use Option 2 or 3 instead.

---

## Verification

After updating your role:

1. Log out and log back in
2. Check the browser console for:
   ```javascript
   console.log('Is Admin:', isAdmin); // Should be true
   console.log('Role:', userProfile?.role); // Should be 'admin'
   ```
3. Try accessing:
   - `/blog/admin`
   - `/projects/admin`
   - `/courses/admin`

---

## Understanding the Authentication Flow

1. **User signs up** → `auth.users` record created
2. **Database trigger** → `user_profiles` record created with `role = 'user'`
3. **ProtectedRoute checks** → `userProfile.role === 'admin'`
4. **If not admin** → Redirected to home page

The admin routes use `<AdminRoute>` wrapper which checks:
```tsx
if (requiredRole === 'admin' && !isAdmin) {
  return <Navigate to={redirectTo} />;
}
```

Where `isAdmin` comes from:
```tsx
isAdmin: userProfile?.role === 'admin'
```

---

## Prevention for Future Users

To avoid this issue for other admin users:

1. Use the `seed-admin` script for each admin
2. Document admin credentials securely
3. Consider creating an admin panel to manage user roles (requires proper authorization)

---

## Security Note

⚠️ **Important**: The current RLS policies prevent users from updating their own role:

```sql
-- Users can update their own profile (except role)
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM user_profiles WHERE id = auth.uid())
  );
```

This is by design for security. Only admins or the service role can change user roles.
