"use client";

import { usePaginatedQuery, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Loader2, AlertTriangle, Download } from "lucide-react";

const PAGE_SIZE = 25;

export default function AdminLeadsClient() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();

  const subscribers = useQuery(
    api.downloads.getSubscribersForExport,
    authLoading || !isAuthenticated ? "skip" : {}
  );

  function exportCSV() {
    if (!subscribers) return;
    const rows = [["Email", "Name"], ...subscribers.map((s) => [s.email, s.name])];
    const sanitize = (v: string) => {
      const escaped = v.replace(/"/g, '""');
      const safe = /^[=+\-@]/.test(escaped) ? `'${escaped}` : escaped;
      return `"${safe}"`;
    };
    const csv = rows.map((r) => r.map(sanitize).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const {
    results: downloads,
    status: pageStatus,
    loadMore,
  } = usePaginatedQuery(
    api.downloads.getAllDownloads,
    authLoading || !isAuthenticated ? "skip" : {},
    { initialNumItems: PAGE_SIZE }
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-charcoal-light">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading leads…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Not authenticated. Verify Convex auth is configured
        (CLERK_JWT_ISSUER_DOMAIN).
      </div>
    );
  }

  if (pageStatus === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center py-24 text-charcoal-light">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading leads…
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Leads</h1>
          <p className="mt-2 text-charcoal-light">
            Contact information collected from plan downloads.
          </p>
        </div>
        <Button
          onClick={exportCSV}
          disabled={!subscribers || subscribers.length === 0}
          className="flex items-center gap-2 rounded-full bg-amber px-4 py-2 text-sm font-medium text-white hover:bg-amber/90"
        >
          <Download className="h-4 w-4" />
          Export Subscribers ({subscribers?.length ?? "…"})
        </Button>
      </div>

      {/* Leads List */}
      <Card className="border-cream-dark">
        <CardContent className="p-0">
          {downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-medium text-charcoal">No leads yet</h3>
              <CardDescription>
                Leads will appear here when visitors download plans.
              </CardDescription>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {downloads.map((download) => (
                <div key={download._id} className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-charcoal">
                        {download.name}
                      </p>
                      <p className="text-sm text-charcoal-light">
                        {download.email}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                      <p className="text-sm font-medium text-charcoal">
                        {download.planName}
                      </p>
                      <p className="text-xs text-charcoal-light">
                        {new Date(download.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Load More */}
      {pageStatus === "CanLoadMore" && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore(PAGE_SIZE)}
            className="border-cream-dark text-charcoal-light hover:border-amber hover:text-amber"
          >
            Load more leads
          </Button>
        </div>
      )}
      {pageStatus === "LoadingMore" && (
        <div className="mt-6 flex justify-center text-charcoal-light">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading more…
        </div>
      )}
    </div>
  );
}
