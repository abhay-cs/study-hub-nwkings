import { supabase } from "./supabase/client";


export async function handleSession(userId: string, courseId: string) {
    // Check if a session already exists
    const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

    if (error) throw error;

    if (data) return data;

    // Otherwise create a new session
    const { data: newSession, error: insertError } = await supabase
        .from("chat_sessions")
        .insert([{ user_id: userId, course_id: courseId }])
        .select()
        .single();

    if (insertError) throw insertError;

    return newSession;
}