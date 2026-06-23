"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import WorkspaceNav, { isWorkspaceTabRoute } from "@/components/WorkspaceNav";

export default function WorkspaceLayoutChrome({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const showWorkspaceNav = isWorkspaceTabRoute(pathname);

  return (
    <div className="flex flex-1 flex-col">
      {showWorkspaceNav && <WorkspaceNav />}
      {children}
    </div>
  );
}
