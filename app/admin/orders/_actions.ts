"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: Id<"orders">,
  status: "pending" | "paid" | "failed"
) {
  const [{ getToken, userId }, user] = await Promise.all([auth(), currentUser()]);
  if (!userId) throw new Error("Unauthorized");
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") throw new Error("Forbidden");
  const token = await getToken({ template: "convex" });
  await fetchMutation(
    api.orders.updateOrderStatus,
    { orderId, status },
    { token: token ?? undefined }
  );
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
