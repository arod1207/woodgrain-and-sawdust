import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Stripe from "stripe";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_CONVEX_URL");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

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

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing required environment variable: STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // orderId is the Convex document ID stored in metadata at checkout time.
    // Using orderId (never exposed in the browser UI) instead of stripeSessionId
    // (visible in the success URL) closes the exploit where a user could call
    // processPaymentSuccess with their own session_id to mark a pending order paid.
    const orderId = session.metadata?.orderId;
    const deviceId = session.metadata?.deviceId;

    if (!orderId || !deviceId) {
      // Return 5xx so Stripe retries the webhook — missing metadata is unexpected
      // and may indicate a bug on our side, not a bad request from Stripe.
      console.error("Missing orderId or deviceId in session metadata", session.id);
      return NextResponse.json(
        { error: "Missing required metadata" },
        { status: 500 }
      );
    }

    const shippingDetails = session.shipping_details;

    try {
      await convex.action(api.orders.processPaymentSuccess, {
        orderId: orderId as Id<"orders">,
        deviceId,
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
