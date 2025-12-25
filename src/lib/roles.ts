import { supabase } from './supabase';
import type { UserRole, UserProfile } from '@/types/user';

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    return null;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update user role' };
  }
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data as UserProfile[];
  } catch (error) {
    return [];
  }
}

/**
 * Check if a user has a specific role
 */
export function hasRole(profile: UserProfile | null, role: UserRole): boolean {
  return profile?.role === role;
}

/**
 * Check if a user is an admin
 */
export function isAdmin(profile: UserProfile | null): boolean {
  return hasRole(profile, 'admin');
}

/**
 * Check if a user is a regular user
 */
export function isRegularUser(profile: UserProfile | null): boolean {
  return hasRole(profile, 'user');
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(profile: UserProfile | null, roles: UserRole[]): boolean {
  return roles.some(role => hasRole(profile, role));
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data as UserProfile[];
  } catch (error) {
    return [];
  }
}
