"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { KortexLogo } from "@/components/KortexLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { WorkspaceNavIcon } from "@/components/NavIcons";
import { useTranslation } from "@/lib/i18n/context";
import { handleAnchorClick } from "@/lib/scroll";

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
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
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

  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-8 lg:gap-10">
          <Link href="/" className="shrink-0">
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher utility />
          {session ? (
            <UserAvatarMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="site-header-login hidden text-sm font-bold text-text-primary transition hover:text-accent-primary sm:inline"
              >
                {t("nav.logIn")}
              </Link>
              <Link href="/register" className="site-header-signup">
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
