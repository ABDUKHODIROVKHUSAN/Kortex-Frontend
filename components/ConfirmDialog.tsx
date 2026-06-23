"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="glass-card relative z-10 w-full max-w-md p-6 shadow-glow-lg"
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-text-primary">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {message}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            {t("confirm.no")}
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            {t("confirm.yes")}
          </Button>
        </div>
      </div>
    </div>
  );
}
