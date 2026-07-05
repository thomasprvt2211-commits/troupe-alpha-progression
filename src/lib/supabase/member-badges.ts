import { getSupabaseClient } from "@/src/lib/supabase/client";
import type { MemberBadgeRow } from "@/src/lib/supabase/types";
import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";

function rowToBadge(row: MemberBadgeRow): MemberManualBadge | null {
  if (!row?.id || !row.badge_name) return null;

  return {
    id: row.id,
    name: row.badge_name,
    note: row.note ?? undefined,
    date: row.created_at?.split("T")[0],
  };
}

function rowsToStore(rows: MemberBadgeRow[]): MemberBadgesStore {
  return rows.reduce<MemberBadgesStore>((store, row) => {
    const badge = rowToBadge(row);
    if (!badge || !row.member_id) return store;

    const existing = store[row.member_id] ?? [];
    store[row.member_id] = [...existing, badge];
    return store;
  }, {});
}

export async function fetchAllMemberBadges(): Promise<MemberBadgesStore> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase non configuré");
  }

  const { data, error } = await supabase
    .from("member_badges")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return rowsToStore((data ?? []) as MemberBadgeRow[]);
}

export async function addMemberBadge(
  memberId: string,
  data: { name: string; note?: string }
): Promise<MemberManualBadge> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase non configuré");
  }

  const { data: row, error } = await supabase
    .from("member_badges")
    .insert({
      member_id: memberId,
      badge_name: data.name.trim(),
      note: data.note?.trim() || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  const badge = rowToBadge(row as MemberBadgeRow);
  if (!badge) throw new Error("Réponse Supabase invalide");
  return badge;
}

export async function updateMemberBadge(
  badgeId: string,
  updates: Partial<Pick<MemberManualBadge, "name" | "note" | "date">>
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase non configuré");
  }

  const payload: Partial<MemberBadgeRow> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) {
    payload.badge_name = updates.name.trim();
  }
  if (updates.note !== undefined) {
    payload.note = updates.note.trim() || null;
  }
  if (updates.date) {
    payload.created_at = `${updates.date}T12:00:00.000Z`;
  }

  const { error } = await supabase
    .from("member_badges")
    .update(payload)
    .eq("id", badgeId);

  if (error) throw error;
}

export async function deleteMemberBadge(badgeId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase non configuré");
  }

  const { error } = await supabase.from("member_badges").delete().eq("id", badgeId);
  if (error) throw error;
}

export function subscribeToMemberBadges(_onChange: () => void): () => void {
  // Realtime désactivé temporairement — fetch manuel uniquement
  return () => {};
}
