"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

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
          <Link
            href="/"
            className="text-sm font-medium text-charcoal-light transition-colors hover:text-amber"
            tabIndex={0}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-charcoal-light transition-colors hover:text-amber"
            tabIndex={0}
          >
            Products
          </Link>

          {/* Auth Section */}
          <div className="ml-4 flex items-center gap-4 border-l border-cream-dark pl-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-light focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
                  tabIndex={0}
                  aria-label="Sign in to your account"
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/admin"
                className="text-sm font-medium text-charcoal-light transition-colors hover:text-amber"
                tabIndex={0}
              >
                Admin
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
