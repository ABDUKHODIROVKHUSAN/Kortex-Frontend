"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

interface SignUpToUpgradeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SignUpToUpgradeDialog({ open, onClose }: SignUpToUpgradeDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="payment-modal-root" role="presentation">
      <button
        type="button"
        className="payment-modal-backdrop"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-upgrade-title"
        className="payment-modal-panel"
      >
        <h2 id="signup-upgrade-title" className="text-lg font-semibold text-text-primary">
          {t("pricing.signUpToUpgradeTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {t("pricing.signUpToUpgradeDesc")}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {t("confirm.no")}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onClose();
              router.push("/register?returnTo=/#pricing");
            }}
          >
            {t("pricing.goToSignUp")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
