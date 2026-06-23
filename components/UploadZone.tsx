"use client";

import { useCallback, useState } from "react";
import { Button, Spinner } from "@/components/ui";
import { PdfFileIcon, DocxFileIcon } from "@/components/FileTypeIcons";
import { useTranslation } from "@/lib/i18n/context";

const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

function isAllowedFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || ext === "docx") return true;
  return ACCEPTED.includes(file.type);
}

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateAndUpload = useCallback(
    async (file: File) => {
      setError("");
      if (!isAllowedFile(file)) {
        setError(t("upload.onlyPdfDocx"));
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
    [onUpload, t]
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
          accept=".pdf,.docx"
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
        <p className="mt-4 text-center text-sm text-error">{error}</p>
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
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setError("");
    if (!isAllowedFile(file)) {
      setError(t("upload.onlyPdfDocx"));
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
          accept=".pdf,.docx"
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
      {error && <p className="mt-4 text-center text-sm text-error">{error}</p>}
    </div>
  );
}
