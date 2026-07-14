"use client";

import { useState } from "react";
import type { SourceChunk } from "@/types";
import { useTranslation } from "@/lib/i18n/context";

export default function SourceCitation({ sources }: { sources: SourceChunk[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  if (!sources?.length) return null;

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
            {sources.map((source, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-bg-secondary px-3 py-2"
              >
                {(source.page || source.paragraph_index != null) && (
                  <span className="chat-source-badge mb-1.5 inline-block">
                    {source.page
                      ? t("chat.page", { page: source.page })
                      : t("chat.section", {
                          index: source.paragraph_index ?? 0,
                        })}
                  </span>
                )}
                <p className="text-xs leading-relaxed text-text-secondary">
                  {source.text.slice(0, 120)}
                  {source.text.length > 120 ? "…" : ""}
                </p>
              </li>
            ))}
          </ul>
          <table className="chat-table chat-sources-table hidden sm:table">
            <thead>
              <tr>
                <th>{t("chat.sourceLocation")}</th>
                <th>{t("chat.sourceExcerpt")}</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
