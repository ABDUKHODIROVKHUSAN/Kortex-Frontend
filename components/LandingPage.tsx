"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GridBackground } from "@/components/GridBackground";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroCTA from "@/components/HeroCTA";
import LandingFAQ from "@/components/LandingFAQ";
import PricingTierAction from "@/components/PricingTierAction";
import { getPricingTiers, type PricingTier } from "@/lib/pricingTiers";
import { useTranslation } from "@/lib/i18n/context";
import { smoothScrollTo } from "@/lib/scroll";

function LandingFeatureCard({
  step,
  title,
  desc,
  foot,
}: {
  step: string;
  title: string;
  desc: string;
  foot: string;
}) {
  return (
    <article className="landing-feature-card">
      <span className="landing-feature-number">{step}</span>
      <h3 className="mt-4 text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{desc}</p>
      <p className="landing-feature-foot">{foot}</p>
    </article>
  );
}

function PricingTierCard({ tier }: { tier: PricingTier }) {
  const ctaClass = tier.highlight
    ? "landing-pricing-cta landing-pricing-cta-primary"
    : "landing-pricing-cta landing-pricing-cta-outline";

  return (
    <div
      className={`landing-pricing-card flex flex-col ${tier.highlight ? "landing-pricing-card-highlight" : ""}`}
    >
      <p className="landing-pricing-name">{tier.name}</p>
      <p className="landing-pricing-price">{tier.price}</p>
      <p className="landing-pricing-desc">{tier.desc}</p>
      <ul className="landing-pricing-features flex-1">
        {tier.features.map((f) => (
          <li key={f}>
            <span className="landing-pricing-check" aria-hidden>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <PricingTierAction tier={tier} variant="landing" className={ctaClass} />
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => smoothScrollTo(hash), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const features = [
    {
      step: "01",
      title: t("landing.f01Title"),
      desc: t("landing.f01Desc"),
      foot: t("landing.f01Foot"),
    },
    {
      step: "02",
      title: t("landing.f02Title"),
      desc: t("landing.f02Desc"),
      foot: t("landing.f02Foot"),
    },
    {
      step: "03",
      title: t("landing.f03Title"),
      desc: t("landing.f03Desc"),
      foot: t("landing.f03Foot"),
    },
    {
      step: "04",
      title: t("landing.f04Title"),
      desc: t("landing.f04Desc"),
      foot: t("landing.f04Foot"),
    },
  ];

  const pricingTiers = getPricingTiers(t, session);
  const ctaHref = session ? "/upload" : "/register";

  return (
    <GridBackground>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6">
        <SiteHeader />

        <section className="flex flex-col items-center justify-center py-16 text-center md:py-24">
          <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-accent-primary">{t("hero.titlePrefix")}</span>{" "}
            {t("hero.titleRest")}
            <br />
            {t("hero.titleLine2")}
          </h1>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {t("hero.subtitle")}
          </p>
          <HeroCTA />
        </section>
      </div>

      <section id="features" className="landing-band landing-band-features scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <h2 className="landing-section-title mb-12 md:mb-16">
            {t("landing.featuresTitle")}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {features.map((item) => (
              <LandingFeatureCard key={item.step} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="landing-band landing-band-pricing scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <h2 className="landing-section-title mb-12 md:mb-16">
            {t("landing.pricingTitle")}
          </h2>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <PricingTierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="landing-band landing-band-faq scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <h2 className="landing-section-title mb-10 md:mb-14">{t("landing.faqTitle")}</h2>
          <LandingFAQ />
        </div>
      </section>

      <section className="landing-band scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 pb-20 pt-4 md:pb-28">
          <div className="landing-cta-box">
            <h2 className="landing-cta-title">{t("landing.ctaTitle")}</h2>
            <Link href={ctaHref} className="landing-cta-button">
              {t("landing.ctaButton")}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6">
        <SiteFooter />
      </div>
    </GridBackground>
  );
}
