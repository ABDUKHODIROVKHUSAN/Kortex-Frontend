"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useTranslation } from "@/lib/i18n/context";

interface SignOutButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  label?: string;
}

export default function SignOutButton({
  variant = "ghost",
  className = "",
  label,
}: SignOutButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        {label ?? t("nav.signOut")}
      </Button>
      <ConfirmDialog
        open={open}
        title={t("confirm.signOutTitle")}
        message={t("confirm.signOutMessage")}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
