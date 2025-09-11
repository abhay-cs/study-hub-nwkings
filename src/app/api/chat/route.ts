import { NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai";

export async function POST(req: Request) {
  const { question } = await req.json();
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