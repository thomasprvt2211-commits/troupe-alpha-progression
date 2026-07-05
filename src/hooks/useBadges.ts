"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createBadgeId,
  loadBadges,
  resetBadgesToDefault,
  saveBadges,
} from "@/src/lib/badge-storage";
import type { BadgeDefinition, BadgeFormData } from "@/src/types";

export function useBadges() {
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setBadges(loadBadges());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener("badges-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("badges-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const addBadge = useCallback(
    (data: BadgeFormData) => {
      const id = createBadgeId(
        data.name,
        badges.map((b) => b.id)
      );
      const newBadge: BadgeDefinition = { ...data, id };
      const updated = [...badges, newBadge];
      saveBadges(updated);
      setBadges(updated);
      return newBadge;
    },
    [badges]
  );

  const updateBadge = useCallback(
    (id: string, data: BadgeFormData) => {
      const updated = badges.map((b) => (b.id === id ? { ...data, id } : b));
      saveBadges(updated);
      setBadges(updated);
    },
    [badges]
  );

  const deleteBadge = useCallback(
    (id: string) => {
      const updated = badges.filter((b) => b.id !== id);
      saveBadges(updated);
      setBadges(updated);
    },
    [badges]
  );

  const resetToDefault = useCallback(() => {
    resetBadgesToDefault();
    refresh();
  }, [refresh]);

  return {
    badges,
    isLoaded,
    addBadge,
    updateBadge,
    deleteBadge,
    resetToDefault,
    refresh,
  };
}
