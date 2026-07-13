"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserAvatar } from "@/lib/useUserAvatar";
import { useTranslation } from "@/lib/i18n/context";

export default function UserAvatarMenu() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const avatar = useUserAvatar();
  const initial = session?.user?.name?.[0]?.toUpperCase() || "U";
  const tier = (session?.user?.subscriptionTier || "free").toLowerCase();
  const isPaid = tier === "pro" || tier === "business";
  const previewSrc = avatar || null;

  if (!session) return null;

  return (
    <div className="user-avatar-menu group relative ml-1">
      <Link
        href="/profile"
        className="site-header-avatar relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-primary/30 bg-accent-primary/10 text-xs font-semibold text-accent-primary transition hover:border-accent-primary/50 hover:shadow-glow"
        title={t("nav.profile")}
        aria-label={t("nav.profile")}
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            initial
          )}
        </span>
        {isPaid && (
          <span
            className="user-avatar-tier-badge"
            title={tier === "business" ? t("profile.business") : t("profile.pro")}
            aria-label={tier === "business" ? t("profile.business") : t("profile.pro")}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" />
            </svg>
          </span>
        )}
      </Link>

      <div className="user-avatar-bubble" role="presentation">
        <div className="user-avatar-bubble-inner">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-accent-primary">{initial}</span>
          )}
        </div>
        <p className="user-avatar-bubble-name">
          {session.user?.name || session.user?.email || t("nav.profile")}
        </p>
        {isPaid && (
          <p className="user-avatar-bubble-tier">
            {tier === "business" ? t("profile.business") : t("profile.pro")}
          </p>
        )}
      </div>
    </div>
  );
}
