import { useState, useEffect } from "react"

export interface ChatSession {
    id: string
    course_id: string
    user_id: string
    created_at: string
    title?: string
}

export function useChatSessions(courseId: string, userId: string) {
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [loading, setLoading] = useState(false)

    async function fetchSessions() {
        setLoading(true)
        try {
            const res = await fetch(`/api/chat/sessions?courseId=${courseId}&userId=${userId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setSessions(data)
        } catch (err) {
            console.error("Failed to fetch sessions:", err)
        } finally {
            setLoading(false)
        }
    }

    async function createSession() {
        try {
            const res = await fetch("/api/chat/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, userId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setSessions(prev => [data, ...prev])
            return data
        } catch (err) {
            console.error("Failed to create session:", err)
        }
    }

    useEffect(() => {
        if (courseId && userId) {
            fetchSessions()
        }
    }, [courseId, userId])

    return { sessions, loading, createSession }
}