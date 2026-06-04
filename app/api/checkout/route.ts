import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { serverClient } from "@/src/sanity/lib/client";
import { Cross } from "@/src/sanity/lib/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getSiteUrl } from "@/lib/siteUrl";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_CONVEX_URL",
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Includes _rev for optimistic-lock reservation (not in the shared CROSS_BY_ID_QUERY)
const CHECKOUT_CROSS_QUERY = `*[_type == "cross" && _id == $id][0] {
  _id,
  _rev,
  name,
  price,
  shippingRate,
  available,
  "imageUrl": images[0].asset->url
}`;

type CheckoutCross = Cross & { _rev: string };

export async function POST(request: NextRequest) {
  let body: { crossId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { crossId } = body;
  if (!crossId || typeof crossId !== "string") {
    return NextResponse.json({ error: "crossId is required" }, { status: 400 });
  }

  // Use serverClient (useCdn: false) for a fresh, non-stale read
  const cross = await serverClient.fetch<CheckoutCross | null>(
    CHECKOUT_CROSS_QUERY,
    { id: crossId },
    { cache: 'no-store' },
  );

  if (!cross) {
    return NextResponse.json({ error: "Cross not found" }, { status: 404 });
  }
  if (!cross.available) {
    return NextResponse.json(
      { error: "This cross is no longer available" },
      { status: 409 },
    );
  }

  try {
    await serverClient
      .patch(cross._id)
      .set({ available: false })
      .commit();
  } catch (err) {
    console.error("Sanity reservation patch failed:", err);
    return NextResponse.json(
      { error: "This cross is no longer available" },
      { status: 409 },
    );
  }

  const siteUrl = getSiteUrl();
  const amountInCents = Math.round(cross.price * 100);
  const shippingRateInCents = Math.round((cross.shippingRate ?? 15) * 100);
  const amountTotal = amountInCents + shippingRateInCents;

  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
    [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingRateInCents, currency: "usd" },
          display_name: "Standard Shipping (USPS)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 10 },
          },
        },
      },
    ];

  // Create Stripe session — restore reservation on failure
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: cross.name,
              ...(cross.imageUrl ? { images: [cross.imageUrl] } : {}),
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: shippingOptions,
      metadata: { crossId: cross._id, crossName: cross.name },
      success_url: `${siteUrl}/shop/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
    });
  } catch (err) {
    await serverClient
      .patch(cross._id)
      .set({ available: true })
      .commit()
      .catch(() => {});
    console.error("Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 },
    );
  }

  // Record pending order — restore reservation on failure
  try {
    await convex.mutation(api.orders.createOrder, {
      crossId: cross._id,
      crossName: cross.name,
      stripeSessionId: session.id,
      customerEmail: "",
      amountTotal,
      shippingMethod: "pending",
    });
  } catch (err) {
    await serverClient
      .patch(cross._id)
      .set({ available: true })
      .commit()
      .catch(() => {});
    console.error("Convex order creation failed:", err);
    return NextResponse.json(
      { error: "Failed to record order. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
