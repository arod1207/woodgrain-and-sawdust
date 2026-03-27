import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getSecret(): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) throw new Error("DOWNLOAD_TOKEN_SECRET is not set");
  return secret;
}

// Token format: base64url("<planId>.<expiresAt>.<hmac>")
export function generateDownloadToken(planId: string): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${planId}.${expiresAt}`;
  const hmac = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${hmac}`).toString("base64url");
}

export function validateDownloadToken(token: string, planId: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = decoded.slice(0, lastDot);
    const providedHmac = decoded.slice(lastDot + 1);

    const expectedHmac = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (!timingSafeEqual(Buffer.from(providedHmac), Buffer.from(expectedHmac))) return false;

    const dotIndex = payload.indexOf(".");
    if (dotIndex === -1) return false;
    const tokenPlanId = payload.slice(0, dotIndex);
    const expiresAt = Number(payload.slice(dotIndex + 1));

    if (tokenPlanId !== planId) return false;
    if (Date.now() > expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}
