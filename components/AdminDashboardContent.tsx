"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getAdminFailures,
  getAdminStats,
  getAdminUsers,
  markAdminFailureRead,
  markAllAdminFailuresRead,
} from "@/lib/api";
import type { AdminFailureItem, AdminStats, AdminUserItem } from "@/types";
import { Button, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";

export default function AdminDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [failures, setFailures] = useState<AdminFailureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, failuresRes] = await Promise.all([
        getAdminStats(session.accessToken),
        getAdminUsers(session.accessToken),
        getAdminFailures(session.accessToken),
      ]);
      setStats(statsRes.data ?? null);
      setUsers(usersRes.data ?? []);
      setFailures(failuresRes.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, t]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!session.user?.isAdmin) {
      router.replace("/");
      return;
    }
    void load();
  }, [status, session, router, load]);

  useEffect(() => {
    if (!session?.user?.isAdmin || !session.accessToken) return;
    const id = window.setInterval(() => {
      void load();
    }, 15000);
    return () => window.clearInterval(id);
  }, [session?.user?.isAdmin, session?.accessToken, load]);

  const handleMarkRead = async (id: string) => {
    if (!session?.accessToken) return;
    setBusyId(id);
    try {
      await markAdminFailureRead(session.accessToken, id);
      setFailures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_read: true } : f))
      );
      setStats((prev) =>
        prev
          ? {
              ...prev,
              unread_failures: Math.max(0, prev.unread_failures - 1),
            }
          : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.loadFailed"));
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAll = async () => {
    if (!session?.accessToken) return;
    setBusyId("all");
    try {
      await markAllAdminFailuresRead(session.accessToken);
      setFailures((prev) => prev.map((f) => ({ ...f, is_read: true })));
      setStats((prev) => (prev ? { ...prev, unread_failures: 0 } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.loadFailed"));
    } finally {
      setBusyId(null);
    }
  };

  if (status === "loading" || (session?.user?.isAdmin && loading && !stats)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-primary">
            {t("admin.badge")}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-text-primary">{t("admin.title")}</h1>
          <p className="mt-2 text-sm text-text-secondary">{t("admin.subtitle")}</p>
        </div>
        <Button variant="secondary" onClick={() => void load()} disabled={loading}>
          {loading ? <Spinner /> : t("admin.refresh")}
        </Button>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.totalUsers")} value={stats?.total_users ?? 0} />
        <StatCard label={t("admin.totalDocuments")} value={stats?.total_documents ?? 0} />
        <StatCard
          label={t("admin.planBreakdown")}
          value={`${stats?.free_users ?? 0} / ${stats?.pro_users ?? 0} / ${stats?.business_users ?? 0}`}
          hint={t("admin.planHint")}
        />
        <StatCard
          label={t("admin.unreadFailures")}
          value={stats?.unread_failures ?? 0}
          accent={!!stats?.unread_failures}
        />
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-text-primary">{t("admin.failuresTitle")}</h2>
          <Button
            variant="secondary"
            className="!px-3 !py-1.5 text-xs"
            onClick={() => void handleMarkAll()}
            disabled={busyId === "all" || !stats?.unread_failures}
          >
            {t("admin.markAllRead")}
          </Button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
          {failures.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-text-muted">
              {t("admin.noFailures")}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {failures.map((f) => (
                <li
                  key={f.id}
                  className={`px-5 py-4 ${f.is_read ? "opacity-70" : "bg-accent-primary/[0.03]"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {!f.is_read && (
                          <span className="rounded-full bg-error/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-error">
                            {t("admin.new")}
                          </span>
                        )}
                        <span className="text-xs font-semibold uppercase tracking-wide text-accent-primary">
                          {f.error_type.replaceAll("_", " ")}
                        </span>
                        <span className="text-xs text-text-muted">
                          {f.created_at ? new Date(f.created_at).toLocaleString() : ""}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-text-primary">
                        {f.user_email || t("admin.unknownUser")}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-text-secondary">
                        {f.message}
                      </p>
                      {f.query_preview && (
                        <p className="mt-2 text-xs text-text-muted">
                          {t("admin.query")}: {f.query_preview}
                        </p>
                      )}
                    </div>
                    {!f.is_read && (
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1.5 text-xs"
                        disabled={busyId === f.id}
                        onClick={() => void handleMarkRead(f.id)}
                      >
                        {t("admin.markRead")}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-text-primary">{t("admin.usersTitle")}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-bg-card">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-bg-tertiary/60 text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("admin.colName")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.colEmail")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.colPlan")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.colDocs")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.colJoined")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {u.full_name}
                    {u.is_admin && (
                      <span className="ml-2 rounded-full bg-accent-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-primary">
                        {t("admin.badge")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-text-primary">
                    {u.subscription_tier}
                  </td>
                  <td className="px-4 py-3 text-text-primary">{u.document_count}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${
        accent
          ? "border-error/30 bg-error/5"
          : "border-border bg-bg-card"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
