"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMe } from "@/lib/api";

const avatarCache = new Map<string, { url: string | null; version: number }>();

function getCachedAvatar(userId: string | undefined, version: number, sessionImage: string | null) {
  if (!userId) return sessionImage;
  const cached = avatarCache.get(userId);
  if (cached && cached.version === version) return cached.url;
  return sessionImage;
}

export function useUserAvatar() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const avatarVersion = session?.user?.avatarVersion ?? 0;
  const sessionImage = session?.user?.image ?? null;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(() =>
    getCachedAvatar(userId, avatarVersion, sessionImage)
  );

  useEffect(() => {
    if (!session?.accessToken || !userId) {
      setAvatarUrl(null);
      return;
    }

    const cached = avatarCache.get(userId);
    if (cached && cached.version === avatarVersion) {
      setAvatarUrl(cached.url);
      return;
    }

    let cancelled = false;
    getMe(session.accessToken)
      .then((res) => {
        const url = res.data?.avatar_url ?? sessionImage ?? null;
        if (!cancelled) {
          avatarCache.set(userId, { url, version: avatarVersion });
          setAvatarUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const url = sessionImage ?? null;
          avatarCache.set(userId, { url, version: avatarVersion });
          setAvatarUrl(url);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.accessToken, userId, avatarVersion, sessionImage]);

  return avatarUrl;
}
