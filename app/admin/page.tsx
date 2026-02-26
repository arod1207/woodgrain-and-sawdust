import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { client } from "@/src/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Plus,
  ClipboardList,
  Settings,
  AlertTriangle,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const STATUS_STYLES: Record<"paid" | "pending" | "failed", string> = {
  paid: "bg-sage/20 text-sage border-sage/30",
  pending: "bg-amber/20 text-amber border-amber/30",
  failed: "bg-red-100 text-red-600 border-red-200",
};

const AdminDashboard = async () => {
  const { sessionClaims, getToken } = await auth();
  const role = (
    (sessionClaims?.publicMetadata ?? sessionClaims?.metadata) as
      | { role?: string }
      | undefined
  )?.role;
  if (role !== "admin") redirect("/sign-in");

  const token = await getToken({ template: "convex" });

  let ordersError = false;
  let productCountError = false;

  const [orders, productCount] = await Promise.all([
    fetchQuery(api.orders.getAllOrders, {}, { token: token ?? undefined }).catch(() => {
      ordersError = true;
      return [];
    }),
    client
      .fetch<number>(`count(*[_type == "product" && defined(slug.current)])`)
      .catch(() => {
        productCountError = true;
        return 0;
      }),
  ]);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 8);

  return (
    <div>
      {/* Error banners */}
      {(ordersError || productCountError) && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Some data failed to load.{" "}
            {ordersError && "Orders could not be fetched — verify Convex auth is configured. "}
            {productCountError && "Product count unavailable — check Sanity connection."}
          </span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-charcoal-light">
          Track orders, revenue, and manage your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">Total Revenue</p>
                <p className="mt-1 text-2xl font-bold text-walnut">
                  {currencyFormatter.format(totalRevenue)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              From {paidOrders.length} paid {paidOrders.length === 1 ? "order" : "orders"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">Total Orders</p>
                <p className="mt-1 text-2xl font-bold text-walnut">{orders.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/20 text-amber">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              {orders.filter((o) => o.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">Products</p>
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
                <p className="font-medium text-charcoal">Add Product</p>
                <p className="text-sm text-charcoal-light">Create a new listing</p>
              </div>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-start gap-3 border-cream-dark p-4 hover:border-amber hover:bg-amber/5"
            asChild
          >
            <Link href="/admin/orders">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10 text-sage">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal">View Orders</p>
                <p className="text-sm text-charcoal-light">Manage order status</p>
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

      {/* Recent Orders */}
      <Card className="border-cream-dark">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-walnut">Recent Orders</CardTitle>
          {orders.length > 0 && (
            <Button variant="ghost" asChild className="text-sm text-charcoal-light hover:text-amber">
              <Link href="/admin/orders">View all</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-medium text-charcoal">No orders yet</h3>
              <CardDescription className="max-w-sm">
                Orders will appear here once customers complete checkout.
              </CardDescription>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-charcoal">
                      {order.customerEmail ?? "Guest"}
                    </p>
                    <p className="text-xs text-charcoal-light">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={`capitalize ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-semibold text-walnut">
                      {currencyFormatter.format(order.total)}
                    </p>
                  </div>
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
