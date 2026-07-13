"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function scrollPageToTop() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch {
    window.scrollTo(0, 0);
  }

  const root = document.documentElement;
  const body = document.body;
  if (typeof root.scrollTo === "function") {
    try {
      root.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      root.scrollTop = 0;
    }
  } else {
    root.scrollTop = 0;
  }
  body.scrollTop = 0;

  const hero = document.getElementById("hero");
  if (hero) {
    try {
      hero.scrollIntoView({ behavior, block: "start" });
    } catch {
      hero.scrollIntoView(true);
    }
  }
}

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setVisible(y > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollPageToTop();
      }}
      className="scroll-to-top-btn"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>,
    document.body
  );
}
