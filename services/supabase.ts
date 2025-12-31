import { createClient } from '@supabase/supabase-js';

// NOTE: These environment variables must be set in your development environment or .env file
// VITE_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY

// Helper to check if env vars are loaded
const supabaseUrl = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) || (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Database features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkConnection = async () => {
    try {
        const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return { success: true, count };
    } catch (e) {
        return { success: false, error: e };
    }
};