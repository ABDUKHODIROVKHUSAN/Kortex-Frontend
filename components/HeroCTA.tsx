"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/i18n/context";

export default function HeroCTA() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  const handleClick = () => {
    if (status === "loading") return;
    // Signed-in users go to Workspace; guests start signup.
    router.push(session ? "/dashboard" : "/register");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      className="btn-primary inline-flex items-center justify-center rounded-lg border border-accent-primary px-10 py-3 text-base font-medium shadow-glow-btn transition-all duration-300 hover:border-accent-secondary hover:shadow-glow-btn-hover disabled:cursor-wait disabled:opacity-70"
    >
      {t("nav.getStarted")}
    </button>
  );
}
