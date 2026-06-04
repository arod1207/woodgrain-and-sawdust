import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { serverClient } from "@/src/sanity/lib/client";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error(
    "Missing required environment variable: STRIPE_WEBHOOK_SECRET",
  );
}
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_CONVEX_URL",
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const crossId = session.metadata?.crossId;
    const shippingOption = session.shipping_cost?.shipping_rate;
    const shippingDetails = session.collected_information?.shipping_details;
    const addr = shippingDetails?.address;

    // Determine shipping method — default standard_shipping since that's the only
    // option offered at checkout. Only override to local_pickup if the rate name
    // explicitly says so (future-proofing for when local pickup is added).
    let shippingMethod = "standard_shipping";
    if (typeof shippingOption === "string") {
      try {
        const rate = await stripe.shippingRates.retrieve(shippingOption);
        if (rate.display_name?.toLowerCase().includes("pickup")) {
          shippingMethod = "local_pickup";
        }
      } catch (err) {
        console.error("Failed to retrieve shipping rate; defaulting to standard_shipping:", err);
      }
    }

    const shippingAddress =
      shippingMethod === "standard_shipping" && addr
        ? {
            line1: addr.line1 ?? "",
            line2: addr.line2 ?? undefined,
            city: addr.city ?? "",
            state: addr.state ?? "",
            postal_code: addr.postal_code ?? "",
            country: addr.country ?? "",
          }
        : undefined;

    // Fulfill the order in Convex
    await convex.mutation(api.orders.fulfillOrder, {
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined,
      customerEmail: session.customer_details?.email ?? undefined,
      customerName: session.customer_details?.name ?? shippingDetails?.name ?? undefined,
      shippingMethod,
      shippingAddress,
    });

    // Mark the cross as sold in Sanity
    if (crossId) {
      try {
        await serverClient.patch(crossId).set({ available: false }).commit();
      } catch (err) {
        console.error("Failed to mark cross as sold in Sanity:", err);
        // Don't fail the webhook — order is still recorded
      }
    }
  }

  return NextResponse.json({ received: true });
}
