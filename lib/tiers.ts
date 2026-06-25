export type SubscriptionTier = "free" | "pro" | "business";

export interface TierLimits {
  questions_per_month: number;
  tokens_per_month?: number;
  tokens_per_week?: number;
  allowed_formats: string[];
}

export const tierLimits: Record<SubscriptionTier, TierLimits> = {
  free: {
    questions_per_month: 50,
    tokens_per_month: 100_000,
    allowed_formats: ["pdf"],
  },
  pro: {
    questions_per_month: 500,
    tokens_per_week: 300_000,
    allowed_formats: ["pdf", "docx"],
  },
  business: {
    questions_per_month: 1000,
    tokens_per_week: 500_000,
    allowed_formats: ["pdf", "doc", "docx"],
  },
};

export function normalizeTier(tier?: string | null): SubscriptionTier {
  if (tier === "pro" || tier === "business" || tier === "free") return tier;
  return "free";
}

export function getTierLimits(tier?: string | null): TierLimits {
  return tierLimits[normalizeTier(tier)];
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function isFormatAllowed(tier: string | null | undefined, filename: string): boolean {
  const ext = getFileExtension(filename);
  return getTierLimits(tier).allowed_formats.includes(ext);
}

export function tierDisplayName(tier: SubscriptionTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
