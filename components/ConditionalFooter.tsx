"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat/")) return null;
  // Footer is desktop-only; mobile keeps the UI shorter.
  return (
    <div className="hidden md:block">
      <SiteFooter />
    </div>
  );
}
