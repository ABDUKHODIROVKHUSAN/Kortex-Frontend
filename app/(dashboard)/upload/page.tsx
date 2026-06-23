"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadZoneWithProgress } from "@/components/UploadZone";
import RecentUploadsList, { type RecentUploadItem } from "@/components/RecentUploadsList";
import { getDocument, listDocuments, uploadDocument } from "@/lib/api";
import { Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";
import type { Document } from "@/types";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [activeUpload, setActiveUpload] = useState<{
    id: string;
    progress: number;
    name: string;
  } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const refreshDocuments = useCallback(async () => {
    if (!session?.accessToken) return;
    const res = await listDocuments(session.accessToken).catch(() => ({ data: [] }));
    setDocuments(res.data || []);
  }, [session?.accessToken]);

  useEffect(() => {
    if (!session?.accessToken) {
      setLoadingDocs(false);
      return;
    }
    refreshDocuments().finally(() => setLoadingDocs(false));
  }, [session?.accessToken, refreshDocuments]);

  useEffect(() => {
    if (processingIds.size === 0 || !session?.accessToken) return;

    const interval = setInterval(async () => {
      const ids = Array.from(processingIds);
      let readyId: string | null = null;

      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await getDocument(session.accessToken!, id);
            if (res.data.status === "ready") {
              readyId = id;
            } else if (res.data.status === "error") {
              setProcessingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
              setUploadError(t("upload.processingFailed"));
            }
            setDocuments((prev) =>
              prev.map((d) => (d.id === id ? res.data : d))
            );
          } catch {
            /* keep polling */
          }
        })
      );

      if (readyId) {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(readyId!);
          return next;
        });
        router.push(`/chat/${readyId}`);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [processingIds, session?.accessToken, router, t]);

  const handleUpload = async (file: File, onProgress: (n: number) => void) => {
    setUploadError("");

    if (status === "loading") {
      throw new Error(t("upload.sessionLoading"));
    }
    if (!session?.accessToken) {
      throw new Error(t("upload.notSignedIn"));
    }

    const tempId = `upload-${Date.now()}`;
    setActiveUpload({ id: tempId, progress: 0, name: file.name });

    try {
      const res = await uploadDocument(session.accessToken, file, (pct) => {
        onProgress(pct);
        setActiveUpload((u) => (u ? { ...u, progress: pct } : u));
      });

      setDocuments((prev) => [res.data, ...prev.filter((d) => d.id !== res.data.id)]);
      setProcessingIds((prev) => new Set(prev).add(res.data.id));
    } finally {
      setActiveUpload(null);
    }
  };

  const recentItems: RecentUploadItem[] = useMemo(() => {
    const sorted = [...documents].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const top = sorted.slice(0, 5);

    if (activeUpload) {
      const placeholder: RecentUploadItem = {
        id: activeUpload.id,
        user_id: "",
        filename: activeUpload.name,
        original_name: activeUpload.name,
        file_type: activeUpload.name.toLowerCase().endsWith(".docx") ? "docx" : "pdf",
        file_size: 0,
        status: "processing",
        chunk_count: 0,
        created_at: new Date().toISOString(),
        isUploading: true,
        uploadProgress: activeUpload.progress,
      };
      return [placeholder, ...top.filter((d) => d.original_name !== activeUpload.name)].slice(
        0,
        5
      );
    }

    return top;
  }, [documents, activeUpload]);

  if (status === "loading" || loadingDocs) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-12">
      <div className="mb-8 w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-text-primary">{t("upload.title")}</h1>
        <p className="mt-2 text-text-secondary">{t("upload.subtitle")}</p>
      </div>

      <UploadZoneWithProgress onUpload={handleUpload} />

      {uploadError && (
        <p className="mt-4 max-w-2xl text-center text-sm text-error">{uploadError}</p>
      )}

      <RecentUploadsList items={recentItems} />
    </div>
  );
}
