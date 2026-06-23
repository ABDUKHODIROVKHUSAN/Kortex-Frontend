"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { GlassCard } from "@/components/ui";

export default function DocsPageContent() {
  const { t } = useTranslation();

  const sections = [
    { title: t("docs.gettingStarted"), body: t("docs.gettingStartedDesc") },
    { title: t("docs.uploading"), body: t("docs.uploadingDesc") },
    { title: t("docs.chatting"), body: t("docs.chattingDesc") },
    { title: t("docs.citations"), body: t("docs.citationsDesc") },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-primary">{t("docs.title")}</h1>
        <p className="mt-3 text-lg text-text-secondary">{t("docs.subtitle")}</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <GlassCard key={section.title}>
            <h2 className="text-lg font-bold text-accent-primary">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{section.body}</p>
          </GlassCard>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-text-muted">
        {t("docs.needHelp")}{" "}
        <Link href="/register" className="font-semibold text-accent-primary hover:underline">
          {t("nav.signUp")}
        </Link>
      </p>
    </div>
  );
}
