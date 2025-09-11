import { supabase } from "./supabase/client"
import { getUserId } from "./user"

export async function handleSession(userId: string, CourseId: string) {
    // const userId = getUserId();

    const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", CourseId)
        .maybeSingle();

    if (error) throw error;

    if (data) return data;

    // otherwise creart a new session

    const { data: newSession, error: insertError } = await supabase
        .from("chat_sessions")
        .insert([{ user_id: userId, course_id: CourseId }])
        .select()
        .single()

    if (insertError) throw insertError;

    return newSession;

}