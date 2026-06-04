import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/src/sanity/lib/client";
import { CROSS_BY_ID_QUERY } from "@/src/sanity/lib/queries";
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

  const cross: Cross | null = await client.fetch(CROSS_BY_ID_QUERY, {
    id: crossId,
  });

  if (!cross) {
    return NextResponse.json({ error: "Cross not found" }, { status: 404 });
  }
  if (!cross.available) {
    return NextResponse.json(
      { error: "This cross is no longer available" },
      { status: 409 },
    );
  }

  const siteUrl = getSiteUrl();
  const amountInCents = Math.round(cross.price * 100);
  const shippingRateInCents = Math.round((cross.shippingRate ?? 15) * 100);

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

  const productData: Stripe.Checkout.SessionCreateParams.LineItem["price_data"] =
    {
      currency: "usd",
      product_data: {
        name: cross.name,
        ...(cross.imageUrl ? { images: [cross.imageUrl] } : {}),
      },
      unit_amount: amountInCents,
    };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: productData, quantity: 1 }],
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: shippingOptions,
    metadata: { crossId: cross._id, crossName: cross.name },
    success_url: `${siteUrl}/shop/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/shop`,
  });

  // Create a pending order in Convex immediately so we have a record even if
  // the webhook is delayed.
  await convex.mutation(api.orders.createOrder, {
    crossId: cross._id,
    crossName: cross.name,
    stripeSessionId: session.id,
    customerEmail: "",
    amountTotal: amountInCents,
    shippingMethod: "pending",
  });

  return NextResponse.json({ url: session.url });
}
