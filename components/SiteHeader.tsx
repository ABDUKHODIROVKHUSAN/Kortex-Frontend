"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { KortexLogo } from "@/components/KortexLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { WorkspaceNavIcon } from "@/components/NavIcons";
import AdminUnlockDialog from "@/components/AdminUnlockDialog";
import { useTranslation } from "@/lib/i18n/context";
import { handleAnchorClick, smoothScrollTo } from "@/lib/scroll";

function isWorkspaceRoute(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname === "/upload" ||
    pathname.startsWith("/workspace/") ||
    pathname.startsWith("/chat/")
  );
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [hash, setHash] = useState("");
  const [workspacePrompt, setWorkspacePrompt] = useState<"hidden" | "visible" | "fading">(
    "hidden"
  );
  const [adminUnlockOpen, setAdminUnlockOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const clearPromptTimers = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    fadeTimer.current = null;
    hideTimer.current = null;
  };

  const showWorkspacePrompt = () => {
    clearPromptTimers();
    setWorkspacePrompt("visible");
    fadeTimer.current = setTimeout(() => {
      setWorkspacePrompt("fading");
      hideTimer.current = setTimeout(() => {
        setWorkspacePrompt("hidden");
      }, 400);
    }, 3000);
  };

  const handleWorkspaceClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (session) return;
    e.preventDefault();
    showWorkspacePrompt();
  };

  const handlePromptClick = () => {
    clearPromptTimers();
    setWorkspacePrompt("hidden");
    router.push("/register");
  };

  const onHome = pathname === "/";
  const featuresActive = onHome && hash === "#features";
  const workspaceActive = isWorkspaceRoute(pathname);
  const pricingActive = onHome && hash === "#pricing";
  const docsActive = onHome && hash === "#docs";

  const navLinkClass = (active: boolean) =>
    `site-header-nav-link flex items-center gap-2 text-sm font-bold transition ${
      active
        ? "text-accent-primary"
        : "text-text-primary hover:text-accent-primary"
    }`;

  const closeMobileNav = () => setMobileNavOpen(false);

  const goMobileHash = (anchor: string) => {
    closeMobileNav();
    const hash = anchor.startsWith("#") ? anchor : `#${anchor}`;
    // Wait for the menu to collapse so scroll position is correct.
    window.setTimeout(() => {
      if (pathname === "/") {
        smoothScrollTo(hash);
        setHash(hash);
      } else {
        router.push(`/${hash}`);
      }
    }, 50);
  };

  const goMobilePage = (href: string) => {
    closeMobileNav();
    router.push(href);
  };

  const mobileNavLinkClass =
    "block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition hover:bg-accent-primary/10 hover:text-accent-primary";

  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-8 lg:gap-10">
          <Link href="/" className="shrink-0" onClick={closeMobileNav}>
            <KortexLogo />
          </Link>

          <nav className="hidden items-center gap-7 md:flex lg:gap-8">
            <Link
              href="/#features"
              onClick={(e) => {
                handleAnchorClick(e, pathname, "#features");
                setHash("#features");
              }}
              className={navLinkClass(featuresActive)}
            >
              {t("nav.features")}
            </Link>
            <div className="relative">
              <Link
                href={session ? "/dashboard" : "/register"}
                onClick={handleWorkspaceClick}
                className={`site-header-workspace inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-bold transition ${
                  workspaceActive
                    ? "border-accent-primary bg-accent-primary text-white shadow-glow-btn"
                    : "border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:border-accent-primary/50 hover:bg-accent-primary/15"
                }`}
              >
                <WorkspaceNavIcon />
                {t("nav.workspace")}
              </Link>
              {workspacePrompt !== "hidden" && (
                <button
                  type="button"
                  onClick={handlePromptClick}
                  className={`workspace-signin-bubble ${
                    workspacePrompt === "fading" ? "is-fading" : ""
                  }`}
                >
                  <span className="workspace-signin-bubble-pointer" aria-hidden />
                  <p className="text-sm font-semibold text-text-primary">
                    {t("nav.workspaceNotSignedIn")}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {t("nav.workspaceSignUpPrompt")}
                  </p>
                </button>
              )}
            </div>
            <Link
              href="/#pricing"
              onClick={(e) => {
                handleAnchorClick(e, pathname, "#pricing");
                setHash("#pricing");
              }}
              className={navLinkClass(pricingActive)}
            >
              {t("nav.pricing")}
            </Link>
            <Link
              href="/#analytics"
              onClick={(e) => {
                handleAnchorClick(e, pathname, "#analytics");
                setHash("#analytics");
              }}
              className={navLinkClass(onHome && hash === "#analytics")}
            >
              {t("nav.analytics")}
            </Link>
            <Link
              href="/#docs"
              onClick={(e) => {
                handleAnchorClick(e, pathname, "#docs");
                setHash("#docs");
              }}
              className={navLinkClass(docsActive)}
            >
              {t("nav.docs")}
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-primary transition hover:border-accent-primary/30 hover:text-accent-primary md:hidden"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span className="sr-only">{mobileNavOpen ? "Close menu" : "Open menu"}</span>
            {mobileNavOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <LanguageSwitcher utility />
          {session ? (
            <>
              {session.user?.isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setAdminUnlockOpen(true)}
                    className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition sm:inline-flex ${
                      pathname === "/admin"
                        ? "border-accent-primary bg-accent-primary text-white shadow-glow-btn"
                        : "border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:border-accent-primary/50 hover:bg-accent-primary/15"
                    }`}
                  >
                    {t("nav.adminDashboard")}
                  </button>
                  <AdminUnlockDialog
                    open={adminUnlockOpen}
                    onClose={() => setAdminUnlockOpen(false)}
                    onUnlocked={() => {
                      setAdminUnlockOpen(false);
                      router.push("/admin");
                    }}
                  />
                </>
              )}
              <UserAvatarMenu />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="site-header-login hidden text-sm font-bold text-text-primary transition hover:text-accent-primary sm:inline"
              >
                {t("nav.logIn")}
              </Link>
              <Link href="/register" className="site-header-signup !px-3 !py-1.5 text-sm sm:!px-4">
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="border-t border-border bg-bg-card px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <button type="button" className={mobileNavLinkClass} onClick={() => goMobileHash("#features")}>
              {t("nav.features")}
            </button>
            <button
              type="button"
              className={mobileNavLinkClass}
              onClick={() => goMobilePage(session ? "/dashboard" : "/register")}
            >
              {t("nav.workspace")}
            </button>
            <button type="button" className={mobileNavLinkClass} onClick={() => goMobileHash("#pricing")}>
              {t("nav.pricing")}
            </button>
            <button type="button" className={mobileNavLinkClass} onClick={() => goMobilePage("/analytics")}>
              {t("nav.analytics")}
            </button>
            <button type="button" className={mobileNavLinkClass} onClick={() => goMobilePage("/docs")}>
              {t("nav.docs")}
            </button>
            {!session && (
              <button type="button" className={mobileNavLinkClass} onClick={() => goMobilePage("/login")}>
                {t("nav.logIn")}
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
