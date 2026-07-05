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
  fetchAllMemberBadgesFromApi,
  addMemberBadgeViaApi,
  updateMemberBadgeViaApi,
  deleteMemberBadgeViaApi,
} from "@/src/lib/member-badges-api";
import {
  createSupabaseConnectionError,
  SUPABASE_LOCAL_FALLBACK_WARNING,
  type MemberBadgesError,
} from "@/src/lib/supabase/errors";
import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";

export interface MemberBadgesContextValue {
  store: MemberBadgesStore;
  isLoaded: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: MemberBadgesError | null;
  configWarning: string | null;
  fallbackWarning: string | null;
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

function applyLocalFallback(
  setStore: (store: MemberBadgesStore) => void,
  setFallbackWarning: (warning: string | null) => void,
  setError: (error: MemberBadgesError | null) => void,
  caught: unknown
) {
  setStore(loadAllMemberBadges());
  setFallbackWarning(SUPABASE_LOCAL_FALLBACK_WARNING);
  setError(createSupabaseConnectionError(caught));
}

function useMemberBadgesState(): MemberBadgesContextValue {
  const [store, setStore] = useState<MemberBadgesStore>(EMPTY_STORE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<MemberBadgesError | null>(null);
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;

    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setConfigWarning(getSupabaseConfigError());
      setFallbackWarning(null);
      setStore(loadAllMemberBadges());
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setConfigWarning(null);

    try {
      const data = await fetchAllMemberBadgesFromApi();
      setStore(data ?? EMPTY_STORE);
      setFallbackWarning(null);
    } catch (caught) {
      applyLocalFallback(setStore, setFallbackWarning, setError, caught);
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

    return () => {
      window.removeEventListener(MEMBER_BADGES_UPDATE_EVENT, handleLocalUpdate);
      window.removeEventListener("storage", handleLocalUpdate);
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
          try {
            await addMemberBadgeViaApi(memberId, data);
            await refresh();
            setFallbackWarning(null);
          } catch (caught) {
            addBadgeLocal(memberId, data);
            applyLocalFallback(setStore, setFallbackWarning, setError, caught);
          }
        } else {
          addBadgeLocal(memberId, data);
          setStore(loadAllMemberBadges());
        }
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
          try {
            await updateMemberBadgeViaApi(badgeId, updates);
            await refresh();
            setFallbackWarning(null);
          } catch (caught) {
            updateBadgeLocal(memberId, badgeId, updates);
            applyLocalFallback(setStore, setFallbackWarning, setError, caught);
          }
        } else {
          updateBadgeLocal(memberId, badgeId, updates);
          setStore(loadAllMemberBadges());
        }
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
          try {
            await deleteMemberBadgeViaApi(badgeId);
            await refresh();
            setFallbackWarning(null);
          } catch (caught) {
            deleteBadgeLocal(memberId, badgeId);
            applyLocalFallback(setStore, setFallbackWarning, setError, caught);
          }
        } else {
          deleteBadgeLocal(memberId, badgeId);
          setStore(loadAllMemberBadges());
        }
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
      fallbackWarning,
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
      fallbackWarning,
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
  fallbackWarning: null,
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
