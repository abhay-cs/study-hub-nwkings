/**
 * Application Constants
 * Centralized configuration values
 */

// API Routes
export const API_ROUTES = {
	CHAT: "/api/chat",
	SESSIONS: "/api/chat/sessions",
	MESSAGES: "/api/chat/messages",
	ONBOARDING: "/api/onboarding",
} as const;

// Page Routes
export const PAGE_ROUTES = {
	HOME: "/",
	DASHBOARD: "/dashboard",
	LOGIN: "/login",
	ONBOARDING: "/onboarding",
	COURSE: (courseId: string) => `/courses/${courseId}`,
	ADMIN: "/admin",
} as const;

// UI Constants
export const UI_CONSTANTS = {
	SIDEBAR_WIDTH: "20rem",
	DEFAULT_SESSION_TITLE: "New Chat",
	MAX_MESSAGE_LENGTH: 5000,
	SESSION_TITLE_MAX_LENGTH: 100,
	SEARCH_DEBOUNCE_MS: 300,
	AUTO_SCROLL_THRESHOLD: 20, // pixels from bottom
} as const;

// Chat Constants
export const CHAT_CONSTANTS = {
	STREAMING_CHUNK_SIZE: 1024,
	MAX_RETRY_ATTEMPTS: 3,
	REQUEST_TIMEOUT_MS: 30000,
	DEFAULT_TITLE_WORD_COUNT: 8,
	TITLE_SNIPPET_LENGTH: 30,
} as const;

// Message Display
export const MESSAGE_CONSTANTS = {
	EMPTY_STATE_TEXT: "Ask me anything about the course content, assignments, or concepts.",
	ERROR_MESSAGE: "Sorry, I had trouble answering that.",
	LOADING_TEXT: "Thinking...",
	TYPING_ANIMATION_DELAY: [0.2, 0.1, 0], // seconds
} as const;

// AI Configuration
export const AI_CONFIG = {
	MODEL: "deepseek-chat",
	BASE_URL: "https://api.deepseek.com",
	SYSTEM_PROMPT: `You are "Network Kings Assistant", a friendly AI tutor for networking students.
- Always explain clearly and avoid jargon unless asked.
- Use real-world analogies (like routers as post offices).
- Break complex answers into steps.
- If the question is about a specific video topic, assume CCNA-level.
- Answer in Markdown with sections: **Summary**, **Detailed Explanation**, **Quick Tip**.`,
} as const;

// Validation Rules
export const VALIDATION = {
	MIN_MESSAGE_LENGTH: 1,
	MAX_MESSAGE_LENGTH: 5000,
	MIN_TITLE_LENGTH: 1,
	MAX_TITLE_LENGTH: 100,
	MIN_PASSWORD_LENGTH: 8,
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
	TIME_ONLY: { hour: "2-digit", minute: "2-digit" } as Intl.DateTimeFormatOptions,
	DATE_TIME: {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	} as Intl.DateTimeFormatOptions,
} as const;
