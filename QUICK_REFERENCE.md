# Quick Reference Card

**TL;DR:** Common patterns and imports for daily development.

---

## 📥 Common Imports

```typescript
// Types
import type {
  User, Course, ChatSession, ChatMessage, Message
} from "@/types";

// API
import { sessionsApi, messagesApi } from "@/lib/api";

// Hooks
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSessionManagement } from "@/hooks/useSessionManagement";

// Utils
import { logger } from "@/utils/logger";
import { getErrorMessage } from "@/utils/errors";

// Constants
import { API_ROUTES, UI_CONSTANTS, CHAT_CONSTANTS } from "@/config/constants";

// Components
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner, TypingIndicator } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
```

---

## 🎣 Hook Usage

### Chat Messages
```typescript
const { messages, loading, error, sendMessage } = useChatMessages(sessionId);

// Send a message
await sendMessage("Hello");
```

### Session Management
```typescript
const {
  sessions,
  loading,
  error,
  createSession,
  updateSession,
  deleteSession
} = useSessionManagement(userId, courseId);

// Create session
const session = await createSession("My Session");

// Update
await updateSession(sessionId, { title: "New Title" });

// Delete
await deleteSession(sessionId);
```

---

## 🌐 API Calls

### Sessions
```typescript
import { sessionsApi } from "@/lib/api/sessions";

// Get all sessions
const sessions = await sessionsApi.getSessions(userId, courseId);

// Create
const session = await sessionsApi.createSession(userId, courseId, "Title");

// Update
const updated = await sessionsApi.updateSession(sessionId, { title: "New" });

// Delete
await sessionsApi.deleteSession(sessionId);
```

### Messages
```typescript
import { messagesApi } from "@/lib/api/messages";

// Get messages
const messages = await messagesApi.getMessages(sessionId);

// Save message
await messagesApi.saveMessage(sessionId, "user", "Hello");

// Stream chat response
await messagesApi.streamChatResponse(question, (token) => {
  console.log(token); // Handle each token
});
```

---

## 📝 Logging

```typescript
import { logger } from "@/utils/logger";

// Debug (dev only)
logger.debug("User action", { userId, action: "click" });

// Info (dev only)
logger.info("Feature enabled", { feature: "chat" });

// Warning (always shown)
logger.warn("Deprecated function used", { function: "oldFunc" });

// Error (always shown)
logger.error("Operation failed", error, { userId, sessionId });

// API logging (automatic)
logger.apiCall("/api/sessions", "POST", { userId });
logger.apiResponse("/api/sessions", 200, { id: "123" });
logger.apiError("/api/sessions", error);
```

---

## ⚠️ Error Handling

```typescript
import { ApiError, ValidationError, getErrorMessage } from "@/utils/errors";

// Throw custom errors
throw new ApiError("Not found", "/api/sessions", 404);
throw new ValidationError("Invalid email", "email");

// Handle errors
try {
  await sessionsApi.createSession(userId, courseId);
} catch (error) {
  const message = getErrorMessage(error);
  logger.error("Failed to create session", error);
  // Show message to user
}
```

---

## 🎨 UI Components

### Error Boundary
```typescript
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Loading States
```typescript
import { LoadingSpinner, TypingIndicator } from "@/components/LoadingState";

{loading && <LoadingSpinner size="md" text="Loading..." />}
{streaming && <TypingIndicator />}
```

### Empty State
```typescript
import { EmptyState } from "@/components/EmptyState";
import { MessageSquare } from "lucide-react";

<EmptyState
  icon={MessageSquare}
  title="No messages yet"
  description="Start a conversation"
  action={<Button>New Chat</Button>}
/>
```

---

## 🔧 Constants

```typescript
import { API_ROUTES, UI_CONSTANTS } from "@/config/constants";

// API routes
fetch(API_ROUTES.SESSIONS);
fetch(API_ROUTES.MESSAGES);
fetch(API_ROUTES.CHAT);

// UI values
const title = UI_CONSTANTS.DEFAULT_SESSION_TITLE;
const width = UI_CONSTANTS.SIDEBAR_WIDTH;

// Validation
const max = UI_CONSTANTS.MAX_MESSAGE_LENGTH;
```

---

## 🧪 Component Pattern

```typescript
"use client";

import { useChatMessages } from "@/hooks/useChatMessages";
import { logger } from "@/utils/logger";
import { UI_CONSTANTS } from "@/config/constants";
import type { Course } from "@/types";

interface Props {
  course: Course;
  sessionId: string | null;
}

export function MyComponent({ course, sessionId }: Props) {
  const { messages, loading, sendMessage } = useChatMessages(sessionId);

  const handleSend = async (text: string) => {
    logger.debug("Sending message", { courseId: course.id });
    await sendMessage(text);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.text}</div>
      ))}
    </div>
  );
}
```

---

## 🚀 Common Tasks

### Add New API Endpoint
1. Define type in `src/types/index.ts`
2. Add constant in `src/config/constants.ts`
3. Create API module in `src/lib/api/your-feature.ts`
4. Export in `src/lib/api/index.ts`

### Create Custom Hook
1. Create file in `src/hooks/useYourHook.ts`
2. Use `useState`, `useEffect`, `useCallback`
3. Call API functions from `src/lib/api/`
4. Add logging with `logger`
5. Handle errors with try/catch

### Update Component
1. Import hook: `import { useYourHook } from "@/hooks/useYourHook"`
2. Use hook: `const { data, loading } = useYourHook(params)`
3. Add logging: `logger.debug("Action", { data })`
4. Handle errors: Display error message from `error.message`

---

## 📦 File Locations

```
src/
├── types/index.ts              # All types
├── config/constants.ts         # All constants
├── utils/
│   ├── logger.ts              # Logging
│   └── errors.ts              # Error classes
├── lib/api/
│   ├── client.ts              # Base client
│   ├── sessions.ts            # Session API
│   ├── messages.ts            # Message API
│   └── index.ts               # Exports
├── hooks/
│   ├── useChatMessages.ts     # Message hook
│   └── useSessionManagement.ts # Session hook
└── components/
    ├── ErrorBoundary.tsx      # Error UI
    ├── LoadingState.tsx       # Loading UI
    └── EmptyState.tsx         # Empty UI
```

---

## 💡 Tips

- ✅ Use hooks for any stateful logic
- ✅ Use API client for all fetch calls
- ✅ Add logging to important actions
- ✅ Import types from `@/types`
- ✅ Use constants instead of strings
- ✅ Wrap pages with ErrorBoundary

---

**See `REFACTORING_GUIDE.md` for detailed examples.**
