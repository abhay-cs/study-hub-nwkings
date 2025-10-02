# Testing Guide

Quick guide to verify the refactoring works correctly.

---

## ✅ The App is Running!

Your Next.js app is now running at:
- **Local:** http://localhost:3002
- **Network:** http://10.0.0.137:3002

(Port 3002 because 3000 was already in use)

---

## 🧪 How to Test the Refactoring

### **Option 1: Use the Test Page (Recommended)**

1. **Open your browser** and navigate to:
   ```
   http://localhost:3002/test-refactoring
   ```

2. **Click "Run Tests"** button

3. **Check the results** on the page - you should see:
   ```
   ✅ Logger working
   ✅ Constants working
   ✅ Types working
   ✅ UI Components imported successfully
   ✅ File imports working
   ```

4. **Open Browser DevTools** (F12 or Cmd+Option+I)
   - Go to **Console** tab
   - You should see structured logs:
   ```
   [DEBUG] Testing logger utility {"test": "debug"}
   [INFO] Testing info level {"test": "info"}
   [INFO] All tests passed! {"totalTests": 5}
   ```

5. **Scroll down** on the test page to see:
   - Loading spinner example
   - Typing indicator example
   - Component showcase

### **Option 2: Test Your Existing Pages**

1. **Go to Dashboard:**
   ```
   http://localhost:3002/dashboard
   ```

2. **Select a Course** (if you have courses in your database)

3. **Open DevTools Console** and watch for logs
   - You won't see logs yet because existing components haven't been migrated
   - This is expected!

4. **Try the chat** - it should work as before (existing code still works)

---

## 🔍 What to Look For

### **✅ Success Indicators**

1. **App loads without errors**
   - No TypeScript compilation errors
   - No import errors
   - Pages render correctly

2. **Test page works**
   - Tests pass with green checkmarks
   - Console shows structured logs
   - Components render properly

3. **Existing functionality works**
   - Dashboard loads
   - Courses display
   - Chat still works
   - Sessions can be created

### **❌ Potential Issues**

If you see errors, check:

1. **TypeScript errors:**
   ```bash
   # Restart TS server in VS Code
   Cmd+Shift+P → "TypeScript: Restart TS Server"
   ```

2. **Import errors:**
   - Make sure all new files are saved
   - Restart dev server: `npm run dev`

3. **Module not found:**
   - Check `tsconfig.json` has `"@/*": ["./src/*"]`
   - Clear Next.js cache:
     ```bash
     rm -rf .next
     npm run dev
     ```

---

## 📊 Testing Checklist

- [ ] Navigate to http://localhost:3002/test-refactoring
- [ ] Click "Run Tests" button
- [ ] Verify all tests pass (✅)
- [ ] Open browser DevTools Console (F12)
- [ ] Verify logs appear with [DEBUG], [INFO] tags
- [ ] Check logs have JSON context: `{"test": "..."}`
- [ ] Scroll down and view component examples
- [ ] Navigate to /dashboard
- [ ] Verify existing pages still work
- [ ] Check no console errors (red text)

---

## 🧐 Understanding the Logs

### **Development Mode Logs**

You should see logs like this in the console:

```javascript
[2025-09-30T14:17:05.000Z] [DEBUG] Testing logger utility {
  "test": "debug"
}

[2025-09-30T14:17:05.001Z] [INFO] Testing info level {
  "test": "info"
}

[2025-09-30T14:17:05.002Z] [INFO] All tests passed! {
  "totalTests": 5
}
```

**What this means:**
- ✅ Logger utility is working
- ✅ Types are compiling correctly
- ✅ New file structure is recognized
- ✅ Components can import from new locations

### **Production Logs**

In production (`NODE_ENV=production`):
- `[DEBUG]` logs won't appear (filtered out)
- `[ERROR]` logs will still show
- This keeps production console clean!

---

## 🎯 Next Steps After Testing

### **If Everything Works** ✅

1. **Keep the test page** for now (useful reference)

2. **Start migrating components** gradually:
   - Follow `MIGRATION_CHECKLIST.md`
   - Start with Phase 2 (Low-Risk Testing)
   - Move to Phase 3 (Update Utility Modules)

3. **Use the new architecture** for any new features:
   - Import types from `@/types`
   - Use `logger` instead of `console.log`
   - Use custom hooks for state management

### **If You See Errors** ❌

1. **Check the error message** in browser console or terminal

2. **Common fixes:**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Restart dev server
   npm run dev

   # Check TypeScript
   npx tsc --noEmit
   ```

3. **Still stuck?** Check specific error:
   - **Module not found:** Verify file paths in imports
   - **Type error:** Check `src/types/index.ts` exports
   - **Runtime error:** Check browser console for details

---

## 📝 Manual Testing Scenarios

### **Test 1: Logger Works**

Add this to any component temporarily:
```typescript
import { logger } from "@/utils/logger";

logger.debug("Test log", { userId: "123" });
```

Check console for the log.

### **Test 2: Constants Work**

```typescript
import { UI_CONSTANTS } from "@/config/constants";

console.log(UI_CONSTANTS.DEFAULT_SESSION_TITLE); // Should log "New Chat"
```

### **Test 3: Types Work**

```typescript
import type { ChatSession } from "@/types";

const session: ChatSession = {
  id: "1",
  user_id: "2",
  course_id: "3",
  title: "Test",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

console.log(session.id); // Should log "1"
```

### **Test 4: API Client Works**

```typescript
import { apiClient } from "@/lib/api/client";

// In an async function:
try {
  const data = await apiClient.get("/api/some-endpoint");
  console.log(data);
} catch (error) {
  console.error(error); // Will be an ApiError with context
}
```

---

## 🚀 Performance Check

The refactoring should **NOT** slow down your app:
- New files are only imported where used
- Logger is optimized (no-op in production)
- TypeScript compiles to efficient JavaScript
- No runtime overhead from types

Check build time:
```bash
npm run build
```

Should complete without errors and similar time to before.

---

## 🔧 Troubleshooting Commands

```bash
# Restart dev server
npm run dev

# Clear cache and restart
rm -rf .next && npm run dev

# Check TypeScript compilation
npx tsc --noEmit

# Check for type errors in new files
npx tsc --noEmit src/types/index.ts
npx tsc --noEmit src/utils/logger.ts
npx tsc --noEmit src/lib/api/client.ts

# View all TypeScript files
find src -name "*.ts" -o -name "*.tsx"

# Check imports are correct
grep -r "from '@/types'" src/
grep -r "from '@/utils/logger'" src/
```

---

## ✨ Success!

If the test page shows all green checkmarks and logs appear in console:

🎉 **Congratulations!** Your refactoring is working correctly!

Now you can:
1. Read `REFACTORING_GUIDE.md` for usage patterns
2. Use `QUICK_REFERENCE.md` for daily development
3. Follow `MIGRATION_CHECKLIST.md` to update existing code
4. Reference `ARCHITECTURE.md` to understand the design

---

## 📞 Quick Reference

- **Test Page:** http://localhost:3002/test-refactoring
- **Dashboard:** http://localhost:3002/dashboard
- **DevTools:** F12 or Cmd+Option+I (Console tab)
- **Logs:** Browser Console (should show [DEBUG], [INFO] tags)

**Files to check:**
- `src/types/index.ts` - All types
- `src/config/constants.ts` - All constants
- `src/utils/logger.ts` - Logging utility
- `src/lib/api/client.ts` - API client

**Documentation:**
- `REFACTORING_GUIDE.md` - Detailed guide
- `QUICK_REFERENCE.md` - Cheat sheet
- `MIGRATION_CHECKLIST.md` - Step-by-step migration
- `ARCHITECTURE.md` - Design overview

---

**Happy testing! 🚀**
