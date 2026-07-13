"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { KortexLogo } from "@/components/KortexLogo";
import { useTranslation } from "@/lib/i18n/context";
import { handleAnchorClick } from "@/lib/scroll";

const WORKFLOW_ICONS = ["📄", "⚡", "💬", "📎"];

export default function SiteFooter() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useTranslation();

  const productLinks = session
    ? [
        { href: "/dashboard", label: t("nav.workspace") },
        { href: "/upload", label: t("nav.upload") },
      ]
    : [{ href: "/register", label: t("nav.signUp") }];

  const anchorLinks = [
    { anchor: "#features", label: t("nav.features") },
    { anchor: "#pricing", label: t("nav.pricing") },
    { anchor: "#analytics", label: t("nav.analytics") },
    { anchor: "#docs", label: t("nav.docs") },
    { anchor: "#faq", label: t("landing.faqTitle") },
  ];

  const workflow = [
    { icon: WORKFLOW_ICONS[0], label: t("footer.workflowUpload") },
    { icon: WORKFLOW_ICONS[1], label: t("footer.workflowIndex") },
    { icon: WORKFLOW_ICONS[2], label: t("footer.workflowAsk") },
    { icon: WORKFLOW_ICONS[3], label: t("footer.workflowCite") },
  ];

  const stackItems = ["RAG", "Claude", "ChromaDB", "PDF · DOCX"];

  return (
    <footer className="site-footer mt-auto shrink-0 border-t border-border">
      <div className="site-footer-glow mx-auto max-w-6xl px-6 py-14">
        <div className="site-footer-workflow mb-12 rounded-2xl border border-border bg-bg-secondary p-6 md:p-8">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            {t("footer.workflowTitle")}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {workflow.map((step, index) => (
              <div key={step.label} className="site-footer-workflow-step relative text-center">
                {index < workflow.length - 1 && (
                  <span
                    className="site-footer-workflow-connector hidden md:block"
                    aria-hidden
                  />
                )}
                <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-lg">
                  {step.icon}
                </span>
                <p className="text-sm font-medium text-text-primary">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <KortexLogo size="sm" />
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {t("footer.tagline")}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-text-muted">{t("footer.taglineSub")}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-primary">
              {t("footer.product")}
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition hover:text-accent-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {anchorLinks.map((link) => (
                <li key={link.anchor}>
                  <a
                    href={`/${link.anchor}`}
                    onClick={(e) => handleAnchorClick(e, pathname, link.anchor)}
                    className="text-sm text-text-secondary transition hover:text-accent-primary hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-primary">
              {t("footer.account")}
            </h3>
            <ul className="space-y-2.5">
              {session ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="text-sm text-text-secondary transition hover:text-accent-primary hover:underline"
                    >
                      {t("nav.profile")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-sm text-text-secondary transition hover:text-accent-primary hover:underline"
                    >
                      {t("nav.workspace")}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-sm text-text-secondary transition hover:text-accent-primary hover:underline"
                    >
                      {t("nav.logIn")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-sm text-text-secondary transition hover:text-accent-primary hover:underline"
                    >
                      {t("nav.signUp")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-primary">
              {t("footer.stackTitle")}
            </h3>
            <p className="mb-3 text-sm text-text-secondary">{t("footer.builtWith")}</p>
            <div className="flex flex-wrap gap-2">
              {stackItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-accent-primary/20 bg-accent-primary/10 px-2.5 py-1 text-xs font-medium text-accent-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
          </p>
          <p className="text-xs text-text-muted">{t("footer.version")}</p>
        </div>
      </div>
    </footer>
  );
}
