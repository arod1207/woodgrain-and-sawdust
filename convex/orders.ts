import { query, mutation, internalQuery, action, internalAction } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { UserIdentity } from "convex/server";

// Throws if the caller is not an authenticated Clerk user with role "admin".
function assertAdmin(identity: UserIdentity | null): asserts identity is UserIdentity {
  if (!identity) throw new Error("Unauthorized");
  const role = (identity.publicMetadata as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
}

// Called by the Next.js checkout API route.
// Creates a pending order BEFORE the Stripe session so that a Stripe failure
// never results in a session existing without a corresponding order.
// Note: This must be a public action because the checkout API calls it via
// ConvexHttpClient. Input validation guards against abuse via direct calls.
export const createPendingOrder = action({
  args: {
    deviceId: v.string(),
    planId: v.string(),
    planName: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<string> => {
    if (args.deviceId.length > 128 || args.planId.length > 128 || args.planName.length > 256) {
      throw new Error("Invalid input");
    }
    if (args.price < 0 || args.price > 10000) {
      throw new Error("Invalid price");
    }
    return await ctx.runMutation(internal.ordersInternal.createOrder, args);
  },
});

// Called exclusively from the Convex HTTP action (convex/http.ts) after
// Stripe signature verification inside Convex's own runtime.
export const processPaymentSuccess = internalAction({
  args: {
    orderId: v.id("orders"),
    deviceId: v.string(),
    customerEmail: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    // Read pre-fulfillment status to detect Stripe webhook retries.
    const preState = await ctx.runQuery(internal.ordersInternal.getOrderById, {
      orderId: args.orderId,
    });
    const alreadyPaid = preState?.status === "paid";

    await ctx.runMutation(internal.ordersInternal.fulfillOrder, args);

    if (!alreadyPaid && args.customerEmail) {
      const order = await ctx.runQuery(internal.ordersInternal.getOrderById, {
        orderId: args.orderId,
      });
      if (order) {
        try {
          await ctx.runAction(internal.email.sendOrderConfirmationEmail, {
            customerEmail: args.customerEmail,
            orderId: args.orderId,
            planName: order.planName,
            price: order.price,
          });
        } catch (err) {
          console.error("[email] Failed to send order confirmation email:", err);
        }
      }
    }
  },
});

// Check if a device has already purchased a specific plan.
// Returns the orderId if purchased (for download link), or null.
export const hasUserPurchasedPlan = query({
  args: { deviceId: v.string(), planId: v.string() },
  handler: async (ctx, args) => {
    if (!args.deviceId) return null;
    const order = await ctx.db
      .query("orders")
      .withIndex("by_deviceId_planId", (q) =>
        q.eq("deviceId", args.deviceId).eq("planId", args.planId)
      )
      .filter((q) => q.eq(q.field("status"), "paid"))
      .first();
    return order ? order._id : null;
  },
});

// Public query — returns only the fields safe for the client (order confirmation
// page, download link). Sensitive fields (deviceId, customerEmail, stripe IDs)
// are deliberately excluded.
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    return {
      _id: order._id,
      planId: order.planId,
      planName: order.planName,
      price: order.price,
      status: order.status,
      createdAt: order.createdAt,
    };
  },
});

const ORDER_STATUS_VALIDATOR = v.optional(
  v.union(v.literal("pending"), v.literal("paid"), v.literal("failed"))
);

// Admin query — returns ALL orders without pagination.
export const getAllOrdersAdmin = query({
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// Admin query — paginated. Pass status to filter by a specific status.
export const getAllOrders = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: ORDER_STATUS_VALIDATOR,
  },
  handler: async (ctx, args) => {
    assertAdmin(await ctx.auth.getUserIdentity());

    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("orders")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Admin query — returns per-status counts for the filter tab badges.
// Uses the by_status index so Convex only scans matching rows per status.
export const getOrderCounts = query({
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    const [pending, paid, failed] = await Promise.all([
      ctx.db.query("orders").withIndex("by_status", (q) => q.eq("status", "pending")).collect(),
      ctx.db.query("orders").withIndex("by_status", (q) => q.eq("status", "paid")).collect(),
      ctx.db.query("orders").withIndex("by_status", (q) => q.eq("status", "failed")).collect(),
    ]);
    return {
      all: pending.length + paid.length + failed.length,
      pending: pending.length,
      paid: paid.length,
      failed: failed.length,
    };
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

// Internal — exposes PII (email). Only safe to call from authenticated contexts.
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
