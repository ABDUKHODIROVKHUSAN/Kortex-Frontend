"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";
import type { Document } from "@/types";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocMetaCard({ doc }: { doc: Document }) {
  const { t } = useTranslation();

  return (
    <GlassCard className="!p-0 overflow-hidden">
      <div className="border-b border-border/80 px-5 py-4">
        <h2 className="break-words text-sm font-semibold leading-snug text-text-primary">
          {doc.original_name}
        </h2>
      </div>
      <table className="chat-meta-table w-full text-sm">
        <tbody>
          <tr>
            <th scope="row">{t("chat.type")}</th>
            <td className="uppercase">{doc.file_type}</td>
          </tr>
          <tr>
            <th scope="row">{t("chat.size")}</th>
            <td>{formatBytes(doc.file_size)}</td>
          </tr>
          <tr>
            <th scope="row">{t("chat.uploaded")}</th>
            <td>{new Date(doc.created_at).toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">{t("chat.chunks")}</th>
            <td>{doc.chunk_count}</td>
          </tr>
        </tbody>
      </table>
    </GlassCard>
  );
}

export default function ChatSidebar({ doc }: { doc: Document | null }) {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="chat-mobile-bar flex shrink-0 items-center gap-3 border-b border-border bg-bg-card/95 px-3 py-2.5 backdrop-blur-sm lg:hidden">
        <Link
          href="/dashboard"
          className="shrink-0 text-sm font-medium text-accent-primary hover:text-accent-secondary"
        >
          {t("chat.backShort")}
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
          {doc?.original_name ?? t("chat.notFound")}
        </p>
        {doc && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent-primary/30 hover:text-accent-primary"
            aria-expanded={drawerOpen}
          >
            {t("chat.documentInfo")}
          </button>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="chat-sidebar hidden w-80 shrink-0 border-r border-accent-primary/10 bg-bg-primary/40 p-6 backdrop-blur-sm lg:block">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex text-sm text-accent-primary hover:text-accent-secondary"
        >
          {t("chat.backToDocuments")}
        </Link>

        {doc ? (
          <DocMetaCard doc={doc} />
        ) : (
          <p className="text-text-secondary">{t("chat.notFound")}</p>
        )}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && doc && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={t("chat.closeInfo")}
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="chat-sidebar absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col overflow-y-auto border-r border-border bg-bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-text-primary">
                {t("chat.documentInfo")}
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-2 py-1 text-sm text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex text-sm text-accent-primary hover:text-accent-secondary"
              onClick={() => setDrawerOpen(false)}
            >
              {t("chat.backToDocuments")}
            </Link>
            <DocMetaCard doc={doc} />
          </aside>
        </div>
      )}
    </>
  );
}
