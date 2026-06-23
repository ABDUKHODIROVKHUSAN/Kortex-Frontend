"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const DropdownContext = createContext<{ close: () => void } | null>(null);

interface HeaderDropdownProps {
  label: ReactNode;
  ariaLabel: string;
  children: ReactNode;
  align?: "left" | "right";
  utility?: boolean;
}

export default function HeaderDropdown({
  label,
  ariaLabel,
  children,
  align = "right",
  utility = false,
}: HeaderDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ close }}>
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`${
            utility ? "header-utility-pill" : "header-dropdown-trigger"
          } rounded-md border px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide backdrop-blur-md transition sm:px-3`}
        >
          <span className="flex items-center gap-1">
            {label}
            <svg
              width="8"
              height="8"
              viewBox="0 0 10 10"
              className={`opacity-50 transition ${open ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </button>

        {open && (
          <div
            className={`header-dropdown-panel absolute top-[calc(100%+6px)] z-50 min-w-[148px] overflow-hidden rounded-xl border border-accent-primary/15 bg-bg-secondary/98 p-1 shadow-glow backdrop-blur-xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownItem({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const ctx = useContext(DropdownContext);

  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        ctx?.close();
      }}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
        active
          ? "bg-accent-primary/10 text-accent-primary"
          : "text-text-secondary hover:bg-bg-tertiary/80 hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

export function FlagCircle({ flag }: { flag: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-tertiary/80 text-sm leading-none">
      {flag}
    </span>
  );
}
