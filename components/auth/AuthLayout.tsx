"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { GridBackground } from "@/components/GridBackground";
import { KortexLogo } from "@/components/KortexLogo";
import { useTranslation } from "@/lib/i18n/context";

interface AuthLayoutProps {
  heading: string;
  subtext: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({
  heading,
  subtext,
  footer,
  children,
}: AuthLayoutProps) {
  const { t } = useTranslation();

  const bullets = [
    t("pricing.freeF1"),
    t("pricing.freeF2"),
    t("pricing.freeF3"),
  ];

  return (
    <GridBackground contentClassName="auth-page-wrapper min-h-screen items-center justify-center px-4 py-8">
      <div className="auth-card flex w-full max-w-[960px] flex-col overflow-hidden lg:flex-row lg:items-stretch">
        <aside className="auth-brand-panel auth-card-brand-panel relative hidden min-h-0 flex-col lg:flex lg:min-h-[520px]">
          <div className="auth-brand-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="auth-brand-glow pointer-events-none absolute -left-24 top-1/4 h-[320px] w-[320px] rounded-full bg-accent-primary/[0.08] blur-[100px]" />
          <div className="auth-brand-glow pointer-events-none absolute -right-16 bottom-0 h-[240px] w-[240px] rounded-full bg-accent-secondary/[0.06] blur-[90px]" />

          <div className="relative z-10 shrink-0">
            <KortexLogo size="md" />
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center py-4">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-primary xl:text-3xl">
              {t("auth.brandHeadline")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary xl:text-base">
              {t("hero.subtitle")}
            </p>
            <ul className="mt-6 space-y-2.5">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 shrink-0 text-xs text-text-muted">
            {t("auth.copyright", { year: new Date().getFullYear() })}
          </p>
        </aside>

        <div className="auth-form-panel auth-card-form-panel flex min-h-0 flex-1 flex-col lg:min-h-[520px]">
          <div className="mb-6 flex shrink-0 items-center justify-between gap-3 lg:mb-0 lg:min-h-[44px]">
            <Link
              href="/"
              className="auth-back-link inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition hover:text-accent-primary"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>{t("auth.backToHome")}</span>
            </Link>
            <div className="lg:hidden">
              <KortexLogo size="md" />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-primary">{heading}</h1>
              <p className="mt-2 text-sm text-text-secondary">{subtext}</p>
            </div>

            {children}

            <div className="mt-6">{footer}</div>
          </div>

          <div className="hidden shrink-0 lg:block lg:min-h-[16px]" aria-hidden />
        </div>
      </div>
    </GridBackground>
  );
}
