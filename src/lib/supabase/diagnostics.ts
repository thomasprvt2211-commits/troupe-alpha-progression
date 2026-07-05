import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/src/lib/supabase/config";
import { getSupabaseErrorMessage } from "@/src/lib/supabase/errors";

export interface SupabaseConnectionTestResult {
  success: boolean;
  statusCode: number | null;
  result: string;
  errorDetail: string | null;
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionTestResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      statusCode: null,
      result: "Échec",
      errorDetail: "Supabase n'est pas configuré.",
    };
  }

  const url = `${getSupabaseUrl()}/rest/v1/member_badges?select=id&limit=1`;
  const key = getSupabaseAnonKey();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (response.ok) {
      return {
        success: true,
        statusCode: response.status,
        result: "Succès",
        errorDetail: null,
      };
    }

    let errorDetail = response.statusText;
    try {
      const body = await response.text();
      if (body) errorDetail = body;
    } catch {
      // ignore body read errors
    }

    return {
      success: false,
      statusCode: response.status,
      result: `Échec (${response.status})`,
      errorDetail,
    };
  } catch (caught) {
    return {
      success: false,
      statusCode: null,
      result: "Échec",
      errorDetail: getSupabaseErrorMessage(caught),
    };
  }
}
