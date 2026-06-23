export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const BACKEND_UNREACHABLE =
  "Backend is not running. Start it with: cd backend && uvicorn app.main:app --port 8000";

export async function checkBackendHealth(): Promise<{
  online: boolean;
  llmProvider?: string | null;
  llmEnabled?: boolean;
}> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return {
      online: true,
      llmProvider: data.llm_provider ?? null,
      llmEnabled: Boolean(data.llm_enabled),
    };
  } catch {
    return { online: false };
  }
}
