import { query, mutation } from "./_generated/server";
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

    return await ctx.db.insert("downloads", {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      planId: args.planId,
      planName: args.planName,
      createdAt: Date.now(),
    });
  },
});

// Admin — single query for dashboard: stats + recent downloads in one table scan.
export const getDashboardData = query({
  args: { recentLimit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    assertAdmin(await ctx.auth.getUserIdentity());
    const all = await ctx.db.query("downloads").order("desc").collect();
    const uniqueEmails = new Set(all.map((d) => d.email)).size;
    const limit = args.recentLimit ?? 8;
    return {
      totalDownloads: all.length,
      uniqueEmails,
      recentDownloads: all.slice(0, limit),
    };
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
