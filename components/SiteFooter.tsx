"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { KortexLogo } from "@/components/KortexLogo";
import { useTranslation } from "@/lib/i18n/context";
import { handleAnchorClick } from "@/lib/scroll";

export default function SiteFooter() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useTranslation();

  const productLinks = session
    ? [
        { href: "/dashboard", label: t("nav.workspace") },
        { href: "/docs", label: t("nav.docs") },
        { href: "/pricing", label: t("nav.pricing") },
      ]
    : [
        { href: "/register", label: t("nav.signUp") },
        { href: "/pricing", label: t("nav.pricing") },
      ];

  const anchorLinks = [
    { anchor: "#features", label: t("nav.features") },
    { anchor: "#pricing", label: t("nav.pricing") },
    { anchor: "#faq", label: t("landing.faqTitle") },
  ];

  return (
    <footer className="site-footer mt-auto shrink-0 border-t border-accent-primary/10 bg-bg-secondary/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <KortexLogo size="sm" />
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {t("footer.tagline")}
            </p>
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
                    className="text-sm text-text-secondary transition hover:text-accent-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {anchorLinks.map((link) => (
                <li key={link.anchor}>
                  <a
                    href={pathname === "/" ? link.anchor : `/${link.anchor}`}
                    onClick={(e) => handleAnchorClick(e, pathname, link.anchor)}
                    className="text-sm text-text-secondary transition hover:text-accent-primary"
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
                <li>
                  <Link
                    href="/profile"
                    className="text-sm text-text-secondary transition hover:text-accent-primary"
                  >
                    {t("nav.profile")}
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-sm text-text-secondary transition hover:text-accent-primary"
                    >
                      {t("nav.logIn")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-sm text-text-secondary transition hover:text-accent-primary"
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
              {t("footer.company")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-text-muted">{t("footer.builtWith")}</span>
              </li>
              <li>
                <span className="text-sm text-text-muted">RAG · Claude · ChromaDB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
          </p>
          <p className="text-xs text-text-muted">{t("footer.version")}</p>
        </div>
      </div>
    </footer>
  );
}
