import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-indigo-100 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to Your App
            </h1>
            <p className="text-lg text-gray-600">
              A modern app with Supabase authentication
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-pink-600"></div>
            </div>
          ) : user ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-green-800">
                  Signed in as <span className="font-semibold">{user.email}</span>
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link to="/profile">
                  <Button>Go to Profile</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg bg-pink-50 p-4 text-center">
                <p className="text-pink-800">
                  Sign in or create an account to get started
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link to="/login">
                  <Button>Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🔐 Secure Authentication</h3>
                <p className="text-sm text-gray-600">
                  Powered by Supabase with email/password authentication
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">👤 User Profiles</h3>
                <p className="text-sm text-gray-600">
                  Manage your account and personal information
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🔄 Password Reset</h3>
                <p className="text-sm text-gray-600">
                  Easy password recovery via email
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🛡️ Protected Routes</h3>
                <p className="text-sm text-gray-600">
                  Secure pages that require authentication
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
