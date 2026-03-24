import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { AlertTriangle } from "lucide-react";
import AdminCustomersClient, { CustomerSummary } from "./AdminCustomersClient";

type OrderStatus = "pending" | "paid" | "failed";

const CustomersPage = async () => {
  const [{ getToken }, user] = await Promise.all([auth(), currentUser()]);
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") redirect("/sign-in");

  const token = await getToken({ template: "convex" });

  let ordersError = false;
  const orders = await fetchQuery(
    api.orders.getAllOrdersAdmin,
    {},
    { token: token ?? undefined }
  ).catch(() => {
    ordersError = true;
    return [];
  });

  // Separate identified customers (have an email) from anonymous checkouts
  const namedOrders = orders.filter((o) => !!o.customerEmail);
  const guestOrders = orders.filter((o) => !o.customerEmail);

  // Group named orders by email.
  const customerMap = new Map<string, CustomerSummary>();
  for (const order of namedOrders) {
    const key = order.customerEmail!;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.status === "paid" ? order.price : 0;
      existing.statuses.push(order.status as OrderStatus);
    } else {
      customerMap.set(key, {
        email: key,
        orderCount: 1,
        totalSpent: order.status === "paid" ? order.price : 0,
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
    .reduce((sum, o) => sum + o.price, 0);

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
          {customers.length} identified{" "}
          {customers.length === 1 ? "customer" : "customers"}
          {guestOrders.length > 0 && (
            <>
              {" "}
              · {guestOrders.length} anonymous{" "}
              {guestOrders.length === 1 ? "checkout" : "checkouts"}
            </>
          )}
        </p>
      </div>

      <AdminCustomersClient
        customers={customers}
        guestOrders={guestOrders}
        guestRevenue={guestRevenue}
      />
    </div>
  );
};

export default CustomersPage;
