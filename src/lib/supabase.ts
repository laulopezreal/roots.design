import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a null client if credentials are missing (for preview deployments)
let supabaseClient: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    'Supabase credentials not configured. The app will run with limited functionality. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable database features.'
  );
}

export const supabase = supabaseClient;
