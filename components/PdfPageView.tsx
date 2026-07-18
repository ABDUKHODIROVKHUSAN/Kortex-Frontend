"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPageView({
  fileUrl,
  pageNumber,
  highlightTerms = [],
}: {
  fileUrl: string;
  pageNumber: number;
  highlightTerms?: string[];
}) {
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(640);
  const safePage = Math.min(Math.max(1, pageNumber), numPages || pageNumber);

  const customTextRenderer = ({ str }: { str: string }) => {
    if (!highlightTerms.length) return str;
    const lower = str.toLowerCase();
    const hit = highlightTerms.some((term) => lower.includes(term.toLowerCase()));
    if (!hit) return str;
    return `<mark class="pdf-cite-mark">${str}</mark>`;
  };

  return (
    <div
      className="pdf-cite-wrap mx-auto"
      ref={(el) => {
        if (!el) return;
        const next = Math.min(720, Math.max(280, el.clientWidth));
        if (next !== width) setWidth(next);
      }}
    >
      <Document
        file={fileUrl}
        loading={
          <div className="flex h-64 items-center justify-center text-sm text-text-secondary">
            Rendering…
          </div>
        }
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        error={
          <div className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
            Could not render this PDF page.
          </div>
        }
      >
        <Page
          pageNumber={safePage}
          width={width}
          renderAnnotationLayer
          renderTextLayer
          customTextRenderer={customTextRenderer}
          className="pdf-cite-page overflow-hidden rounded-lg border border-border bg-white shadow-sm"
        />
      </Document>
      {numPages > 0 && (
        <p className="mt-2 text-center text-xs text-text-muted">
          {safePage} / {numPages}
        </p>
      )}
    </div>
  );
}
