"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

const TABS = [
  { href: "/dashboard", match: (p: string) => p === "/dashboard" },
  { href: "/upload", match: (p: string) => p === "/upload" },
  {
    href: "/workspace/history",
    match: (p: string) => p.startsWith("/workspace/history"),
  },
  {
    href: "/workspace/settings",
    match: (p: string) => p.startsWith("/workspace/settings"),
  },
] as const;

export function isWorkspaceTabRoute(pathname: string) {
  return TABS.some((tab) => tab.match(pathname));
}

export default function WorkspaceNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const labels: Record<(typeof TABS)[number]["href"], string> = {
    "/dashboard": t("workspace.myDocuments"),
    "/upload": t("workspace.upload"),
    "/workspace/history": t("workspace.history"),
    "/workspace/settings": t("workspace.settings"),
  };

  return (
    <nav className="workspace-nav shrink-0 border-b border-border/70 bg-bg-primary/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 sm:gap-8 sm:px-6">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative shrink-0 py-3 text-sm font-bold transition sm:py-4 ${
                active
                  ? "workspace-nav-tab-active text-accent-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {labels[tab.href]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
