import { supabase } from "@/lib/supabase/client";


export async function getCurrentUser() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user; // contains id, email, etc.
}

// 🔹 Ensure the user exists in public.users table
export async function ensureUser() {
    const user = await getCurrentUser();
    if (!user) return null;

    // Upsert ensures row exists, updates if it already does
    const { error } = await supabase.from("users").upsert(
        {
            id: user.id, // use Supabase auth.users.id
            email: user.email,
            name: user.user_metadata?.name ?? null,
        },
        { onConflict: "id" }
    );

    if (error) throw error;

    return user;
}