import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendShippingConfirmation } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    toEmail?: string;
    toName?: string;
    crossName?: string;
    trackingNumber?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { toEmail, toName, crossName, trackingNumber } = body;

  if (!toEmail || !toName || !crossName) {
    return NextResponse.json({ error: "toEmail, toName, and crossName are required" }, { status: 400 });
  }

  try {
    await sendShippingConfirmation({ toEmail, toName, crossName, trackingNumber });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send shipping confirmation email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
