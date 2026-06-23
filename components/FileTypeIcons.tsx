export function PdfFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M4 2.5h6.5L14 6v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M10 2.5V6.5H14" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.5 9.5h7M5.5 11.5h5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DocxFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M4 2.5h6.5L14 6v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M10 2.5V6.5H14" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.5 9h2l.75 2.5L9 9h2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FileTypeIcon({
  type,
  className = "",
}: {
  type: "pdf" | "docx";
  className?: string;
}) {
  if (type === "pdf") return <PdfFileIcon className={className} />;
  return <DocxFileIcon className={className} />;
}
