"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect /farm-intelligence → /dashboard/farm-intelligence
 */
export default function FarmIntelligenceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/farm-intelligence");
  }, [router]);
  return null;
}
