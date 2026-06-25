"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-upgrade-title"
        className="glass-card relative z-10 w-full max-w-md p-6 shadow-glow-lg"
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
              router.push("/register?returnTo=/pricing");
            }}
          >
            {t("pricing.goToSignUp")}
          </Button>
        </div>
      </div>
    </div>
  );
}
