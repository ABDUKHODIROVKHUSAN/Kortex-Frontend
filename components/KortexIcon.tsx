export function KortexIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-accent-primary"
      aria-hidden
    >
      {/* K — vertical stem */}
      <path
        d="M14 10v28"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* K — upper arm */}
      <path
        d="M14 24L34 10"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* K — lower arm */}
      <path
        d="M14 24L34 38"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* neural nodes */}
      <circle cx="14" cy="24" r="2.5" fill="currentColor" className="text-accent-glow" />
      <circle cx="34" cy="10" r="1.75" fill="currentColor" className="opacity-80" />
      <circle cx="34" cy="38" r="1.75" fill="currentColor" className="opacity-80" />
    </svg>
  );
}
