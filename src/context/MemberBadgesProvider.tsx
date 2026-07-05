"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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

export interface MemberBadgesContextValue {
  store: MemberBadgesStore;
  isLoaded: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  configWarning: string | null;
  isSupabaseEnabled: boolean;
  getBadges: (memberId: string) => MemberManualBadge[];
  getCount: (memberId: string) => number;
  getTotalCount: () => number;
  addMemberBadge: (
    memberId: string,
    data: { name: string; note?: string; date?: string }
  ) => Promise<void>;
  updateMemberBadge: (
    memberId: string,
    badgeId: string,
    updates: Partial<Pick<MemberManualBadge, "name" | "note" | "date">>
  ) => Promise<void>;
  deleteMemberBadge: (memberId: string, badgeId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const MemberBadgesContext = createContext<MemberBadgesContextValue | null>(null);

const EMPTY_STORE: MemberBadgesStore = {};

function useMemberBadgesState(): MemberBadgesContextValue {
  const [store, setStore] = useState<MemberBadgesStore>(EMPTY_STORE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configWarning, setConfigWarning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;

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
      setStore(data ?? EMPTY_STORE);
    } catch {
      setError("Impossible de charger les badges depuis Supabase.");
      setStore(loadAllMemberBadges());
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    return Object.values(store).reduce(
      (sum, badges) => sum + (badges?.length ?? 0),
      0
    );
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

  return useMemo(
    () => ({
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
    }),
    [
      store,
      isLoaded,
      isLoading,
      isSaving,
      error,
      configWarning,
      getBadges,
      getCount,
      getTotalCount,
      addMemberBadge,
      updateMemberBadge,
      deleteMemberBadge,
      refresh,
    ]
  );
}

const FALLBACK_VALUE: MemberBadgesContextValue = {
  store: EMPTY_STORE,
  isLoaded: true,
  isLoading: false,
  isSaving: false,
  error: null,
  configWarning: null,
  isSupabaseEnabled: false,
  getBadges: () => [],
  getCount: () => 0,
  getTotalCount: () => 0,
  addMemberBadge: async () => {},
  updateMemberBadge: async () => {},
  deleteMemberBadge: async () => {},
  refresh: async () => {},
};

export function MemberBadgesProvider({ children }: { children: ReactNode }) {
  const value = useMemberBadgesState();
  return (
    <MemberBadgesContext.Provider value={value}>{children}</MemberBadgesContext.Provider>
  );
}

export function useMemberBadges(): MemberBadgesContextValue {
  const context = useContext(MemberBadgesContext);
  return context ?? FALLBACK_VALUE;
}
