import type { Session } from "next-auth";

export type PricingTierId = "free" | "pro" | "business";
export type BillingPeriod = "monthly" | "annual";

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingFeatureGroup {
  title: string;
  features: PricingFeature[];
}

export interface PricingTier {
  id: PricingTierId;
  name: string;
  desc: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  priceLabel: string;
  periodLabel: string;
  featureGroups: PricingFeatureGroup[];
  /** Flat list for dialogs / legacy consumers */
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  disabled: boolean;
}

const ANNUAL_DISCOUNT = 0.2;

export function annualMonthlyPrice(monthly: number): number {
  return Math.round(monthly * (1 - ANNUAL_DISCOUNT) * 100) / 100;
}

export function formatUsd(amount: number): string {
  return amount === 0
    ? "$0"
    : `$${amount.toFixed(2).replace(/\.00$/, "")}`;
}

export function getPricingTiers(
  t: (key: string) => string,
  session: Session | null,
  billing: BillingPeriod = "monthly"
): PricingTier[] {
  const signedIn = !!session;

  const freeMonthly = 0;
  const proMonthly = 11.99;
  const businessMonthly = 19.99;

  const freePrice =
    billing === "monthly" ? freeMonthly : annualMonthlyPrice(freeMonthly);
  const proPrice =
    billing === "monthly" ? proMonthly : annualMonthlyPrice(proMonthly);
  const businessPrice =
    billing === "monthly" ? businessMonthly : annualMonthlyPrice(businessMonthly);

  const periodLabel =
    billing === "monthly" ? t("pricing.perMonth") : t("pricing.perMonthBilledAnnually");

  const freeGroups: PricingFeatureGroup[] = [
    {
      title: t("pricing.groupUsage"),
      features: [
        { label: t("pricing.freeF1"), included: true },
        { label: t("pricing.freeF2"), included: true },
        { label: t("pricing.freeF3"), included: true },
      ],
    },
    {
      title: t("pricing.groupAi"),
      features: [
        { label: t("pricing.featStandardAi"), included: true },
        { label: t("pricing.featPriorityResponses"), included: false },
        { label: t("pricing.featFastAi"), included: false },
      ],
    },
    {
      title: t("pricing.groupSupport"),
      features: [
        { label: t("pricing.featCommunitySupport"), included: true },
        { label: t("pricing.featEmailSupport"), included: false },
        { label: t("pricing.featDedicatedManager"), included: false },
      ],
    },
  ];

  const proGroups: PricingFeatureGroup[] = [
    {
      title: t("pricing.groupUsage"),
      features: [
        { label: t("pricing.proF1"), included: true },
        { label: t("pricing.proF2"), included: true },
        { label: t("pricing.proF3"), included: true },
      ],
    },
    {
      title: t("pricing.groupAi"),
      features: [
        { label: t("pricing.featStandardAi"), included: true },
        { label: t("pricing.featPriorityResponses"), included: true },
        { label: t("pricing.featFastAi"), included: false },
      ],
    },
    {
      title: t("pricing.groupSupport"),
      features: [
        { label: t("pricing.featCommunitySupport"), included: true },
        { label: t("pricing.featEmailSupport"), included: true },
        { label: t("pricing.featDedicatedManager"), included: false },
      ],
    },
  ];

  const businessGroups: PricingFeatureGroup[] = [
    {
      title: t("pricing.groupUsage"),
      features: [
        { label: t("pricing.businessF1"), included: true },
        { label: t("pricing.businessF2"), included: true },
        { label: t("pricing.businessF3"), included: true },
      ],
    },
    {
      title: t("pricing.groupAi"),
      features: [
        { label: t("pricing.featStandardAi"), included: true },
        { label: t("pricing.featPriorityResponses"), included: true },
        { label: t("pricing.featFastAi"), included: true },
      ],
    },
    {
      title: t("pricing.groupSupport"),
      features: [
        { label: t("pricing.featCommunitySupport"), included: true },
        { label: t("pricing.featEmailSupport"), included: true },
        { label: t("pricing.featDedicatedManager"), included: true },
      ],
    },
  ];

  const includedLabels = (groups: PricingFeatureGroup[]) =>
    groups.flatMap((g) => g.features.filter((f) => f.included).map((f) => f.label));

  return [
    {
      id: "free",
      name: t("pricing.freeName"),
      priceMonthly: freeMonthly,
      priceAnnualMonthly: annualMonthlyPrice(freeMonthly),
      priceLabel: formatUsd(freePrice),
      periodLabel,
      desc: t("pricing.freeDesc"),
      featureGroups: freeGroups,
      features: includedLabels(freeGroups),
      cta: signedIn ? t("pricing.ctaOpenWorkspace") : t("pricing.ctaGetStarted"),
      href: signedIn ? "/dashboard" : "/register",
      highlight: false,
      disabled: false,
    },
    {
      id: "pro",
      name: t("pricing.proName"),
      priceMonthly: proMonthly,
      priceAnnualMonthly: annualMonthlyPrice(proMonthly),
      priceLabel: formatUsd(proPrice),
      periodLabel,
      desc: t("pricing.proDesc"),
      featureGroups: proGroups,
      features: includedLabels(proGroups),
      cta: t("pricing.ctaGetStarted"),
      href: "#",
      highlight: true,
      disabled: false,
    },
    {
      id: "business",
      name: t("pricing.businessName"),
      priceMonthly: businessMonthly,
      priceAnnualMonthly: annualMonthlyPrice(businessMonthly),
      priceLabel: formatUsd(businessPrice),
      periodLabel,
      desc: t("pricing.businessDesc"),
      featureGroups: businessGroups,
      features: includedLabels(businessGroups),
      cta: t("pricing.ctaContactSales"),
      href: "#",
      highlight: false,
      disabled: false,
    },
  ];
}
