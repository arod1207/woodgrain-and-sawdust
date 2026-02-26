"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import AdminSidebar from "@/components/ui/AdminSidebar";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_CONVEX_URL");
}
const convex = new ConvexReactClient(convexUrl);

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <div className="flex h-screen overflow-hidden bg-cream">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ConvexProviderWithClerk>
  );
};

export default AdminLayout;
