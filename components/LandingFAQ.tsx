"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

const FAQ_KEYS = [
  { q: "landing.faqQ1", a: "landing.faqA1" },
  { q: "landing.faqQ2", a: "landing.faqA2" },
  { q: "landing.faqQ3", a: "landing.faqA3" },
  { q: "landing.faqQ4", a: "landing.faqA4" },
  { q: "landing.faqQ5", a: "landing.faqA5" },
  { q: "landing.faqQ6", a: "landing.faqA6" },
] as const;

export default function LandingFAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="landing-faq-list">
      {FAQ_KEYS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q} className="landing-faq-item">
            <button
              type="button"
              className="landing-faq-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{t(item.q)}</span>
              <span className="landing-faq-icon" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="landing-faq-answer">
                <p>{t(item.a)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
