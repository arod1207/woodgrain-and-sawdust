import { query, internalQuery, action, internalAction } from "./_generated/server";
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

// Called exclusively from the Convex HTTP action (convex/http.ts) after
// Stripe signature verification inside Convex's own runtime.
// internalAction ensures this cannot be invoked from any browser or external client.
export const processPaymentSuccess = internalAction({
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

// Admin query — requires an authenticated Clerk session token.
// Pass the token via fetchQuery(api.orders.getAllOrders, {}, { token }) in server components.
export const getAllOrders = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db.query("orders").order("desc").collect();
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
