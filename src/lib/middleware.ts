import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";


export async function middleware(req: NextRequest) {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    const isAuthRoute = req.nextUrl.pathname.startsWith("/auth")
    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") // OR 
        || req.nextUrl.pathname.startsWith("/courses");

    
    if (!session && isProtectedRoute) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // next() middleware thingy.. 
    return NextResponse.next();
}