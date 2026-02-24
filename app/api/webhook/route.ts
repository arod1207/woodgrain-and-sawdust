import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Stripe from "stripe";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const deviceId = session.metadata?.deviceId;

    if (!deviceId) {
      console.error("No deviceId in session metadata");
      return NextResponse.json({ received: true });
    }

    const shippingDetails = session.shipping_details;

    try {
      await convex.mutation(api.orders.fulfillOrder, {
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email ?? undefined,
        shippingAddress: shippingDetails?.address
          ? {
              name: shippingDetails.name ?? "",
              line1: shippingDetails.address.line1 ?? "",
              line2: shippingDetails.address.line2 ?? undefined,
              city: shippingDetails.address.city ?? "",
              state: shippingDetails.address.state ?? "",
              postalCode: shippingDetails.address.postal_code ?? "",
              country: shippingDetails.address.country ?? "",
            }
          : undefined,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined,
      });

      await convex.mutation(api.cart.clearCart, { deviceId });
    } catch (err) {
      console.error("Error fulfilling order:", err);
      return NextResponse.json(
        { error: "Error processing webhook" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
