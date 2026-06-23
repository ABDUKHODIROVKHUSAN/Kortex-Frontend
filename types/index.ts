export interface DocumentChatStats {
  document_id: string;
  message_count: number;
  question_count: number;
  last_activity_at: string | null;
}

export interface ChatSessionSummary {
  document_id: string;
  document_name: string;
  first_question: string;
  message_count: number;
  last_activity_at: string;
}

export interface RagSettings {
  chunkSize: number;
  chunkOverlap: number;
  responseStyle: "concise" | "detailed";
  showSourceExcerpts: boolean;
}

export const DEFAULT_RAG_SETTINGS: RagSettings = {
  chunkSize: 500,
  chunkOverlap: 50,
  responseStyle: "detailed",
  showSourceExcerpts: true,
};

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  file_type: "pdf" | "docx";
  file_size: number;
  status: "processing" | "ready" | "error";
  chunk_count: number;
  created_at: string;
}

export interface SourceChunk {
  text: string;
  page?: number;
  paragraph_index?: number;
  chunk_index?: number;
}

export interface ChatMessage {
  id: string;
  document_id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceChunk[];
  created_at: string;
}

export interface ChatUsage {
  requests_used: number;
  requests_limit: number;
  requests_remaining: number;
  tokens_used: number;
  tokens_limit: number;
  tokens_remaining: number;
  resets_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
  user: User;
}
