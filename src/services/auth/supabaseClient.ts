/**
 * Supabase Client Configuration
 *
 * Initializes the Supabase client with environment variables.
 * Falls back to mock mode if credentials are not configured.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase client (or null if not configured)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if we're using mock auth
export const isMockMode = !isSupabaseConfigured;

// Log configuration status
if (isMockMode) {
  console.warn(
    '⚠️ Supabase not configured. Using mock authentication.\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable real authentication.'
  );
} else {
  console.info('✅ Supabase client initialized successfully');
}
