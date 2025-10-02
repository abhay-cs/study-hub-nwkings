/**
 * API Module Exports
 * Centralized API access point
 */

export { apiClient } from "./client";
export { sessionsApi } from "./sessions";
export { messagesApi } from "./messages";

// Re-export for convenience
import { sessionsApi } from "./sessions";
import { messagesApi } from "./messages";

export const api = {
  sessions: sessionsApi,
  messages: messagesApi,
};
