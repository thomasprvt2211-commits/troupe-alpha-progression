import { NextResponse } from "next/server";
import { getSupabaseUrl } from "@/src/lib/supabase/config";
import {
  runSupabaseNetworkDiagnosticsServer,
  testMemberBadgesConnectionServer,
} from "@/src/lib/supabase/member-badges-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [result, networkTests] = await Promise.all([
    testMemberBadgesConnectionServer(),
    runSupabaseNetworkDiagnosticsServer(),
  ]);

  return NextResponse.json({
    ...result,
    networkTests,
    url: getSupabaseUrl() || "(non défini)",
  });
}
