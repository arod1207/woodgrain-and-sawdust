"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: Id<"orders">,
  status: "pending" | "paid" | "failed"
) {
  const { getToken, userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const token = await getToken({ template: "convex" });
  await fetchMutation(
    api.orders.updateOrderStatus,
    { orderId, status },
    { token: token ?? undefined }
  );
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
