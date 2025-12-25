import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import type { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  redirectTo = '/unauthorized',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, userProfile, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={50} />
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  // Check if specific role is required
  if (requiredRole) {
    if (!userProfile) {
      return <Navigate to={redirectTo} />;
    }

    // Check if user has the required role
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to={redirectTo} />;
    }

    if (userProfile.role !== requiredRole) {
      return <Navigate to={redirectTo} />;
    }
  }

  return <>{children}</>;
}

// Convenience component for admin-only routes
export function AdminRoute({
  children,
  redirectTo = '/unauthorized',
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

// Convenience component for authenticated routes (any role)
export function AuthenticatedRoute({
  children,
  redirectTo = '/unauthorized',
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute requireAuth redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}
