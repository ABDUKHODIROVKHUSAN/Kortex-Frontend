"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button, Input } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthLayout
      heading={t("auth.forgotPasswordTitle")}
      subtext={t("auth.forgotPasswordDesc")}
      footer={
        <p className="text-center text-sm text-text-secondary">
          <Link href="/login" className="font-semibold text-accent-primary hover:underline">
            {t("auth.backToSignIn")}
          </Link>
        </p>
      }
    >
      {submitted ? (
        <p className="rounded-xl border border-border bg-bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-text-secondary">
          {t("auth.forgotPasswordNotice")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              {t("auth.email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("auth.emailPlaceholder")}
            />
          </div>

          <Button type="submit" className="btn-primary w-full py-3">
            {t("auth.sendResetLink")}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
