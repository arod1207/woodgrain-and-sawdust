import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const orderItemsValidator = v.array(
  v.object({
    productId: v.string(),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    image: v.string(),
  })
);

export const shippingAddressValidator = v.optional(
  v.object({
    name: v.string(),
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    country: v.string(),
  })
);

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
    items: orderItemsValidator,
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      deviceId: args.deviceId,
      items: args.items,
      subtotal: args.subtotal,
      shipping: args.shipping,
      total: args.total,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Fulfills an order by its Convex document ID.
// Uses orderId (from Stripe session metadata) rather than stripeSessionId (visible in browser URL),
// so the public action wrapper cannot be exploited by a user who knows their session_id.
export const fulfillOrder = internalMutation({
  args: {
    orderId: v.id("orders"),
    deviceId: v.string(),
    customerEmail: v.optional(v.string()),
    shippingAddress: shippingAddressValidator,
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

    // Mark the order paid, store session details, and clear the cart atomically.
    await ctx.db.patch(args.orderId, {
      status: "paid",
      customerEmail: args.customerEmail,
      shippingAddress: args.shippingAddress,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeSessionId: args.stripeSessionId,
      updatedAt: Date.now(),
    });

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    if (cart) {
      await ctx.db.delete(cart._id);
    }
  },
});
