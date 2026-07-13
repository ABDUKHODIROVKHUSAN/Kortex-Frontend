"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GridBackground } from "@/components/GridBackground";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroCTA from "@/components/HeroCTA";
import LandingFAQ from "@/components/LandingFAQ";
import PricingTierAction from "@/components/PricingTierAction";
import ScrollToTop from "@/components/ScrollToTop";
import LandingAnalytics from "@/components/LandingAnalytics";
import { GlassCard } from "@/components/ui";
import {
  getPricingTiers,
  type BillingPeriod,
  type PricingTier,
} from "@/lib/pricingTiers";
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

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <span className="landing-pricing-check" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="landing-pricing-dash" aria-hidden>
      —
    </span>
  );
}

function PricingTierCard({ tier }: { tier: PricingTier }) {
  const { t } = useTranslation();
  const ctaClass = tier.highlight
    ? "landing-pricing-cta landing-pricing-cta-primary"
    : "landing-pricing-cta landing-pricing-cta-outline";

  return (
    <div
      className={`landing-pricing-card flex flex-col ${
        tier.highlight ? "landing-pricing-card-highlight" : ""
      }`}
    >
      {tier.highlight && (
        <span className="landing-pricing-badge">{t("pricing.mostPopular")}</span>
      )}
      <p className="landing-pricing-name">{tier.name}</p>
      <p className="landing-pricing-desc">{tier.desc}</p>
      <div className="landing-pricing-price-row">
        <span className="landing-pricing-price">{tier.priceLabel}</span>
        {tier.id !== "free" && (
          <span className="landing-pricing-period">{tier.periodLabel}</span>
        )}
      </div>
      {tier.id === "free" && (
        <p className="landing-pricing-period landing-pricing-period-free">
          {t("pricing.foreverFree")}
        </p>
      )}
      <PricingTierAction tier={tier} variant="landing" className={ctaClass} />
      <div className="landing-pricing-groups flex-1">
        {tier.featureGroups.map((group) => (
          <div key={group.title} className="landing-pricing-group">
            <p className="landing-pricing-group-title">{group.title}</p>
            <ul className="landing-pricing-features">
              {group.features.map((f) => (
                <li
                  key={f.label}
                  className={f.included ? "" : "landing-pricing-feature-excluded"}
                >
                  <CheckIcon included={f.included} />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const BILLING_FAQ_KEYS = [
  { q: "pricing.billingFaqQ1", a: "pricing.billingFaqA1" },
  { q: "pricing.billingFaqQ2", a: "pricing.billingFaqA2" },
  { q: "pricing.billingFaqQ3", a: "pricing.billingFaqA3" },
  { q: "pricing.billingFaqQ4", a: "pricing.billingFaqA4" },
] as const;

function PricingBillingFAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="landing-pricing-faq">
      <h3 className="landing-pricing-faq-title">{t("pricing.billingFaqTitle")}</h3>
      <div className="landing-faq-list">
        {BILLING_FAQ_KEYS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.q} className="landing-faq-item">
              <button
                type="button"
                className="landing-faq-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{t(item.q)}</span>
                <span className="landing-faq-icon" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="landing-faq-answer">
                  <p>{t(item.a)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

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

  const docsSections = [
    { title: t("docs.gettingStarted"), body: t("docs.gettingStartedDesc") },
    { title: t("docs.uploading"), body: t("docs.uploadingDesc") },
    { title: t("docs.chatting"), body: t("docs.chattingDesc") },
    { title: t("docs.citations"), body: t("docs.citationsDesc") },
  ];

  const pricingTiers = getPricingTiers(t, session, billing);
  const featuresCtaHref = session ? "/dashboard" : "/register";
  const ctaHref = session ? "/upload" : "/register";

  return (
    <GridBackground>
      <SiteHeader />

      <section
        id="hero"
        className="landing-band scroll-mt-24"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6">
          <div className="flex flex-col items-center justify-center py-16 text-center md:py-24">
            <h1 className="landing-hero-title mb-6 max-w-4xl text-4xl font-bold text-text-primary md:text-6xl lg:text-7xl">
              <span className="landing-hero-prefix text-accent-primary">
                {t("hero.titlePrefix")}
              </span>
              <span className="landing-hero-rest">{t("hero.titleRest")}</span>
              <br />
              <span className="landing-hero-line2">{t("hero.titleLine2")}</span>
            </h1>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              {t("hero.subtitle")}
            </p>
            <HeroCTA />
          </div>
        </div>
      </section>

      <section id="features" className="landing-band landing-band-features scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <h2 className="landing-section-title mb-3 md:mb-4">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base text-text-secondary md:mb-16">
            {t("landing.featuresSubtitle")}
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {features.map((item) => (
              <LandingFeatureCard key={item.step} {...item} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href={featuresCtaHref} className="site-header-signup !rounded-lg !px-8 !py-3">
              {t("landing.featuresCta")}
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="landing-band landing-band-pricing scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <h2 className="landing-section-title mb-3 md:mb-4">
            {t("landing.pricingTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-base text-text-secondary md:mb-10">
            {t("pricing.subtitle")}
          </p>

          <div className="landing-billing-toggle mb-12 md:mb-16" role="group" aria-label={t("pricing.billingToggle")}>
            <button
              type="button"
              className={`landing-billing-option ${billing === "monthly" ? "is-active" : ""}`}
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
            >
              {t("pricing.monthly")}
            </button>
            <button
              type="button"
              className={`landing-billing-option ${billing === "annual" ? "is-active" : ""}`}
              onClick={() => setBilling("annual")}
              aria-pressed={billing === "annual"}
            >
              {t("pricing.annual")}
              <span className="landing-billing-save">{t("pricing.savePercent")}</span>
            </button>
          </div>

          <div className="landing-pricing-grid">
            {pricingTiers.map((tier) => (
              <PricingTierCard key={tier.id} tier={tier} />
            ))}
          </div>

          <PricingBillingFAQ />
        </div>
      </section>

      <LandingAnalytics />

      <section id="docs" className="landing-band scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <h2 className="landing-section-title mb-3 md:mb-4">
            {t("landing.docsTitle")}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base text-text-secondary md:mb-14">
            {t("landing.docsSubtitle")}
          </p>
          <div className="space-y-4">
            {docsSections.map((section) => (
              <GlassCard key={section.title}>
                <h3 className="text-lg font-bold text-accent-primary">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {section.body}
                </p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-text-muted">
            {t("docs.needHelp")}{" "}
            <Link
              href={session ? "/upload" : "/register"}
              className="font-semibold text-accent-primary hover:underline"
            >
              {t("nav.signUp")}
            </Link>
          </p>
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

      <ScrollToTop />
    </GridBackground>
  );
}
