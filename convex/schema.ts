import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    deviceId: v.string(),
    planId: v.string(),
    planName: v.string(),
    price: v.number(),
    customerEmail: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_deviceId", ["deviceId"])
    .index("by_stripeSessionId", ["stripeSessionId"])
    .index("by_status", ["status"])
    .index("by_deviceId_planId", ["deviceId", "planId"]),
});
