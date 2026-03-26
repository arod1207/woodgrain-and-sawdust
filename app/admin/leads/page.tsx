import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLeadsClient from "./AdminLeadsClient";

const LeadsPage = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") redirect("/sign-in");

  return <AdminLeadsClient />;
};

export default LeadsPage;
