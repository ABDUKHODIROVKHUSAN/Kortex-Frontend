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
  subscription_tier?: string;
  is_admin?: boolean;
}

export interface AdminStats {
  total_users: number;
  total_documents: number;
  free_users: number;
  pro_users: number;
  business_users: number;
  unread_failures: number;
}

export interface AdminUserItem {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
  is_admin: boolean;
  document_count: number;
  created_at: string | null;
}

export interface AdminFailureItem {
  id: string;
  user_id: string | null;
  user_email: string | null;
  document_id: string | null;
  error_type: string;
  message: string;
  query_preview: string | null;
  is_read: boolean;
  created_at: string | null;
}

export type IndexingStage =
  | "queued"
  | "extracting"
  | "chunking"
  | "embedding"
  | "storing"
  | "ready"
  | "error";

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  file_type: "pdf" | "docx";
  file_size: number;
  status: "processing" | "ready" | "error";
  chunk_count: number;
  progress_percent?: number;
  progress_stage?: IndexingStage | string;
  chunk_size?: number;
  chunk_overlap?: number;
  created_at: string;
}

export interface SourceChunk {
  text: string;
  page?: number;
  paragraph_index?: number;
  chunk_index?: number;
  score?: number | null;
  retrieval_method?: string;
}

export interface RetrievalMeta {
  method: string;
  top_k: number;
  chunk_count: number;
  latency_ms: number;
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
  subscription_tier?: string;
  requests_used: number;
  requests_limit: number;
  requests_remaining: number;
  tokens_used: number;
  tokens_limit: number;
  tokens_remaining: number;
  token_period?: string;
  resets_at: string;
}

export interface UpgradeTierResponse {
  success: boolean;
  message: string;
  userTier: string;
}

export interface AnalyticsSummary {
  total_users: number;
  total_documents: number;
  pdf_percentage: number;
  docx_percentage: number;
  free_users: number;
  pro_users: number;
  business_users: number;
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
