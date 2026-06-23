"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat/")) return null;
  return <SiteFooter />;
}
