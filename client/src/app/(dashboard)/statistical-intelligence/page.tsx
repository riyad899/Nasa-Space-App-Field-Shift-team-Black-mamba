"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect /statistical-intelligence → /dashboard/statistical-intelligence
 */
export default function StatisticalIntelligenceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/statistical-intelligence");
  }, [router]);
  return null;
}
