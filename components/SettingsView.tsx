"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui";
import SignOutButton from "@/components/SignOutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { loadRagSettings, saveRagSettings } from "@/lib/workspaceSettings";
import { useTranslation } from "@/lib/i18n/context";
import type { RagSettings } from "@/types";
import { DEFAULT_RAG_SETTINGS } from "@/types";

export default function SettingsView() {
  const { t } = useTranslation();
  const [rag, setRag] = useState<RagSettings>(DEFAULT_RAG_SETTINGS);

  useEffect(() => {
    setRag(loadRagSettings());
  }, []);

  const updateRag = (patch: Partial<RagSettings>) => {
    setRag((prev) => {
      const next = { ...prev, ...patch };
      saveRagSettings(next);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {t("workspace.settingsTitle")}
        </h1>
        <p className="mt-1 text-text-secondary">{t("workspace.settingsSubtitle")}</p>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-text-secondary">
            {t("workspace.profileShortcut")}
          </h2>
          <p className="mb-4 text-sm text-text-muted">{t("workspace.profileShortcutDesc")}</p>
          <Link
            href="/profile"
            className="site-header-signup inline-flex items-center justify-center !px-4 !py-2 text-sm"
          >
            {t("workspace.manageProfile")} →
          </Link>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-text-secondary">
            {t("workspace.languageSection")}
          </h2>
          <p className="mb-4 text-sm text-text-muted">{t("workspace.languageDesc")}</p>
          <LanguageSwitcher fullWidth />
        </GlassCard>

        <GlassCard>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-text-secondary">
            {t("workspace.aiRetrieval")}
          </h2>
          <p className="mb-4 text-sm text-text-muted">{t("workspace.aiRetrievalDesc")}</p>

          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center justify-between text-sm text-text-secondary">
                <span>{t("workspace.chunkSize")}</span>
                <span className="font-mono text-xs text-accent-primary">{rag.chunkSize}</span>
              </label>
              <input
                type="range"
                min={256}
                max={2048}
                step={64}
                value={rag.chunkSize}
                onChange={(e) => updateRag({ chunkSize: Number(e.target.value) })}
                className="w-full accent-accent-primary"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center justify-between text-sm text-text-secondary">
                <span>{t("workspace.chunkOverlap")}</span>
                <span className="font-mono text-xs text-accent-primary">{rag.chunkOverlap}</span>
              </label>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={rag.chunkOverlap}
                onChange={(e) => updateRag({ chunkOverlap: Number(e.target.value) })}
                className="w-full accent-accent-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-text-secondary">
                {t("workspace.responseStyle")}
              </label>
              <select
                value={rag.responseStyle}
                onChange={(e) =>
                  updateRag({
                    responseStyle: e.target.value as RagSettings["responseStyle"],
                  })
                }
                className="themed-input w-full rounded-lg px-3 py-3 text-sm"
              >
                <option value="concise">{t("workspace.responseConcise")}</option>
                <option value="detailed">{t("workspace.responseDetailed")}</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span className="text-sm text-text-secondary">
                {t("workspace.showSourceExcerpts")}
              </span>
              <input
                type="checkbox"
                checked={rag.showSourceExcerpts}
                onChange={(e) => updateRag({ showSourceExcerpts: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-accent-primary"
              />
            </label>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-text-secondary">
            {t("workspace.accountSection")}
          </h2>
          <p className="mb-4 text-sm text-text-muted">{t("workspace.accountDesc")}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="btn-secondary-themed inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition hover:border-accent-primary/30 hover:text-accent-primary"
            >
              {t("workspace.manageProfile")}
            </Link>
            <SignOutButton variant="secondary" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
