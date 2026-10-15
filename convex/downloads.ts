import { query, mutation, internalAction, internalQuery } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import type { UserIdentity } from "convex/server";
import { syncResendContact } from "./resendContacts";

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
      await ctx.scheduler.runAfter(0, internal.downloads.syncToResend, {
        name: args.name.trim(),
        email,
      });
    }
  },
});

// Internal — adds a new opt-in subscriber to the Resend email list
// (one list shared with the Designer).
export const syncToResend = internalAction({
  args: { name: v.string(), email: v.string() },
  handler: async (_ctx, { name, email }) => {
    await syncResendContact({ email, name, subscribed: true });
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
    await ctx.scheduler.runAfter(0, internal.downloads.removeFromResend, { email })
    return { unsubscribed: records.length }
  },
})

// Internal — unsubscribes an email in the Resend email list.
export const removeFromResend = internalAction({
  args: { email: v.string() },
  handler: async (_ctx, { email }) => {
    await syncResendContact({ email, subscribed: false });
  },
});

// Unique current subscribers. Deduplicate by email, newest-first. Track every
// email so a later subscribe:true row can't override an earlier subscribe:false row.
async function currentSubscribers(ctx: QueryCtx) {
  const all = await ctx.db
    .query("downloads")
    .order("desc")
    .collect();
  const seen = new Map<string, { name: string; email: string } | null>();
  for (const d of all) {
    if (!seen.has(d.email)) {
      seen.set(d.email, d.subscribe ? { name: d.name, email: d.email } : null);
    }
  }
  return Array.from(seen.values()).filter(Boolean) as { name: string; email: string }[];
}

// Admin — unique subscribers (subscribe=true) for CSV export.
export const getSubscribersForExport = query({
  args: {},
  handler: async (ctx) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    return await currentSubscribers(ctx);
  },
});

export const listSubscribers = internalQuery({
  args: {},
  handler: async (ctx) => await currentSubscribers(ctx),
});

// One-time: copies every current subscriber into the Resend list. Safe to re-run.
// npx convex run --prod downloads:backfillResend
export const backfillResend = internalAction({
  args: {},
  handler: async (ctx): Promise<{ subscribers: number; synced: number }> => {
    const subscribers: { name: string; email: string }[] = await ctx.runQuery(internal.downloads.listSubscribers, {});
    let synced = 0;
    for (const s of subscribers) {
      if (await syncResendContact({ email: s.email, name: s.name, subscribed: true })) synced++;
      await new Promise((r) => setTimeout(r, 700)); // stay under Resend's rate limit
    }
    return { subscribers: subscribers.length, synced };
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
