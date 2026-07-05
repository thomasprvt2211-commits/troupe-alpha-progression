const PLACEHOLDER_PATTERNS = [
  "PASTE_",
  "your-anon-key",
  "your-project",
  "example.com",
];

function isValidEnvValue(value: string | undefined): boolean {
  if (!value?.trim()) return false;

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();

  return !PLACEHOLDER_PATTERNS.some(
    (pattern) => lower.includes(pattern.toLowerCase())
  );
}

export function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.includes("supabase");
  } catch {
    return false;
  }
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function isSupabaseUrlValid(): boolean {
  const url = getSupabaseUrl();
  return Boolean(url) && isValidSupabaseUrl(url);
}

export function isAnonKeyPresent(): boolean {
  return isValidEnvValue(getSupabaseAnonKey());
}

export function isSupabaseConfigured(): boolean {
  return isSupabaseUrlValid() && isAnonKeyPresent();
}

export function getSupabaseConfigError(): string | null {
  if (isSupabaseConfigured()) return null;
  return "Supabase n'est pas configuré.";
}

export function getSupabaseDiagnostics() {
  const url = getSupabaseUrl();

  return {
    configured: isSupabaseConfigured(),
    url: url || "(non défini)",
    urlValid: isSupabaseUrlValid(),
    anonKeyPresent: isAnonKeyPresent(),
  };
}
