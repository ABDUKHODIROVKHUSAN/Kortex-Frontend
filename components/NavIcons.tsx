export function AskNavIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2.5 3.5h11a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H6l-2.5 2v-2h-1a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WorkspaceNavIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2.5 4.5A1.5 1.5 0 0 1 4 3h8a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6 3v2.5M10 3v2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
