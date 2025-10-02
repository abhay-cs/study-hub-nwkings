# Migration Checklist

Use this checklist to gradually migrate your existing code to the new architecture.

---

## ✅ Phase 1: Setup & Understanding (Current)

- [x] New architecture files created
- [x] Documentation written
- [ ] Read `REFACTORING_GUIDE.md` thoroughly
- [ ] Review `QUICK_REFERENCE.md` for daily use
- [ ] Understand the new file structure

---

## ✅ Phase 2: Low-Risk Testing (Start Here)

### Test the New Architecture

- [ ] Import and log something with `logger`:
  ```typescript
  import { logger } from "@/utils/logger";
  logger.debug("Testing logger", { test: true });
  ```

- [ ] Try using a constant:
  ```typescript
  import { UI_CONSTANTS } from "@/config/constants";
  console.log(UI_CONSTANTS.DEFAULT_SESSION_TITLE);
  ```

- [ ] Import a type:
  ```typescript
  import type { ChatSession } from "@/types";
  const session: ChatSession = { /* ... */ };
  ```

### Create a Test Component

- [ ] Create `src/components/TestRefactoring.tsx`
- [ ] Use `useSessionManagement` hook
- [ ] Wrap with `ErrorBoundary`
- [ ] Add logging with `logger`
- [ ] Verify everything works

---

## ✅ Phase 3: Update Utility Modules

### Sessions Module

- [ ] Backup `src/lib/sessions.ts` → `src/lib/sessions.old.ts`
- [ ] Replace content with `src/lib/sessions-refactored.ts`
- [ ] Test all session operations:
  - [ ] Get sessions
  - [ ] Create session
  - [ ] Update session
  - [ ] Delete session
- [ ] Check logs in browser console
- [ ] Remove `.old.ts` backup if successful

### Messages Module

- [ ] Backup `src/lib/messages.ts` → `src/lib/messages.old.ts`
- [ ] Replace content with `src/lib/messages-refactored.ts`
- [ ] Test all message operations:
  - [ ] Get messages
  - [ ] Save message
  - [ ] Auto-title update
- [ ] Check logs in browser console
- [ ] Remove `.old.ts` backup if successful

### API Module

- [ ] Update `src/lib/api.ts` to use new API client:
  ```typescript
  // Old: export async function askChatbot(...)
  // New: export { messagesApi } from "@/lib/api/messages";
  ```
- [ ] Update imports in components using `api.ts`

---

## ✅ Phase 4: Update API Routes (Optional)

### Add Logging to API Routes

- [ ] `src/app/api/chat/route.ts`:
  - [ ] Import logger
  - [ ] Add request logging
  - [ ] Add error logging

- [ ] `src/app/api/chat/sessions/route.ts`:
  - [ ] Add logging
  - [ ] Use custom errors

- [ ] `src/app/api/chat/messages/route.ts`:
  - [ ] Add logging
  - [ ] Use custom errors

---

## ✅ Phase 5: Refactor Chat Components

### ChatBot Component

- [ ] Backup `src/components/chatbot.tsx`
- [ ] Import new types from `@/types`
- [ ] Replace manual state with `useChatMessages` hook
- [ ] Replace constants with imports from `@/config/constants`
- [ ] Add logging for key actions
- [ ] Replace loading indicator with `<TypingIndicator />`
- [ ] Test thoroughly:
  - [ ] Send messages
  - [ ] Receive responses
  - [ ] Session switching
  - [ ] Error handling
- [ ] Check browser console for logs

### ChatHistorySidebar Component

- [ ] Backup `src/components/chatbotSidebar.tsx`
- [ ] Import new types from `@/types`
- [ ] Replace manual state with `useSessionManagement` hook
- [ ] Replace constants with imports
- [ ] Add logging for actions
- [ ] Replace loading state with `<LoadingSpinner />`
- [ ] Replace empty state with `<EmptyState />`
- [ ] Test:
  - [ ] Create session
  - [ ] Rename session
  - [ ] Delete session
  - [ ] Search sessions

---

## ✅ Phase 6: Update Page Components

### Course Page

- [ ] Update `src/app/courses/[courseId]/clientPage.tsx`:
  - [ ] Import types
  - [ ] Add `ErrorBoundary`
  - [ ] Add logging
  - [ ] Use refactored child components

### Dashboard Page

- [ ] Update `src/app/dashboard/page.tsx`:
  - [ ] Import types
  - [ ] Add `ErrorBoundary`
  - [ ] Add logging

---

## ✅ Phase 7: Add Error Boundaries

- [ ] Wrap main layout with `ErrorBoundary`
- [ ] Wrap course pages with `ErrorBoundary`
- [ ] Wrap dashboard with `ErrorBoundary`
- [ ] Test error boundary by throwing an error
- [ ] Verify fallback UI appears

---

## ✅ Phase 8: Polish & Cleanup

### Code Cleanup

- [ ] Remove old backup files (`.old.ts`)
- [ ] Delete unused imports
- [ ] Update component prop types to use `@/types`
- [ ] Replace all `console.log` with `logger`
- [ ] Replace magic strings with constants

### Testing

- [ ] Test all user flows:
  - [ ] Login
  - [ ] View dashboard
  - [ ] Select course
  - [ ] Create chat session
  - [ ] Send messages
  - [ ] Rename session
  - [ ] Delete session
  - [ ] Switch between sessions
  - [ ] Error scenarios

### Documentation

- [ ] Update `README.md` with new architecture notes
- [ ] Document any custom patterns you create
- [ ] Add code comments for complex logic

---

## ✅ Phase 9: Advanced (Optional)

### Performance Optimization

- [ ] Consider adding React Query for caching
- [ ] Add request deduplication
- [ ] Implement optimistic updates

### Testing

- [ ] Write unit tests for hooks
- [ ] Write unit tests for API functions
- [ ] Add integration tests

### Monitoring

- [ ] Set up error reporting (e.g., Sentry)
- [ ] Add analytics logging
- [ ] Create admin dashboard for logs

---

## 📊 Progress Tracking

**Current Status:** _Phase 1 Complete_ ✅

Update this as you complete each phase:

- [x] Phase 1: Setup & Understanding
- [ ] Phase 2: Low-Risk Testing
- [ ] Phase 3: Update Utility Modules
- [ ] Phase 4: Update API Routes
- [ ] Phase 5: Refactor Chat Components
- [ ] Phase 6: Update Page Components
- [ ] Phase 7: Add Error Boundaries
- [ ] Phase 8: Polish & Cleanup
- [ ] Phase 9: Advanced Features

---

## 🐛 Troubleshooting

### Import Errors

If you see module not found errors:
```bash
# Restart Next.js dev server
npm run dev
```

### Type Errors

If TypeScript complains about types:
1. Check imports: `import type { ... } from "@/types"`
2. Restart TypeScript server in VS Code: Cmd+Shift+P → "Restart TS Server"

### Logger Not Working

Make sure you're in development mode:
```bash
# Check NODE_ENV
echo $NODE_ENV  # Should be 'development'
```

### API Client Errors

Check browser console for detailed error logs:
```
[ERROR] API Error: /api/sessions {"error": {...}}
```

---

## 💡 Tips for Success

1. **Go Slowly** - Migrate one file at a time
2. **Test Frequently** - Test after each change
3. **Keep Backups** - Create `.old.ts` backups before major changes
4. **Use Git** - Commit after each successful migration
5. **Check Logs** - Use browser console to verify logging works
6. **Read Docs** - Refer to `REFACTORING_GUIDE.md` when stuck

---

## 🎯 Recommended Order

1. Start with Phase 2 (testing)
2. Move to Phase 3 (utility modules) - **lowest risk**
3. Then Phase 5 (components) - **highest impact**
4. Finally Phases 6-8 (pages & polish)

---

## ✅ Done!

Once you complete all phases:
- [ ] Remove old backup files
- [ ] Update this checklist's progress section
- [ ] Celebrate! 🎉

---

**Questions?** See `REFACTORING_GUIDE.md` or `QUICK_REFERENCE.md`
