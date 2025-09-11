import { v4 as uuidv4 } from "uuid";
import {supabase} from "@/lib/supabase/client"
export function getUserId() {
    if (typeof window === "undefined") {
        return null; // avoid crashing on server
    }

    let userId = localStorage.getItem("user_id");
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem("user_id", userId);
    }
    return userId;
}

export async function ensureUser(userId: string) {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

    if (!data) {
        // insert new user row
        const { error: insertError } = await supabase
            .from("users")
            .insert([{ id: userId }]); // add other required columns if needed
        if (insertError) throw insertError;
    }
}