import type {
  ApiResponse,
  AnalyticsSummary,
  AdminFailureItem,
  AdminStats,
  AdminUserItem,
  ChatMessage,
  ChatSessionSummary,
  ChatUsage,
  Document,
  DocumentChatStats,
  TokenData,
  UpgradeTierResponse,
  User,
} from "@/types";
import { API_URL, BACKEND_UNREACHABLE } from "@/lib/backend-health";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      const detail = err.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(", ")
            : err.message || "Request failed";
      throw new Error(message);
    }

    return res.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(BACKEND_UNREACHABLE);
    }
    throw error;
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
}): Promise<ApiResponse<TokenData>> {
  return apiFetch<TokenData>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<ApiResponse<TokenData>> {
  return apiFetch<TokenData>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(token: string): Promise<ApiResponse<User>> {
  return apiFetch<User>("/auth/me", {}, token);
}

export async function upgradeTier(
  token: string,
  tier: "free" | "pro" | "business"
): Promise<UpgradeTierResponse> {
  const res = await fetch(`${API_URL}/api/upgrade-tier`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tier }),
  });

  const json = await res.json().catch(() => ({
    success: false,
    message: "Request failed",
    userTier: "",
  }));

  if (!res.ok) {
    return {
      success: false,
      message: json.detail || json.message || "Upgrade failed",
      userTier: "",
    };
  }

  return json as UpgradeTierResponse;
}

export async function updateProfile(
  token: string,
  data: {
    email?: string;
    full_name?: string;
    phone?: string | null;
    avatar_url?: string | null;
  }
): Promise<ApiResponse<User>> {
  return apiFetch<User>(
    "/auth/me",
    { method: "PATCH", body: JSON.stringify(data) },
    token
  );
}

export async function listDocuments(token: string): Promise<ApiResponse<Document[]>> {
  return apiFetch<Document[]>("/documents/", {}, token);
}

export async function getDocument(
  token: string,
  docId: string
): Promise<ApiResponse<Document>> {
  return apiFetch<Document>(`/documents/${docId}`, {}, token);
}

export async function uploadDocument(
  token: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<ApiResponse<Document>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(json);
        } else {
          reject(new Error(json.detail || json.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error(BACKEND_UNREACHABLE)));
    xhr.open("POST", `${API_URL}/documents/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  });
}

export async function deleteDocument(
  token: string,
  docId: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/documents/${docId}`, { method: "DELETE" }, token);
}

export async function renameDocument(
  token: string,
  docId: string,
  original_name: string
): Promise<ApiResponse<Document>> {
  return apiFetch<Document>(
    `/documents/${docId}`,
    { method: "PATCH", body: JSON.stringify({ original_name }) },
    token
  );
}

export async function getChatStats(
  token: string
): Promise<ApiResponse<DocumentChatStats[]>> {
  return apiFetch<DocumentChatStats[]>("/chat/stats", {}, token);
}

export async function getChatSessions(
  token: string
): Promise<ApiResponse<ChatSessionSummary[]>> {
  return apiFetch<ChatSessionSummary[]>("/chat/sessions", {}, token);
}

export async function getChatUsage(token: string): Promise<ApiResponse<ChatUsage>> {
  return apiFetch<ChatUsage>("/chat/usage", {}, token);
}

export async function getChatHistory(
  token: string,
  docId: string
): Promise<ApiResponse<ChatMessage[]>> {
  return apiFetch<ChatMessage[]>(`/chat/history/${docId}`, {}, token);
}

export async function clearChatHistory(
  token: string,
  docId: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/chat/history/${docId}`, { method: "DELETE" }, token);
}

export async function getAnalyticsSummary(): Promise<ApiResponse<AnalyticsSummary>> {
  return apiFetch<AnalyticsSummary>("/api/analytics/summary");
}

export async function getAdminStats(token: string): Promise<ApiResponse<AdminStats>> {
  return apiFetch<AdminStats>("/api/admin/stats", {}, token);
}

export async function getAdminUsers(token: string): Promise<ApiResponse<AdminUserItem[]>> {
  return apiFetch<AdminUserItem[]>("/api/admin/users", {}, token);
}

export async function getAdminFailures(
  token: string
): Promise<ApiResponse<AdminFailureItem[]>> {
  return apiFetch<AdminFailureItem[]>("/api/admin/failures", {}, token);
}

export async function markAdminFailureRead(
  token: string,
  failureId: string
): Promise<ApiResponse<{ id: string; is_read: boolean }>> {
  return apiFetch(`/api/admin/failures/${failureId}/read`, { method: "POST" }, token);
}

export async function markAllAdminFailuresRead(
  token: string
): Promise<ApiResponse<{ updated: number }>> {
  return apiFetch("/api/admin/failures/read-all", { method: "POST" }, token);
}

export async function streamChat(
  token: string,
  docId: string,
  query: string,
  onToken: (token: string) => void,
  onDone: (sources: ChatMessage["sources"], usage?: ChatUsage) => void,
  onError: (msg: string) => void
): Promise<void> {
  const url = `${API_URL}/chat/stream?doc_id=${encodeURIComponent(docId)}&query=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok || !res.body) {
    if (res.status === 429) {
      const err = await res.json().catch(() => ({ detail: "Daily chat limit reached" }));
      onError(typeof err.detail === "string" ? err.detail : "Daily chat limit reached");
      return;
    }
    onError("Failed to start chat stream");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.type === "token") onToken(payload.content);
        if (payload.type === "done") onDone(payload.sources, payload.usage);
        if (payload.type === "error") onError(payload.message);
      } catch {
        /* ignore malformed chunks */
      }
    }
  }
}
