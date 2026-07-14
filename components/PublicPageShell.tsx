import type { ReactNode } from "react";
import { GridBackground } from "@/components/GridBackground";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PublicPageShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GridBackground>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <main className="flex-1 py-12">{children}</main>
        <div className="hidden md:block">
          <SiteFooter />
        </div>
      </div>
    </GridBackground>
  );
}
