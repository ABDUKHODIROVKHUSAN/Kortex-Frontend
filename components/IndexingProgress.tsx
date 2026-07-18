"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";
import type { Document } from "@/types";

const LARGE_FILE_BYTES = 1_200_000;
const LARGE_CHUNK_COUNT = 200;

function stageLabel(
  stage: string | undefined,
  t: (key: string, vars?: Record<string, string | number>) => string
) {
  switch (stage) {
    case "extracting":
      return t("upload.stageExtracting");
    case "chunking":
      return t("upload.stageChunking");
    case "embedding":
      return t("upload.stageEmbedding");
    case "storing":
      return t("upload.stageStoring");
    case "queued":
      return t("upload.stageQueued");
    default:
      return t("upload.statusProcessing");
  }
}

export default function IndexingProgress({
  document,
  compact = false,
}: {
  document: Pick<
    Document,
    "file_size" | "chunk_count" | "progress_percent" | "progress_stage" | "status"
  >;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const target = Math.max(0, Math.min(100, document.progress_percent ?? 8));
  const [displayPct, setDisplayPct] = useState(target);

  // Smoothly ease the bar toward the latest server value so small docs still feel alive.
  useEffect(() => {
    const id = window.setInterval(() => {
      setDisplayPct((prev) => {
        if (prev === target) return prev;
        if (prev > target) return target;
        const step = Math.max(1, Math.ceil((target - prev) / 6));
        return Math.min(target, prev + step);
      });
    }, 80);
    return () => window.clearInterval(id);
  }, [target]);

  const isLarge =
    (document.file_size ?? 0) >= LARGE_FILE_BYTES ||
    (document.chunk_count ?? 0) >= LARGE_CHUNK_COUNT;

  const label = stageLabel(document.progress_stage, t);

  return (
    <div className={compact ? "w-full" : "w-full space-y-1.5"}>
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Spinner className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
        <span className="shrink-0 tabular-nums text-text-muted">{displayPct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className="indexing-progress-bar h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary"
          style={{ width: `${displayPct}%` }}
        />
      </div>
      {isLarge && (
        <p className="text-[11px] leading-snug text-text-muted">
          {t("upload.indexingLargeHint")}
        </p>
      )}
    </div>
  );
}
