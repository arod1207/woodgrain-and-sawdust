// Thin proxy to the Convex HTTP action that handles Stripe webhooks.
//
// Stripe signature verification and order fulfillment both happen inside
// Convex's runtime (convex/http.ts), where server-internal functions are
// reachable and the ConvexHttpClient (browser SDK) is not involved.
//
// This proxy preserves the raw request body byte-for-byte so the HMAC
// signature Stripe attached can be re-verified on the Convex side.
//
// If you ever want to point Stripe directly at the Convex HTTP endpoint,
// the URL is: https://<deployment>.convex.site/stripe-webhook
// and this file can be deleted.

import { NextRequest, NextResponse } from "next/server";

// Derive the Convex HTTP-actions URL from the cloud API URL.
// NEXT_PUBLIC_CONVEX_URL  => https://<name>.convex.cloud  (client API)
// Convex site URL         => https://<name>.convex.site   (HTTP actions)
function convexSiteUrl(): string {
  const explicit = process.env.CONVEX_SITE_URL;
  if (explicit) return explicit;

  const cloudUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!cloudUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_CONVEX_URL — cannot derive Convex site URL"
    );
  }
  return cloudUrl.replace(".convex.cloud", ".convex.site");
}

export async function POST(request: NextRequest) {
  let siteUrl: string;
  try {
    siteUrl = convexSiteUrl();
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // Read the body as raw bytes — forwarding the exact bytes is required so
  // Stripe's HMAC signature can be verified inside the Convex HTTP action.
  const rawBody = await request.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(`${siteUrl}/stripe-webhook`, {
      method: "POST",
      headers: {
        "content-type": request.headers.get("content-type") ?? "application/json",
        "stripe-signature": signature,
      },
      body: rawBody,
    });
  } catch (err) {
    console.error("Failed to reach Convex webhook endpoint:", err);
    return NextResponse.json(
      { error: "Failed to forward webhook" },
      { status: 502 }
    );
  }

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
