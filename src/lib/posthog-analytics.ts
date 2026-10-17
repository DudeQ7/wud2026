const PERIOD_DAYS = 30;

type QueryRow = Record<string, unknown>;

type QueryResponse = {
  results?: QueryRow[] | unknown[][];
  detail?: string;
};

export type PostHogAnalytics = {
  periodDays: number;
  summary: {
    events: number;
    users: number;
    activeDays: number;
  };
  topEvents: Array<{ name: string; count: number }>;
  topPages: Array<{ url: string; views: number }>;
};

function getResultValue(row: QueryRow | unknown[], key: string, index: number) {
  if (Array.isArray(row)) return row[index];
  return row[key];
}

function asNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "Nieznane";
}

async function runHogQL(query: string): Promise<QueryResponse> {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace(/\/$/, "");
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

  if (!host || !projectId || !apiKey) {
    throw new Error("PostHog analytics is not configured");
  }

  const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
    cache: "no-store",
  });

  const body = (await response.json()) as QueryResponse;

  if (!response.ok) {
    throw new Error(body.detail || `PostHog query failed with status ${response.status}`);
  }

  return body;
}

function isAnalyticsConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_HOST &&
      process.env.POSTHOG_PROJECT_ID &&
      process.env.POSTHOG_PERSONAL_API_KEY
  );
}

export async function getPostHogAnalytics(): Promise<
  | { status: "ok"; data: PostHogAnalytics }
  | { status: "not-configured" }
  | { status: "error"; message: string }
> {
  if (!isAnalyticsConfigured()) {
    return { status: "not-configured" };
  }

  const dateFilter = `timestamp >= now() - INTERVAL ${PERIOD_DAYS} DAY`;

  try {
    const [summary, topEvents, topPages] = await Promise.all([
      runHogQL(`
        SELECT
          count() AS events,
          count(distinct distinct_id) AS users,
          count(distinct toDate(timestamp)) AS active_days
        FROM events
        WHERE ${dateFilter}
      `),
      runHogQL(`
        SELECT event, count() AS event_count
        FROM events
        WHERE ${dateFilter}
        GROUP BY event
        ORDER BY event_count DESC
        LIMIT 10
      `),
      runHogQL(`
        SELECT properties.$current_url AS page_url, count() AS view_count
        FROM events
        WHERE event = '$pageview'
          AND ${dateFilter}
          AND properties.$current_url IS NOT NULL
        GROUP BY page_url
        ORDER BY view_count DESC
        LIMIT 10
      `),
    ]);

    const summaryRow = summary.results?.[0] ?? [];

    return {
      status: "ok",
      data: {
        periodDays: PERIOD_DAYS,
        summary: {
          events: asNumber(getResultValue(summaryRow, "events", 0)),
          users: asNumber(getResultValue(summaryRow, "users", 1)),
          activeDays: asNumber(getResultValue(summaryRow, "active_days", 2)),
        },
        topEvents: (topEvents.results ?? []).map((row) => ({
          name: asString(getResultValue(row, "event", 0)),
          count: asNumber(getResultValue(row, "event_count", 1)),
        })),
        topPages: (topPages.results ?? []).map((row) => ({
          url: asString(getResultValue(row, "page_url", 0)),
          views: asNumber(getResultValue(row, "view_count", 1)),
        })),
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Nie udało się pobrać danych z PostHoga.",
    };
  }
}
