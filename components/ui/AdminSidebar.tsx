"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Package, ClipboardList, Users } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-5 w-5" />,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-cream-dark bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-cream-dark px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-walnut transition-colors hover:text-amber"
          aria-label="Go to storefront"
        >
          <svg
            className="h-6 w-6"
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
          <span>Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            asChild
            className={`w-full justify-start gap-3 ${
              isActive(item.href)
                ? "bg-amber/10 text-amber hover:bg-amber/15 hover:text-amber"
                : "text-charcoal-light hover:bg-cream-dark hover:text-charcoal"
            }`}
          >
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.icon}
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>

      {/* User Section */}
      <Separator className="bg-cream-dark" />
      <div className="p-4">
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="flex-1 text-sm">
            <p className="font-medium text-charcoal">Admin Panel</p>
            <Link
              href="/"
              className="text-charcoal-light transition-colors hover:text-amber"
            >
              View Store
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
