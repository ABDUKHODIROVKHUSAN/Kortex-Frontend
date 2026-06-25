"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "@/components/ui";
import { PdfFileIcon, DocxFileIcon } from "@/components/FileTypeIcons";
import { useTranslation } from "@/lib/i18n/context";
import { getFileExtension, getTierLimits, isFormatAllowed } from "@/lib/tiers";

const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/octet-stream",
];

function formatErrorMessage(
  filename: string,
  tier: string | null | undefined,
  t: (key: string) => string
): string {
  const ext = getFileExtension(filename);
  if (ext === "docx") return t("upload.docxUpgradeRequired");
  if (ext === "doc") return t("upload.docUpgradeRequired");
  if (!isFormatAllowed(tier, filename)) return t("upload.formatUpgradeRequired");
  return t("upload.onlyPdfDocx");
}

function isAllowedFile(file: File, tier: string | null | undefined): boolean {
  const ext = getFileExtension(file.name);
  if (ext === "pdf" || ext === "docx" || ext === "doc") {
    return isFormatAllowed(tier, file.name);
  }
  return ACCEPTED.includes(file.type) && isFormatAllowed(tier, file.name);
}

function acceptForTier(tier: string | null | undefined): string {
  const formats = getTierLimits(tier).allowed_formats;
  return formats.map((f) => `.${f}`).join(",");
}

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const tier = session?.user?.subscriptionTier;
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUpgradeLink, setShowUpgradeLink] = useState(false);

  const validateAndUpload = useCallback(
    async (file: File) => {
      setError("");
      setShowUpgradeLink(false);
      if (!isAllowedFile(file, tier)) {
        setError(formatErrorMessage(file.name, tier, t));
        setShowUpgradeLink(true);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError(t("upload.maxSize"));
        return;
      }

      setUploading(true);
      setProgress(0);
      try {
        await onUpload(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("upload.uploadFailed"));
      } finally {
        setUploading(false);
      }
    },
    [onUpload, t, tier]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`upload-zone relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl p-12 ${
          dragging ? "upload-zone-dragging" : ""
        }`}
      >
        <input
          type="file"
          accept={acceptForTier(tier)}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndUpload(file);
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-10 w-10" />
            <p className="text-text-secondary">
              {t("upload.uploading", { progress })}
            </p>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-bg-tertiary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-primary/15 text-3xl">
              📄
            </div>
            <p className="mb-1 text-lg font-medium text-text-primary">
              {t("upload.dropHere")}
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-text-secondary">
              <PdfFileIcon className="text-accent-primary" />
              <DocxFileIcon className="text-accent-primary" />
              <span>{t("upload.fileTypes")}</span>
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-error">
          {error}{" "}
          {showUpgradeLink && (
            <Link href="/pricing" className="font-semibold text-accent-primary hover:underline">
              {t("upload.upgradeLink")}
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

export function UploadZoneWithProgress({
  onUpload,
}: {
  onUpload: (file: File, onProgress: (n: number) => void) => Promise<void>;
}) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const tier = session?.user?.subscriptionTier;
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUpgradeLink, setShowUpgradeLink] = useState(false);

  const handleUpload = async (file: File) => {
    setError("");
    setShowUpgradeLink(false);
    if (!isAllowedFile(file, tier)) {
      setError(formatErrorMessage(file.name, tier, t));
      setShowUpgradeLink(true);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(t("upload.maxSize"));
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      await onUpload(file, setProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("upload.uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
        className={`upload-zone relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl p-12 ${
          dragging ? "upload-zone-dragging" : ""
        }`}
      >
        <input
          type="file"
          accept={acceptForTier(tier)}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-10 w-10" />
            <p className="text-text-secondary">
              {t("upload.uploading", { progress })}
            </p>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-bg-tertiary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-primary/15 text-3xl">
              📄
            </div>
            <p className="mb-1 text-lg font-medium text-text-primary">
              {t("upload.dropHere")}
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-text-secondary">
              <PdfFileIcon className="text-accent-primary" />
              <DocxFileIcon className="text-accent-primary" />
              <span>{t("upload.fileTypes")}</span>
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-4 text-center text-sm text-error">
          {error}{" "}
          {showUpgradeLink && (
            <Link href="/pricing" className="font-semibold text-accent-primary hover:underline">
              {t("upload.upgradeLink")}
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
