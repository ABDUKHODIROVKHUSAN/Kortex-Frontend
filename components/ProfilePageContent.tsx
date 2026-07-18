"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { GlassCard, Button, Spinner, Badge, Input } from "@/components/ui";
import { KortexLogo } from "@/components/KortexLogo";
import SignOutButton from "@/components/SignOutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ProfileChunksIcon,
  ProfileDocumentsIcon,
  ProfileHistoryIcon,
  ProfileReadyIcon,
  ProfileSettingsIcon,
  ProfileUploadIcon,
} from "@/components/ProfileIcons";
import { getMe, listDocuments, updateProfile } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/context";
import type { Document, User } from "@/types";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <GlassCard className="text-center !p-5">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary">
        {icon}
      </div>
      <p className="text-2xl font-bold text-accent-primary">{value}</p>
      <p className="mt-1 text-xs text-text-secondary">{label}</p>
    </GlassCard>
  );
}

function QuickActionCard({
  href,
  label,
  desc,
  icon,
}: {
  href: string;
  label: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="feature-card group flex items-center gap-4 p-5 transition hover:border-accent-primary/25 hover:shadow-glow"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary transition group-hover:shadow-glow">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-text-primary group-hover:text-accent-primary">
          {label}
        </p>
        <p className="truncate text-xs text-text-secondary">{desc}</p>
      </div>
    </Link>
  );
}

export default function ProfilePageContent() {
  const { data: session, status, update } = useSession();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: null as string | null,
  });

  useEffect(() => {
    if (!session?.accessToken) {
      setLoadingDocs(false);
      return;
    }
    Promise.all([
      listDocuments(session.accessToken).catch(() => ({ data: [] })),
      getMe(session.accessToken).catch(() => null),
    ])
      .then(([docsRes, meRes]) => {
        setDocuments(docsRes.data || []);
        if (meRes?.data) {
          setProfile(meRes.data);
          setForm({
            full_name: meRes.data.full_name,
            email: meRes.data.email,
            phone: meRes.data.phone || "",
            avatar_url: meRes.data.avatar_url || null,
          });
        }
      })
      .finally(() => setLoadingDocs(false));
  }, [session?.accessToken]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(""), 4000);
    return () => window.clearTimeout(timer);
  }, [success]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const readyCount = documents.filter((d) => d.status === "ready").length;
  const totalChunks = documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0);
  const displayName = editing ? form.full_name : profile?.full_name || session?.user?.name || "";
  const displayEmail = editing ? form.email : profile?.email || session?.user?.email || "";
  const displayPhone = editing ? form.phone : profile?.phone || session?.user?.phone || "";
  const avatar = editing ? form.avatar_url : profile?.avatar_url || session?.user?.image || null;
  const userId = profile?.id || session?.user?.id || "";
  const subscriptionTier = profile?.subscription_tier || session?.user?.subscriptionTier || "free";
  const initial = displayName[0]?.toUpperCase() || "U";

  const quickActions = [
    {
      href: "/dashboard",
      label: t("profile.viewDocuments"),
      desc: t("profile.documentsTab"),
      icon: <ProfileDocumentsIcon />,
    },
    {
      href: "/upload",
      label: t("profile.uploadDoc"),
      desc: t("profile.uploadsTab"),
      icon: <ProfileUploadIcon />,
    },
    {
      href: "/workspace/history",
      label: t("profile.historyTab"),
      desc: t("workspace.historySubtitle"),
      icon: <ProfileHistoryIcon />,
    },
    {
      href: "/workspace/settings",
      label: t("profile.settingsTab"),
      desc: t("profile.workspaceSettingsDesc"),
      icon: <ProfileSettingsIcon />,
    },
  ];

  const startEdit = () => {
    setForm({
      full_name: profile?.full_name || session?.user?.name || "",
      email: profile?.email || session?.user?.email || "",
      phone: profile?.phone || session?.user?.phone || "",
      avatar_url: profile?.avatar_url || session?.user?.image || null,
    });
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError("");
  };

  const handlePhoto = (file: File | null) => {
    if (!file || !editing) return;
    if (file.size > 2 * 1024 * 1024) {
      setError(t("profile.photoTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, avatar_url: reader.result as string }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await updateProfile(session.accessToken, {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        avatar_url: form.avatar_url,
      });
      setProfile(res.data);
      await update({
        name: res.data.full_name,
        email: res.data.email,
        phone: res.data.phone,
        avatarVersion: Date.now(),
      });
      setEditing(false);
      setSuccess(t("profile.updateSuccess"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profile.updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {success && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-accent-primary/30 bg-accent-primary/10 px-4 py-3 text-sm text-accent-primary"
        >
          {success}
        </div>
      )}

      <GlassCard className="relative mb-8 overflow-hidden !p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/5" />
        <div className="relative p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-primary">
              {t("profile.accountDetails")}
            </h2>
            {editing ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="!px-3 !py-1.5 text-xs"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  {t("profile.cancel")}
                </Button>
                <Button
                  className="!px-3 !py-1.5 text-xs"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <Spinner /> : t("profile.saveChanges")}
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                className="!px-3 !py-1.5 text-xs"
                onClick={startEdit}
              >
                {t("profile.edit")}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              {avatar ? (
                <Image
                  src={avatar}
                  alt=""
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-2xl border border-accent-primary/30 object-cover shadow-glow"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-accent-primary/30 bg-accent-primary/10 text-3xl font-bold text-accent-primary shadow-glow">
                  {initial}
                </div>
              )}
              {editing && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 rounded-full border border-accent-primary/40 bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-accent-primary shadow-glow"
                  >
                    {t("profile.uploadPhoto")}
                  </button>
                </>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">{displayName}</h1>
                <Link href="/#pricing">
                  <Badge color="success">
                    {t(
                      subscriptionTier === "pro"
                        ? "profile.pro"
                        : subscriptionTier === "business"
                          ? "profile.business"
                          : "profile.free"
                    )}
                  </Badge>
                </Link>
              </div>
              <p className="text-sm text-text-secondary">{displayEmail}</p>
              {displayPhone && (
                <p className="mt-1 text-sm text-text-muted">{displayPhone}</p>
              )}
              <p className="mt-2 text-sm text-text-muted">{t("profile.subtitle")}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border/70 pt-6">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">
                    {t("auth.fullName")}
                  </label>
                  <Input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, full_name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">
                    {t("profile.email")}
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">
                    {t("profile.phone")}
                  </label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder={t("profile.phonePlaceholder")}
                  />
                </div>
                {form.avatar_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setForm((p) => ({ ...p, avatar_url: null }))}
                  >
                    {t("profile.removePhoto")}
                  </Button>
                )}
              </div>
            ) : (
              <dl className="space-y-3 text-sm">
                {session?.user?.isAdmin && userId && (
                  <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                    <dt className="text-text-muted">{t("profile.userId")}</dt>
                    <dd className="truncate font-mono text-xs text-text-primary">
                      {userId}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-text-muted">{t("auth.fullName")}</dt>
                  <dd className="text-text-primary">{displayName}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-text-muted">{t("profile.email")}</dt>
                  <dd className="truncate text-text-primary">{displayEmail}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-text-muted">{t("profile.phone")}</dt>
                  <dd className="text-text-primary">
                    {displayPhone || t("profile.noPhone")}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-text-muted">{t("profile.plan")}</dt>
                  <dd className="flex items-center gap-2">
                    <span className="text-accent-primary">
                      {t(
                        subscriptionTier === "pro"
                          ? "profile.pro"
                          : subscriptionTier === "business"
                            ? "profile.business"
                            : "profile.free"
                      )}
                    </span>
                    <Link
                      href="/#pricing"
                      className="text-xs text-text-secondary transition hover:text-accent-primary"
                    >
                      {t("profile.upgradePlan")} →
                    </Link>
                  </dd>
                </div>
              </dl>
            )}
            {error && <p className="mt-4 text-sm text-error">{error}</p>}
          </div>
        </div>
      </GlassCard>

      {loadingDocs ? (
        <div className="mb-8 flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label={t("profile.statsDocuments")}
            value={documents.length}
            icon={<ProfileDocumentsIcon />}
          />
          <StatCard
            label={t("profile.statsReady")}
            value={readyCount}
            icon={<ProfileReadyIcon />}
          />
          <StatCard
            label={t("profile.statsChunks")}
            value={totalChunks}
            icon={<ProfileChunksIcon />}
          />
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          {t("profile.quickActions")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <QuickActionCard key={action.href} {...action} />
          ))}
        </div>
      </div>

      <div id="preferences" className="scroll-mt-24">
        <GlassCard className="mb-6">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-accent-primary">
          {t("profile.preferences")}
        </h2>
        <p className="mb-5 text-sm text-text-muted">{t("profile.preferencesDesc")}</p>
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs text-text-muted">{t("profile.language")}</p>
            <LanguageSwitcher fullWidth />
          </div>
        </div>
        <Link
          href="/workspace/settings"
          className="mt-5 inline-flex items-center gap-1 text-sm text-accent-primary transition hover:underline"
        >
          {t("profile.workspaceSettingsLink")} →
        </Link>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          {t("profile.sessionTitle")}
        </h2>
        <p className="mb-4 text-sm text-text-secondary">{t("profile.signOutDesc")}</p>
        <SignOutButton variant="secondary" className="w-full sm:w-auto" />
      </GlassCard>

      <div className="mt-8 flex justify-center opacity-30">
        <KortexLogo size="sm" />
      </div>
    </div>
  );
}
