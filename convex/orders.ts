import { query, mutation, internalQuery, action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { UserIdentity } from "convex/server";
import {
  orderItemsValidator,
  shippingAddressValidator,
} from "./ordersInternal";

// Throws if the caller is not an authenticated Clerk user with role "admin".
// Set role via Clerk Dashboard → Users → <user> → Public metadata: { "role": "admin" }
function assertAdmin(identity: UserIdentity | null): asserts identity is UserIdentity {
  if (!identity) throw new Error("Unauthorized");
  const role = (identity.publicMetadata as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
}

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

    if (args.customerEmail) {
      const order = await ctx.runQuery(internal.ordersInternal.getOrderById, {
        orderId: args.orderId,
      });
      if (order) {
        try {
          await ctx.runAction(internal.email.sendOrderConfirmationEmail, {
            customerEmail: args.customerEmail,
            customerName: args.shippingAddress?.name ?? "Valued Customer",
            orderId: args.orderId,
            items: order.items,
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total,
            shippingAddress: args.shippingAddress,
          });
        } catch (err) {
          console.error("[email] Failed to send order confirmation email:", err);
          // non-fatal — order is already fulfilled
        }
      }
    }
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

// Admin query — requires an authenticated Clerk session token with role "admin".
// Pass the token via fetchQuery(api.orders.getAllOrders, {}, { token }) in server components.
export const getAllOrders = query({
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    // TODO: replace with paginate() once order volume warrants it
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// Admin mutation — requires an authenticated Clerk session token with role "admin".
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    assertAdmin(await ctx.auth.getUserIdentity());

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status === "paid" && args.status !== "paid") {
      throw new Error("Cannot revert a paid order");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
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
