"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DownloadForm from "@/components/customer/DownloadForm";
import { Download, Coffee } from "lucide-react";
import type { ReactNode } from "react";

interface PlanActionsProps {
  planId: string;
  planName: string;
  planSlug: string;
  children: ReactNode;
}

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/woodgrainandsawdust";

export default function PlanActions({
  planId,
  planName,
  planSlug,
  children,
}: PlanActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {/* Plan label */}
      <div className="mb-6">
        <p className="text-3xl font-bold text-amber">Free</p>
      </div>

      {children}

      {/* Action buttons */}
      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
          onClick={() => setDialogOpen(true)}
        >
          <Download className="mr-2 h-5 w-5" />
          Download Plan
        </Button>

        <a
          href={BUY_ME_A_COFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border-2 border-amber/30 px-6 py-3 text-sm font-medium text-amber transition-colors hover:border-amber hover:bg-amber/5"
        >
          <Coffee className="h-4 w-4" />
          Enjoy this plan? Buy me a coffee!
        </a>
      </div>

      <DownloadForm
        planId={planId}
        planName={planName}
        planSlug={planSlug}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
