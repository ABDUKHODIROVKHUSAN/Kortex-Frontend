"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import SupportChatWidget from "@/components/SupportChatWidget";
import { ToastProvider } from "@/components/ToastProvider";
import type { Locale } from "@/lib/i18n/messages";
import { LocaleProvider } from "@/lib/i18n/context";
import type { Theme } from "@/lib/theme/types";
import { ThemeProvider } from "@/lib/theme/context";

interface ProvidersProps {
  children: ReactNode;
  initialLocale: Locale;
  initialTheme: Theme;
}

export default function Providers({
  children,
  initialLocale,
  initialTheme,
}: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider initialTheme={initialTheme}>
        <LocaleProvider initialLocale={initialLocale}>
          <ToastProvider>
            <div className="app-shell">{children}</div>
            <SupportChatWidget />
          </ToastProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
