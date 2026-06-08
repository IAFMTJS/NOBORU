import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 * Import only from repository modules — never from components, hooks, or pages.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
