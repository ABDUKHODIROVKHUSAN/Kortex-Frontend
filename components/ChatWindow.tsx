"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { ChatMessage, SourceChunk } from "@/types";
import { getChatHistory, streamChat, clearChatHistory, getChatUsage } from "@/lib/api";
import MessageBubble from "@/components/MessageBubble";
import ChatUsageBar from "@/components/ChatUsageBar";
import { Button, Spinner } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/context";
import type { ChatUsage } from "@/types";

export default function ChatWindow({ docId }: { docId: string }) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [streamSources, setStreamSources] = useState<SourceChunk[]>([]);
  const [streamError, setStreamError] = useState("");
  const [usage, setUsage] = useState<ChatUsage | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = async () => {
    if (!input.trim() || !session?.accessToken || streaming) return;

    const query = input.trim();
    setInput("");
    setStreaming(true);
    setStreamContent("");
    setStreamSources([]);
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
      (sources, nextUsage) => {
        setStreamSources(sources || []);
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
      <ChatUsageBar usage={usage} />
      <div className="chat-toolbar flex shrink-0 items-center justify-end px-4 py-2">
        <Button
          variant="ghost"
          className="!px-3 !py-1.5 text-xs"
          onClick={handleClearChat}
          disabled={streaming || messages.length === 0}
        >
          {t("chat.clearChat")}
        </Button>
      </div>
      <div className="chat-messages-area flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 && !streaming && (
          <p className="text-center text-text-secondary">
            {t("chat.emptyPrompt")}
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {streaming && (
          <MessageBubble
            message={{
              role: "assistant",
              content: streamContent,
              sources: streamSources.length ? streamSources : undefined,
            }}
            isStreaming={!streamContent}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {streamError && (
        <div className="shrink-0 border-t border-error/20 bg-error/5 px-4 py-2 text-sm text-error">
          <p>{streamError}</p>
          {(streamError.includes("monthly question limit") ||
            streamError.includes("Upgrade to Pro")) && (
            <Link href="/pricing" className="mt-1 inline-block font-semibold text-accent-primary hover:underline">
              {t("chat.upgradeNow")}
            </Link>
          )}
        </div>
      )}

      <div className="chat-composer shrink-0 p-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.inputPlaceholder")}
            rows={2}
            className="chat-input flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none transition focus:border-accent-primary/40 focus:ring-1 focus:ring-accent-primary/20"
          />
          <Button
            onClick={sendMessage}
            disabled={streaming || !input.trim() || (usage?.requests_remaining ?? 1) <= 0}
            className="btn-primary shrink-0 self-end"
          >
            {streaming ? <Spinner /> : t("chat.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}
