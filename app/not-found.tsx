import Link from "next/link";
import Header from "@/components/ui/Header";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="texture-paper flex min-h-screen flex-col bg-cream text-charcoal">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-walnut/10 mb-6">
          <Hammer className="h-9 w-9 text-walnut" />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber">
          404 — Page Not Found
        </p>
        <h1 className="mb-4 font-heading text-4xl font-bold text-walnut sm:text-5xl">
          Nothing to cut here.
        </h1>
        <p className="mb-8 max-w-md text-charcoal-light">
          Looks like this page got lost in the sawdust. Head back and find a
          plan worth building.
        </p>
        <Button
          className="rounded-full bg-amber px-8 py-6 text-base text-cream hover:bg-amber-light"
          asChild
        >
          <Link href="/plans">Browse Plans</Link>
        </Button>
      </main>
      <footer className="bg-walnut-dark py-8 text-cream" aria-label="Site footer">
        <div className="mb-8 border-t-2 border-dashed border-walnut/40" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-cream/80">
              &copy; {new Date().getFullYear()} Woodgrain & Sawdust. All rights
              reserved.
            </p>
            <nav className="flex items-center gap-4" aria-label="Footer navigation">
              <Link
                href="/privacy"
                className="text-sm text-cream/60 underline-offset-2 hover:text-cream hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-cream/60 underline-offset-2 hover:text-cream hover:underline"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
