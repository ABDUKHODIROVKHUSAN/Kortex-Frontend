"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/i18n/context";
import { getPricingTiers } from "@/lib/pricingTiers";
import { GlassCard } from "@/components/ui";

export default function PricingPageContent() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const tiers = getPricingTiers(t, session);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-text-primary">{t("pricing.title")}</h1>
        <p className="mt-3 text-lg text-text-secondary">{t("pricing.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <GlassCard
            key={tier.id}
            className={`flex flex-col ${tier.highlight ? "border-accent-primary/30 shadow-glow" : ""}`}
          >
            <h2 className="text-xl font-bold text-accent-primary">{tier.name}</h2>
            <p className="mt-2 text-3xl font-bold text-text-primary">{tier.price}</p>
            <p className="mt-2 text-sm text-text-secondary">{tier.desc}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-text-secondary">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold text-accent-primary" aria-hidden>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            {tier.disabled || tier.href === "#" ? (
              <span className="site-header-signup mt-8 inline-flex cursor-not-allowed justify-center opacity-60">
                {tier.cta}
              </span>
            ) : (
              <Link
                href={tier.href}
                className="site-header-signup mt-8 inline-flex justify-center"
              >
                {tier.cta}
              </Link>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
