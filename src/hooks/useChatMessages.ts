/**
 * useChatMessages Hook
 * Manages chat messages for a session with optimistic updates
 */

import { useState, useEffect, useCallback } from "react";
import { messagesApi } from "@/lib/api/messages";
import { logger } from "@/utils/logger";
import { getErrorMessage } from "@/utils/errors";
import type { Message, UseChatMessagesResult } from "@/types";
import { CHAT_CONSTANTS } from "@/config/constants";

export function useChatMessages(sessionId: string | null): UseChatMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Load messages when session changes
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    loadMessages(sessionId);
  }, [sessionId]);

  const loadMessages = async (sid: string) => {
    setLoading(true);
    setError(null);

    try {
      logger.debug("Loading messages", { sessionId: sid });
      const dbMessages = await messagesApi.getMessages(sid);

      const formattedMessages: Message[] = dbMessages.map((m) => ({
        from: m.role === "user" ? "user" : "bot",
        text: m.message,
        created_at: m.created_at,
      }));

      setMessages(formattedMessages);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      logger.error("Failed to load messages", err, { sessionId: sid });
      setError(err instanceof Error ? err : new Error(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!sessionId || !messageText.trim() || isStreaming) {
        logger.warn("Cannot send message", {
          hasSession: !!sessionId,
          hasText: !!messageText.trim(),
          isStreaming,
        });
        return;
      }

      setIsStreaming(true);
      setError(null);

      try {
        // Optimistic update: add user message
        const userMessage: Message = {
          from: "user",
          text: messageText,
        };

        setMessages((prev) => [...prev, userMessage]);

        // Save user message to DB
        await messagesApi.saveMessage(sessionId, "user", messageText);

        // Add placeholder bot message
        setMessages((prev) => [...prev, { from: "bot", text: "" }]);

        // Stream bot response
        let botReply = "";

        await messagesApi.streamChatResponse(messageText, (token) => {
          botReply += token;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { from: "bot", text: botReply };
            return updated;
          });
        });

        // Save bot message to DB
        await messagesApi.saveMessage(sessionId, "bot", botReply);

        logger.debug("Message sent successfully", { sessionId });
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        logger.error("Failed to send message", err, { sessionId });

        // Update last message with error
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            from: "bot",
            text: "Sorry, I had trouble answering that. Please try again.",
          };
          return updated;
        });

        setError(err instanceof Error ? err : new Error(errorMsg));
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId, isStreaming]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
