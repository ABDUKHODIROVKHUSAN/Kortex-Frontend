"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { registerUser } from "@/lib/api";
import { Button, Input, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ email, password, full_name: fullName });

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(t("auth.signInFailed"));
        return;
      }

      router.push(returnTo && returnTo.startsWith("/") ? returnTo : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading={t("auth.createAccount")}
      subtext={t("auth.getStartedWith")}
      footer={
        <p className="text-center text-sm text-text-secondary">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-accent-primary hover:underline">
            {t("auth.signInLink")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            {t("auth.fullName")}
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder={t("auth.namePlaceholder")}
          />
        </div>

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
            minLength={8}
            placeholder={t("auth.passwordHint")}
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? t("auth.creatingAccount") : t("auth.createAccountBtn")}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
