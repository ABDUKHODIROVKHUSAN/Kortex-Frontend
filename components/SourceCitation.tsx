"use client";

import { useState } from "react";
import type { SourceChunk } from "@/types";
import { useTranslation } from "@/lib/i18n/context";

export default function SourceCitation({
  sources,
  onOpenSource,
}: {
  sources: SourceChunk[];
  onOpenSource?: (source: SourceChunk) => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  if (!sources?.length) return null;

  const renderRow = (source: SourceChunk, i: number, compact: boolean) => {
    const clickable = Boolean(onOpenSource);
    const label = source.page
      ? t("chat.page", { page: source.page })
      : source.paragraph_index != null
        ? t("chat.section", { index: source.paragraph_index })
        : t("chat.sourceUntitled");

    const body = (
      <>
        {(source.page || source.paragraph_index != null) && (
          <span className="chat-source-badge mb-1.5 inline-block">{label}</span>
        )}
        <p className="text-xs leading-relaxed text-text-secondary">
          {source.text.slice(0, compact ? 120 : 160)}
          {source.text.length > (compact ? 120 : 160) ? "…" : ""}
        </p>
        {clickable && (
          <span className="mt-1.5 inline-block text-[11px] font-semibold text-accent-primary">
            {t("chat.openInPdf")} →
          </span>
        )}
      </>
    );

    if (clickable) {
      return (
        <button
          key={i}
          type="button"
          onClick={() => onOpenSource?.(source)}
          className="block w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-left transition hover:border-accent-primary/40 hover:bg-accent-primary/5"
        >
          {body}
        </button>
      );
    }

    return (
      <li key={i} className="rounded-lg border border-border bg-bg-secondary px-3 py-2">
        {body}
      </li>
    );
  };

  return (
    <div className="chat-sources mt-4 border-t border-border/70 pt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-semibold text-accent-primary transition hover:text-accent-secondary"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-accent-primary/10 text-[10px]">
          {open ? "▼" : "▶"}
        </span>
        {t("chat.sources", { count: sources.length })}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "mt-3 max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="chat-table-wrap">
          <ul className="space-y-2 sm:hidden">
            {sources.map((source, i) => renderRow(source, i, true))}
          </ul>
          <table className="chat-table chat-sources-table hidden sm:table">
            <thead>
              <tr>
                <th>{t("chat.sourceLocation")}</th>
                <th>{t("chat.sourceExcerpt")}</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {sources.map((source, i) => (
                <tr key={i}>
                  <td className="chat-source-location whitespace-nowrap">
                    {(source.page || source.paragraph_index != null) && (
                      <span className="chat-source-badge">
                        {source.page
                          ? t("chat.page", { page: source.page })
                          : t("chat.section", {
                              index: source.paragraph_index ?? 0,
                            })}
                      </span>
                    )}
                  </td>
                  <td className="text-text-secondary">
                    {source.text.slice(0, 160)}
                    {source.text.length > 160 ? "…" : ""}
                  </td>
                  <td>
                    {onOpenSource && (
                      <button
                        type="button"
                        onClick={() => onOpenSource(source)}
                        className="text-xs font-semibold text-accent-primary hover:underline"
                      >
                        {t("chat.view")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
