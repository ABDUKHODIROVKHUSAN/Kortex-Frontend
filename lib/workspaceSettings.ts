import type { RagSettings } from "@/types";
import { DEFAULT_RAG_SETTINGS } from "@/types";

const STORAGE_KEY = "kortex-rag-settings";

export function loadRagSettings(): RagSettings {
  if (typeof window === "undefined") return DEFAULT_RAG_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RAG_SETTINGS;
    return { ...DEFAULT_RAG_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RAG_SETTINGS;
  }
}

export function saveRagSettings(settings: RagSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Chunk size/overlap apply on the next upload. Response style applies on the next chat turn. */
