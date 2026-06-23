import type { ReactNode } from "react";
import { PageBackground } from "@/components/PageBackground";

interface GridBackgroundProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function GridBackground({
  children,
  className = "",
  contentClassName = "",
}: GridBackgroundProps) {
  return (
    <div className={`relative flex min-h-0 flex-1 flex-col ${className}`}>
      <PageBackground />
      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

export { PageBackground };
