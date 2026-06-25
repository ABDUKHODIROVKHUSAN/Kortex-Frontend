"use client";

import { useEffect } from "react";
import { Button, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

interface UpgradeConfirmDialogProps {
  open: boolean;
  tierName: string;
  features: string[];
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UpgradeConfirmDialog({
  open,
  tierName,
  features,
  loading = false,
  onConfirm,
  onCancel,
}: UpgradeConfirmDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
        aria-label="Close"
        disabled={loading}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-confirm-title"
        className="glass-card relative z-10 w-full max-w-md p-6 shadow-glow-lg"
      >
        <h2 id="upgrade-confirm-title" className="text-lg font-semibold text-text-primary">
          {t("pricing.upgradeTo", { plan: tierName })}
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="shrink-0 font-semibold text-accent-primary" aria-hidden>
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-text-secondary">{t("pricing.upgradeImmediate")}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
            {t("confirm.no")}
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner /> : t("pricing.confirmUpgrade")}
          </Button>
        </div>
      </div>
    </div>
  );
}
