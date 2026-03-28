import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { UserIdentity } from "convex/server";

function assertAdmin(identity: UserIdentity | null): asserts identity is UserIdentity {
  if (!identity) throw new Error("Unauthorized");
  const role = (identity.publicMetadata as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
}

// Public — called client-side to track plan views and form opens.
export const recordEvent = mutation({
  args: {
    event: v.union(v.literal("plan_view"), v.literal("form_open")),
    planId: v.string(),
    planName: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.planId || args.planId.length > 128) throw new Error("Invalid planId");
    if (!args.planName || args.planName.length > 256) throw new Error("Invalid planName");

    await ctx.db.insert("events", {
      event: args.event,
      planId: args.planId,
      planName: args.planName,
      createdAt: Date.now(),
    });
  },
});

// Admin — funnel stats per plan: views → form opens → downloads.
export const getFunnelStats = query({
  args: {},
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());

    const [allEvents, allDownloads] = await Promise.all([
      ctx.db.query("events").collect(),
      ctx.db.query("downloads").collect(),
    ]);

    // Group by planId
    const plans = new Map<string, { planName: string; views: number; formOpens: number; downloads: number }>();

    for (const e of allEvents) {
      if (!plans.has(e.planId)) {
        plans.set(e.planId, { planName: e.planName, views: 0, formOpens: 0, downloads: 0 });
      }
      const p = plans.get(e.planId)!;
      if (e.event === "plan_view") p.views++;
      else if (e.event === "form_open") p.formOpens++;
    }

    for (const d of allDownloads) {
      if (!plans.has(d.planId)) {
        plans.set(d.planId, { planName: d.planName, views: 0, formOpens: 0, downloads: 0 });
      }
      plans.get(d.planId)!.downloads++;
    }

    return Array.from(plans.entries())
      .map(([planId, stats]) => ({ planId, ...stats }))
      .sort((a, b) => b.downloads - a.downloads);
  },
});
