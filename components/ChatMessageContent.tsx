"use client";

import type { ReactNode } from "react";

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparatorRow(line: string): boolean {
  const cells = parseTableRow(line);
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

function renderTable(lines: string[], key: number): ReactNode {
  const rows = lines.map(parseTableRow).filter((row) => row.some(Boolean));
  if (rows.length === 0) return null;

  const header = rows[0];
  const bodyStart = rows.length > 1 && isSeparatorRow(lines[1]) ? 2 : 1;
  const body = rows.slice(bodyStart);

  return (
    <div key={key} className="chat-table-wrap">
      <table className="chat-table">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChatMessageContent({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join("\n").trimEnd();
    if (text) {
      blocks.push(
        <p key={blocks.length} className="chat-message-paragraph whitespace-pre-wrap">
          {text}
        </p>
      );
    }
    paragraph = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.includes("|", 1)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      flushParagraph();
      const table = renderTable(tableLines, blocks.length);
      if (table) blocks.push(table);
      continue;
    }

    paragraph.push(line);
    i += 1;
  }

  flushParagraph();

  return <div className="chat-message-content">{blocks}</div>;
}
