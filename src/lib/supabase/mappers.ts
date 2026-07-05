import type { MemberBadgeRow } from "@/src/lib/supabase/types";
import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";

export function rowToBadge(row: MemberBadgeRow): MemberManualBadge | null {
  if (!row?.id || !row.badge_name) return null;

  return {
    id: row.id,
    name: row.badge_name,
    note: row.note ?? undefined,
    date: row.created_at?.split("T")[0],
  };
}

export function rowsToStore(rows: MemberBadgeRow[]): MemberBadgesStore {
  return rows.reduce<MemberBadgesStore>((store, row) => {
    const badge = rowToBadge(row);
    if (!badge || !row.member_id) return store;

    const existing = store[row.member_id] ?? [];
    store[row.member_id] = [...existing, badge];
    return store;
  }, {});
}

export function rowsToBadges(rows: MemberBadgeRow[]): MemberManualBadge[] {
  return rows
    .map((row) => rowToBadge(row))
    .filter((badge): badge is MemberManualBadge => badge !== null);
}
