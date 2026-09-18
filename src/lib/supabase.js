import { createClient } from '@supabase/supabase-js';

// Canonical Sri Siva Sai Seeds Live Supabase credentials
const DEFAULT_SUPABASE_URL = 'https://ajtlgnfezvbpvtildrok.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGxnbmZlenZicHZ0aWxkcm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM3NjAsImV4cCI6MjEwMDE4OTc2MH0.DKngsIquyv9R6cRUmeAspepOOObuf_k4AmG5Fipq-VM';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

// Safe client creator to ensure the app never crashes on import
let clientInstance;
try {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  });
} catch (err) {
  console.error('[Supabase] Init error, falling back to default client:', err);
  clientInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
}

export const supabase = clientInstance;
export default supabase;
