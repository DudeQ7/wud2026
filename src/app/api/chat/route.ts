import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { posthogAssistantLogger, posthogLogProvider } from "../../../../instrumentation";
import { chatRequestSchema, streamReply } from "@/lib/assistant";
import { createClient } from "@/lib/supabase/server";

function flushPostHogLogs() {
  after(async () => {
    await posthogLogProvider?.forceFlush();
  });
}

export async function POST(request: Request) {
  const body = chatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid request" }, { status: 400 });

  posthogAssistantLogger?.emit({
    body: "assistant request accepted",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: "assistant_request_accepted",
      route: "/api/chat",
      language: body.data.lang,
      message_count: body.data.messages.length,
    },
  });

  let distinctId: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    distinctId = user?.id;
  } catch {
    // The public assistant remains available when no authenticated Supabase user is present.
  }

  try {
    const response = new Response(await streamReply(body.data, distinctId), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });

    posthogAssistantLogger?.emit({
      body: "assistant response stream started",
      severityNumber: SeverityNumber.INFO,
      attributes: { event: "assistant_response_stream_started", route: "/api/chat" },
    });
    flushPostHogLogs();
    return response;
  } catch (error) {
    posthogAssistantLogger?.emit({
      body: "assistant response unavailable",
      severityNumber: SeverityNumber.ERROR,
      attributes: { event: "assistant_response_unavailable", route: "/api/chat" },
    });
    flushPostHogLogs();
    console.error(error);
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }
}
