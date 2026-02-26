import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminOrdersClient from "./AdminOrdersClient";

type StatusFilter = "all" | "pending" | "paid" | "failed";
const VALID_FILTERS: StatusFilter[] = ["all", "pending", "paid", "failed"];

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  // Protect the route — non-admins are redirected to sign-in.
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") redirect("/sign-in");

  const { status: statusParam } = await searchParams;
  const activeFilter: StatusFilter =
    VALID_FILTERS.includes(statusParam as StatusFilter)
      ? (statusParam as StatusFilter)
      : "all";

  return <AdminOrdersClient activeFilter={activeFilter} />;
};

export default OrdersPage;
