"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { ChatUsage } from "@/types";

function pct(used: number, limit: number) {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function ChatUsageBar({ usage }: { usage: ChatUsage | null }) {
  const { t } = useTranslation();

  if (!usage) return null;

  const reqPct = pct(usage.requests_used, usage.requests_limit);
  const lowRequests = usage.requests_remaining <= 5;

  return (
    <div className="chat-usage-bar shrink-0 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-medium text-text-secondary">{t("chat.usageTitle")}</span>
        <span className={lowRequests ? "text-warning" : "text-text-muted"}>
          {t("chat.requestsRemaining", {
            remaining: usage.requests_remaining,
            limit: usage.requests_limit,
          })}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className={`h-full rounded-full transition-all ${
            lowRequests ? "bg-warning" : "bg-accent-primary"
          }`}
          style={{ width: `${reqPct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-text-muted">
        {t("chat.tokensRemaining", {
          remaining: usage.tokens_remaining.toLocaleString(),
          limit: usage.tokens_limit.toLocaleString(),
        })}
      </p>
    </div>
  );
}
