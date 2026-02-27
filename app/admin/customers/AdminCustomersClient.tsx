"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronDown, ChevronUp, MapPin } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type OrderStatus = "pending" | "paid" | "failed";

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerSummary {
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: number;
  statuses: OrderStatus[];
  addresses: ShippingAddress[];
}

interface GuestOrder {
  status: string;
  total: number;
}

interface Props {
  customers: CustomerSummary[];
  guestOrders: GuestOrder[];
  guestRevenue: number;
}

export default function AdminCustomersClient({
  customers,
  guestOrders,
  guestRevenue,
}: Props) {
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

  const toggle = (email: string) =>
    setExpandedEmail((prev) => (prev === email ? null : email));

  if (customers.length === 0 && guestOrders.length === 0) {
    return (
      <Card className="border-cream-dark">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mb-1 font-medium text-charcoal">No customers yet</h3>
            <CardDescription>
              Customer data will appear here once orders come in.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-cream-dark">
      <CardContent className="p-0">
        <div className="divide-y divide-cream-dark">
          {customers.map((customer) => {
            const paidCount = customer.statuses.filter((s) => s === "paid").length;
            const pendingCount = customer.statuses.filter((s) => s === "pending").length;
            const isExpanded = expandedEmail === customer.email;

            return (
              <div key={customer.email}>
                {/* Main row */}
                <button
                  onClick={() => toggle(customer.email)}
                  className="flex w-full flex-wrap items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-cream/50 sm:p-5"
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
                    <div className="text-charcoal-light">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Address panel */}
                {isExpanded && (
                  <div className="border-t border-cream-dark bg-cream/30 px-4 py-3 sm:px-5">
                    {customer.addresses.length === 0 ? (
                      <p className="flex items-center gap-2 text-sm text-charcoal-light">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        No address on file
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {customer.addresses.map((addr, i) => (
                          <div
                            key={`${addr.line1}-${addr.postalCode}`}
                            className="flex flex-col gap-0.5"
                          >
                            {customer.addresses.length > 1 && (
                              <p className="text-[10px] font-medium uppercase tracking-wide text-charcoal-light">
                                {i === 0 ? "Most recent" : "Previous"}
                              </p>
                            )}
                            <div className="flex items-start gap-2 text-sm text-charcoal">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-charcoal-light" />
                              <div>
                                <p className="font-medium">{addr.name}</p>
                                <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                                <p>
                                  {addr.city}, {addr.state} {addr.postalCode},{" "}
                                  {addr.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                  {guestOrders.length}{" "}
                  {guestOrders.length === 1 ? "order" : "orders"} — may be
                  multiple different customers
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
      </CardContent>
    </Card>
  );
}
