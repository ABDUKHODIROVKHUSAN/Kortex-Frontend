/** AI assistant bot icon for the support chat widget toggle and header. */
export function SupportBotIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-accent-primary"
      aria-hidden
    >
      {/* antenna + spark */}
      <path
        d="M12 3v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="2.25" r="1.1" fill="currentColor" className="text-accent-glow" />
      <path
        d="M14.2 2.8l.6-.9M9.8 2.8l-.6-.9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="opacity-70"
      />
      {/* head */}
      <rect
        x="5"
        y="7"
        width="14"
        height="11"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      {/* face panel */}
      <rect
        x="7.5"
        y="9.5"
        width="9"
        height="6.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
        className="opacity-55"
      />
      {/* eyes */}
      <circle cx="10" cy="12.5" r="1.15" fill="currentColor" />
      <circle cx="14" cy="12.5" r="1.15" fill="currentColor" />
      {/* mouth */}
      <path
        d="M10.2 15.2c.8.55 2.8.55 3.6 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* side ears / nodes */}
      <circle cx="3.6" cy="12" r="1" fill="currentColor" className="opacity-75" />
      <circle cx="20.4" cy="12" r="1" fill="currentColor" className="opacity-75" />
    </svg>
  );
}
