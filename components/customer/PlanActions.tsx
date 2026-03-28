"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import DownloadForm from "@/components/customer/DownloadForm";
import { Download, Coffee } from "lucide-react";
import type { ReactNode } from "react";

interface PlanActionsProps {
  planId: string;
  planName: string;
  planSlug: string;
  comingSoon?: boolean;
  children: ReactNode;
}

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/woodgrainandsawdust";

export default function PlanActions({
  planId,
  planName,
  planSlug,
  comingSoon,
  children,
}: PlanActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const recordEvent = useMutation(api.events.recordEvent);

  return (
    <>
      {/* Plan label */}
      <div className="mb-6">
        {comingSoon ? (
          <span className="inline-block rounded-full bg-walnut/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-walnut">
            Coming Soon
          </span>
        ) : (
          <p className="text-3xl font-bold text-amber">Free</p>
        )}
      </div>

      {children}

      {/* Action buttons */}
      <div className="space-y-3">
        {comingSoon ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-walnut/20 bg-walnut/5 px-8 py-4 text-base font-semibold text-walnut/50">
            Download Coming Soon
          </div>
        ) : (
          <>
            <Button
              size="lg"
              className="w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
              onClick={() => {
                setDialogOpen(true);
                recordEvent({ event: "form_open", planId, planName }).catch(() => {});
              }}
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
          </>
        )}
      </div>

      {!comingSoon && (
        <DownloadForm
          planId={planId}
          planName={planName}
          planSlug={planSlug}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
