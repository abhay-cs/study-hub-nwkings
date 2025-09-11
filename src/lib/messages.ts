import { supabase } from "./supabase/client"

export async function saveMessage(sessionId: string, role: "user" | "bot", message: string) {
    const { error } = await supabase
        .from("chat_messages")
        .insert([{ session_id: sessionId, role, message }]);
    if (error) throw error;
}


//fetch messages for a session and returns it order wise..
export async function getMessages(sessionId: string) {
    const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })

    if (error) throw error;

    return data;
}