"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { Document, DocumentChatStats } from "@/types";
import { deleteDocument, renameDocument } from "@/lib/api";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Badge, GlassCard, Button } from "@/components/ui";
import ConfirmDialog from "@/components/ConfirmDialog";
import RenameDocumentDialog from "@/components/RenameDocumentDialog";
import { useTranslation } from "@/lib/i18n/context";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusColor(status: Document["status"]) {
  if (status === "ready") return "success" as const;
  if (status === "processing") return "warning" as const;
  return "error" as const;
}

function statusLabel(status: Document["status"], t: (k: string) => string) {
  if (status === "ready") return t("dashboard.statusReady");
  if (status === "processing") return t("dashboard.statusProcessing");
  return t("dashboard.statusFailed");
}

interface DocumentCardProps {
  document: Document;
  chatStats?: DocumentChatStats;
  onDeleted: (id: string) => void;
  onRenamed: (id: string, name: string) => void;
}

export default function DocumentCard({
  document,
  chatStats,
  onDeleted,
  onRenamed,
}: DocumentCardProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [vanishing, setVanishing] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  const relativeLabels = {
    justNow: t("dashboard.justNow"),
    minutesAgo: (count: number) => t("dashboard.minutesAgo", { count }),
    hoursAgo: (count: number) => t("dashboard.hoursAgo", { count }),
    daysAgo: (count: number) => t("dashboard.daysAgo", { count }),
  };

  const activityStat =
    chatStats?.last_activity_at && chatStats.question_count > 0
      ? t("dashboard.activityStat", {
          time: formatRelativeTime(chatStats.last_activity_at, relativeLabels),
          count: chatStats.question_count,
        })
      : null;

  const handleDelete = async () => {
    if (!session?.accessToken) return;
    setDeleting(true);
    try {
      await deleteDocument(session.accessToken, document.id);
      setDeleteOpen(false);
      setVanishing(true);
      setTimeout(() => onDeleted(document.id), 300);
    } catch {
      setDeleting(false);
    }
  };

  const handleRename = async (name: string) => {
    if (!session?.accessToken) return;
    setRenaming(true);
    try {
      const res = await renameDocument(session.accessToken, document.id, name);
      onRenamed(document.id, res.data.original_name);
      setRenameOpen(false);
    } finally {
      setRenaming(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <GlassCard
        className={`group relative flex h-full flex-col transition hover:border-accent-primary/25 hover:shadow-glow-lg ${
          vanishing ? "scale-95 opacity-0 duration-400" : "opacity-100 duration-300"
        }`}
      >
        <div ref={menuRef} className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-bg-secondary/80 text-text-secondary transition hover:border-accent-primary/30 hover:text-accent-primary"
            aria-label={t("dashboard.documentMenu")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <circle cx="8" cy="3" r="1.25" />
              <circle cx="8" cy="8" r="1.25" />
              <circle cx="8" cy="13" r="1.25" />
            </svg>
          </button>
          {menuOpen && (
            <div className="header-dropdown-panel absolute right-0 top-[calc(100%+4px)] z-20 min-w-[140px] overflow-hidden rounded-xl border p-1 shadow-glow">
              <button
                type="button"
                className="flex w-full rounded-lg px-3 py-2 text-left text-xs text-text-secondary transition hover:bg-bg-tertiary/80 hover:text-text-primary"
                onClick={() => {
                  setRenameOpen(true);
                  setMenuOpen(false);
                }}
              >
                {t("dashboard.rename")}
              </button>
              <button
                type="button"
                className="flex w-full rounded-lg px-3 py-2 text-left text-xs text-error transition hover:bg-error/10"
                onClick={() => {
                  setDeleteOpen(true);
                  setMenuOpen(false);
                }}
              >
                {t("dashboard.delete")}
              </button>
            </div>
          )}
        </div>

        <div className="mb-4 min-w-0 pr-10">
          <h3
            className="truncate font-semibold text-text-primary"
            title={document.original_name}
          >
            {document.original_name}
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            {new Date(document.created_at).toLocaleDateString()} ·{" "}
            {formatBytes(document.file_size)}
          </p>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge color="default">{document.file_type.toUpperCase()}</Badge>
          <Badge color={statusColor(document.status)}>
            {statusLabel(document.status, t)}
          </Badge>
        </div>

        {document.status === "ready" && (
          <p className="mb-1 text-xs text-text-muted">
            {t("dashboard.chunks", { count: document.chunk_count })}
          </p>
        )}

        {activityStat ? (
          <p className="mb-4 text-xs text-text-secondary">{activityStat}</p>
        ) : document.status === "ready" ? (
          <p className="mb-4 text-xs text-text-muted">{t("dashboard.noQuestionsYet")}</p>
        ) : (
          <div className="mb-4" />
        )}

        <div className="mt-auto">
          <Link href={document.status === "ready" ? `/chat/${document.id}` : "#"}>
            <Button
              className="w-full"
              disabled={document.status !== "ready"}
              variant={document.status === "ready" ? "primary" : "secondary"}
            >
              {document.status === "processing"
                ? t("dashboard.processing")
                : document.status === "error"
                  ? t("dashboard.statusFailed")
                  : t("dashboard.openChat")}
            </Button>
          </Link>
        </div>
      </GlassCard>

      <ConfirmDialog
        open={deleteOpen}
        title={t("dashboard.deleteTitle")}
        message={t("dashboard.deleteConfirm", { name: document.original_name })}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />

      <RenameDocumentDialog
        open={renameOpen}
        currentName={document.original_name}
        saving={renaming}
        onConfirm={handleRename}
        onCancel={() => !renaming && setRenameOpen(false)}
      />
    </>
  );
}
