import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
