import { createFileRoute, Link } from '@tanstack/react-router';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { SEO } from '@/components/SEO';

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
});

function Unauthorized() {
  const { isAuthenticated, userProfile } = useAuth();

  return (
    <>
      <SEO
        title="Unauthorized Access - Taia Tiniyara"
        description="You don't have permission to access this page."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Access Denied
          </h1>

          {isAuthenticated ? (
            <>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
                Your current role is <span className="font-semibold">{userProfile?.role || 'user'}</span>. 
                This page requires administrator privileges.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                You need to be logged in to access this page.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
                Please sign in with an authorized account.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Go to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </Button>
          </div>

          {!isAuthenticated && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Need access? Contact the administrator to request permissions.
              </p>
            </div>
          )}

          {isAuthenticated && userProfile?.role === 'user' && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If you believe you should have access to this page, please contact the administrator.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
