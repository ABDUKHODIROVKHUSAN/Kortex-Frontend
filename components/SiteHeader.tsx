"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { KortexLogo } from "@/components/KortexLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { AskNavIcon, WorkspaceNavIcon } from "@/components/NavIcons";
import { useTranslation } from "@/lib/i18n/context";
import { useUserAvatar } from "@/lib/useUserAvatar";
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
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const avatar = useUserAvatar();
  const initial = session?.user?.name?.[0]?.toUpperCase() || "U";

  const askActive = pathname === "/";
  const workspaceActive = isWorkspaceRoute(pathname);
  const pricingActive = pathname === "/pricing";
  const docsActive = pathname === "/docs";

  const workspaceHref = session ? "/dashboard" : "/login?callbackUrl=/dashboard";

  const navLinkClass = (active: boolean) =>
    `site-header-nav-link flex items-center gap-2 text-sm font-bold transition ${
      active
        ? "text-accent-primary"
        : "text-text-primary hover:text-accent-primary"
    }`;

  return (
    <header className="site-header flex items-center justify-between gap-6 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-8 lg:gap-10">
        <Link href="/" className="shrink-0">
          <KortexLogo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex lg:gap-8">
          <Link
            href="/#faq"
            onClick={(e) => handleAnchorClick(e, pathname, "#faq")}
            className={navLinkClass(askActive)}
          >
            <AskNavIcon />
            {t("nav.ask")}
          </Link>
          <Link href={workspaceHref} className={navLinkClass(workspaceActive)}>
            <WorkspaceNavIcon />
            {t("nav.workspace")}
          </Link>
          <Link href="/pricing" className={navLinkClass(pricingActive)}>
            {t("nav.pricing")}
          </Link>
          <Link href="/docs" className={navLinkClass(docsActive)}>
            {t("nav.docs")}
          </Link>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeSwitcher compact utility />
        <LanguageSwitcher utility />
        {session ? (
          <Link
            href="/profile"
            className="site-header-avatar ml-1 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent-primary/30 bg-accent-primary/10 text-xs font-semibold text-accent-primary transition hover:border-accent-primary/50 hover:shadow-glow"
            title={t("nav.profile")}
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </Link>
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
    </header>
  );
}
