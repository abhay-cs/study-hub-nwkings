import { SupabaseClient } from "@supabase/supabase-js"
import { supabase } from "./supabase/client";



// Get all sessions for a user + course
export async function getSessions(
    supabaseClient: SupabaseClient | typeof supabase,
    userId: string,
    courseId: string
) {
    const { data, error } = await supabaseClient
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
}

// Create a new session (always inserts a new row)
export async function createSession(
    supabaseClient: SupabaseClient | typeof supabase,
    userId: string,
    courseId: string,
    title?: string
) {
    const { data, error } = await supabaseClient
        .from("chat_sessions")
        .insert([{ user_id: userId, course_id: courseId, title }])
        .select()
        .single();

    if (error) throw error;
    return data;
}


export async function updateSession(
    supabaseClient: SupabaseClient | typeof supabase,
    sessionId: string,
    updates: { title?: string }
) {
    const { data, error } = await supabaseClient
        .from("chat_sessions")
        .update(updates)
        .eq("id", sessionId)
        .select()
        .single();

    if (error) throw error;
    return data;
}


export async function deleteSession(
    supabaseClient: SupabaseClient | typeof supabase,
    sessionId: string
) {
    const { error } = await supabaseClient.from("chat_sessions").delete().eq("id", sessionId);
    if (error) throw error;
    return true;
}

export async function handleSession(
    supabaseClient: SupabaseClient | typeof supabase,
    userId: string,
    courseId: string
) {
    // Check if a session already exists
    const { data, error } = await supabaseClient
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

    if (error) throw error;

    if (data) return data;

    // Otherwise create a new session
    const { data: newSession, error: insertError } = await supabaseClient
        .from("chat_sessions")
        .insert([{ user_id: userId, course_id: courseId }])
        .select()
        .single();

    if (insertError) throw insertError;

    return newSession;
}