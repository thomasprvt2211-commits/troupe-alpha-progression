import { NextResponse } from "next/server";
import {
  addMemberBadgeServer,
  deleteMemberBadgeServer,
  fetchAllMemberBadgesServer,
  fetchMemberBadgesServer,
  updateMemberBadgeServer,
} from "@/src/lib/supabase/member-badges-server";
import { isSupabaseConfigured } from "@/src/lib/supabase/config";
import { getSupabaseErrorMessage } from "@/src/lib/supabase/errors";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");

  try {
    if (memberId) {
      const badges = await fetchMemberBadgesServer(memberId);
      return NextResponse.json({ badges });
    }

    const store = await fetchAllMemberBadgesServer();
    return NextResponse.json({ store });
  } catch (caught) {
    return NextResponse.json(
      { error: getSupabaseErrorMessage(caught) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const memberId = body?.member_id as string | undefined;
    const badgeName = body?.badge_name as string | undefined;
    const note = body?.note as string | undefined;

    if (!memberId?.trim() || !badgeName?.trim()) {
      return NextResponse.json(
        { error: "member_id et badge_name sont requis" },
        { status: 400 }
      );
    }

    const badge = await addMemberBadgeServer(memberId, badgeName, note);
    return NextResponse.json({ badge }, { status: 201 });
  } catch (caught) {
    return NextResponse.json(
      { error: getSupabaseErrorMessage(caught) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const id = body?.id as string | undefined;
    const badgeName = body?.badge_name as string | undefined;
    const note = body?.note as string | undefined;
    const date = body?.date as string | undefined;

    if (!id?.trim()) {
      return NextResponse.json({ error: "id est requis" }, { status: 400 });
    }

    const badge = await updateMemberBadgeServer(id, {
      ...(badgeName !== undefined && { badge_name: badgeName }),
      ...(note !== undefined && { note }),
      ...(date !== undefined && { date }),
    });

    return NextResponse.json({ badge });
  } catch (caught) {
    return NextResponse.json(
      { error: getSupabaseErrorMessage(caught) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id?.trim()) {
    return NextResponse.json({ error: "id est requis" }, { status: 400 });
  }

  try {
    await deleteMemberBadgeServer(id);
    return NextResponse.json({ success: true });
  } catch (caught) {
    return NextResponse.json(
      { error: getSupabaseErrorMessage(caught) },
      { status: 500 }
    );
  }
}
