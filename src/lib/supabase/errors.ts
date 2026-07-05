interface SupabaseLikeError {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}

export function getSupabaseErrorMessage(error: unknown): string {
  if (!error) return "Erreur inconnue";

  if (typeof error === "string") return error;

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object") {
    const supabaseError = error as SupabaseLikeError;
    const parts = [supabaseError.message, supabaseError.details, supabaseError.hint].filter(
      (part): part is string => Boolean(part?.trim())
    );

    if (parts.length > 0) {
      return parts.join(" — ");
    }
  }

  return "Erreur inconnue";
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
