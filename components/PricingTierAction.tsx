"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PaymentDetailsDialog from "@/components/PaymentDetailsDialog";
import SignUpToUpgradeDialog from "@/components/SignUpToUpgradeDialog";
import { useToast } from "@/components/ToastProvider";
import { upgradeTier } from "@/lib/api";
import type { PricingTier } from "@/lib/pricingTiers";
import { useTranslation } from "@/lib/i18n/context";

interface PricingTierActionProps {
  tier: PricingTier;
  className?: string;
  variant?: "page" | "landing";
}

export default function PricingTierAction({
  tier,
  className = "",
  variant = "page",
}: PricingTierActionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const signedIn = !!session;
  const isFree = tier.id === "free";
  const isPaid = tier.id === "pro" || tier.id === "business";

  const baseClass =
    variant === "landing"
      ? tier.highlight
        ? "landing-pricing-cta landing-pricing-cta-primary"
        : "landing-pricing-cta landing-pricing-cta-outline"
      : "site-header-signup inline-flex justify-center";

  const handleFreeClick = () => {
    router.push("/dashboard");
  };

  const handleUpgradeClick = () => {
    if (!signedIn) {
      setSignUpOpen(true);
      return;
    }
    setPaymentOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!session?.accessToken || tier.id === "free") return;

    setUpgrading(true);
    try {
      const res = await upgradeTier(session.accessToken, tier.id as "pro" | "business");
      if (!res.success) {
        throw new Error(res.message || t("pricing.upgradeFailed"));
      }

      await update({ subscriptionTier: res.userTier });
      setPaymentOpen(false);
      showToast(t("pricing.upgradeSuccess", { plan: tier.name }), "success");
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : t("pricing.upgradeFailed"),
        "error"
      );
      throw err;
    } finally {
      setUpgrading(false);
    }
  };

  if (isFree) {
    if (signedIn) {
      return (
        <button type="button" className={`${baseClass} ${className}`} onClick={handleFreeClick}>
          {tier.cta}
        </button>
      );
    }
    return (
      <Link href={tier.href} className={`${baseClass} ${className}`}>
        {tier.cta}
      </Link>
    );
  }

  if (isPaid) {
    return (
      <>
        <button
          type="button"
          className={`${baseClass} ${className}`}
          onClick={handleUpgradeClick}
        >
          {tier.cta}
        </button>
        <SignUpToUpgradeDialog open={signUpOpen} onClose={() => setSignUpOpen(false)} />
        <PaymentDetailsDialog
          open={paymentOpen}
          tierName={tier.name}
          priceLabel={tier.priceLabel}
          periodLabel={tier.periodLabel}
          loading={upgrading}
          onConfirm={handleConfirmPayment}
          onCancel={() => !upgrading && setPaymentOpen(false)}
        />
      </>
    );
  }

  return null;
}
