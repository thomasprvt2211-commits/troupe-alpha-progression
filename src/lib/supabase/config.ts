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

function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.includes("supabase");
  } catch {
    return false;
  }
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    isValidEnvValue(url) &&
    isValidEnvValue(key) &&
    isValidSupabaseUrl(url!.trim())
  );
}

export function getSupabaseConfigError(): string | null {
  if (isSupabaseConfigured()) return null;
  return "Supabase n'est pas configuré.";
}
