"use client";

import { useEffect } from "react";

/** Legacy route — redirects to the landing docs section. */
export default function DocsRedirectPage() {
  useEffect(() => {
    window.location.replace("/#docs");
  }, []);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-secondary">
      Redirecting to docs…
    </div>
  );
}
