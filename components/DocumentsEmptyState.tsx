"use client";

import Link from "next/link";
import { KortexIcon } from "@/components/KortexIcon";
import { Button } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

export default function DocumentsEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent-primary/20 bg-accent-primary/10">
        <KortexIcon size={40} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-text-primary">
        {t("dashboard.emptyTitle")}
      </h2>
      <p className="mb-8 max-w-md text-text-secondary">{t("dashboard.emptyDesc")}</p>
      <Link href="/upload">
        <Button>{t("dashboard.uploadFirst")}</Button>
      </Link>
    </div>
  );
}
