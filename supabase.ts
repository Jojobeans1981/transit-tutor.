import { createClient } from '@supabase/supabase-js';

// Accessing variables injected by Vite's define block
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Strict validation: Ensure values exist and aren't just empty strings or the literal string "undefined"
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'undefined' && 
  supabaseUrl !== '' &&
  supabaseUrl.startsWith('http')
);

// Define a robust mock that prevents method-chaining crashes for all Supabase methods used in the app
const createMockSupabase = () => {
  const mockResponse = { data: null, error: null, count: 0 };
  const mockPromise = Promise.resolve(mockResponse);
  
  const chain = {
    select: () => chain,
    insert: () => mockPromise,
    upsert: () => mockPromise,
    update: () => chain,
    delete: () => mockPromise,
    eq: () => chain,
    single: () => mockPromise,
    order: () => chain,
    limit: () => mockPromise,
    range: () => chain,
    then: (cb: any) => mockPromise.then(cb),
    catch: (cb: any) => mockPromise.catch(cb),
  };

  return {
    from: () => chain,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Offline Mode") }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Offline Mode") }),
      signOut: () => Promise.resolve({ error: null }),
    }
  } as any;
};

if (!isSupabaseConfigured) {
  console.warn(
    "S.O.D.A. Core Security: Supabase credentials missing or invalid in env.local. " +
    "Check your .env.local file. The app is falling back to Local Session mode."
  );
}

// Initialize real client or safe mock
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockSupabase();