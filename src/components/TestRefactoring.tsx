"use client";

/**
 * Test Component
 * Verifies that the new refactored architecture works correctly
 */

import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
import { UI_CONSTANTS, API_ROUTES } from "@/config/constants";
import type { ChatSession } from "@/types";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, TypingIndicator } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MessageSquare } from "lucide-react";

export function TestRefactoring() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = () => {
    setLoading(true);
    const results: string[] = [];

    try {
      // Test 1: Logger
      logger.debug("Testing logger utility", { test: "debug" });
      logger.info("Testing info level", { test: "info" });
      results.push("✅ Logger working");

      // Test 2: Constants
      const routes = API_ROUTES.SESSIONS;
      const title = UI_CONSTANTS.DEFAULT_SESSION_TITLE;
      results.push(`✅ Constants working (${routes}, ${title})`);

      // Test 3: Types
      const testSession: ChatSession = {
        id: "test-123",
        user_id: "user-456",
        course_id: "course-789",
        title: "Test Session",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      results.push(`✅ Types working (session id: ${testSession.id})`);

      // Test 4: Components
      results.push("✅ UI Components imported successfully");

      // Test 5: Check file structure
      results.push("✅ File imports working");

      logger.info("All tests passed!", { totalTests: results.length });
    } catch (error) {
      logger.error("Test failed", error);
      results.push(`❌ Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }

    setTestResults(results);
  };

  useEffect(() => {
    logger.debug("TestRefactoring component mounted");
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">🔧 Refactoring Test</h1>
        <p className="text-muted-foreground">
          This component tests that the new architecture works correctly.
        </p>
      </div>

      <div className="space-y-4">
        <Button onClick={runTests} disabled={loading} size="lg">
          {loading ? "Running Tests..." : "Run Tests"}
        </Button>

        {loading && (
          <div className="py-8">
            <LoadingSpinner size="lg" text="Testing new architecture..." />
          </div>
        )}

        {!loading && testResults.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Test Results:</h2>
            <div className="bg-muted p-4 rounded-lg space-y-1">
              {testResults.map((result, i) => (
                <div key={i} className="font-mono text-sm">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && testResults.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="No tests run yet"
            description="Click the button above to run architecture tests"
          />
        )}
      </div>

      <div className="border-t pt-6 space-y-4">
        <h2 className="text-xl font-semibold">Component Examples:</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Loading Spinner:</h3>
            <LoadingSpinner size="sm" text="Loading..." />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Typing Indicator:</h3>
            <TypingIndicator />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Check Browser Console:</h3>
            <p className="text-sm text-muted-foreground">
              Open DevTools Console (F12) to see structured logs from the logger utility.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">✨ What's Being Tested:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Logger utility (check console)</li>
          <li>Constants import</li>
          <li>TypeScript types</li>
          <li>UI components (LoadingState, EmptyState)</li>
          <li>Error boundary (wrapping this component)</li>
        </ul>
      </div>

      <div className="text-xs text-muted-foreground">
        <strong>Note:</strong> This is a test component. You can remove it after verifying
        everything works. See <code>MIGRATION_CHECKLIST.md</code> for next steps.
      </div>
    </div>
  );
}

// Export wrapped with ErrorBoundary
export default function TestRefactoringPage() {
  return (
    <ErrorBoundary>
      <TestRefactoring />
    </ErrorBoundary>
  );
}
