import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type OrderStatus = "pending" | "paid" | "failed";

interface CustomerSummary {
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: number;
  statuses: OrderStatus[];
}

const CustomersPage = async () => {
  const { sessionClaims, getToken } = await auth();
  const role = (
    (sessionClaims?.publicMetadata ?? sessionClaims?.metadata) as
      | { role?: string }
      | undefined
  )?.role;
  if (role !== "admin") redirect("/sign-in");

  const token = await getToken({ template: "convex" });

  let ordersError = false;
  const orders = await fetchQuery(
    api.orders.getAllOrders,
    {},
    { token: token ?? undefined }
  ).catch(() => {
    ordersError = true;
    return [];
  });

  // Separate identified customers (have an email) from anonymous checkouts
  const namedOrders = orders.filter((o) => !!o.customerEmail);
  const guestOrders = orders.filter((o) => !o.customerEmail);

  // Group named orders by email
  const customerMap = new Map<string, CustomerSummary>();
  for (const order of namedOrders) {
    const key = order.customerEmail!;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.status === "paid" ? order.total : 0;
      if (order.createdAt > existing.lastOrderAt) {
        existing.lastOrderAt = order.createdAt;
      }
      existing.statuses.push(order.status as OrderStatus);
    } else {
      customerMap.set(key, {
        email: key,
        orderCount: 1,
        totalSpent: order.status === "paid" ? order.total : 0,
        lastOrderAt: order.createdAt,
        statuses: [order.status as OrderStatus],
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.lastOrderAt - a.lastOrderAt
  );

  const guestRevenue = guestOrders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      {/* Error banner */}
      {ordersError && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load orders. Verify Convex auth is configured (CLERK_JWT_ISSUER_DOMAIN).
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Customers</h1>
        <p className="mt-2 text-charcoal-light">
          {customers.length} identified {customers.length === 1 ? "customer" : "customers"}
          {guestOrders.length > 0 && (
            <> · {guestOrders.length} anonymous {guestOrders.length === 1 ? "checkout" : "checkouts"}</>
          )}
        </p>
      </div>

      <Card className="border-cream-dark">
        <CardContent className="p-0">
          {customers.length === 0 && guestOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-medium text-charcoal">No customers yet</h3>
              <CardDescription>
                Customer data will appear here once orders come in.
              </CardDescription>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {customers.map((customer) => {
                const paidCount = customer.statuses.filter((s) => s === "paid").length;
                const pendingCount = customer.statuses.filter((s) => s === "pending").length;

                return (
                  <div
                    key={customer.email}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-charcoal">{customer.email}</p>
                        {paidCount > 0 && (
                          <Badge
                            variant="outline"
                            className="border-sage/30 bg-sage/10 text-sage text-[10px]"
                          >
                            {paidCount} paid
                          </Badge>
                        )}
                        {pendingCount > 0 && (
                          <Badge
                            variant="outline"
                            className="border-amber/30 bg-amber/10 text-amber text-[10px]"
                          >
                            {pendingCount} pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-light">
                        Last order{" "}
                        {new Date(customer.lastOrderAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-xs text-charcoal-light">Orders</p>
                        <p className="font-semibold text-walnut">{customer.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-light">Spent</p>
                        <p className="font-semibold text-walnut">
                          {currencyFormatter.format(customer.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Anonymous checkouts row */}
              {guestOrders.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 bg-cream/40 p-4 sm:p-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-charcoal-light">Anonymous checkouts</p>
                      <Badge
                        variant="outline"
                        className="border-charcoal-light/30 bg-cream-dark text-charcoal-light text-[10px]"
                      >
                        no email provided
                      </Badge>
                    </div>
                    <p className="text-xs text-charcoal-light">
                      {guestOrders.length} {guestOrders.length === 1 ? "order" : "orders"} — may be multiple different customers
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-xs text-charcoal-light">Orders</p>
                      <p className="font-semibold text-walnut">{guestOrders.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-light">Revenue</p>
                      <p className="font-semibold text-walnut">
                        {currencyFormatter.format(guestRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
