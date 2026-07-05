interface SupabaseLikeError {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}

export const SUPABASE_CONNECTION_ERROR =
  "Connexion Supabase impossible. Vérifiez les variables Vercel ou la configuration Supabase.";

export const SUPABASE_LOCAL_FALLBACK_WARNING =
  "Sauvegarde locale utilisée car Supabase est inaccessible.";

export function getSupabaseErrorMessage(error: unknown): string {
  if (!error) return "Erreur inconnue";

  if (typeof error === "string") {
    return sanitizeErrorMessage(error);
  }

  if (error instanceof Error && error.message) {
    return sanitizeErrorMessage(error.message);
  }

  if (typeof error === "object") {
    const supabaseError = error as SupabaseLikeError;
    const parts = [supabaseError.message, supabaseError.details, supabaseError.hint].filter(
      (part): part is string => Boolean(part?.trim())
    );

    if (parts.length > 0) {
      return sanitizeErrorMessage(parts.join(" — "));
    }
  }

  return "Erreur inconnue";
}

function sanitizeErrorMessage(message: string): string {
  const firstLine = message.split("\n")[0]?.trim() ?? message;
  return firstLine.slice(0, 300);
}

export interface MemberBadgesError {
  message: string;
  detail: string | null;
}

export function createMemberBadgesError(
  message: string,
  caught: unknown
): MemberBadgesError {
  const detail = getSupabaseErrorMessage(caught);
  return {
    message,
    detail: detail || null,
  };
}

export function createSupabaseConnectionError(caught: unknown): MemberBadgesError {
  return createMemberBadgesError(SUPABASE_CONNECTION_ERROR, caught);
}
