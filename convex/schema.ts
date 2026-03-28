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
});
