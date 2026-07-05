"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadAllMemberBadges,
  addMemberBadge as addBadge,
  updateMemberBadge as updateBadge,
  deleteMemberBadge as deleteBadge,
  MEMBER_BADGES_UPDATE_EVENT,
} from "@/src/lib/member-badge-storage";
import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";

export function useMemberBadges() {
  const [store, setStore] = useState<MemberBadgesStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setStore(loadAllMemberBadges());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(MEMBER_BADGES_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(MEMBER_BADGES_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const getBadges = useCallback(
    (memberId: string): MemberManualBadge[] => store[memberId] ?? [],
    [store]
  );

  const getCount = useCallback(
    (memberId: string): number => (store[memberId] ?? []).length,
    [store]
  );

  const getTotalCount = useCallback((): number => {
    return Object.values(store).reduce((sum, badges) => sum + badges.length, 0);
  }, [store]);

  const addMemberBadge = useCallback(
    (memberId: string, data: { name: string; note?: string; date?: string }) => {
      addBadge(memberId, data);
      refresh();
    },
    [refresh]
  );

  const updateMemberBadge = useCallback(
    (
      memberId: string,
      badgeId: string,
      updates: Partial<Pick<MemberManualBadge, "name" | "note" | "date">>
    ) => {
      updateBadge(memberId, badgeId, updates);
      refresh();
    },
    [refresh]
  );

  const deleteMemberBadge = useCallback(
    (memberId: string, badgeId: string) => {
      deleteBadge(memberId, badgeId);
      refresh();
    },
    [refresh]
  );

  return {
    store,
    isLoaded,
    getBadges,
    getCount,
    getTotalCount,
    addMemberBadge,
    updateMemberBadge,
    deleteMemberBadge,
    refresh,
  };
}
