import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cart: defineTable({
    deviceId: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),

  orders: defineTable({
    deviceId: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),
    customerEmail: v.optional(v.string()),
    shippingAddress: v.optional(
      v.object({
        name: v.string(),
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_deviceId", ["deviceId"])
    .index("by_stripeSessionId", ["stripeSessionId"]),
});
