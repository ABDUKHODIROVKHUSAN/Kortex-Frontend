"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMe } from "@/lib/api";

export function useUserAvatar() {
  const { data: session } = useSession();
  const avatarVersion = (session?.user as { avatarVersion?: number } | undefined)
    ?.avatarVersion;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) {
      setAvatarUrl(null);
      return;
    }

    let cancelled = false;
    getMe(session.accessToken)
      .then((res) => {
        if (!cancelled) setAvatarUrl(res.data?.avatar_url ?? null);
      })
      .catch(() => {
        if (!cancelled) setAvatarUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.accessToken, avatarVersion]);

  return avatarUrl;
}
