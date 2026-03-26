import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { client } from "@/src/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Users,
  Package,
  Plus,
  ClipboardList,
  Settings,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = async () => {
  const [{ getToken }, user] = await Promise.all([auth(), currentUser()]);
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") redirect("/sign-in");

  const token = await getToken({ template: "convex" });

  let downloadsError = false;
  let productCountError = false;

  const [dashboard, productCount] = await Promise.all([
    fetchQuery(api.downloads.getDashboardData, {}, { token: token ?? undefined }).catch(() => {
      downloadsError = true;
      return { totalDownloads: 0, uniqueEmails: 0, recentDownloads: [] as { _id: string; name: string; email: string; planName: string; createdAt: number }[] };
    }),
    client
      .fetch<number>(`count(*[_type == "cutPlan" && defined(slug.current)])`)
      .catch(() => {
        productCountError = true;
        return 0;
      }),
  ]);

  const { totalDownloads, uniqueEmails, recentDownloads } = dashboard;

  return (
    <div>
      {/* Error banners */}
      {(downloadsError || productCountError) && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Some data failed to load.{" "}
            {downloadsError && "Downloads could not be fetched — verify Convex auth is configured. "}
            {productCountError && "Plan count unavailable — check Sanity connection."}
          </span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-charcoal-light">
          Track downloads, subscribers, and manage your cut plans.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">Total Downloads</p>
                <p className="mt-1 text-2xl font-bold text-walnut">
                  {totalDownloads}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage">
                <Download className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              All-time plan downloads
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">Unique Subscribers</p>
                <p className="mt-1 text-2xl font-bold text-walnut">{uniqueEmails}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/20 text-amber">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              Distinct email addresses
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">Cut Plans</p>
                <p className="mt-1 text-2xl font-bold text-walnut">{productCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-light/20 text-amber">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">Active listings in Sanity</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-walnut">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto justify-start gap-3 border-cream-dark p-4 hover:border-amber hover:bg-amber/5"
            asChild
          >
            <Link href="/studio">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal">Add Plan</p>
                <p className="text-sm text-charcoal-light">Create a new cut plan</p>
              </div>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-start gap-3 border-cream-dark p-4 hover:border-amber hover:bg-amber/5"
            asChild
          >
            <Link href="/admin/leads">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10 text-sage">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal">View Leads</p>
                <p className="text-sm text-charcoal-light">See collected emails</p>
              </div>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-start gap-3 border-cream-dark p-4 hover:border-amber hover:bg-amber/5"
            asChild
          >
            <Link href="/studio">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-walnut/10 text-walnut">
                <Settings className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal">Sanity Studio</p>
                <p className="text-sm text-charcoal-light">Manage content</p>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Downloads */}
      <Card className="border-cream-dark">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-walnut">Recent Downloads</CardTitle>
          {recentDownloads.length > 0 && (
            <Button variant="ghost" asChild className="text-sm text-charcoal-light hover:text-amber">
              <Link href="/admin/leads">View all</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentDownloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-medium text-charcoal">No downloads yet</h3>
              <CardDescription className="max-w-sm">
                Downloads will appear here once visitors download plans.
              </CardDescription>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {recentDownloads.map((download) => (
                <div key={download._id} className="flex items-center justify-between py-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-charcoal">
                      {download.name}
                    </p>
                    <p className="text-xs text-charcoal-light">
                      {download.email} ·{" "}
                      {new Date(download.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-charcoal-light">
                    {download.planName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
