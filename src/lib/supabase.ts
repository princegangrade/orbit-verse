import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Missing Supabase config') }),
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Missing Supabase config') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signUp: () => Promise.resolve({ error: new Error('Missing Supabase config') }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Missing Supabase config') }),
    },
    from: () => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ error: new Error('Missing Supabase config') }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: new Error('Missing Supabase config') }) })
    })
  } as any;
