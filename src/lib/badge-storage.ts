import { badgeDefinitions as defaultBadges } from "@/src/data/troupe-alpha";
import type { BadgeDefinition } from "@/src/types";
import { slugify } from "@/src/lib/utils";

const STORAGE_KEY = "troupe-alpha-badges";

export function getDefaultBadges(): BadgeDefinition[] {
  return defaultBadges;
}

export function loadBadges(): BadgeDefinition[] {
  if (typeof window === "undefined") {
    return getDefaultBadges();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultBadges();
    }
    return JSON.parse(stored) as BadgeDefinition[];
  } catch {
    return getDefaultBadges();
  }
}

export function saveBadges(badges: BadgeDefinition[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
  window.dispatchEvent(new CustomEvent("badges-updated"));
}

export function resetBadgesToDefault(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("badges-updated"));
}

export function createBadgeId(name: string, existingIds: string[]): string {
  let base = slugify(name);
  if (!base) base = "badge";
  let id = base;
  let counter = 1;
  while (existingIds.includes(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

export function getBadgeByIdFromList(
  badges: BadgeDefinition[],
  id: string
): BadgeDefinition | undefined {
  return badges.find((b) => b.id === id);
}
