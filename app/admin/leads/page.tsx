import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLeadsClient from "./AdminLeadsClient";

const LeadsPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = user.publicMetadata?.role as string | undefined;
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="mb-2 text-2xl font-bold text-walnut">403 — Forbidden</h1>
        <p className="text-charcoal-light">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <AdminLeadsClient />;
};

export default LeadsPage;
