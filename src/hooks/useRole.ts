import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/user';

export function useRole() {
  const { userProfile, isLoading, isAuthenticated } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isUser = (): boolean => {
    return hasRole('user');
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const canAccessAdminRoutes = (): boolean => {
    return isAuthenticated && isAdmin();
  };

  return {
    userProfile,
    isLoading,
    hasRole,
    isAdmin,
    isUser,
    hasAnyRole,
    canAccessAdminRoutes,
    currentRole: userProfile?.role ?? null,
  };
}
