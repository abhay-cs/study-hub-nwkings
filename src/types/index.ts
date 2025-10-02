// ============================================================================
// Core Database Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  course_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "bot";
  message: string;
  created_at: string;
}

// ============================================================================
// UI/Component Types
// ============================================================================

export interface Message {
  from: "user" | "bot";
  text: string;
  created_at?: string;
}

export interface MessagesBySession {
  [sessionId: string]: Message[];
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ChatRequest {
  question: string;
  sessionId?: string;
  courseId?: string;
}

export interface SessionCreateRequest {
  userId: string;
  courseId: string;
  title?: string;
}

export interface SessionUpdateRequest {
  title?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseChatSessionsResult {
  sessions: ChatSession[];
  loading: boolean;
  error: Error | null;
  createSession: (title?: string) => Promise<ChatSession | null>;
  updateSession: (sessionId: string, updates: SessionUpdateRequest) => Promise<ChatSession | null>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export interface UseChatMessagesResult {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ChatBotProps {
  course: Course;
  sessionId: string | null;
  userId: string;
  onSessionTitleUpdate?: (sessionId: string, newTitle: string) => void;
}

export interface ChatHistorySidebarProps {
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onSessionTitleUpdate?: (sessionId: string, newTitle: string) => void;
  userId: string;
  courseId: string;
}

export interface AppSidebarProps {
  user: User;
  course?: { id: string };
  currentSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  onNewChat?: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type AsyncFunction<T = void> = () => Promise<T>;
export type AsyncFunctionWithArg<T, R = void> = (arg: T) => Promise<R>;
export type TokenCallback = (token: string) => void;
