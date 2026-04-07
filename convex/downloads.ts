import { query, mutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import type { UserIdentity } from "convex/server";

function assertAdmin(identity: UserIdentity | null): asserts identity is UserIdentity {
  if (!identity) throw new Error("Unauthorized");
  const role = (identity.publicMetadata as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
}

// Called by the DownloadForm component to record a lead before serving the PDF.
export const recordDownload = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    planId: v.string(),
    planName: v.string(),
    subscribe: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim() || args.name.length > 256) {
      throw new Error("Invalid name");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email) || args.email.length > 256) {
      throw new Error("Invalid email");
    }
    if (!args.planId || args.planId.length > 128) {
      throw new Error("Invalid planId");
    }
    if (!args.planName || args.planName.length > 256) {
      throw new Error("Invalid planName");
    }

    const email = args.email.trim().toLowerCase()

    await ctx.db.insert("downloads", {
      name: args.name.trim(),
      email,
      planId: args.planId,
      planName: args.planName,
      subscribe: args.subscribe,
      emailConsent: args.subscribe,
      createdAt: Date.now(),
    });

    if (args.subscribe) {
      await ctx.scheduler.runAfter(0, internal.downloads.syncToButtondown, {
        name: args.name.trim(),
        email,
      });
    }
  },
});

// Internal — syncs a new opt-in subscriber to Buttondown.
export const syncToButtondown = internalAction({
  args: { name: v.string(), email: v.string() },
  handler: async (_ctx, { name, email }) => {
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error("BUTTONDOWN_API_KEY is not set — skipping Buttondown sync");
      return;
    }

    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        type: "regular",
        metadata: { name },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      // 400 with "already subscribed" is not a real error — ignore it.
      if (res.status === 400 && (body.includes("already subscribed") || body.includes("already exists"))) return;
      console.error(`Buttondown sync failed (${res.status}): ${body}`);
    }
  },
});

// Admin — single query for dashboard: stats + recent downloads in one table scan.
export const getDashboardData = query({
  args: { recentLimit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    const all = await ctx.db.query("downloads").order("desc").collect();
    const uniqueEmails = new Set(all.map((d) => d.email)).size;
    const subscriberCount = new Set(
      all.filter((d) => d.subscribe === true).map((d) => d.email)
    ).size;
    const limit = args.recentLimit ?? 8;
    return {
      totalDownloads: all.length,
      uniqueEmails,
      subscriberCount,
      recentDownloads: all.slice(0, limit),
    };
  },
});

// Public — unsubscribe by email (called from the unsubscribe page after token verification).
export const unsubscribeByEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase()
    const records = await ctx.db
      .query("downloads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect()
    await Promise.all(
      records.map((r) => ctx.db.patch(r._id, { subscribe: false }))
    )
    await ctx.scheduler.runAfter(0, internal.downloads.removeFromButtondown, { email })
    return { unsubscribed: records.length }
  },
})

// Internal — removes a subscriber from Buttondown.
export const removeFromButtondown = internalAction({
  args: { email: v.string() },
  handler: async (_ctx, { email }) => {
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error("BUTTONDOWN_API_KEY is not set — skipping Buttondown removal");
      return;
    }

    const res = await fetch(`https://api.buttondown.email/v1/subscribers/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: { Authorization: `Token ${apiKey}` },
    });

    // 404 means they weren't in Buttondown — not an error.
    if (!res.ok && res.status !== 404) {
      console.error(`Buttondown removal failed (${res.status}) for ${email}`);
    }
  },
});

// Admin — unique subscribers (subscribe=true) for CSV export.
export const getSubscribersForExport = query({
  args: {},
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    const all = await ctx.db
      .query("downloads")
      .order("desc")
      .collect();
    // Deduplicate by email, newest-first. Track every email so a later
    // subscribe:true row can't override an earlier subscribe:false row.
    const seen = new Map<string, { name: string; email: string } | null>();
    for (const d of all) {
      if (!seen.has(d.email)) {
        seen.set(d.email, d.subscribe ? { name: d.name, email: d.email } : null);
      }
    }
    return Array.from(seen.values()).filter(Boolean) as { name: string; email: string }[];
  },
});

// Admin — paginated downloads for the leads page.
export const getAllDownloads = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    return await ctx.db
      .query("downloads")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
