export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  messageCount?: number;
  lastMessagePreview?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ChatRequest {
  conversationId: string;
  message: string;
}

export interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}
