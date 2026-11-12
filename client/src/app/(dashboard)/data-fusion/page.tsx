"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect /data-fusion → /dashboard/data-fusion
 */
export default function DataFusionRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/data-fusion");
  }, [router]);
  return null;
}
