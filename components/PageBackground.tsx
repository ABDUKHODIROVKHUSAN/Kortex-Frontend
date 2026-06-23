"use client";

import { useTheme } from "@/lib/theme/context";

const SPARKLES = [
  { left: "8%", top: "12%", delay: "0s", duration: "4s" },
  { left: "22%", top: "28%", delay: "0.8s", duration: "5s" },
  { left: "45%", top: "8%", delay: "1.2s", duration: "3.5s" },
  { left: "68%", top: "18%", delay: "0.3s", duration: "4.5s" },
  { left: "85%", top: "32%", delay: "1.6s", duration: "5.5s" },
  { left: "12%", top: "55%", delay: "2s", duration: "4s" },
  { left: "35%", top: "72%", delay: "0.5s", duration: "6s" },
  { left: "58%", top: "48%", delay: "1.8s", duration: "3.8s" },
  { left: "78%", top: "65%", delay: "1s", duration: "4.2s" },
  { left: "92%", top: "78%", delay: "2.4s", duration: "5s" },
  { left: "50%", top: "85%", delay: "0.2s", duration: "4.8s" },
  { left: "28%", top: "42%", delay: "1.4s", duration: "3.2s" },
];

/** Fixed full-viewport background — grid, glows, sparkles */
export function PageBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg-primary">
      <div className="grid-pattern absolute inset-0" />

      {isLight ? (
        <>
          <div className="page-bg-light-wash absolute inset-0" />
          <div className="absolute -right-20 top-1/3 h-[420px] w-[420px] rounded-full bg-accent-primary/[0.04] blur-[120px]" />
          <div className="absolute -left-16 bottom-1/4 h-[360px] w-[360px] rounded-full bg-accent-secondary/[0.03] blur-[100px]" />
        </>
      ) : (
        <>
          <div className="absolute -left-32 top-1/4 h-[520px] w-[520px] rounded-full bg-accent-primary/[0.07] blur-[100px]" />
          <div className="absolute -right-24 bottom-1/4 h-[480px] w-[480px] rounded-full bg-accent-secondary/[0.06] blur-[90px]" />
          <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent-primary/[0.04] blur-[80px]" />
        </>
      )}

      <div className="absolute inset-0 overflow-hidden">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="sparkle"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              animationDuration: `${s.duration}, ${parseFloat(s.duration) * 1.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
