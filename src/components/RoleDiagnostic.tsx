/**
 * Temporary diagnostic component to check user role
 * Add this to your home page or dashboard to see your current role
 * Remove after verifying admin access
 */

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function RoleDiagnostic() {
  const { user, userProfile, isAdmin, isAuthenticated, isLoading, refreshProfile } = useAuth();

  const handleRefresh = async () => {
    await refreshProfile();
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <h3 className="font-bold text-lg mb-2">⚠️ Not Authenticated</h3>
        <p>You need to log in to see your role information.</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <p>Loading user information...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">🔍 User Role Diagnostic</h3>
        <Button 
          onClick={handleRefresh} 
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Role
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <span className="font-semibold">Email: </span>
          <span>{user?.email || 'N/A'}</span>
        </div>

        <div>
          <span className="font-semibold">User ID: </span>
          <span className="text-sm font-mono">{user?.id || 'N/A'}</span>
        </div>

        <div>
          <span className="font-semibold">Full Name: </span>
          <span>{userProfile?.full_name || 'Not set'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Current Role: </span>
          <Badge variant={userProfile?.role === 'admin' ? 'default' : 'outline'}>
            {userProfile?.role || 'Not set'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Admin Access: </span>
          {isAdmin ? (
            <Badge className="bg-green-500">✓ YES - You can access admin pages</Badge>
          ) : (
            <Badge variant="destructive">✗ NO - You cannot access admin pages</Badge>
          )}
        </div>

        {!isAdmin && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="font-semibold text-red-700 dark:text-red-400 mb-2">
              ❌ Admin Access Denied
            </p>
            <p className="text-sm text-red-600 dark:text-red-300">
              Your role is '{userProfile?.role || 'not set'}' but needs to be 'admin'.
            </p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              To fix this, see <code>ADMIN-ACCESS-FIX.md</code> in the project root.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <p className="font-semibold text-green-700 dark:text-green-400 mb-2">
              ✓ Admin Access Granted
            </p>
            <p className="text-sm text-green-600 dark:text-green-300">
              You can access:
            </p>
            <ul className="text-sm text-green-600 dark:text-green-300 list-disc list-inside mt-1">
              <li><a href="/blog/admin" className="underline">/blog/admin</a></li>
              <li><a href="/projects/admin" className="underline">/projects/admin</a></li>
              <li><a href="/courses/admin" className="underline">/courses/admin</a></li>
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
        <p className="text-xs text-gray-500">
          <strong>Note:</strong> Remove this component after verifying your role.
        </p>
      </div>
    </Card>
  );
}
