import { NextResponse } from "next/server";
import { getSupabaseUrl } from "@/src/lib/supabase/config";
import { testMemberBadgesConnectionServer } from "@/src/lib/supabase/member-badges-server";

export async function GET() {
  const result = await testMemberBadgesConnectionServer();
  return NextResponse.json({
    ...result,
    url: getSupabaseUrl() || "(non défini)",
  });
}
