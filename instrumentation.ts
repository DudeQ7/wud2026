import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogProjectToken && process.env.NODE_ENV === "development") {
  console.warn("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is missing; server PostHog logs are disabled");
}

if (!posthogHost && process.env.NODE_ENV === "development") {
  console.warn("NEXT_PUBLIC_POSTHOG_HOST is missing; server PostHog logs are disabled");
}

export const posthogLogProvider = posthogProjectToken && posthogHost
  ? new LoggerProvider({
      resource: resourceFromAttributes({ "service.name": "wud2026" }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogProjectToken}`,
              "Content-Type": "application/json",
            },
          }),
        }),
      ],
    })
  : null;

export const posthogAssistantLogger = posthogLogProvider?.getLogger("posthog-assistant-route");
