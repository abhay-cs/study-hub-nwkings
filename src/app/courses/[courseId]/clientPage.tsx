"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar-course";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChatBot } from "@/components/chatbot";

export default function ClientPage({
  course,
  user,
}: {
  course: any;
  user: { id: string; name: string; email: string };
}) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return (
    <SidebarProvider style={{ "--sidebar-width": "20rem" } as React.CSSProperties}>
      <AppSidebar
        user={user}
        course={{ id: course.id }}
        currentSessionId={currentSessionId || ""}
        onSessionSelect={(id) => setCurrentSessionId(id)}
        onNewChat={() => setCurrentSessionId(null)}
      />

      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-14 shrink-0 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-muted-foreground">Course:</span>
            <span>{course?.name || "Loading..."}</span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatBot course={course} sessionId={currentSessionId} userId={user.id} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}