# Refactoring Guide

This document explains the new architecture and how to use the refactored codebase.

## 📁 New Structure

```
src/
├── types/              # TypeScript types and interfaces
│   └── index.ts        # All type definitions
├── config/             # Configuration and constants
│   └── constants.ts    # App-wide constants
├── utils/              # Utility functions
│   ├── logger.ts       # Logging utility
│   └── errors.ts       # Custom error classes
├── lib/
│   └── api/           # API layer (structured)
│       ├── client.ts   # Base API client
│       ├── sessions.ts # Session endpoints
│       ├── messages.ts # Message endpoints
│       └── index.ts    # API exports
├── hooks/              # Custom React hooks
│   ├── useChatMessages.ts       # Message management
│   └── useSessionManagement.ts  # Session management
└── components/         # UI components
    ├── ErrorBoundary.tsx
    ├── LoadingState.tsx
    └── EmptyState.tsx
```

## 🎯 Key Improvements

### 1. **Centralized Types** (`src/types/index.ts`)

All TypeScript interfaces in one place. No more duplicate type definitions!

```typescript
import type { ChatSession, Message, User } from "@/types";
```

### 2. **Structured API Layer** (`src/lib/api/`)

Clean, testable API calls with automatic error handling and logging.

**Before:**
```typescript
const res = await fetch("/api/sessions");
const data = await res.json();
```

**After:**
```typescript
import { sessionsApi } from "@/lib/api/sessions";
const sessions = await sessionsApi.getSessions(userId, courseId);
```

### 3. **Custom Hooks**

Reusable business logic extracted from components.

**Sessions Hook:**
```typescript
import { useSessionManagement } from "@/hooks/useSessionManagement";

const { sessions, createSession, updateSession, deleteSession } =
  useSessionManagement(userId, courseId);
```

**Messages Hook:**
```typescript
import { useChatMessages } from "@/hooks/useChatMessages";

const { messages, sendMessage, loading } = useChatMessages(sessionId);
```

### 4. **Logging Utility** (`src/utils/logger.ts`)

Consistent logging for debugging. Automatically disabled in production.

```typescript
import { logger } from "@/utils/logger";

logger.debug("User action", { userId, action: "create_session" });
logger.error("API failed", error, { endpoint: "/api/sessions" });
```

### 5. **Error Handling** (`src/utils/errors.ts`)

Custom error types for better error management.

```typescript
import { ApiError, ValidationError } from "@/utils/errors";

throw new ApiError("Session not found", "/api/sessions", 404);
```

### 6. **Constants** (`src/config/constants.ts`)

All magic strings and numbers in one place.

```typescript
import { API_ROUTES, UI_CONSTANTS } from "@/config/constants";

const endpoint = API_ROUTES.SESSIONS;
const title = UI_CONSTANTS.DEFAULT_SESSION_TITLE;
```

## 🔄 Migration Examples

### Updating a Component to Use New Architecture

**Before:**
```typescript
// Old chatbot component
const [loading, setLoading] = useState(false);
const [messages, setMessages] = useState([]);

useEffect(() => {
  fetch(`/api/messages?sessionId=${sessionId}`)
    .then(res => res.json())
    .then(data => setMessages(data))
    .catch(err => console.error(err));
}, [sessionId]);

const sendMessage = async (text) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ question: text }),
  });
  // ... handle response
};
```

**After:**
```typescript
// New chatbot component
import { useChatMessages } from "@/hooks/useChatMessages";

const { messages, loading, sendMessage } = useChatMessages(sessionId);
```

### Using the API Client

**Before:**
```typescript
const response = await fetch("/api/sessions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId, courseId }),
});

if (!response.ok) {
  throw new Error("Failed");
}

const session = await response.json();
```

**After:**
```typescript
import { sessionsApi } from "@/lib/api/sessions";

const session = await sessionsApi.createSession(userId, courseId);
// Error handling, logging, and timeout are automatic!
```

## 🚀 Adding New Features

### Adding a New API Endpoint

1. **Define types** in `src/types/index.ts`:
```typescript
export interface NewFeature {
  id: string;
  name: string;
}
```

2. **Add constant** in `src/config/constants.ts`:
```typescript
export const API_ROUTES = {
  // ... existing routes
  NEW_FEATURE: "/api/new-feature",
};
```

3. **Create API module** `src/lib/api/new-feature.ts`:
```typescript
import { apiClient } from "./client";
import { API_ROUTES } from "@/config/constants";

export const newFeatureApi = {
  async getFeature(id: string) {
    return apiClient.get(`${API_ROUTES.NEW_FEATURE}/${id}`);
  },
};
```

4. **Export** in `src/lib/api/index.ts`:
```typescript
export { newFeatureApi } from "./new-feature";
```

### Creating a Custom Hook

1. Create `src/hooks/useNewFeature.ts`:
```typescript
import { useState, useEffect } from "react";
import { newFeatureApi } from "@/lib/api/new-feature";
import { logger } from "@/utils/logger";

export function useNewFeature(id: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await newFeatureApi.getFeature(id);
        setData(result);
      } catch (error) {
        logger.error("Failed to load feature", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading };
}
```

## 🐛 Debugging Tips

### Enable Debug Logging

In development, all debug logs are visible. Check browser console:
```
[2025-09-30T...] [DEBUG] Fetching sessions {"userId": "...", "courseId": "..."}
```

### Error Tracking

All errors are logged with context:
```
[2025-09-30T...] [ERROR] API Error: /api/sessions {
  "error": { "message": "...", "stack": "..." }
}
```

### Using Logger Strategically

```typescript
// Component lifecycle
logger.debug("Component mounted", { componentName: "ChatBot" });

// User actions
logger.info("User action", { action: "send_message", userId });

// API calls (automatic via apiClient)
// Errors (with full context)
logger.error("Operation failed", error, { userId, sessionId });
```

## ✅ Benefits

1. **Type Safety**: Centralized types prevent mismatches
2. **Maintainability**: Clear structure, easy to find code
3. **Debugging**: Comprehensive logging out of the box
4. **Testability**: Isolated logic in hooks and API modules
5. **Scalability**: Easy to add new features following patterns
6. **Error Handling**: Consistent error management
7. **Code Reuse**: Hooks and utilities reduce duplication

## 🔍 Next Steps

To apply this architecture to existing components:

1. **Update imports** to use new types from `@/types`
2. **Replace fetch calls** with API modules from `@/lib/api`
3. **Extract logic** into custom hooks
4. **Add logging** at key points
5. **Wrap with ErrorBoundary** for error handling
6. **Replace magic strings** with constants

## 📚 Additional Resources

- See `src/types/index.ts` for all available types
- See `src/config/constants.ts` for all constants
- See `src/hooks/` for hook examples
- See `src/lib/api/` for API client usage
