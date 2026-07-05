"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadAllMemberBadges,
  addMemberBadge as addBadgeLocal,
  updateMemberBadge as updateBadgeLocal,
  deleteMemberBadge as deleteBadgeLocal,
  MEMBER_BADGES_UPDATE_EVENT,
} from "@/src/lib/member-badge-storage";
import { isSupabaseConfigured, getSupabaseConfigError } from "@/src/lib/supabase/config";
import {
  fetchAllMemberBadges,
  addMemberBadge as addBadgeRemote,
  updateMemberBadge as updateBadgeRemote,
  deleteMemberBadge as deleteBadgeRemote,
  subscribeToMemberBadges,
} from "@/src/lib/supabase/member-badges";
import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";

export function useMemberBadges() {
  const [store, setStore] = useState<MemberBadgesStore>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configWarning, setConfigWarning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setConfigWarning(getSupabaseConfigError());
      setStore(loadAllMemberBadges());
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setConfigWarning(null);

    try {
      const data = await fetchAllMemberBadges();
      setStore(data);
    } catch {
      setError("Impossible de charger les badges depuis Supabase.");
      setStore(loadAllMemberBadges());
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const handleLocalUpdate = () => {
      if (!isSupabaseConfigured()) {
        setStore(loadAllMemberBadges());
      }
    };

    window.addEventListener(MEMBER_BADGES_UPDATE_EVENT, handleLocalUpdate);
    window.addEventListener("storage", handleLocalUpdate);

    const unsubscribeRealtime = subscribeToMemberBadges(() => {
      void refresh();
    });

    return () => {
      window.removeEventListener(MEMBER_BADGES_UPDATE_EVENT, handleLocalUpdate);
      window.removeEventListener("storage", handleLocalUpdate);
      unsubscribeRealtime();
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
    async (memberId: string, data: { name: string; note?: string; date?: string }) => {
      setIsSaving(true);
      setError(null);

      try {
        if (isSupabaseConfigured()) {
          await addBadgeRemote(memberId, data);
          await refresh();
        } else {
          addBadgeLocal(memberId, data);
          setStore(loadAllMemberBadges());
        }
      } catch {
        setError("Erreur lors de l'ajout du badge.");
        throw new Error("add failed");
      } finally {
        setIsSaving(false);
      }
    },
    [refresh]
  );

  const updateMemberBadge = useCallback(
    async (
      memberId: string,
      badgeId: string,
      updates: Partial<Pick<MemberManualBadge, "name" | "note" | "date">>
    ) => {
      setIsSaving(true);
      setError(null);

      try {
        if (isSupabaseConfigured()) {
          await updateBadgeRemote(badgeId, updates);
          await refresh();
        } else {
          updateBadgeLocal(memberId, badgeId, updates);
          setStore(loadAllMemberBadges());
        }
      } catch {
        setError("Erreur lors de la modification du badge.");
        throw new Error("update failed");
      } finally {
        setIsSaving(false);
      }
    },
    [refresh]
  );

  const deleteMemberBadge = useCallback(
    async (memberId: string, badgeId: string) => {
      setIsSaving(true);
      setError(null);

      try {
        if (isSupabaseConfigured()) {
          await deleteBadgeRemote(badgeId);
          await refresh();
        } else {
          deleteBadgeLocal(memberId, badgeId);
          setStore(loadAllMemberBadges());
        }
      } catch {
        setError("Erreur lors de la suppression du badge.");
        throw new Error("delete failed");
      } finally {
        setIsSaving(false);
      }
    },
    [refresh]
  );

  return {
    store,
    isLoaded,
    isLoading,
    isSaving,
    error,
    configWarning,
    isSupabaseEnabled: isSupabaseConfigured(),
    getBadges,
    getCount,
    getTotalCount,
    addMemberBadge,
    updateMemberBadge,
    deleteMemberBadge,
    refresh,
  };
}
