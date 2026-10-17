import { chatRequestSchema, streamReply } from "@/lib/assistant";

export async function POST(request: Request) {
  const body = chatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid request" }, { status: 400 });

  try {
    return new Response(await streamReply(body.data), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }
}
