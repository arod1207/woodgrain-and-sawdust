import Link from "next/link";
import Header from "@/components/ui/Header";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="texture-paper flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
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
};

export default CustomerLayout;
