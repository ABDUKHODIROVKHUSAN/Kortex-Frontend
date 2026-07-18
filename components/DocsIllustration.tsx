"use client";

/** Animated document stack for the Documentation section. */
export default function DocsIllustration() {
  return (
    <div className="docs-illustration" aria-hidden>
      <div className="docs-illustration-glow" />

      <div className="docs-card docs-card-back">
        <div className="docs-card-lines">
          <span />
          <span />
          <span />
          <span className="short" />
        </div>
      </div>

      <div className="docs-card docs-card-mid">
        <div className="docs-card-badge">PDF</div>
        <div className="docs-card-lines">
          <span />
          <span />
          <span className="short" />
          <span />
        </div>
      </div>

      <div className="docs-card docs-card-front">
        <div className="docs-card-header">
          <span className="docs-card-dot" />
          <span className="docs-card-title">Kortex Doc</span>
        </div>
        <div className="docs-card-lines">
          <span />
          <span />
          <span className="accent" />
          <span />
          <span className="short" />
        </div>
        <div className="docs-card-cite">
          <span className="docs-cite-chip">[Page 3]</span>
          <span className="docs-cite-chip">[Page 12]</span>
        </div>
      </div>

      <div className="docs-float docs-float-q">?</div>
      <div className="docs-float docs-float-check">✓</div>
    </div>
  );
}
