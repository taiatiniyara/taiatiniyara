import { useState, useEffect } from 'react';

/**
 * Simple user state hook for enrollment
 * This is a temporary solution using localStorage
 * Replace with proper authentication (Supabase Auth, Auth0, etc.) in production
 */

interface User {
  email: string;
  name?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('temp_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name?: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('temp_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('temp_user');
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
