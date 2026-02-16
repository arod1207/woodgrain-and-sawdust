import Header from "@/components/ui/Header";
import { Separator } from "@/components/ui/separator";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-walnut-dark py-8 text-cream">
        <Separator className="mb-8 bg-walnut" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-cream/80">
              &copy; {new Date().getFullYear()} Woodgrain & Sawdust. All rights
              reserved.
            </p>
            <p className="text-sm text-cream/60">
              Handcrafted with care in the USA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
