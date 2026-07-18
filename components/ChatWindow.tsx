"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { ChatMessage, Document, RetrievalMeta, SourceChunk } from "@/types";
import { getChatHistory, streamChat, clearChatHistory, getChatUsage } from "@/lib/api";
import MessageBubble from "@/components/MessageBubble";
import ChatUsageBar from "@/components/ChatUsageBar";
import PdfCitationViewer, {
  type PdfCitationTarget,
} from "@/components/PdfCitationViewer";
import { Button, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";
import type { ChatUsage } from "@/types";
import { loadRagSettings } from "@/lib/workspaceSettings";

const DEMO_QUESTIONS_KO = [
  "하이브리드 검색이 왜 필요한가?",
  "Kortex RAG 파이프라인 단계를 말해줘",
  "DEMO-HYBRID-RRF 토큰이 뭐야?",
];

const DEMO_QUESTIONS_EN = [
  "Why is hybrid search needed?",
  "List the Kortex RAG pipeline steps",
  "What is the DEMO-HYBRID-RRF token?",
];

export default function ChatWindow({
  docId,
  document,
}: {
  docId: string;
  document?: Document | null;
}) {
  const { data: session } = useSession();
  const { t, locale } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [streamSources, setStreamSources] = useState<SourceChunk[]>([]);
  const [streamRetrieval, setStreamRetrieval] = useState<RetrievalMeta | null>(null);
  const [lastRetrieval, setLastRetrieval] = useState<RetrievalMeta | null>(null);
  const [streamError, setStreamError] = useState("");
  const [usage, setUsage] = useState<ChatUsage | null>(null);
  const [compactPlaceholder, setCompactPlaceholder] = useState(false);
  const [pdfTarget, setPdfTarget] = useState<PdfCitationTarget | null>(null);
  const [showExcerpts, setShowExcerpts] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const demoQuestions = locale === "ko" ? DEMO_QUESTIONS_KO : DEMO_QUESTIONS_EN;
  const isDemoDoc =
    document?.original_name?.toLowerCase().includes("kortex-sample") ||
    document?.original_name?.includes("데모");

  useEffect(() => {
    setShowExcerpts(loadRagSettings().showSourceExcerpts);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompactPlaceholder(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!session?.accessToken) return;
    Promise.all([
      getChatHistory(session.accessToken, docId),
      getChatUsage(session.accessToken).catch(() => null),
    ])
      .then(([historyRes, usageRes]) => {
        setMessages(historyRes.data);
        if (usageRes?.data) setUsage(usageRes.data);
      })
      .catch(() => {
        setMessages([]);
        setStreamError(t("chat.notFound"));
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, docId, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamContent, scrollToBottom]);

  const openSource = (source: SourceChunk) => {
    if (!document) return;
    setPdfTarget({
      docId,
      fileType: document.file_type,
      source,
    });
  };

  const sendMessage = async (preset?: string) => {
    const query = (preset ?? input).trim();
    if (!query || !session?.accessToken || streaming) return;

    setInput("");
    setStreaming(true);
    setStreamContent("");
    setStreamSources([]);
    setStreamRetrieval(null);
    setStreamError("");

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      document_id: docId,
      role: "user",
      content: query,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    let accumulated = "";

    await streamChat(
      session.accessToken,
      docId,
      query,
      (token) => {
        accumulated += token;
        setStreamContent(accumulated);
      },
      (sources, nextUsage, retrieval) => {
        setStreamSources(sources || []);
        setStreamRetrieval(retrieval ?? null);
        setLastRetrieval(retrieval ?? null);
        if (nextUsage) setUsage(nextUsage);
        const assistantMsg: ChatMessage = {
          id: `temp-a-${Date.now()}`,
          document_id: docId,
          role: "assistant",
          content: accumulated,
          sources: sources || [],
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setStreamContent("");
        setStreaming(false);
      },
      (err) => {
        setStreamError(err);
        setStreaming(false);
        setStreamContent("");
      }
    );
  };

  const handleClearChat = async () => {
    if (!session?.accessToken || streaming) return;
    await clearChatHistory(session.accessToken, docId);
    setMessages([]);
    setStreamError("");
    setLastRetrieval(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="chat-panel flex h-full min-h-0 flex-col">
      <div className="chat-toolbar flex shrink-0 items-start justify-between gap-2 border-b border-border bg-bg-card/95">
        <div className="min-w-0 flex-1">
          <ChatUsageBar usage={usage} />
        </div>
        <div className="shrink-0 pr-2 pt-2 sm:pr-3 sm:pt-2.5">
          <Button
            variant="ghost"
            className="!px-2 !py-1 text-xs sm:!px-3 sm:!py-1.5"
            onClick={handleClearChat}
            disabled={streaming || messages.length === 0}
          >
            {t("chat.clearChat")}
          </Button>
        </div>
      </div>
      <div className="chat-messages-area min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:space-y-5 sm:px-6 sm:py-5">
        {messages.length === 0 && !streaming && (
          <div className="mx-auto max-w-lg text-center">
            <p className="text-text-secondary">{t("chat.emptyPrompt")}</p>
            {(isDemoDoc || locale === "ko") && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {demoQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-border bg-bg-secondary px-3 py-1.5 text-left text-xs text-text-secondary transition hover:border-accent-primary/40 hover:text-accent-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showSources={showExcerpts}
            onOpenSource={document ? openSource : undefined}
            retrieval={
              msg.role === "assistant" && idx === messages.length - 1
                ? lastRetrieval
                : undefined
            }
          />
        ))}
        {streaming && (
          <MessageBubble
            message={{
              role: "assistant",
              content: streamContent,
              sources: streamSources.length ? streamSources : undefined,
            }}
            isStreaming={!streamContent}
            showSources={showExcerpts}
            retrieval={streamRetrieval}
            onOpenSource={document ? openSource : undefined}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {streamError && (
        <div className="shrink-0 border-t border-error/20 bg-error/5 px-4 py-2 text-sm text-error">
          <p>{streamError}</p>
          {(streamError.includes("monthly question limit") ||
            streamError.includes("Upgrade to Pro")) && (
            <Link href="/#pricing" className="mt-1 inline-block font-semibold text-accent-primary hover:underline">
              {t("chat.upgradeNow")}
            </Link>
          )}
        </div>
      )}

      <div className="chat-composer shrink-0 p-3 sm:p-4">
        <div className="flex items-end gap-2 sm:gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              compactPlaceholder
                ? t("chat.inputPlaceholderMobile")
                : t("chat.inputPlaceholder")
            }
            rows={2}
            className="chat-input min-w-0 flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition focus:border-accent-primary/40 focus:ring-1 focus:ring-accent-primary/20 sm:px-4 sm:py-3"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={streaming || !input.trim() || (usage?.requests_remaining ?? 1) <= 0}
            className="btn-primary shrink-0 self-end !px-3 !py-2.5 sm:!px-4"
          >
            {streaming ? <Spinner /> : t("chat.send")}
          </Button>
        </div>
      </div>

      <PdfCitationViewer target={pdfTarget} onClose={() => setPdfTarget(null)} />
    </div>
  );
}
