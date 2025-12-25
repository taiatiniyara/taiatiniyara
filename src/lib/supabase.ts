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

// Supabase client with extended timeout for large operations
export const supabase = createClient(url, publishableKey, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'taiatiniyara-web',
    },
  },
  // Increase timeout for large content operations
  auth: {
    persistSession: true,
  },
});