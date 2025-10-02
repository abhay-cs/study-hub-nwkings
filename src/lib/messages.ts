import { SupabaseClient } from "@supabase/supabase-js"
import { supabase } from "./supabase/client"

export async function saveMessage(
    supabaseClient: SupabaseClient | typeof supabase,
    sessionId: string,
    role: "user" | "bot",
    message: string
) {
    const { error } = await supabaseClient
        .from("chat_messages")
        .insert([{ session_id: sessionId, role, message }]);
    if (error) throw error;

    // Auto-generate session title from first user message
    if (role === "user") {
        const { data: session } = await supabaseClient
            .from("chat_sessions")
            .select("title")
            .eq("id", sessionId)
            .single();

        if (session && session.title == "New Chat") {
            const generatedTitle = message.split(" ").slice(0, 8).join(" ");
            await supabaseClient
                .from("chat_sessions")
                .update({ title: generatedTitle })
                .eq("id", sessionId);
        }
    }
}


//fetch messages for a session and returns it order wise..
export async function getMessages(
    supabaseClient: SupabaseClient | typeof supabase,
    sessionId: string
) {
    const { data, error } = await supabaseClient
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })

    if (error) throw error;

    return data;
}