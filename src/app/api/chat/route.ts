import { NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  // Authenticate user
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question } = await req.json();

  // Validate input
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  }

  // Limit question length to prevent abuse
  if (question.length > 5000) {
    return NextResponse.json({ error: "Question too long (max 5000 chars)" }, { status: 400 });
  }

  const stream = await streamChatResponse(question);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(token));
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}