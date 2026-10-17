import { z } from "zod";
import { messageSchema, streamReply } from "@/lib/assistant";

const bodySchema = z.object({ messages: z.array(messageSchema).min(1).max(100) });

export async function POST(request: Request) {
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid request" }, { status: 400 });

  try {
    return new Response(await streamReply(body.data.messages), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }
}
