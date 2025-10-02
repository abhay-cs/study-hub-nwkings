/**
 * useSessionManagement Hook
 * Manages chat sessions for a course
 */

import { useState, useEffect, useCallback } from "react";
import { sessionsApi } from "@/lib/api/sessions";
import { logger } from "@/utils/logger";
import { getErrorMessage } from "@/utils/errors";
import type { ChatSession, UseChatSessionsResult, SessionUpdateRequest } from "@/types";
import { UI_CONSTANTS } from "@/config/constants";

export function useSessionManagement(
  userId: string,
  courseId: string
): UseChatSessionsResult {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch sessions on mount or when dependencies change
  useEffect(() => {
    if (userId && courseId) {
      fetchSessions();
    }
  }, [userId, courseId]);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      logger.debug("Fetching sessions", { userId, courseId });
      const data = await sessionsApi.getSessions(userId, courseId);
      setSessions(data);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      logger.error("Failed to fetch sessions", err, { userId, courseId });
      setError(err instanceof Error ? err : new Error(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const createSession = useCallback(
    async (title?: string): Promise<ChatSession | null> => {
      try {
        logger.debug("Creating new session", { userId, courseId, title });

        const newSession = await sessionsApi.createSession(
          userId,
          courseId,
          title || UI_CONSTANTS.DEFAULT_SESSION_TITLE
        );

        setSessions((prev) => [newSession, ...prev]);
        return newSession;
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        logger.error("Failed to create session", err, { userId, courseId });
        setError(err instanceof Error ? err : new Error(errorMsg));
        return null;
      }
    },
    [userId, courseId]
  );

  const updateSession = useCallback(
    async (
      sessionId: string,
      updates: SessionUpdateRequest
    ): Promise<ChatSession | null> => {
      try {
        logger.debug("Updating session", { sessionId, updates });

        const updatedSession = await sessionsApi.updateSession(sessionId, updates);

        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? updatedSession : s))
        );

        return updatedSession;
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        logger.error("Failed to update session", err, { sessionId });
        setError(err instanceof Error ? err : new Error(errorMsg));
        return null;
      }
    },
    []
  );

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      logger.debug("Deleting session", { sessionId });

      await sessionsApi.deleteSession(sessionId);

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));

      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      logger.error("Failed to delete session", err, { sessionId });
      setError(err instanceof Error ? err : new Error(errorMsg));
      return false;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchSessions();
  }, [userId, courseId]);

  return {
    sessions,
    loading,
    error,
    createSession,
    updateSession,
    deleteSession,
    refetch,
  };
}
