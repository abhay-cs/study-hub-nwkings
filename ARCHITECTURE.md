# Architecture Overview

Visual guide to the refactored codebase structure.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                              │
│                       (src/app/*)                                │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ├── Server Components (SSR)
                │   ├── Fetch from Supabase
                │   ├── Get user session
                │   └── Pass data to client
                │
                └── Client Components ("use client")
                    │
                    ├─────────────────────────────────────┐
                    │                                     │
                    ▼                                     ▼
            ┌──────────────┐                    ┌──────────────┐
            │   UI Layer   │                    │  Data Layer  │
            │ (Components) │                    │   (Hooks)    │
            └──────┬───────┘                    └──────┬───────┘
                   │                                   │
                   │ renders                           │ manages state
                   │                                   │
                   └────────────┬──────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Business Logic      │
                    │   (Custom Hooks)      │
                    │                       │
                    │ - useChatMessages     │
                    │ - useSessionManagement│
                    └───────────┬───────────┘
                                │
                                │ calls
                                │
                                ▼
                    ┌───────────────────────┐
                    │    API Layer          │
                    │  (src/lib/api/*)      │
                    │                       │
                    │ - apiClient           │
                    │ - sessionsApi         │
                    │ - messagesApi         │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌──────────┐    ┌──────────┐   ┌──────────┐
        │ Supabase │    │ Next.js  │   │ External │
        │   DB     │    │   API    │   │   APIs   │
        └──────────┘    └──────────┘   └──────────┘
```

---

## 🗂️ File Structure

```
src/
│
├── 📁 types/                    # Type Definitions
│   └── index.ts                 # All TypeScript interfaces
│
├── 📁 config/                   # Configuration
│   └── constants.ts             # App-wide constants
│
├── 📁 utils/                    # Utilities
│   ├── logger.ts               # Logging utility
│   └── errors.ts               # Custom error classes
│
├── 📁 lib/                      # Core Logic
│   ├── 📁 api/                 # API Layer (NEW ✨)
│   │   ├── client.ts           # Base HTTP client
│   │   ├── sessions.ts         # Session endpoints
│   │   ├── messages.ts         # Message endpoints
│   │   └── index.ts            # Exports
│   │
│   ├── 📁 supabase/            # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   │
│   ├── sessions.ts             # Legacy (migrate to api/)
│   ├── messages.ts             # Legacy (migrate to api/)
│   └── ai.ts                   # AI integration
│
├── 📁 hooks/                    # Custom Hooks (NEW ✨)
│   ├── useChatMessages.ts      # Message management
│   ├── useSessionManagement.ts # Session management
│   └── useChatSessions.ts      # Legacy
│
├── 📁 components/               # React Components
│   ├── ErrorBoundary.tsx       # Error handling (NEW ✨)
│   ├── LoadingState.tsx        # Loading UI (NEW ✨)
│   ├── EmptyState.tsx          # Empty states (NEW ✨)
│   ├── chatbot.tsx             # Main chat UI
│   ├── chatbotSidebar.tsx      # Session sidebar
│   └── 📁 ui/                  # Radix UI components
│
└── 📁 app/                      # Next.js App Router
    ├── layout.tsx              # Root layout
    ├── page.tsx                # Home page
    ├── 📁 dashboard/           # Dashboard pages
    ├── 📁 courses/             # Course pages
    └── 📁 api/                 # API routes
        ├── chat/
        ├── sessions/
        └── messages/
```

---

## 🔄 Data Flow

### **1. User Sends Message**

```
User Input
    ↓
ChatBot Component
    ↓
useChatMessages Hook
    ↓
messagesApi.streamChatResponse()
    ↓
apiClient (with logging & error handling)
    ↓
POST /api/chat
    ↓
DeepSeek API
    ↓
Stream response back
    ↓
Update UI in real-time
```

### **2. Session Management**

```
User Action (New Chat)
    ↓
ChatHistorySidebar Component
    ↓
useSessionManagement Hook
    ↓
sessionsApi.createSession()
    ↓
apiClient
    ↓
Supabase INSERT
    ↓
Update local state
    ↓
Trigger re-render
```

---

## 🧩 Layer Responsibilities

### **1. Components Layer** (`src/components/`)
- **Role:** UI rendering and user interactions
- **Can:** Use hooks, display data, handle events
- **Cannot:** Direct API calls, business logic
- **Example:**
  ```typescript
  // ✅ Good
  const { messages, sendMessage } = useChatMessages(sessionId);

  // ❌ Bad
  const messages = await fetch("/api/messages");
  ```

### **2. Hooks Layer** (`src/hooks/`)
- **Role:** State management and business logic
- **Can:** Call APIs, manage state, handle side effects
- **Cannot:** Render UI, direct DOM manipulation
- **Example:**
  ```typescript
  // ✅ Good
  const data = await sessionsApi.getSessions(userId, courseId);

  // ❌ Bad
  return <div>Data here</div>;
  ```

### **3. API Layer** (`src/lib/api/`)
- **Role:** HTTP communication
- **Can:** Make requests, handle responses, retry logic
- **Cannot:** UI logic, state management
- **Example:**
  ```typescript
  // ✅ Good
  return apiClient.post(API_ROUTES.SESSIONS, { userId, courseId });

  // ❌ Bad
  setLoading(true); // No state management here
  ```

### **4. Utils Layer** (`src/utils/`)
- **Role:** Helper functions
- **Can:** Pure functions, logging, error handling
- **Cannot:** State, API calls, UI
- **Example:**
  ```typescript
  // ✅ Good
  logger.debug("Action", { data });

  // ❌ Bad
  const [state, setState] = useState();
  ```

---

## 🎯 Design Patterns

### **1. Custom Hook Pattern**

```typescript
// Extract logic → Make reusable → Easy to test

// Before: Logic in component (hard to reuse)
const Component = () => {
  const [data, setData] = useState([]);
  useEffect(() => { /* fetch logic */ }, []);
  // ...
};

// After: Logic in hook (reusable)
const useData = () => {
  const [data, setData] = useState([]);
  useEffect(() => { /* fetch logic */ }, []);
  return { data };
};

const Component = () => {
  const { data } = useData();
  // ...
};
```

### **2. API Client Pattern**

```typescript
// Centralized → Consistent errors → Auto logging

// Before: Manual fetch everywhere
const res = await fetch(url);
if (!res.ok) throw new Error();
const data = await res.json();

// After: Abstracted client
const data = await apiClient.get(url);
// Error handling, logging, timeout automatic!
```

### **3. Error Boundary Pattern**

```typescript
// Catch errors → Show fallback → Prevent crashes

<ErrorBoundary>
  <Component />
</ErrorBoundary>

// If Component throws, ErrorBoundary catches it
// and shows user-friendly error UI
```

---

## 🚦 Request Flow Example

### Creating a New Session

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                               │
│    User clicks "New Chat" button                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. COMPONENT                                                 │
│    ChatHistorySidebar.tsx                                   │
│    → onClick handler triggered                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CUSTOM HOOK                                              │
│    useSessionManagement.ts                                  │
│    → createSession() called                                 │
│    → logger.debug("Creating session", {...})               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. API LAYER                                                │
│    src/lib/api/sessions.ts                                  │
│    → sessionsApi.createSession(userId, courseId)           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. HTTP CLIENT                                              │
│    src/lib/api/client.ts                                    │
│    → apiClient.post(API_ROUTES.SESSIONS, data)             │
│    → logger.apiCall("/api/sessions", "POST", {...})        │
│    → Set timeout, handle errors                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. SUPABASE                                                 │
│    Direct insert to database                                │
│    → INSERT INTO chat_sessions (...)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. RESPONSE                                                 │
│    ← New session object returned                           │
│    → logger.apiResponse("/api/sessions", 200, {...})       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. STATE UPDATE                                             │
│    useSessionManagement.ts                                  │
│    → setSessions([newSession, ...prev])                     │
│    → logger.info("Session created", {sessionId})           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. UI RE-RENDER                                             │
│    ChatHistorySidebar.tsx                                   │
│    → New session appears in list                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Type Safety Flow

```
Database Schema
    ↓
TypeScript Types (src/types/index.ts)
    ↓
API Functions (typed parameters & returns)
    ↓
Hooks (typed state & functions)
    ↓
Components (typed props)
    ↓
UI (type-safe rendering)
```

**Benefit:** Catch errors at compile time, not runtime!

---

## 🧪 Testing Strategy

```
┌──────────────────┐
│  Unit Tests      │  Test hooks & utils in isolation
│  (Future)        │  - useChatMessages
│                  │  - useSessionManagement
│                  │  - logger, errors
└──────────────────┘

┌──────────────────┐
│ Integration      │  Test API → Hook → Component
│ Tests (Future)   │  - Full user flows
│                  │  - API mocking
└──────────────────┘

┌──────────────────┐
│ E2E Tests        │  Test complete application
│ (Future)         │  - Playwright/Cypress
│                  │  - Real user scenarios
└──────────────────┘
```

---

## 📚 Quick Links

- **Types:** `src/types/index.ts`
- **Constants:** `src/config/constants.ts`
- **Logger:** `src/utils/logger.ts`
- **API Client:** `src/lib/api/client.ts`
- **Hooks:** `src/hooks/`
- **Components:** `src/components/`

---

## 🎓 Learning Path

1. **Read:** `REFACTORING_GUIDE.md` for detailed usage
2. **Reference:** `QUICK_REFERENCE.md` for daily dev
3. **Follow:** `MIGRATION_CHECKLIST.md` to update code
4. **Understand:** This document for architecture

---

**Architecture is about making change easy. These patterns make your code:**
- ✅ Easy to understand
- ✅ Easy to modify
- ✅ Easy to test
- ✅ Easy to debug
