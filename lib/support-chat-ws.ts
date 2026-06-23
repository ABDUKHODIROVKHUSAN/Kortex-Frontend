import { API_URL } from "@/lib/backend-health";

/** WebSocket URL for the Kortex support chat widget (FastAPI backend). */
export function getSupportChatWsUrl(): string {
  const base = API_URL.replace(/\/$/, "");
  if (base.startsWith("https://")) {
    return base.replace(/^https:/, "wss:") + "/support/ws";
  }
  if (base.startsWith("http://")) {
    return base.replace(/^http:/, "ws:") + "/support/ws";
  }
  return `ws://${base}/support/ws`;
}

export type SupportChatOutbound =
  | { type: "message"; content: string }
  | { type: "ping" };

export type SupportChatInbound =
  | { type: "token"; content: string }
  | { type: "done" }
  | { type: "error"; message: string }
  | { type: "pong" };
