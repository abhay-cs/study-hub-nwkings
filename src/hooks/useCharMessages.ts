import { useState, useEffect } from "react"

export interface ChatMessage {
    id: string
    session_id: string
    role: "user" | "assistant" | "bot"
    message: string
    created_at: string
}

export function useChatMessages(sessionId?: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)

    async function fetchMessages() {
        if (!sessionId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setMessages(data)
        } catch (err) {
            console.error("Failed to fetch messages:", err)
        } finally {
            setLoading(false)
        }
    }

    async function sendMessage(role: "user" | "assistant" | "bot", message: string) {
        if (!sessionId) return
        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, role, message }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            // Add optimistically
            setMessages(prev => [...prev, { id: crypto.randomUUID(), session_id: sessionId, role, message, created_at: new Date().toISOString() }])
        } catch (err) {
            console.error("Failed to send message:", err)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [sessionId])

    return { messages, loading, sendMessage }
}