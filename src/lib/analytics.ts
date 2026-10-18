import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let initialized = false;

/**
 * PostHog startuje dopiero po zgodzie (§6.18). Wywoływane z `instrumentation-client.ts`
 * przy zapisanej zgodzie i z banera po kliknięciu „Akceptuj”.
 */
export function initAnalytics() {
  if (!key) {
    if (process.env.NODE_ENV === "development") console.warn("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is missing");
    return;
  }
  if (!host) {
    if (process.env.NODE_ENV === "development") console.warn("NEXT_PUBLIC_POSTHOG_HOST is missing");
    return;
  }

  if (initialized) {
    posthog.opt_in_capturing();
    return;
  }

  posthog.init(key, {
    api_host: host,
    defaults: "2026-05-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
  initialized = true;
}

/** Wycofanie zgody: zatrzymuje wysyłkę i czyści identyfikator przeglądarki. */
export function disableAnalytics() {
  if (!initialized) return;
  posthog.opt_out_capturing();
  posthog.reset();
}
