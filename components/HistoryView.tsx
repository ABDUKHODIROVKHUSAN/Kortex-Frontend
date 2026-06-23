"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GlassCard, Spinner } from "@/components/ui";
import { getChatSessions } from "@/lib/api";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useTranslation } from "@/lib/i18n/context";
import type { ChatSessionSummary } from "@/types";

export default function HistoryView() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }
    getChatSessions(session.accessToken)
      .then((res) => setSessions(res.data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  const relativeLabels = {
    justNow: t("dashboard.justNow"),
    minutesAgo: (count: number) => t("dashboard.minutesAgo", { count }),
    hoursAgo: (count: number) => t("dashboard.hoursAgo", { count }),
    daysAgo: (count: number) => t("dashboard.daysAgo", { count }),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {t("workspace.historyTitle")}
        </h1>
        <p className="mt-1 text-text-secondary">{t("workspace.historySubtitle")}</p>
      </div>

      {sessions.length === 0 ? (
        <GlassCard className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-primary/20 bg-accent-primary/5 text-3xl">
            💬
          </div>
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            {t("workspace.historyEmpty")}
          </h2>
          <p className="mb-6 max-w-md text-text-secondary">
            {t("workspace.historyEmptyDesc")}
          </p>
          <Link
            href="/upload"
            className="site-header-signup inline-flex items-center justify-center"
          >
            {t("workspace.upload")}
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {sessions.map((sessionItem) => (
            <GlassCard key={sessionItem.document_id} className="!p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-primary">
                    {sessionItem.document_name}
                  </p>
                  <p
                    className="mt-2 truncate text-sm text-text-primary"
                    title={sessionItem.first_question}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sessionItem.first_question}
                  </p>
                  <p className="mt-2 text-xs text-text-secondary">
                    {t("workspace.sessionMeta", {
                      messages: sessionItem.message_count,
                      time: formatRelativeTime(
                        sessionItem.last_activity_at,
                        relativeLabels
                      ),
                    })}
                  </p>
                </div>
                <Link
                  href={`/chat/${sessionItem.document_id}`}
                  className="site-header-signup inline-flex shrink-0 items-center justify-center !px-4 !py-2 text-sm"
                >
                  {t("workspace.continueChat")}
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
