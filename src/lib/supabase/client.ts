import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/src/lib/supabase/config";

let browserClient: SupabaseClient | null = null;
let clientInitFailed = false;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (clientInitFailed) return null;
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    try {
      browserClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
      );
    } catch {
      clientInitFailed = true;
      return null;
    }
  }

  return browserClient;
}

export function resetSupabaseClient(): void {
  browserClient = null;
  clientInitFailed = false;
}
