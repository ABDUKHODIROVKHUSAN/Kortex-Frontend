"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useSession } from "next-auth/react";
import { GridBackground } from "@/components/GridBackground";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroCTA from "@/components/HeroCTA";
import LandingFAQ from "@/components/LandingFAQ";
import PricingTierAction from "@/components/PricingTierAction";
import ScrollToTop from "@/components/ScrollToTop";
import LandingAnalytics from "@/components/LandingAnalytics";
import DocsIllustration from "@/components/DocsIllustration";
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
      <div className="landing-pricing-groups hidden flex-1 md:block">
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
  const ctaHref = session ? "/dashboard" : "/register";

  return (
    <GridBackground>
      <SiteHeader />

      <section
        id="hero"
        className="landing-band scroll-mt-24"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6">
          <div className="flex flex-col items-center justify-center py-10 text-center md:py-24">
            <h1 className="landing-hero-title mb-4 max-w-4xl text-3xl font-bold text-text-primary sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
              <span className="landing-hero-prefix text-accent-primary">
                {t("hero.titlePrefix")}
              </span>
              <span className="landing-hero-rest">{t("hero.titleRest")}</span>
              <br />
              <span className="landing-hero-line2">{t("hero.titleLine2")}</span>
            </h1>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base md:mb-10 md:text-lg">
              {t("hero.subtitle")}
            </p>
            <HeroCTA />
          </div>
        </div>
      </section>

      <section id="features" className="landing-band landing-band-features scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-24">
          <h2 className="landing-section-title mb-2 md:mb-4">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-text-secondary md:mb-16 md:text-base">
            {t("landing.featuresSubtitle")}
          </p>
          <div className="grid gap-3 sm:gap-5 md:grid-cols-2">
            {features.map((item) => (
              <LandingFeatureCard key={item.step} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="landing-band landing-band-pricing scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-24">
          <h2 className="landing-section-title mb-2 md:mb-4">
            {t("landing.pricingTitle")}
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-text-secondary md:mb-10 md:text-base">
            {t("pricing.subtitle")}
          </p>

          <div className="landing-billing-toggle mb-8 md:mb-16" role="group" aria-label={t("pricing.billingToggle")}>
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

          <div className="hidden md:block">
            <PricingBillingFAQ />
          </div>
          <p className="mt-8 text-center text-sm md:hidden">
            <Link href="/pricing" className="font-semibold text-accent-primary hover:underline">
              {t("landing.viewFullPricing")}
            </Link>
          </p>
        </div>
      </section>

      <div className="hidden md:block">
        <LandingAnalytics />
      </div>

      <section id="docs" className="landing-band scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-24">
          <h2 className="landing-section-title mb-2 md:mb-4">
            {t("landing.docsTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-text-secondary md:mb-12 md:text-base">
            {t("landing.docsSubtitle")}
          </p>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 flex justify-center lg:order-1">
              <DocsIllustration />
            </div>

            <div className="order-1 space-y-4 lg:order-2">
              {/* Compact teaser on small phones; full cards from sm up */}
              <div className="sm:hidden">
                <GlassCard className="!p-5 text-center">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {t("landing.docsMobileTeaser")}
                  </p>
                </GlassCard>
              </div>
              <div className="hidden space-y-4 sm:block">
                {docsSections.map((section, index) => (
                  <GlassCard
                    key={section.title}
                    className="docs-guide-card"
                    style={
                      {
                        "--docs-card-delay": `${index * 0.08}s`,
                      } as CSSProperties
                    }
                  >
                    <div className="flex items-start gap-3">
                      <span className="docs-guide-step">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="text-lg font-bold text-accent-primary">
                          {section.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          {section.body}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-text-muted md:mt-10">
            {t("docs.needHelp")}{" "}
            <Link
              href={session ? "/dashboard" : "/register"}
              className="font-semibold text-accent-primary hover:underline"
            >
              {t("nav.signUp")}
            </Link>
          </p>
        </div>
      </section>

      <section id="faq" className="landing-band landing-band-faq scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 py-10 md:py-24">
          <h2 className="landing-section-title mb-6 md:mb-14">{t("landing.faqTitle")}</h2>
          <LandingFAQ />
        </div>
      </section>

      <section className="landing-band scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-2 md:pb-28 md:pt-4">
          <div className="landing-cta-box">
            <h2 className="landing-cta-title">{t("landing.ctaTitle")}</h2>
            <Link href={ctaHref} className="landing-cta-button">
              {t("landing.ctaButton")}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto hidden w-full max-w-6xl px-6 md:block">
        <SiteFooter />
      </div>

      <ScrollToTop />
    </GridBackground>
  );
}
