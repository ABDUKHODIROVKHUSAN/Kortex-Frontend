"use client";

import { useEffect } from "react";

/** Legacy route — scrolls to the landing analytics section. */
export default function AnalyticsRedirectPage() {
  useEffect(() => {
    window.location.replace("/#analytics");
  }, []);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-secondary">
      Redirecting…
    </div>
  );
}
