import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminShell from "@/components/ui/AdminShell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Every /admin page goes through here: signed-out people are sent to sign in,
 * signed-in non-admins get a full-page 403 (no sidebar, nothing of the admin),
 * and admins get the admin frame. (Each page and Convex still check too.)
 */
const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = user.publicMetadata?.role as string | undefined;
  if (role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-walnut">403 — Forbidden</h1>
        <p className="text-charcoal-light">You do not have permission to view this page.</p>
        <Link href="/" className="mt-6 text-sm font-medium text-amber transition-colors hover:text-walnut">
          Back to Woodgrain &amp; Sawdust
        </Link>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
};

export default AdminLayout;
