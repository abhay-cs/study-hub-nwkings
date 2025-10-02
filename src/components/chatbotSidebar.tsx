"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MessageSquarePlus,
    MessageSquare,
    Search,
    MoreHorizontal,
    Edit3,
    Trash2,
} from "lucide-react";
import { getSessions, createSession, updateSession, deleteSession } from "@/lib/sessions";
import { supabase } from "@/lib/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatSession {
    id: string;
    title: string | null;
    created_at: string;
    updated_at: string;
}

interface ChatHistorySidebarProps {
    currentSessionId?: string;
    onSessionSelect: (sessionId: string) => void;
    onSessionTitleUpdate?: (sessionId: string, newTitle: string) => void;
    userId: string;
    courseId: string;
}

export function ChatHistorySidebar({
    currentSessionId,
    onSessionSelect,
    onSessionTitleUpdate,
    userId,
    courseId,
}: ChatHistorySidebarProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const [editingSession, setEditingSession] = useState<ChatSession | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [deletingSession, setDeletingSession] = useState<ChatSession | null>(null);

    // Fetch sessions from DB
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await getSessions(supabase, userId, courseId);
                setSessions(data);
            } catch (err) {
                console.error("Error loading sessions:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId, courseId]);

    function updateTitleLocally(sessionId: string, newTitle: string) {
        setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
        );
        if (onSessionTitleUpdate) {
            onSessionTitleUpdate(sessionId, newTitle);
        }
    }

    // Start a new chat session
    async function handleNewChat() {
        try {
            const newSession = await createSession(supabase, userId, courseId, "New Chat");
            setSessions((prev) => [newSession, ...prev]);
            onSessionSelect(newSession.id);
        } catch (err) {
            console.error("Error creating session:", err);
        }
    }

    // Save edit
    async function handleSaveEdit() {
        if (!editingSession || !newTitle.trim()) return;
        try {
            const updated = await updateSession(supabase, editingSession.id, { title: newTitle.trim() });
            setSessions((prev) =>
                prev.map((s) => (s.id === editingSession.id ? { ...s, title: updated.title } : s))
            );
            setEditingSession(null);
            setNewTitle("");
        } catch (err) {
            console.error("Error updating session:", err);
        }
    }

    // Confirm delete
    async function confirmDelete() {
        if (!deletingSession) return;
        try {
            await deleteSession(supabase, deletingSession.id);
            setSessions((prev) => prev.filter((s) => s.id !== deletingSession.id));
            setDeletingSession(null);
        } catch (err) {
            console.error("Error deleting session:", err);
        }
    }

    const filteredSessions = sessions.filter((s) =>
        (s.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
                <Button
                    onClick={handleNewChat}
                    className="w-full justify-start gap-2 h-10"
                    variant="outline"
                >
                    <MessageSquarePlus className="w-4 h-4" />
                    New Chat
                </Button>
            </div>

            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-2">
                    <div className="p-2 space-y-2">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading...</p>
                        ) : filteredSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No conversations yet</p>
                            </div>
                        ) : (
                            filteredSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={`flex items-center justify-between w-full px-2 py-1 rounded-lg ${currentSessionId === session.id
                                            ? "bg-primary/10 border border-primary/20"
                                            : "hover:bg-muted/50"
                                        }`}
                                >
                                    {/* Session button */}
                                    <button
                                        onClick={() => onSessionSelect(session.id)}
                                        className="flex-1 text-left p-2"
                                    >
                                        <h4 className="text-sm font-medium truncate">
                                            {session.title || "Untitled Chat"}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(session.updated_at).toLocaleString()}
                                        </p>
                                    </button>

                                    {/* Actions menu (3 dots) */}
                                    <div className="flex-shrink-0">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingSession(session);
                                                        setNewTitle(session.title || "");
                                                    }}
                                                >
                                                    <Edit3 className="w-4 h-4 mr-2" />
                                                    Rename
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingSession(session)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Conversation</DialogTitle>
                        <DialogDescription>
                            Give this conversation a more descriptive name.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter conversation title..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                        }}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSession(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={!newTitle.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingSession} onOpenChange={() => setDeletingSession(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingSession?.title}&quot;? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}