/**
 * User hook that wraps Supabase authentication
 * @deprecated Use useAuth from '@/contexts/AuthContext' instead
 * This hook is kept for backward compatibility
 */
import { useAuth } from '@/contexts/AuthContext';

export function useUser() {
  const auth = useAuth();
  
  return {
    user: auth.user ? {
      email: auth.user.email!,
      name: auth.user.user_metadata?.name,
      id: auth.user.id,
    } : null,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: async (email: string, password: string) => {
      const { error } = await auth.signIn(email, password);
      if (error) throw error;
    },
    logout: auth.signOut,
  };
}
