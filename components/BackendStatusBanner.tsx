"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/backend-health";
import { useTranslation } from "@/lib/i18n/context";

export default function BackendStatusBanner() {
  const { t } = useTranslation();
  const [online, setOnline] = useState(true);
  const [llmReady, setLlmReady] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const status = await checkBackendHealth();
      if (cancelled) return;
      setOnline(status.online);
      setLlmReady(status.online ? Boolean(status.llmEnabled) : true);
    };

    poll();
    const id = window.setInterval(poll, 10000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (online && llmReady) return null;

  return (
    <div
      className={`border-b px-4 py-2 text-center text-sm ${
        online
          ? "border-warning/30 bg-warning/10 text-warning"
          : "border-error/30 bg-error/10 text-error"
      }`}
      role="status"
    >
      {!online ? t("system.backendOffline") : t("system.llmNotConfigured")}
    </div>
  );
}
