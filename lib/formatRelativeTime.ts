type RelativeLabels = {
  justNow: string;
  minutesAgo: (count: number) => string;
  hoursAgo: (count: number) => string;
  daysAgo: (count: number) => string;
};

export function formatRelativeTime(iso: string, labels: RelativeLabels): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 60_000) return labels.justNow;

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return labels.minutesAgo(minutes);

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return labels.hoursAgo(hours);

  const days = Math.floor(hours / 24);
  return labels.daysAgo(days);
}
