import { createClient } from '@supabase/supabase-js';

// Helper to check if env vars are loaded
const getEnvVar = (key: string) => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

if (!isConfigured) {
  console.warn('Lumina: Supabase credentials missing. App will run in local mock mode.');
}

// Prevent crash by providing dummy values if missing. 
// The client will be initialized but network requests will fail (or be intercepted by our service layer).
// https://placeholder.supabase.co is a syntactically valid URL.
const urlToUse = isConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const keyToUse = isConfigured ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(urlToUse, keyToUse);

export const checkConnection = async () => {
    if (!isConfigured) return { success: false, error: { message: 'Supabase credentials not configured in .env' } };
    try {
        const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return { success: true, count };
    } catch (e) {
        return { success: false, error: e };
    }
};