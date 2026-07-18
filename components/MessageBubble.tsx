"use client";

import type { ChatMessage, RetrievalMeta, SourceChunk } from "@/types";
import SourceCitation from "@/components/SourceCitation";
import ChatMessageContent from "@/components/ChatMessageContent";
import { KortexIcon } from "@/components/KortexIcon";
import { useTranslation } from "@/lib/i18n/context";
import { loadRagSettings } from "@/lib/workspaceSettings";

export default function MessageBubble({
  message,
  isStreaming,
  retrieval,
  onOpenSource,
  showSources,
}: {
  message:
    | ChatMessage
    | {
        role: "user" | "assistant";
        content: string;
        sources?: ChatMessage["sources"];
      };
  isStreaming?: boolean;
  retrieval?: RetrievalMeta | null;
  onOpenSource?: (source: SourceChunk) => void;
  showSources?: boolean;
}) {
  const { t } = useTranslation();
  const isUser = message.role === "user";
  const excerptsEnabled =
    showSources ?? (typeof window !== "undefined" ? loadRagSettings().showSourceExcerpts : true);

  return (
    <div className={`chat-message-row flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          isUser
            ? "message-bubble-user max-w-[min(100%,28rem)]"
            : "message-bubble-assistant max-w-full sm:max-w-[min(96%,40rem)]"
        } min-w-0 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${!isUser ? "!p-3 sm:!p-4" : ""}`}
      >
        {!isUser && (
          <div className="mb-2.5 flex items-center gap-2 border-b border-border/60 pb-2">
            <KortexIcon size={16} />
            <span className="text-xs font-semibold tracking-wide text-text-secondary">
              {t("brand")}
            </span>
            {retrieval && (
              <span className="ml-auto rounded-md bg-accent-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-primary">
                {t("chat.retrievalBadge", {
                  method: retrieval.method,
                  ms: retrieval.latency_ms,
                  count: retrieval.chunk_count,
                })}
              </span>
            )}
          </div>
        )}
        {isUser && (
          <p className="chat-user-label mb-1 text-[10px] font-semibold uppercase tracking-wider">
            {t("chat.you")}
          </p>
        )}
        <ChatMessageContent content={message.content} />
        {isStreaming && !message.content && (
          <div className="flex gap-1 py-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent-primary [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent-primary [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent-primary [animation-delay:300ms]" />
          </div>
        )}
        {!isUser && excerptsEnabled && message.sources && (
          <SourceCitation sources={message.sources} onOpenSource={onOpenSource} />
        )}
      </div>
    </div>
  );
}
