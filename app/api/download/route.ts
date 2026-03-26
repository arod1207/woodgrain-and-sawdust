import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/src/sanity/lib/client";
import { CUT_PLAN_PDF_QUERY } from "@/src/sanity/lib/queries";

interface SanityPlanPdf {
  _id: string;
  name: string;
  pdfUrl: string | null;
  pdfOriginalFilename: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("planId");

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  const plan = await sanityClient.fetch<SanityPlanPdf | null>(
    CUT_PLAN_PDF_QUERY,
    { id: planId }
  );

  if (!plan || !plan.pdfUrl) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
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
