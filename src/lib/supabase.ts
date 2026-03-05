import { createClient } from '@supabase/supabase-js';

// Configuration from user request
const PROVIDED_SUPABASE_URL = 'https://vsmmwrukydbcvzgwziiy.supabase.co';
const PROVIDED_SUPABASE_ANON_KEY = 'sb_publishable_VxoIrP2JlnbJ60Qg-kEtAw_HVckAe9J';

// Environment variables (fallback)
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use provided credentials if available, otherwise use environment variables
const supabaseUrl = PROVIDED_SUPABASE_URL || envSupabaseUrl;
const supabaseAnonKey = PROVIDED_SUPABASE_ANON_KEY || envSupabaseAnonKey;

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.length > 0 &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 0 &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
