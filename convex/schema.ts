import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    event: v.union(v.literal("plan_view"), v.literal("form_open")),
    planId: v.string(),
    planName: v.string(),
    createdAt: v.number(),
  })
    .index("by_planId", ["planId"])
    .index("by_event", ["event"]),

  downloads: defineTable({
    name: v.string(),
    email: v.string(),
    planId: v.string(),
    planName: v.string(),
    subscribe: v.optional(v.boolean()),
    emailConsent: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_planId", ["planId"]),

  orders: defineTable({
    crossId: v.string(),
    crossName: v.string(),
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled"),
    ),
    customerName: v.optional(v.string()),
    customerEmail: v.string(),
    amountTotal: v.number(),
    shippingMethod: v.string(),
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
    shippingStatus: v.optional(
      v.union(
        v.literal("not_shipped"),
        v.literal("shipped"),
        v.literal("delivered"),
      ),
    ),
    trackingNumber: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_stripeSessionId", ["stripeSessionId"])
    .index("by_status", ["status"])
    .index("by_email", ["customerEmail"]),
});
