// route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // body should be an object with onboarding data
        const supabase = await createSupabaseServerClient();

        // verify user via supabase.auth.getUser() which is secure
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const userId = userData.user.id;

        // update public.users.profile_data - merge with existing if you'd like
        const { data, error } = await supabase
            .from("users")
            .update({ profile_data: body })
            .eq("id", userId)
            .select("*")
            .single();

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, profile: data });
    } catch (err: any) {
        console.error("onboarding route error", err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}