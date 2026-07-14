"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

const ADMIN_UNLOCK_KEY = "kortex-admin-unlocked";
const ADMIN_GATE_PASSWORD = "sentry2020";

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAdminUnlocked(value: boolean) {
  try {
    if (value) sessionStorage.setItem(ADMIN_UNLOCK_KEY, "1");
    else sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
  } catch {
    /* ignore */
  }
}

interface AdminUnlockDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called after unlock animation; default navigates to /admin */
  onUnlocked?: () => void;
}

export default function AdminUnlockDialog({
  open,
  onClose,
  onUnlocked,
}: AdminUnlockDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "checking" | "unlocking" | "done">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
    setPhase("idle");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "idle") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, phase]);

  if (!open || !mounted) return null;

  const busy = phase === "checking" || phase === "unlocking" || phase === "done";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");

    if (!password.trim()) {
      setError(t("admin.unlockRequired"));
      return;
    }

    setPhase("checking");
    await new Promise((r) => setTimeout(r, 450));

    if (password !== ADMIN_GATE_PASSWORD) {
      setPhase("idle");
      setError(t("admin.unlockWrong"));
      return;
    }

    setPhase("unlocking");
    setAdminUnlocked(true);
    await new Promise((r) => setTimeout(r, 1100));
    setPhase("done");
    await new Promise((r) => setTimeout(r, 280));

    if (onUnlocked) onUnlocked();
    else router.push("/admin");
  };

  return createPortal(
    <div className="admin-unlock-root" role="presentation">
      <button
        type="button"
        className="admin-unlock-backdrop"
        onClick={busy ? undefined : onClose}
        aria-label="Close"
        disabled={busy}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-unlock-title"
        className={`admin-unlock-panel ${phase === "unlocking" || phase === "done" ? "is-unlocking" : ""} ${
          phase === "done" ? "is-done" : ""
        }`}
      >
        <div className="admin-unlock-grid" aria-hidden />
        <div className="admin-unlock-glow" aria-hidden />

        <div className={`admin-lock ${phase === "unlocking" || phase === "done" ? "is-open" : ""}`}>
          <div className="admin-lock-shackle" aria-hidden />
          <div className="admin-lock-body" aria-hidden>
            <span className="admin-lock-keyhole" />
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">
          {t("admin.badge")}
        </p>
        <h2
          id="admin-unlock-title"
          className="mt-2 text-center text-xl font-bold text-text-primary"
        >
          {phase === "unlocking" || phase === "done"
            ? t("admin.unlockSuccess")
            : t("admin.unlockTitle")}
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          {phase === "unlocking" || phase === "done"
            ? t("admin.unlockOpening")
            : t("admin.unlockSubtitle")}
        </p>

        {phase !== "unlocking" && phase !== "done" && (
          <form className="mt-6 space-y-3" onSubmit={handleSubmit} noValidate>
            <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="admin-gate-pw">
              {t("admin.unlockPassword")}
            </label>
            <Input
              id="admin-gate-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              disabled={busy}
              autoFocus
            />
            {error && (
              <p className="rounded-lg bg-error/10 px-3 py-2 text-xs text-error">{error}</p>
            )}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onClose}
                disabled={busy}
              >
                {t("confirm.no")}
              </Button>
              <Button type="submit" className="flex-1" disabled={busy}>
                {phase === "checking" ? <Spinner /> : t("admin.unlockSubmit")}
              </Button>
            </div>
          </form>
        )}

        {(phase === "unlocking" || phase === "done") && (
          <div className="mt-6 flex justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
