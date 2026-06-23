"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button, Input } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(t("auth.invalidCredentials"));
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthLayout
      heading={t("auth.welcomeBack")}
      subtext={t("auth.signInTo")}
      footer={
        <p className="text-center text-sm text-text-secondary">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-semibold text-accent-primary hover:underline">
            {t("auth.register")}
          </Link>
        </p>
      }
    >
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            {t("auth.password")}
          </label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("auth.passwordPlaceholder")}
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-accent-primary hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? t("auth.signingIn") : t("nav.signIn")}
        </Button>
      </form>
    </AuthLayout>
  );
}
