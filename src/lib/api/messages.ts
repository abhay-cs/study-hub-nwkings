/**
 * Messages API
 * All message-related API calls
 */

import { apiClient } from "./client";
import { API_ROUTES } from "@/config/constants";
import type { ChatMessage, TokenCallback } from "@/types";
import { logger } from "@/utils/logger";

export const messagesApi = {
  /**
   * Get all messages for a session
   */
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    logger.debug("Fetching messages", { sessionId });

    const params = new URLSearchParams({ sessionId });
    return apiClient.get<ChatMessage[]>(`${API_ROUTES.MESSAGES}?${params}`);
  },

  /**
   * Save a message
   */
  async saveMessage(
    sessionId: string,
    role: "user" | "bot",
    message: string
  ): Promise<ChatMessage> {
    logger.debug("Saving message", { sessionId, role });

    return apiClient.post<ChatMessage>(API_ROUTES.MESSAGES, {
      sessionId,
      role,
      message,
    });
  },

  /**
   * Stream chat response
   */
  async streamChatResponse(
    question: string,
    onToken: TokenCallback
  ): Promise<void> {
    logger.debug("Streaming chat response", { question: question.slice(0, 50) });

    return apiClient.stream(API_ROUTES.CHAT, { question }, onToken);
  },
};
