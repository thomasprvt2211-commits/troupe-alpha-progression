import { getSupabaseUrl } from "@/src/lib/supabase/config";
import {
  testMemberBadgesApiConnection,
  type ApiDiagnosticResult,
} from "@/src/lib/member-badges-api";

export type SupabaseConnectionTestResult = ApiDiagnosticResult & {
  result: string;
  url: string;
};

export async function testSupabaseConnection(): Promise<SupabaseConnectionTestResult> {
  const apiResult = await testMemberBadgesApiConnection();

  return {
    ...apiResult,
    result: apiResult.success ? "Succès" : "Échec",
    url: (apiResult.url ?? getSupabaseUrl()) || "(non défini)",
  };
}

export function getSupabaseDiagnostics() {
  const url = getSupabaseUrl();

  return {
    configured: false,
    url: url || "(non défini)",
    urlValid: Boolean(url) && url.includes("supabase.co"),
    anonKeyPresent: false,
  };
}
