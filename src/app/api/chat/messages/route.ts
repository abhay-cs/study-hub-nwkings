import { NextResponse } from "next/server"
import { saveMessage, getMessages } from "@/lib/messages"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    // Authenticate user
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("user_id")
      .eq("id", sessionId)
      .single()

    if (sessionError || !session || session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const messages = await getMessages(supabase, sessionId)
    return NextResponse.json(messages)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Authenticate user
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, role, message } = await req.json()
    if (!sessionId || !role || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("user_id")
      .eq("id", sessionId)
      .single()

    if (sessionError || !session || session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await saveMessage(supabase, sessionId, role, message)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}