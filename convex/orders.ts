import { query, internalQuery, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import {
  orderItemsValidator,
  shippingAddressValidator,
} from "./ordersInternal";

// Called by the Next.js checkout API route.
// Creates a pending order BEFORE the Stripe session so that a Stripe failure
// never results in a session existing without a corresponding order.
// Returns the Convex orderId, which is stored in Stripe session metadata.
export const createPendingOrder = action({
  args: {
    deviceId: v.string(),
    items: orderItemsValidator,
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args): Promise<string> => {
    return await ctx.runMutation(internal.ordersInternal.createOrder, args);
  },
});

// Called by the Next.js Stripe webhook route after signature verification.
// Uses orderId (stored in Stripe metadata, never shown in the browser UI)
// rather than stripeSessionId (visible in the success URL), preventing a user
// from calling this action on their own pending order to mark it paid without paying.
export const processPaymentSuccess = action({
  args: {
    orderId: v.id("orders"),
    deviceId: v.string(),
    customerEmail: v.optional(v.string()),
    shippingAddress: shippingAddressValidator,
    stripePaymentIntentId: v.optional(v.string()),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.runMutation(internal.ordersInternal.fulfillOrder, args);
  },
});

// Used by the order confirmation page to look up an order by its Convex ID,
// which is embedded in the success URL at checkout time.
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getOrderBySessionId = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .unique();
  },
});

// Internal — exposes PII (email, shipping address). Only safe to call from
// authenticated contexts. Do not expose as a public query until admin auth exists.
export const getOrdersByDeviceId = internalQuery({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .order("desc")
      .collect();
  },
});
