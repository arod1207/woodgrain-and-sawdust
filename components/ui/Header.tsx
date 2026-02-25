"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/customer/CartDrawer";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-cream-dark bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-walnut transition-colors hover:text-amber"
          aria-label="Woodgrain & Sawdust Home"
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="hidden sm:inline">Woodgrain & Sawdust</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6" aria-label="Main navigation">
          <Button variant="ghost" asChild className="text-charcoal-light hover:text-amber hover:bg-transparent">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild className="text-charcoal-light hover:text-amber hover:bg-transparent">
            <Link href="/products">Products</Link>
          </Button>

          {/* Cart Drawer */}
          <CartDrawer />
        </nav>
      </div>
    </header>
  );
};

export default Header;
