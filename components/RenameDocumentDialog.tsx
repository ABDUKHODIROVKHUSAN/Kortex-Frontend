"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

interface RenameDocumentDialogProps {
  open: boolean;
  currentName: string;
  saving?: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function RenameDocumentDialog({
  open,
  currentName,
  saving = false,
  onConfirm,
  onCancel,
}: RenameDocumentDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

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
        className="glass-card relative z-10 w-full max-w-md p-6 shadow-glow-lg"
      >
        <h2 className="text-lg font-semibold text-text-primary">
          {t("dashboard.renameTitle")}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{t("dashboard.renameDesc")}</p>
        <div className="mt-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) onConfirm(name.trim());
            }}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={saving}>
            {t("confirm.no")}
          </Button>
          <Button
            className="flex-1"
            onClick={() => name.trim() && onConfirm(name.trim())}
            disabled={saving || !name.trim()}
          >
            {saving ? t("dashboard.saving") : t("dashboard.renameSave")}
          </Button>
        </div>
      </div>
    </div>
  );
}
