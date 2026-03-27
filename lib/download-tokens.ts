import { randomBytes } from "crypto";

interface TokenEntry {
  planId: string;
  expiresAt: number;
}

const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes
const EVICTION_INTERVAL_MS = 5 * 60 * 1000;
const tokenStore = new Map<string, TokenEntry>();
let lastEviction = Date.now();

function evictExpired() {
  const now = Date.now();
  if (now - lastEviction < EVICTION_INTERVAL_MS) return;
  for (const [token, entry] of tokenStore) {
    if (entry.expiresAt <= now) tokenStore.delete(token);
  }
  lastEviction = now;
}

export function generateDownloadToken(planId: string): string {
  evictExpired();
  const token = randomBytes(32).toString("hex");
  tokenStore.set(token, { planId, expiresAt: Date.now() + TOKEN_TTL_MS });
  return token;
}

export function validateDownloadToken(token: string, planId: string): boolean {
  evictExpired();
  const entry = tokenStore.get(token);
  if (!entry) return false;
  if (entry.planId !== planId || entry.expiresAt <= Date.now()) {
    tokenStore.delete(token);
    return false;
  }
  tokenStore.delete(token); // single-use
  return true;
}
