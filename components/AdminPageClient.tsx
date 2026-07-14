"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminUnlockDialog, {
  isAdminUnlocked,
  setAdminUnlocked,
} from "@/components/AdminUnlockDialog";

export default function AdminPageClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    const ok = isAdminUnlocked();
    setUnlocked(ok);
    setGateOpen(!ok);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary/20 border-t-accent-primary" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <AdminUnlockDialog
        open={gateOpen}
        onClose={() => {
          setGateOpen(false);
          router.push("/");
        }}
        onUnlocked={() => {
          setAdminUnlocked(true);
          setUnlocked(true);
          setGateOpen(false);
        }}
      />
    );
  }

  return <>{children}</>;
}
