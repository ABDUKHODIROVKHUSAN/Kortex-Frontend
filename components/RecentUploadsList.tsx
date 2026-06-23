"use client";

import { Badge, Spinner } from "@/components/ui";
import { FileTypeIcon } from "@/components/FileTypeIcons";
import { useTranslation } from "@/lib/i18n/context";
import type { Document } from "@/types";

export type RecentUploadItem = Document & {
  uploadProgress?: number;
  isUploading?: boolean;
};

function statusColor(status: Document["status"]) {
  if (status === "ready") return "success" as const;
  if (status === "processing") return "warning" as const;
  return "error" as const;
}

function statusLabel(status: Document["status"], t: (k: string) => string) {
  if (status === "ready") return t("dashboard.statusReady");
  if (status === "processing") return t("upload.statusProcessing");
  return t("dashboard.statusFailed");
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentUploadsList({ items }: { items: RecentUploadItem[] }) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-secondary">
        {t("upload.recentUploads")}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="feature-card flex flex-col gap-3 !p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <FileTypeIcon
                type={item.file_type}
                className="mt-0.5 shrink-0 text-accent-primary"
              />
              <div className="min-w-0">
                <p
                  className="truncate font-medium text-text-primary"
                  title={item.original_name}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.original_name}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {formatTimestamp(item.created_at)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 sm:min-w-[140px]">
              <div className="flex items-center gap-2">
                <Badge color="default">{item.file_type.toUpperCase()}</Badge>
                <Badge color={statusColor(item.status)}>
                  {item.isUploading
                    ? t("upload.statusUploading")
                    : statusLabel(item.status, t)}
                </Badge>
              </div>

              {item.isUploading && item.uploadProgress != null && (
                <div className="w-full sm:w-36">
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all"
                      style={{ width: `${item.uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[10px] text-text-muted">
                    {item.uploadProgress}%
                  </p>
                </div>
              )}

              {item.status === "processing" && !item.isUploading && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Spinner className="h-3.5 w-3.5" />
                  <span className="animate-pulse">{t("upload.statusProcessing")}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
