import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Internal-only order lookup — used by processPaymentSuccess to read order
// data for the confirmation email without exposing PII via the public API.
export const getOrderById = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Creates a pending order before the Stripe session exists.
// Returns the Convex orderId so it can be stored in Stripe session metadata.
export const createOrder = internalMutation({
  args: {
    deviceId: v.string(),
    planId: v.string(),
    planName: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      deviceId: args.deviceId,
      planId: args.planId,
      planName: args.planName,
      price: args.price,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Fulfills an order after Stripe payment confirmation.
// Uses orderId (from Stripe session metadata) for security.
export const fulfillOrder = internalMutation({
  args: {
    orderId: v.id("orders"),
    deviceId: v.string(),
    customerEmail: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);

    if (!order) throw new Error(`Order not found: ${args.orderId}`);

    // Ownership check — prevent one device from fulfilling another device's order.
    if (order.deviceId !== args.deviceId) {
      throw new Error("deviceId mismatch — order does not belong to this device");
    }

    // Idempotency guard — Stripe can deliver webhooks more than once.
    if (order.status === "paid") return;

    await ctx.db.patch(args.orderId, {
      status: "paid",
      customerEmail: args.customerEmail,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeSessionId: args.stripeSessionId,
      updatedAt: Date.now(),
    });
  },
});
