import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { client as sanityClient } from "@/src/sanity/lib/client";
import { CUT_PLAN_BY_ID_QUERY } from "@/src/sanity/lib/queries";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_CONVEX_URL");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// UUID v4 regex for validating deviceId format.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 5 checkout attempts per IP per 10 minutes.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const EVICTION_INTERVAL_MS = 5 * 60 * 1000;
const rateLimitLog = new Map<string, number[]>();
let lastEviction = Date.now();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  // Periodically evict stale entries to prevent unbounded growth.
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

interface SanityPlan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { planId, deviceId } = body as Record<string, unknown>;

    if (
      typeof deviceId !== "string" ||
      deviceId.trim().length === 0 ||
      deviceId.length > 128 ||
      !UUID_RE.test(deviceId)
    ) {
      return NextResponse.json({ error: "Missing or invalid deviceId" }, { status: 400 });
    }

    if (typeof planId !== "string" || planId.trim().length === 0) {
      return NextResponse.json({ error: "Missing or invalid planId" }, { status: 400 });
    }

    // Fetch authoritative plan data from Sanity — never trust client-supplied prices.
    const plan = await sanityClient.fetch<SanityPlan | null>(
      CUT_PLAN_BY_ID_QUERY,
      { id: planId }
    );

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.price <= 0) {
      return NextResponse.json(
        { error: "This plan is free — no checkout required" },
        { status: 400 }
      );
    }

    // STEP 1: Create the Convex order BEFORE creating the Stripe session.
    const orderId = await convex.action(api.orders.createPendingOrder, {
      deviceId,
      planId: plan._id,
      planName: plan.name,
      price: plan.price,
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // STEP 2: Create Stripe checkout session for the single plan.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              ...(plan.image ? { images: [plan.image] } : {}),
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/order-confirmation?order_id=${orderId}`,
      cancel_url: `${origin}/plans/${plan.slug}`,
      metadata: { orderId, deviceId, planId: plan._id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
