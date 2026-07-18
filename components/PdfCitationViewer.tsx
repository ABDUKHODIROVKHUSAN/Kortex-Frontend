"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { getDocumentFileUrl } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/context";
import type { SourceChunk } from "@/types";

const PdfPageView = dynamic(() => import("@/components/PdfPageView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center text-sm text-text-secondary">
      Loading PDF…
    </div>
  ),
});

export interface PdfCitationTarget {
  docId: string;
  fileType: string;
  source: SourceChunk;
}

export default function PdfCitationViewer({
  target,
  onClose,
}: {
  target: PdfCitationTarget | null;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const page = target?.source.page ?? 1;
  const excerpt = target?.source.text ?? "";
  const isPdf = target?.fileType === "pdf";

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  useEffect(() => {
    if (!target || !session?.accessToken) return;

    let revoked: string | null = null;
    let cancelled = false;

    setLoading(true);
    setError("");
    setBlobUrl(null);

    (async () => {
      try {
        const res = await fetch(getDocumentFileUrl(target.docId), {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to load document file");
        const blob = await res.blob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        revoked = url;
        setBlobUrl(url);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("chat.pdfLoadFailed"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [target, session?.accessToken, t]);

  const highlightTerms = useMemo(() => {
    if (!excerpt) return [];
    return excerpt
      .split(/\s+/)
      .map((w) => w.replace(/[^\w가-힣]/g, ""))
      .filter((w) => w.length >= 2)
      .slice(0, 12);
  }, [excerpt]);

  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("chat.pdfViewerTitle")}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-bg-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              {t("chat.pdfViewerTitle")}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">
              {isPdf
                ? t("chat.pdfViewerPage", { page })
                : t("chat.docxViewerHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-sm text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-border/70 bg-bg-secondary/60 px-4 py-3 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {t("chat.matchedExcerpt")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            “{excerpt}
{excerpt.length >= 200 ? "…" : ""}”
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-bg-primary/40 p-3 sm:p-4">
          {loading && (
            <div className="flex h-64 items-center justify-center text-sm text-text-secondary">
              {t("chat.pdfLoading")}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </div>
          )}
          {!loading && !error && blobUrl && isPdf && (
            <PdfPageView
              fileUrl={blobUrl}
              pageNumber={page}
              highlightTerms={highlightTerms}
            />
          )}
          {!loading && !error && blobUrl && !isPdf && (
            <div className="rounded-lg border border-border bg-bg-secondary px-4 py-6 text-center text-sm text-text-secondary">
              <p>{t("chat.docxViewerHint")}</p>
              <a
                href={blobUrl}
                download
                className="mt-3 inline-block font-semibold text-accent-primary hover:underline"
              >
                {t("chat.downloadOriginal")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
