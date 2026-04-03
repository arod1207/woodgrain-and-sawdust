const FALLBACK = "https://woodgrainandsawdust.com";

/**
 * Returns a guaranteed valid absolute URL string for the site.
 * - Uses NEXT_PUBLIC_SITE_URL if set; otherwise falls back to the hardcoded default.
 * - Prepends "https://" when the env value has no scheme (e.g. "localhost:3000").
 *   This prevents new URL(siteUrl) from throwing in layout.tsx.
 */
export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (!raw) return FALLBACK;
  if (!/^https?:\/\//i.test(raw)) return `https://${raw}`;
  return raw;
}
