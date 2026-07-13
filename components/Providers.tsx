"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import SupportChatWidget from "@/components/SupportChatWidget";
import { ToastProvider } from "@/components/ToastProvider";
import type { Locale } from "@/lib/i18n/messages";
import { LocaleProvider } from "@/lib/i18n/context";

interface ProvidersProps {
  children: ReactNode;
  initialLocale: Locale;
}

export default function Providers({
  children,
  initialLocale,
}: ProvidersProps) {
  return (
    <SessionProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <ToastProvider>
          <div className="app-shell">{children}</div>
          <SupportChatWidget />
        </ToastProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
