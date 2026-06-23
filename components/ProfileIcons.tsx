type IconProps = { className?: string };

export function ProfileDocumentsIcon({ className = "" }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M5.5 3.5h6l3.5 3.5v9a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1v-11.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M11.5 3.5v3.5h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function ProfileReadyIcon({ className = "" }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 10.2 8.8 12.5 13.5 7.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileChunksIcon({ className = "" }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ProfileUploadIcon({ className = "" }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M10 13.5V4.5M10 4.5 7 7.5M10 4.5l3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 13.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileHistoryIcon({ className = "" }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 6.5v4l2.5 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileSettingsIcon({ className = "" }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4M15.1 15.1l-1.4-1.4M6.3 6.3 4.9 4.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
