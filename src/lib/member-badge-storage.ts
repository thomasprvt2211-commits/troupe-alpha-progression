import type { Member, MemberBadgesStore, MemberManualBadge, PatrolId } from "@/src/types";

export const MEMBER_BADGES_STORAGE_KEY = "troupe-alpha-member-badges";

const UPDATE_EVENT = "member-badges-updated";

export function loadAllMemberBadges(): MemberBadgesStore {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(MEMBER_BADGES_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as MemberBadgesStore;
  } catch {
    return {};
  }
}

export function saveAllMemberBadges(store: MemberBadgesStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEMBER_BADGES_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function getMemberBadges(memberId: string): MemberManualBadge[] {
  const store = loadAllMemberBadges();
  return store[memberId] ?? [];
}

function generateBadgeId(): string {
  return `badge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function addMemberBadge(
  memberId: string,
  data: { name: string; note?: string; date?: string }
): MemberManualBadge {
  const store = loadAllMemberBadges();
  const badge: MemberManualBadge = {
    id: generateBadgeId(),
    name: data.name.trim(),
    note: data.note?.trim() || undefined,
    date: data.date || new Date().toISOString().split("T")[0],
  };

  const existing = store[memberId] ?? [];
  store[memberId] = [...existing, badge];
  saveAllMemberBadges(store);
  return badge;
}

export function updateMemberBadge(
  memberId: string,
  badgeId: string,
  updates: Partial<Pick<MemberManualBadge, "name" | "note" | "date">>
): void {
  const store = loadAllMemberBadges();
  const badges = store[memberId] ?? [];

  store[memberId] = badges.map((b) =>
    b.id === badgeId
      ? {
          ...b,
          ...updates,
          name: updates.name?.trim() ?? b.name,
          note: updates.note !== undefined ? updates.note.trim() || undefined : b.note,
        }
      : b
  );

  saveAllMemberBadges(store);
}

export function deleteMemberBadge(memberId: string, badgeId: string): void {
  const store = loadAllMemberBadges();
  const badges = store[memberId] ?? [];
  store[memberId] = badges.filter((b) => b.id !== badgeId);
  saveAllMemberBadges(store);
}

export function getMemberBadgeCount(memberId: string): number {
  return getMemberBadges(memberId).length;
}

export function getTotalValidatedBadges(): number {
  const store = loadAllMemberBadges();
  return Object.values(store).reduce((sum, badges) => sum + badges.length, 0);
}

export function getBadgesCountByPatrol(
  members: Member[],
  patrolId: PatrolId
): number {
  const store = loadAllMemberBadges();
  return members
    .filter((m) => m.patrolId === patrolId)
    .reduce((sum, m) => sum + (store[m.id]?.length ?? 0), 0);
}

export function getMembersWithMostBadges(
  members: Member[],
  limit = 5
): { member: Member; count: number }[] {
  const store = loadAllMemberBadges();
  return members
    .map((member) => ({
      member,
      count: store[member.id]?.length ?? 0,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export { UPDATE_EVENT as MEMBER_BADGES_UPDATE_EVENT };
