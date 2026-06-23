"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";
import type { Document } from "@/types";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChatSidebar({ doc }: { doc: Document | null }) {
  const { t } = useTranslation();

  return (
    <aside className="chat-sidebar w-80 shrink-0 border-r border-accent-primary/10 bg-bg-primary/40 p-6 backdrop-blur-sm">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex text-sm text-accent-primary hover:text-accent-secondary"
      >
        {t("chat.backToDocuments")}
      </Link>

      {doc ? (
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
      ) : (
        <p className="text-text-secondary">{t("chat.notFound")}</p>
      )}
    </aside>
  );
}
