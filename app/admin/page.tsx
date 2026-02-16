import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Plus, 
  ClipboardList, 
  Settings,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-walnut sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-charcoal-light">
          Welcome to your admin dashboard. Track orders, revenue, and manage
          your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">
                  Total Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-walnut">$0.00</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              Connect Stripe in Phase 4
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">
                  Total Orders
                </p>
                <p className="mt-1 text-2xl font-bold text-walnut">0</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/20 text-amber">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              Connect Convex in Phase 3
            </p>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">
                  Customers
                </p>
                <p className="mt-1 text-2xl font-bold text-walnut">0</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-walnut/10 text-walnut">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              Track in Phase 7
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="border-cream-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-light">
                  Products
                </p>
                <p className="mt-1 text-2xl font-bold text-walnut">0</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-light/20 text-amber-light">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-light">
              Add via Sanity in Phase 2
            </p>
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
                <p className="text-sm text-charcoal-light">
                  Create a new listing
                </p>
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
                <p className="text-sm text-charcoal-light">
                  Manage order status
                </p>
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
                <p className="text-sm text-charcoal-light">
                  Manage content
                </p>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="border-cream-dark">
        <CardHeader>
          <CardTitle className="text-walnut">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="mb-2 font-medium text-charcoal">No activity yet</h3>
            <CardDescription className="max-w-sm">
              Recent orders and updates will appear here once you start receiving
              orders. Complete Phase 4 to enable checkout.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
