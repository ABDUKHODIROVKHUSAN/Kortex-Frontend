"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DocumentCard from "@/components/DocumentCard";
import DocumentsEmptyState from "@/components/DocumentsEmptyState";
import { Button, Input } from "@/components/ui";
import { getChatStats, getDocument } from "@/lib/api";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useTranslation } from "@/lib/i18n/context";
import type { Document, DocumentChatStats } from "@/types";

type StatusFilter = "all" | "ready" | "processing" | "error";
type SortMode = "latest" | "oldest" | "biggest";

export default function DashboardView({
  initialDocuments,
}: {
  initialDocuments: Document[];
}) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState(initialDocuments);
  const [chatStatsMap, setChatStatsMap] = useState<Record<string, DocumentChatStats>>(
    {}
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    if (!session?.accessToken) return;
    getChatStats(session.accessToken)
      .then((res) => {
        const map: Record<string, DocumentChatStats> = {};
        for (const stat of res.data || []) {
          map[stat.document_id] = stat;
        }
        setChatStatsMap(map);
      })
      .catch(() => {});
  }, [session?.accessToken, documents.length]);

  const processingIdsKey = useMemo(
    () =>
      documents
        .filter((d) => d.status === "processing")
        .map((d) => d.id)
        .sort()
        .join(","),
    [documents]
  );

  useEffect(() => {
    if (!session?.accessToken || !processingIdsKey) return;
    const ids = processingIdsKey.split(",");

    const interval = setInterval(async () => {
      const updated = await Promise.all(
        ids.map((id) =>
          getDocument(session.accessToken!, id)
            .then((res) => res.data)
            .catch(() => null)
        )
      );
      setDocuments((prev) =>
        prev.map((doc) => {
          const next = updated.find((u) => u && u.id === doc.id);
          return next ?? doc;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [session?.accessToken, processingIdsKey]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const list = documents.filter((doc) => {
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (q && !doc.original_name.toLowerCase().includes(q)) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortMode === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortMode === "biggest") {
        return (b.file_size || 0) - (a.file_size || 0);
      }
      // latest (default)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [documents, debouncedSearch, statusFilter, sortMode]);

  const countLabel =
    documents.length === 1
      ? t("dashboard.documentCount", { count: documents.length })
      : t("dashboard.documentCountPlural", { count: documents.length });

  const hasDocuments = documents.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {t("dashboard.title")}
          </h1>
          {hasDocuments && <p className="mt-1 text-text-secondary">{countLabel}</p>}
        </div>
        {hasDocuments && (
          <Link href="/upload">
            <Button>{t("dashboard.uploadNew")}</Button>
          </Link>
        )}
      </div>

      {!hasDocuments ? (
        <DocumentsEmptyState />
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dashboard.searchPlaceholder")}
              className="sm:max-w-xs"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="themed-input rounded-lg px-3 py-3 text-sm sm:max-w-[180px]"
              aria-label={t("dashboard.filterAll")}
            >
              <option value="all">{t("dashboard.filterAll")}</option>
              <option value="ready">{t("dashboard.filterReady")}</option>
              <option value="processing">{t("dashboard.filterProcessing")}</option>
              <option value="error">{t("dashboard.filterFailed")}</option>
            </select>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="themed-input rounded-lg px-3 py-3 text-sm sm:max-w-[180px]"
              aria-label={t("dashboard.sortLabel")}
            >
              <option value="latest">{t("dashboard.sortLatest")}</option>
              <option value="oldest">{t("dashboard.sortOldest")}</option>
              <option value="biggest">{t("dashboard.sortBiggest")}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-text-secondary">
              {t("dashboard.noResults")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doc) => (
                <div key={doc.id} className="min-w-0 overflow-visible">
                  <DocumentCard
                    document={doc}
                    chatStats={chatStatsMap[doc.id]}
                    onDeleted={(id) => {
                      setDocuments((d) => d.filter((x) => x.id !== id));
                      setChatStatsMap((m) => {
                        const next = { ...m };
                        delete next[id];
                        return next;
                      });
                    }}
                    onRenamed={(id, name) =>
                      setDocuments((d) =>
                        d.map((x) => (x.id === id ? { ...x, original_name: name } : x))
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
