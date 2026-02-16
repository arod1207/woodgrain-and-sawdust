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
        <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-light">
                Total Revenue
              </p>
              <p className="mt-1 text-2xl font-bold text-walnut">$0.00</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-charcoal-light">
            Connect Stripe in Phase 4
          </p>
        </div>

        {/* Orders Card */}
        <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-light">
                Total Orders
              </p>
              <p className="mt-1 text-2xl font-bold text-walnut">0</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/20 text-amber">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-charcoal-light">
            Connect Convex in Phase 3
          </p>
        </div>

        {/* Customers Card */}
        <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-light">
                Customers
              </p>
              <p className="mt-1 text-2xl font-bold text-walnut">0</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-walnut/10 text-walnut">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-charcoal-light">
            Track in Phase 7
          </p>
        </div>

        {/* Products Card */}
        <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-light">
                Products
              </p>
              <p className="mt-1 text-2xl font-bold text-walnut">0</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-light/20 text-amber-light">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-charcoal-light">
            Add via Sanity in Phase 2
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-walnut">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            className="flex items-center gap-3 rounded-lg border border-cream-dark bg-white p-4 text-left transition-colors hover:border-amber hover:bg-amber/5"
            tabIndex={0}
            aria-label="Add a new product"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal">Add Product</p>
              <p className="text-sm text-charcoal-light">
                Create a new listing
              </p>
            </div>
          </button>

          <button
            className="flex items-center gap-3 rounded-lg border border-cream-dark bg-white p-4 text-left transition-colors hover:border-amber hover:bg-amber/5"
            tabIndex={0}
            aria-label="View all orders"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10 text-sage">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal">View Orders</p>
              <p className="text-sm text-charcoal-light">
                Manage order status
              </p>
            </div>
          </button>

          <button
            className="flex items-center gap-3 rounded-lg border border-cream-dark bg-white p-4 text-left transition-colors hover:border-amber hover:bg-amber/5"
            tabIndex={0}
            aria-label="Open Sanity Studio"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-walnut/10 text-walnut">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal">Sanity Studio</p>
              <p className="text-sm text-charcoal-light">
                Manage content
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-walnut">
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 font-medium text-charcoal">No activity yet</h3>
          <p className="max-w-sm text-sm text-charcoal-light">
            Recent orders and updates will appear here once you start receiving
            orders. Complete Phase 4 to enable checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
