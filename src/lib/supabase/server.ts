import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/src/lib/supabase/config";

let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!serverClient) {
    serverClient = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  }

  return serverClient;
}

export function resetSupabaseServerClient(): void {
  serverClient = null;
}
