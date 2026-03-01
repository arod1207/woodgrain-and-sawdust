import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { client as sanityClient } from "@/src/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/src/sanity/lib/queries";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_CONVEX_URL");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// UUID v4 regex for validating deviceId format.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Maximum number of distinct line items per order (DoS protection).
const MAX_ITEMS = 50;
// Maximum quantity per line item — mirrors the Convex cart mutation limit.
const MAX_QTY = 99;

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 5 checkout attempts per IP per 10 minutes.
// Note: resets on server restart and is not shared across multiple instances.
// For multi-instance/serverless deployments, replace with a KV-backed limiter
// (e.g. Upstash Redis with @upstash/ratelimit).
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;
const rateLimitLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitLog.get(ip) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, timestamps);
    return true;
  }
  rateLimitLog.set(ip, [...timestamps, now]);
  return false;
}

interface CartLineItem {
  productId: string;
  quantity: number;
}

interface SanityProduct {
  _id: string;
  name: string;
  price: number;
  inStock: boolean;
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

    const { items, deviceId } = body as Record<string, unknown>;

    if (
      typeof deviceId !== "string" ||
      deviceId.trim().length === 0 ||
      deviceId.length > 128 ||
      !UUID_RE.test(deviceId)
    ) {
      return NextResponse.json({ error: "Missing or invalid deviceId" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing or empty items" }, { status: 400 });
    }

    if (items.length > MAX_ITEMS) {
      return NextResponse.json(
        { error: `Cart cannot exceed ${MAX_ITEMS} items` },
        { status: 400 }
      );
    }

    // Validate each item has a non-empty productId and a positive integer quantity.
    const isValid = items.every(
      (item: unknown) =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as Record<string, unknown>).productId === "string" &&
        ((item as Record<string, unknown>).productId as string).length > 0 &&
        Number.isInteger((item as Record<string, unknown>).quantity) &&
        ((item as Record<string, unknown>).quantity as number) > 0 &&
        ((item as Record<string, unknown>).quantity as number) <= MAX_QTY
    );
    if (!isValid) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const validatedItems = items as CartLineItem[];

    // Fetch authoritative product data (including price) from Sanity.
    // Client-supplied prices are intentionally ignored.
    const productIds = validatedItems.map((item) => item.productId);
    const sanityProducts = await sanityClient.fetch<SanityProduct[]>(
      PRODUCTS_BY_IDS_QUERY,
      { ids: productIds }
    );

    const productMap = new Map<string, SanityProduct>(
      sanityProducts.map((p) => [p._id, p])
    );

    // Reject if any cart item has no matching product in Sanity.
    const missingProduct = validatedItems.find((item) => !productMap.has(item.productId));
    if (missingProduct) {
      return NextResponse.json(
        { error: "One or more products could not be found" },
        { status: 400 }
      );
    }

    // Reject if any product is out of stock.
    const outOfStock = validatedItems.find(
      (item) => productMap.get(item.productId)!.inStock === false
    );
    if (outOfStock) {
      return NextResponse.json(
        { error: "One or more items in your cart are out of stock" },
        { status: 400 }
      );
    }

    // Build Stripe line items using Sanity prices — never client-supplied values.
    const lineItems = validatedItems.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error("Product missing from map after validation");
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            ...(product.image ? { images: [product.image] } : {}),
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Build verified order items using Sanity data for storage.
    const verifiedItems = validatedItems.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error("Product missing from map after validation");
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image ?? "",
      };
    });

    // Round subtotal to cents to avoid floating-point accumulation errors.
    const subtotal =
      Math.round(
        verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
      ) / 100;

    // STEP 1: Create the Convex order BEFORE creating the Stripe session.
    // If Stripe fails after this point, we have an orphaned pending order — acceptable.
    // The previous ordering (session first, order second) was dangerous: if Convex failed,
    // the customer could pay but the webhook would have no order to fulfill.
    const orderId = await convex.action(api.orders.createPendingOrder, {
      deviceId,
      items: verifiedItems,
      subtotal,
      shipping: 0,
      total: subtotal,
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // STEP 2: Create the Stripe checkout session, embedding the Convex orderId in metadata.
    // The webhook uses orderId (not stripeSessionId) to find the order, so the session_id
    // visible in the success URL cannot be used to fraudulently fulfill a pending order.
    // The orderId is also embedded in the success URL so the confirmation page can query
    // the order directly — eliminating the need for a public attachStripeSession action.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/order-confirmation?order_id=${orderId}`,
      cancel_url: `${origin}/cart`,
      metadata: { orderId, deviceId },
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
