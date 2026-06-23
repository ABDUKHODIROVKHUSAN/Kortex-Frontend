"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

export default function HeroCTA() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  return (
    <Link href={session ? "/upload" : "/register"}>
      <Button className="btn-primary px-10 py-3 text-base">{t("nav.getStarted")}</Button>
    </Link>
  );
}
