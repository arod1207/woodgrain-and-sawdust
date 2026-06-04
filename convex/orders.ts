import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { UserIdentity } from "convex/server";

function assertAdmin(identity: UserIdentity | null): asserts identity is UserIdentity {
  if (!identity) throw new Error("Unauthorized");
  const role = (identity.publicMetadata as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
}

export const createOrder = mutation({
  args: {
    crossId: v.string(),
    crossName: v.string(),
    stripeSessionId: v.string(),
    customerEmail: v.string(),
    amountTotal: v.number(),
    shippingMethod: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const fulfillOrder = mutation({
  args: {
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    shippingMethod: v.optional(v.string()),
    shippingAddress: v.optional(
      v.object({
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        postal_code: v.string(),
        country: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId),
      )
      .first();

    if (!order) return null;

    await ctx.db.patch(order._id, {
      status: "paid",
      stripePaymentIntentId: args.stripePaymentIntentId,
      ...(args.customerEmail ? { customerEmail: args.customerEmail } : {}),
      customerName: args.customerName,
      ...(args.shippingMethod ? { shippingMethod: args.shippingMethod } : {}),
      shippingAddress: args.shippingAddress,
    });

    return order._id;
  },
});

export const getOrderBySessionId = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId),
      )
      .first();
  },
});

export const getAllOrdersAdmin = query({
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateShipping = mutation({
  args: {
    orderId: v.id("orders"),
    shippingStatus: v.union(
      v.literal("not_shipped"),
      v.literal("shipped"),
      v.literal("delivered"),
    ),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    await ctx.db.patch(args.orderId, {
      shippingStatus: args.shippingStatus,
      ...(args.trackingNumber !== undefined && {
        trackingNumber: args.trackingNumber,
      }),
    });
  },
});

export const getOrderStats = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const paid = orders.filter((o) => o.status === "paid");
    return {
      total: orders.length,
      paid: paid.length,
      revenue: paid.reduce((sum, o) => sum + o.amountTotal, 0),
    };
  },
});
