/**
 * Authentication Service
 *
 * Unified authentication service that works with both Supabase and mock mode.
 * Automatically switches based on configuration.
 */

import {
  mockLogin,
  mockSignup,
  mockLogout,
  getMockCurrentUser,
  isMockAdmin,
  type MockUser,
} from './mockAuthService';
import { supabase, isMockMode } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

/**
 * Login with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (isMockMode) {
    // Use mock authentication
    const response = await mockLogin(email, password);
    return {
      user: response.user,
      error: response.error,
    };
  }

  // Use Supabase authentication
  try {
    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        user: null,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        user: null,
        error: 'Login failed',
      };
    }

    // Fetch user role from database
    const { data: userData, error: userError } = await supabase!
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: userData?.role || 'user',
        created_at: data.user.created_at,
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signup(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (isMockMode) {
    // Use mock authentication
    const response = await mockSignup(email, password);
    return {
      user: response.user,
      error: response.error,
    };
  }

  // Use Supabase authentication
  try {
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        user: null,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        user: null,
        error: 'Signup failed',
      };
    }

    // Create user record in database
    const { error: insertError } = await supabase!.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      role: 'user',
    });

    if (insertError) {
      console.error('Error creating user record:', insertError);
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: 'user',
        created_at: data.user.created_at,
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<{ error: string | null }> {
  if (isMockMode) {
    return await mockLogout();
  }

  try {
    const { error } = await supabase!.auth.signOut();
    return { error: error ? error.message : null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (isMockMode) {
    return getMockCurrentUser();
  }

  try {
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (!user) {return null;}

    // Fetch user role from database
    const { data: userData } = await supabase!
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      role: userData?.role || 'user',
      created_at: user.created_at,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  if (isMockMode) {
    return isMockAdmin();
  }

  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Listen to auth state changes (Supabase only)
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): (() => void) | null {
  if (isMockMode) {
    // No real-time listener for mock mode
    // Call callback immediately with current user
    callback(getMockCurrentUser());
    return null;
  }

  const {
    data: { subscription },
  } = supabase!.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data: userData } = await supabase!
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      callback({
        id: session.user.id,
        email: session.user.email!,
        role: userData?.role || 'user',
        created_at: session.user.created_at,
      });
    } else {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}
