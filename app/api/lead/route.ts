import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_CONVEX_URL");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 10 lead submissions per IP per 10 minutes.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const EVICTION_INTERVAL_MS = 5 * 60 * 1000;
const rateLimitLog = new Map<string, number[]>();
let lastEviction = Date.now();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  if (now - lastEviction > EVICTION_INTERVAL_MS) {
    for (const [key, timestamps] of rateLimitLog) {
      const active = timestamps.filter((t) => t > cutoff);
      if (active.length === 0) {
        rateLimitLog.delete(key);
      } else {
        rateLimitLog.set(key, active);
      }
    }
    lastEviction = now;
  }

  const timestamps = (rateLimitLog.get(ip) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, timestamps);
    return true;
  }
  rateLimitLog.set(ip, [...timestamps, now]);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; planId?: string; planName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, planId, planName } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!planId || typeof planId !== "string") {
    return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
  }
  if (!planName || typeof planName !== "string") {
    return NextResponse.json({ error: "Plan name is required" }, { status: 400 });
  }

  try {
    await convex.mutation(api.downloads.recordDownload, {
      name,
      email,
      planId,
      planName,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to record download" },
      { status: 500 }
    );
  }
}
