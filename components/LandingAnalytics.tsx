"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard, Spinner } from "@/components/ui";
import { getAnalyticsSummary } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/context";
import type { AnalyticsSummary } from "@/types";

const REFRESH_MS = 30_000;

export default function LandingAnalytics() {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await getAnalyticsSummary();
      setData(res.data);
    } catch {
      /* keep last successful snapshot */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return (
    <section id="analytics" className="landing-band scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="landing-section-title mb-3 md:mb-4">
          {t("analytics.title")}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-base text-text-secondary md:mb-16">
          {t("analytics.subtitle")}
        </p>

        {loading && !data ? (
          <div className="flex items-center justify-center gap-3 py-12 text-text-secondary">
            <Spinner />
            {t("analytics.loading")}
          </div>
        ) : data ? (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <GlassCard className="border-l-4 !border-l-accent-primary">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {t("analytics.totalUsers")}
                </p>
                <p className="mt-2 text-5xl font-bold text-text-primary">
                  {data.total_users.toLocaleString()}
                </p>
              </GlassCard>

              <GlassCard className="border-l-4 !border-l-accent-glow">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {t("analytics.totalDocuments")}
                </p>
                <p className="mt-2 text-5xl font-bold text-text-primary">
                  {data.total_documents.toLocaleString()}
                </p>
              </GlassCard>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <GlassCard>
                <h3 className="mb-6 text-xl font-bold text-text-primary">
                  {t("analytics.documentTypes")}
                </h3>

                <div className="mb-8">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-text-primary">PDF</span>
                    <span className="text-2xl font-bold text-accent-primary">
                      {data.pdf_percentage}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-bg-tertiary">
                    <div
                      className="h-3 rounded-full bg-accent-primary transition-all duration-500"
                      style={{ width: `${data.pdf_percentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-text-primary">DOCX</span>
                    <span className="text-2xl font-bold text-accent-secondary">
                      {data.docx_percentage}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-bg-tertiary">
                    <div
                      className="h-3 rounded-full bg-accent-secondary transition-all duration-500"
                      style={{ width: `${data.docx_percentage}%` }}
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="mb-6 text-xl font-bold text-text-primary">
                  {t("analytics.subscriptions")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-bg-tertiary px-4 py-3">
                    <p className="font-semibold text-text-primary">
                      {t("analytics.freeUsers")}
                    </p>
                    <p className="text-3xl font-bold text-success">{data.free_users}</p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-accent-primary/10 px-4 py-3">
                    <p className="font-semibold text-text-primary">
                      {t("analytics.proUsers")}
                    </p>
                    <p className="text-3xl font-bold text-accent-primary">{data.pro_users}</p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-accent-secondary/10 px-4 py-3">
                    <p className="font-semibold text-text-primary">
                      {t("analytics.businessUsers")}
                    </p>
                    <p className="text-3xl font-bold text-accent-secondary">
                      {data.business_users}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-text-muted">{t("analytics.loadFailed")}</p>
        )}
      </div>
    </section>
  );
}
