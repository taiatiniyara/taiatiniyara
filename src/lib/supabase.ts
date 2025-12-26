import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!url || !publishableKey) {
  console.error('Missing Supabase environment variables', {
    url: url ? 'present' : 'missing',
    publishableKey: publishableKey ? 'present' : 'missing'
  });
  throw new Error("Missing Supabase environment variables");
}

// Supabase client with optimized configuration
export const supabase = createClient(url, publishableKey, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'taiatiniyara-web',
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});