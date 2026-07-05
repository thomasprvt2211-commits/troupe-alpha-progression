import type { Member, PatrolId } from "@/src/types";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getMemberById(members: Member[], id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

export function getMembersByPatrol(members: Member[], patrolId: PatrolId): Member[] {
  return members.filter((m) => m.patrolId === patrolId);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function countValidatedCategories(member: Member): number {
  return member.progressionCategories.filter((c) => c.status === "Validé").length;
}
