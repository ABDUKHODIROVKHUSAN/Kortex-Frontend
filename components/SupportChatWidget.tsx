"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SupportBotIcon } from "@/components/SupportBotIcon";
import {
  getSupportChatWsUrl,
  type SupportChatInbound,
  type SupportChatOutbound,
} from "@/lib/support-chat-ws";

const SUPPORT_CHAT_PATHS = ["/", "/pricing", "/docs"];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function SupportChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [typing, setTyping] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamIdRef = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reconnectTimer = useRef<number | null>(null);
  const shouldConnectRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleInbound = useCallback((payload: SupportChatInbound) => {
    if (payload.type === "token") {
      setTyping(false);
      const streamId = streamIdRef.current;
      if (!streamId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId ? { ...m, content: m.content + payload.content } : m
        )
      );
      return;
    }

    if (payload.type === "error") {
      setTyping(false);
      setStreaming(false);
      const streamId = streamIdRef.current;
      if (streamId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? { ...m, content: m.content || payload.message }
              : m
          )
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: payload.message },
        ]);
      }
      streamIdRef.current = null;
      return;
    }

    if (payload.type === "done") {
      setTyping(false);
      setStreaming(false);
      streamIdRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    setConnecting(true);
    const ws = new WebSocket(getSupportChatWsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      setConnecting(false);
      setReconnecting(false);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as SupportChatInbound;
        handleInbound(payload);
      } catch {
        /* ignore malformed frames */
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      setConnecting(false);
      setStreaming(false);
      setTyping(false);
      streamIdRef.current = null;

      if (shouldConnectRef.current) {
        setReconnecting(true);
        reconnectTimer.current = window.setTimeout(() => {
          connect();
        }, 2000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [handleInbound]);

  useEffect(() => {
    if (!open) return;
    shouldConnectRef.current = true;
    connect();

    return () => {
      shouldConnectRef.current = false;
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [open, connect]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || streaming) return;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content: "Not connected — reconnecting… please try again in a moment.",
        },
      ]);
      connect();
      return;
    }

    const userMsg: ChatMessage = { id: newId(), role: "user", content: text };
    const assistantId = newId();
    streamIdRef.current = assistantId;

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setStreaming(true);
    setTyping(true);

    const payload: SupportChatOutbound = { type: "message", content: text };
    ws.send(JSON.stringify(payload));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!SUPPORT_CHAT_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <div className="support-chat-widget pointer-events-none fixed bottom-6 right-6 z-50">
      <div
        className={`support-chat-panel pointer-events-auto absolute bottom-[calc(100%+12px)] right-0 flex w-[360px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-accent-primary/15 bg-bg-card shadow-glow-lg transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ height: 480 }}
        aria-hidden={!open}
      >
        <header className="support-chat-header flex shrink-0 items-center justify-between border-b border-border/80 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-primary/25 bg-accent-primary/10">
              <SupportBotIcon size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-text-primary">Kortex</p>
              <p className="text-[11px] text-text-muted">Support assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-bg-tertiary/80 hover:text-text-primary"
            aria-label="Close support chat"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {reconnecting && (
          <p className="shrink-0 border-b border-border/60 bg-bg-secondary/50 px-4 py-1.5 text-center text-[11px] text-text-muted">
            Reconnecting…
          </p>
        )}

        <div
          ref={listRef}
          className="support-chat-messages min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 && (
            <p className="text-center text-sm leading-relaxed text-text-secondary">
              Ask about pricing, features, how Kortex works, or where to find things on
              the site.
            </p>
          )}
          {messages.map((msg) => {
            if (msg.role === "assistant" && !msg.content && typing) {
              return null;
            }
            return (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "support-chat-bubble-user border border-accent-primary/30 bg-accent-primary/10 text-text-primary"
                    : "support-chat-bubble-assistant border border-border bg-bg-secondary/60 text-text-primary"
                }`}
              >
                {msg.content}
              </div>
            </div>
            );
          })}
          {typing && (
            <div className="flex justify-start">
              <div className="support-chat-bubble-assistant flex items-center gap-1 rounded-xl border border-border bg-bg-secondary/60 px-3 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-primary [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-primary [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-primary [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="support-chat-composer shrink-0 border-t border-border/80 p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Kortex…"
              rows={2}
              disabled={streaming && connecting}
              className="chat-input min-h-[44px] flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="btn-primary flex h-[44px] w-[44px] shrink-0 items-center justify-center self-end rounded-xl border border-accent-primary/40 disabled:opacity-50"
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path
                  d="M3 9h10M10 5l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="support-chat-toggle pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent-primary/30 bg-bg-card text-accent-primary shadow-glow transition hover:border-accent-primary/50 hover:shadow-glow-lg"
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M6 6l10 10M16 6L6 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <SupportBotIcon size={24} />
        )}
      </button>
    </div>
  );
}
