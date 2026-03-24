import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { client as sanityClient } from "@/src/sanity/lib/client";
import { CUT_PLAN_PDF_QUERY } from "@/src/sanity/lib/queries";
import type { Id } from "@/convex/_generated/dataModel";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_CONVEX_URL");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

interface SanityPlanPdf {
  _id: string;
  name: string;
  price: number;
  pdfUrl: string | null;
  pdfOriginalFilename: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("planId");
  const orderId = searchParams.get("orderId");

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  // Fetch plan from Sanity (includes the PDF URL — server-only query).
  const plan = await sanityClient.fetch<SanityPlanPdf | null>(
    CUT_PLAN_PDF_QUERY,
    { id: planId }
  );

  if (!plan || !plan.pdfUrl) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  // For paid plans, verify the order is paid before serving the PDF.
  if (plan.price > 0) {
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required for paid plans" },
        { status: 400 }
      );
    }

    try {
      const order = await convex.query(api.orders.getOrderById, {
        orderId: orderId as Id<"orders">,
      });

      if (!order || order.status !== "paid" || order.planId !== planId) {
        return NextResponse.json(
          { error: "Payment required to download this plan" },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Unable to verify order" },
        { status: 403 }
      );
    }
  }

  // Stream the PDF from Sanity's CDN.
  const pdfResponse = await fetch(plan.pdfUrl);

  if (!pdfResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch PDF" },
      { status: 502 }
    );
  }

  const pdfBuffer = await pdfResponse.arrayBuffer();
  const rawFilename = plan.pdfOriginalFilename || `${plan.name}.pdf`;
  const safeFilename = rawFilename.replace(/["\r\n\\]/g, "_");

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
