/**
 * Sessions API
 * All session-related API calls
 */

import { apiClient } from "./client";
import { API_ROUTES } from "@/config/constants";
import type { ChatSession, SessionCreateRequest, SessionUpdateRequest } from "@/types";
import { logger } from "@/utils/logger";

export const sessionsApi = {
  /**
   * Get all sessions for a user and course
   */
  async getSessions(userId: string, courseId: string): Promise<ChatSession[]> {
    logger.debug("Fetching sessions", { userId, courseId });

    const params = new URLSearchParams({ userId, courseId });
    return apiClient.get<ChatSession[]>(`${API_ROUTES.SESSIONS}?${params}`);
  },

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    courseId: string,
    title?: string
  ): Promise<ChatSession> {
    logger.debug("Creating session", { userId, courseId, title });

    return apiClient.post<ChatSession>(API_ROUTES.SESSIONS, {
      userId,
      courseId,
      title,
    });
  },

  /**
   * Update an existing session
   */
  async updateSession(
    sessionId: string,
    updates: SessionUpdateRequest
  ): Promise<ChatSession> {
    logger.debug("Updating session", { sessionId, updates });

    return apiClient.put<ChatSession>(`${API_ROUTES.SESSIONS}/${sessionId}`, updates);
  },

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    logger.debug("Deleting session", { sessionId });

    return apiClient.delete<void>(`${API_ROUTES.SESSIONS}/${sessionId}`);
  },
};
