import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/src/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}
