import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/src/lib/supabase/config";
import { getSupabaseServerClient } from "@/src/lib/supabase/server";
import { rowToBadge, rowsToBadges, rowsToStore } from "@/src/lib/supabase/mappers";
import type { MemberBadgeRow } from "@/src/lib/supabase/types";
import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";

function getClientOrThrow() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase non configuré");
  }
  return supabase;
}

export async function fetchAllMemberBadgesServer(): Promise<MemberBadgesStore> {
  const supabase = getClientOrThrow();

  const { data, error } = await supabase
    .from("member_badges")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return rowsToStore((data ?? []) as MemberBadgeRow[]);
}

export async function fetchMemberBadgesServer(
  memberId: string
): Promise<MemberManualBadge[]> {
  const supabase = getClientOrThrow();

  const { data, error } = await supabase
    .from("member_badges")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return rowsToBadges((data ?? []) as MemberBadgeRow[]);
}

export async function addMemberBadgeServer(
  memberId: string,
  badgeName: string,
  note?: string
): Promise<MemberManualBadge> {
  const supabase = getClientOrThrow();

  const { data, error } = await supabase
    .from("member_badges")
    .insert({
      member_id: memberId,
      badge_name: badgeName.trim(),
      note: note?.trim() || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  const badge = rowToBadge(data as MemberBadgeRow);
  if (!badge) throw new Error("Réponse Supabase invalide");
  return badge;
}

export async function updateMemberBadgeServer(
  badgeId: string,
  updates: { badge_name?: string; note?: string | null; date?: string }
): Promise<MemberManualBadge> {
  const supabase = getClientOrThrow();

  const payload: Partial<MemberBadgeRow> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.badge_name !== undefined) {
    payload.badge_name = updates.badge_name.trim();
  }
  if (updates.note !== undefined) {
    payload.note = updates.note?.trim() || null;
  }
  if (updates.date) {
    payload.created_at = `${updates.date}T12:00:00.000Z`;
  }

  const { data, error } = await supabase
    .from("member_badges")
    .update(payload)
    .eq("id", badgeId)
    .select("*")
    .single();

  if (error) throw error;

  const badge = rowToBadge(data as MemberBadgeRow);
  if (!badge) throw new Error("Réponse Supabase invalide");
  return badge;
}

export async function deleteMemberBadgeServer(badgeId: string): Promise<void> {
  const supabase = getClientOrThrow();

  const { error } = await supabase.from("member_badges").delete().eq("id", badgeId);
  if (error) throw error;
}

export interface ServerFetchTestResult {
  label: string;
  url: string;
  success: boolean;
  status: number | null;
  body: string | null;
  errorName: string | null;
  errorMessage: string | null;
  errorCause: string | null;
}

function formatErrorCause(caught: unknown): string | null {
  if (!(caught instanceof Error) || caught.cause === undefined) return null;

  const cause = caught.cause;
  if (cause instanceof Error) {
    const code = (cause as NodeJS.ErrnoException).code;
    return code ? `${code}: ${cause.message}` : `${cause.name}: ${cause.message}`;
  }
  if (typeof cause === "object" && cause !== null) {
    try {
      return JSON.stringify(cause);
    } catch {
      return String(cause);
    }
  }
  return String(cause);
}

async function runServerFetchTest(
  label: string,
  url: string,
  headers?: Record<string, string>
): Promise<ServerFetchTestResult> {
  try {
    const response = await fetch(url, { headers, cache: "no-store" });
    const bodyText = await response.text();

    return {
      label,
      url,
      success: response.ok,
      status: response.status,
      body: bodyText.slice(0, 300) || null,
      errorName: null,
      errorMessage: null,
      errorCause: null,
    };
  } catch (caught) {
    return {
      label,
      url,
      success: false,
      status: null,
      body: null,
      errorName: caught instanceof Error ? caught.name : "UnknownError",
      errorMessage: caught instanceof Error ? caught.message : String(caught),
      errorCause: formatErrorCause(caught),
    };
  }
}

export async function runSupabaseNetworkDiagnosticsServer(): Promise<
  ServerFetchTestResult[]
> {
  const url = getSupabaseUrl().replace(/\/+$/, "");
  const key = getSupabaseAnonKey();

  if (!url) {
    return [];
  }

  const restHeaders = key
    ? { apikey: key, Authorization: `Bearer ${key}` }
    : undefined;

  return Promise.all([
    runServerFetchTest("Santé Supabase (auth)", `${url}/auth/v1/health`),
    runServerFetchTest(
      "Table member_badges (REST)",
      `${url}/rest/v1/member_badges?select=id&limit=1`,
      restHeaders
    ),
  ]);
}

export async function testMemberBadgesConnectionServer(): Promise<{
  configured: boolean;
  urlValid: boolean;
  keyPresent: boolean;
  success: boolean;
  count: number;
  error: string | null;
}> {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  const configured = isSupabaseConfigured();
  const urlValid = Boolean(url) && url.includes("supabase.co");
  const keyPresent = Boolean(key);

  if (!configured) {
    return {
      configured: false,
      urlValid,
      keyPresent,
      success: false,
      count: 0,
      error: "Supabase non configuré",
    };
  }

  try {
    const supabase = getClientOrThrow();
    const { count, error } = await supabase
      .from("member_badges")
      .select("*", { count: "exact", head: true });

    if (error) {
      return {
        configured: true,
        urlValid,
        keyPresent,
        success: false,
        count: 0,
        error: error.message,
      };
    }

    return {
      configured: true,
      urlValid,
      keyPresent,
      success: true,
      count: count ?? 0,
      error: null,
    };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Erreur inconnue";
    const cause = formatErrorCause(caught);
    return {
      configured: true,
      urlValid,
      keyPresent,
      success: false,
      count: 0,
      error: cause ? `${message} (cause : ${cause})` : message,
    };
  }
}
