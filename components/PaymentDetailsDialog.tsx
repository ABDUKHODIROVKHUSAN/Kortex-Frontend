"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Button, Input, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

interface PaymentDetailsDialogProps {
  open: boolean;
  tierName: string;
  priceLabel: string;
  periodLabel: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

type FieldKey = "cardName" | "cardNumber" | "expiry" | "cvc";

interface FormState {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const EMPTY: FormState = {
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isExpiryValid(expiry: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;
  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

/** Hardcoded demo rule: Visa-style 16-digit cards starting with 4 are accepted. */
function isCardNumberAccepted(cardNumber: string): boolean {
  const digits = digitsOnly(cardNumber);
  return digits.length === 16 && digits.startsWith("4");
}

export default function PaymentDetailsDialog({
  open,
  tierName,
  priceLabel,
  periodLabel,
  loading = false,
  onConfirm,
  onCancel,
}: PaymentDetailsDialogProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | "form", string>>>({});
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading && status !== "checking") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel, loading, status]);

  if (!open || !mounted) return null;

  const setField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
    if (status === "error" || status === "success") setStatus("idle");
  };

  const validate = (): boolean => {
    const next: Partial<Record<FieldKey | "form", string>> = {};

    if (!form.cardName.trim()) {
      next.cardName = t("pricing.payFieldRequired", { field: t("pricing.payCardName") });
    } else if (form.cardName.trim().length < 2) {
      next.cardName = t("pricing.payCardNameInvalid");
    }

    const numberDigits = digitsOnly(form.cardNumber);
    if (!form.cardNumber.trim()) {
      next.cardNumber = t("pricing.payFieldRequired", { field: t("pricing.payCardNumber") });
    } else if (numberDigits.length !== 16) {
      next.cardNumber = t("pricing.payCardNumberInvalid");
    } else if (!isCardNumberAccepted(form.cardNumber)) {
      next.cardNumber = t("pricing.payCardDeclined");
    }

    if (!form.expiry.trim()) {
      next.expiry = t("pricing.payFieldRequired", { field: t("pricing.payExpiry") });
    } else if (!isExpiryValid(form.expiry)) {
      next.expiry = t("pricing.payExpiryInvalid");
    }

    if (!form.cvc.trim()) {
      next.cvc = t("pricing.payFieldRequired", { field: t("pricing.payCvc") });
    } else if (!/^\d{3,4}$/.test(form.cvc)) {
      next.cvc = t("pricing.payCvcInvalid");
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || status === "checking") return;

    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("checking");
    await new Promise((resolve) => setTimeout(resolve, 900));
    try {
      await onConfirm();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrors({ form: t("pricing.upgradeFailed") });
    }
  };

  const busy = loading || status === "checking";

  return createPortal(
    <div className="payment-modal-root" role="presentation">
      <button
        type="button"
        className="payment-modal-backdrop"
        onClick={busy ? undefined : onCancel}
        aria-label="Close"
        disabled={busy}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="payment-modal-panel"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-primary">
              {t("pricing.paySecureCheckout")}
            </p>
            <h2
              id="payment-modal-title"
              className="mt-1 text-lg font-semibold text-text-primary"
            >
              {t("pricing.upgradeTo", { plan: tierName })}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {priceLabel}
              <span className="text-text-muted"> {periodLabel}</span>
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          {t("pricing.payHint")}
        </p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="pay-name">
              {t("pricing.payCardName")}
            </label>
            <Input
              id="pay-name"
              autoComplete="cc-name"
              placeholder={t("pricing.payCardNamePlaceholder")}
              value={form.cardName}
              onChange={(e) => setField("cardName", e.target.value)}
              disabled={busy}
              aria-invalid={!!errors.cardName}
            />
            {errors.cardName && (
              <p className="mt-1 text-xs text-error">{errors.cardName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="pay-number">
              {t("pricing.payCardNumber")}
            </label>
            <Input
              id="pay-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={form.cardNumber}
              onChange={(e) => setField("cardNumber", formatCardNumber(e.target.value))}
              disabled={busy}
              aria-invalid={!!errors.cardNumber}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-xs text-error">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="pay-expiry">
                {t("pricing.payExpiry")}
              </label>
              <Input
                id="pay-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
                disabled={busy}
                aria-invalid={!!errors.expiry}
              />
              {errors.expiry && (
                <p className="mt-1 text-xs text-error">{errors.expiry}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="pay-cvc">
                {t("pricing.payCvc")}
              </label>
              <Input
                id="pay-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={form.cvc}
                onChange={(e) => setField("cvc", digitsOnly(e.target.value).slice(0, 4))}
                disabled={busy}
                aria-invalid={!!errors.cvc}
              />
              {errors.cvc && (
                <p className="mt-1 text-xs text-error">{errors.cvc}</p>
              )}
            </div>
          </div>

          {errors.form && (
            <p className="rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
              {errors.form}
            </p>
          )}

          {status === "error" && Object.keys(errors).length > 0 && !errors.form && (
            <p className="rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
              {t("pricing.payFixDetails")}
            </p>
          )}

          {status === "checking" && (
            <p className="rounded-lg bg-accent-primary/10 px-3 py-2 text-xs text-accent-primary">
              {t("pricing.payProcessing")}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onCancel}
              disabled={busy}
            >
              {t("confirm.no")}
            </Button>
            <Button type="submit" className="flex-1" disabled={busy}>
              {busy ? <Spinner /> : t("pricing.paySubmit")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
