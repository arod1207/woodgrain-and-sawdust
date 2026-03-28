"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface PlanViewTrackerProps {
  planId: string;
  planName: string;
}

export default function PlanViewTracker({ planId, planName }: PlanViewTrackerProps) {
  const recordEvent = useMutation(api.events.recordEvent);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    recordEvent({ event: "plan_view", planId, planName }).catch(() => {
      // silently ignore — analytics failures shouldn't surface to users
    });
  }, [planId, planName, recordEvent]);

  return null;
}
