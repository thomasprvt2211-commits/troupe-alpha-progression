import { getSupabaseClient } from "@/src/lib/supabase/client";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/src/lib/supabase/config";
import { getSupabaseErrorMessage } from "@/src/lib/supabase/errors";

export type AnonKeyFormat = "publishable" | "jwt" | "unknown" | "missing";

export interface SupabaseConnectionTestResult {
  success: boolean;
  statusCode: number | null;
  result: string;
  errorDetail: string | null;
  projectReachable: boolean | null;
  projectReachableDetail: string | null;
  sdkResult: string | null;
  sdkErrorDetail: string | null;
  hint: string | null;
}

export function getAnonKeyFormat(): AnonKeyFormat {
  const key = getSupabaseAnonKey();
  if (!key) return "missing";
  if (key.startsWith("sb_publishable_")) return "publishable";
  if (key.startsWith("eyJ")) return "jwt";
  return "unknown";
}

export function getAnonKeyFormatLabel(format: AnonKeyFormat): string {
  switch (format) {
    case "publishable":
      return "Publishable (sb_publishable_…)";
    case "jwt":
      return "JWT anon (eyJ…)";
    case "missing":
      return "Manquante";
    default:
      return "Format inconnu";
  }
}

function getFailedFetchHint(
  projectReachable: boolean | null,
  keyFormat: AnonKeyFormat
): string {
  if (projectReachable === false) {
    return "Le projet Supabase semble inaccessible. Vérifiez qu'il n'est pas en pause dans dashboard.supabase.com, puis réactivez-le.";
  }

  if (keyFormat === "unknown") {
    return "La clé dans Vercel ne ressemble pas à une clé Supabase valide. Copiez la clé « anon public » ou « publishable » depuis Supabase → Project Settings → API.";
  }

  return "Échec réseau (Failed to fetch). Vérifiez le projet Supabase, la clé API dans Vercel, puis redéployez le site après toute modification.";
}

async function testProjectReachability(): Promise<{
  reachable: boolean;
  statusCode: number | null;
  detail: string | null;
}> {
  const url = getSupabaseUrl();
  if (!url) {
    return { reachable: false, statusCode: null, detail: "URL non définie" };
  }

  try {
    const response = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
    });

    return {
      reachable: response.ok,
      statusCode: response.status,
      detail: response.ok ? null : `${response.status} ${response.statusText}`,
    };
  } catch (caught) {
    return {
      reachable: false,
      statusCode: null,
      detail: getSupabaseErrorMessage(caught),
    };
  }
}

async function testWithSupabaseSdk(): Promise<{
  success: boolean;
  detail: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, detail: "Client Supabase non initialisé" };
  }

  const { error } = await supabase.from("member_badges").select("id").limit(1);

  if (error) {
    return { success: false, detail: error.message };
  }

  return { success: true, detail: null };
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionTestResult> {
  const keyFormat = getAnonKeyFormat();

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      statusCode: null,
      result: "Échec",
      errorDetail: "Supabase n'est pas configuré.",
      projectReachable: null,
      projectReachableDetail: null,
      sdkResult: null,
      sdkErrorDetail: null,
      hint: "Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel, puis redéployez.",
    };
  }

  const projectTest = await testProjectReachability();
  const url = `${getSupabaseUrl()}/rest/v1/member_badges?select=id&limit=1`;
  const key = getSupabaseAnonKey();

  let fetchResult: SupabaseConnectionTestResult = {
    success: false,
    statusCode: null,
    result: "Échec",
    errorDetail: null,
    projectReachable: projectTest.reachable,
    projectReachableDetail: projectTest.detail,
    sdkResult: null,
    sdkErrorDetail: null,
    hint: null,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (response.ok) {
      fetchResult = {
        ...fetchResult,
        success: true,
        statusCode: response.status,
        result: "Succès",
        errorDetail: null,
      };
    } else {
      let errorDetail = response.statusText;
      try {
        const body = await response.text();
        if (body) errorDetail = body;
      } catch {
        // ignore body read errors
      }

      fetchResult = {
        ...fetchResult,
        success: false,
        statusCode: response.status,
        result: `Échec (${response.status})`,
        errorDetail,
      };
    }
  } catch (caught) {
    fetchResult = {
      ...fetchResult,
      success: false,
      statusCode: null,
      result: "Échec",
      errorDetail: getSupabaseErrorMessage(caught),
    };
  }

  const sdkTest = await testWithSupabaseSdk();
  fetchResult.sdkResult = sdkTest.success ? "Succès" : "Échec";
  fetchResult.sdkErrorDetail = sdkTest.detail;

  if (!fetchResult.success) {
    fetchResult.hint = getFailedFetchHint(projectTest.reachable, keyFormat);

    if (
      fetchResult.errorDetail?.includes("does not exist") ||
      fetchResult.sdkErrorDetail?.includes("does not exist")
    ) {
      fetchResult.hint =
        "La table member_badges n'existe pas. Exécutez le fichier supabase/schema.sql dans l'éditeur SQL Supabase.";
    } else if (
      fetchResult.errorDetail?.toLowerCase().includes("permission") ||
      fetchResult.sdkErrorDetail?.toLowerCase().includes("permission")
    ) {
      fetchResult.hint =
        "Permission refusée sur member_badges. Vérifiez les politiques RLS dans Supabase (voir supabase/schema.sql).";
    }
  }

  return fetchResult;
}

export function getSupabaseDiagnostics() {
  const url = getSupabaseUrl();
  const keyFormat = getAnonKeyFormat();

  return {
    configured: isSupabaseConfigured(),
    url: url || "(non défini)",
    urlValid: Boolean(url) && url.includes("supabase.co"),
    anonKeyPresent: Boolean(getSupabaseAnonKey()),
    keyFormat,
    keyFormatLabel: getAnonKeyFormatLabel(keyFormat),
  };
}
