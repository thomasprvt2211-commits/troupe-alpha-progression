import type { MemberBadgesStore, MemberManualBadge } from "@/src/types";
import { getSupabaseErrorMessage } from "@/src/lib/supabase/errors";

async function parseApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // ignore JSON parse errors
  }
  return `Erreur HTTP ${response.status}`;
}

export async function fetchAllMemberBadgesFromApi(): Promise<MemberBadgesStore> {
  const response = await fetch("/api/member-badges");

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as { store?: MemberBadgesStore };
  return data.store ?? {};
}

export async function fetchMemberBadgesFromApi(
  memberId: string
): Promise<MemberManualBadge[]> {
  const response = await fetch(
    `/api/member-badges?memberId=${encodeURIComponent(memberId)}`
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as { badges?: MemberManualBadge[] };
  return data.badges ?? [];
}

export async function addMemberBadgeViaApi(
  memberId: string,
  data: { name: string; note?: string }
): Promise<MemberManualBadge> {
  const response = await fetch("/api/member-badges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      member_id: memberId,
      badge_name: data.name,
      note: data.note ?? "",
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const result = (await response.json()) as { badge: MemberManualBadge };
  return result.badge;
}

export async function updateMemberBadgeViaApi(
  badgeId: string,
  updates: Partial<Pick<MemberManualBadge, "name" | "note" | "date">>
): Promise<MemberManualBadge> {
  const body: Record<string, string> = { id: badgeId };
  if (updates.name !== undefined) body.badge_name = updates.name;
  if (updates.note !== undefined) body.note = updates.note;
  if (updates.date !== undefined) body.date = updates.date;

  const response = await fetch("/api/member-badges", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const result = (await response.json()) as { badge: MemberManualBadge };
  return result.badge;
}

export async function deleteMemberBadgeViaApi(badgeId: string): Promise<void> {
  const response = await fetch(
    `/api/member-badges?id=${encodeURIComponent(badgeId)}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
}

export interface ApiNetworkTestResult {
  label: string;
  url: string;
  success: boolean;
  status: number | null;
  body: string | null;
  errorName: string | null;
  errorMessage: string | null;
  errorCause: string | null;
}

export interface ApiDiagnosticResult {
  configured: boolean;
  urlValid: boolean;
  keyPresent: boolean;
  success: boolean;
  count: number;
  error: string | null;
  url?: string;
  networkTests?: ApiNetworkTestResult[];
}

export async function testMemberBadgesApiConnection(): Promise<ApiDiagnosticResult> {
  try {
    const response = await fetch("/api/member-badges/diagnostic");

    if (!response.ok) {
      return {
        configured: false,
        urlValid: false,
        keyPresent: false,
        success: false,
        count: 0,
        error: await parseApiError(response),
      };
    }

    return (await response.json()) as ApiDiagnosticResult;
  } catch (caught) {
    return {
      configured: false,
      urlValid: false,
      keyPresent: false,
      success: false,
      count: 0,
      error: getSupabaseErrorMessage(caught),
    };
  }
}
