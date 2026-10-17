import { getPostHogAnalytics } from "@/lib/posthog-analytics";
import Link from "next/link";

// The dashboard reads request-time confirmation state and live PostHog data.
export const instant = false;

function formatNumber(value: number) {
  return new Intl.NumberFormat("pl-PL").format(value);
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-extrabold">{formatNumber(value)}</p>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function WarningScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-8">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          MVP · Analityka
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Uwaga: prawdziwe dane</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ten ekran pokazuje prawdziwe dane analityczne z PostHoga. Nie udostępniaj
          tego adresu osobom spoza zespołu i nie kopiuj prezentowanych informacji
          do publicznych materiałów.
        </p>
        <Link
          href="/analityka?confirmed=1"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background"
        >
          Rozumiem, pokaż dane
        </Link>
      </section>
    </main>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const { confirmed } = await searchParams;

  if (confirmed !== "1") {
    return <WarningScreen />;
  }

  const result = await getPostHogAnalytics();

  if (result.status === "not-configured") {
    return (
      <main className="min-h-dvh bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Analityka PostHoga</h1>
          <div className="rounded-2xl border border-border bg-background p-6 text-sm">
            <p className="font-semibold">Dodaj do `.env.local`:</p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">
              {`POSTHOG_PERSONAL_API_KEY=phx_...
POSTHOG_PROJECT_ID=123456`}
            </pre>
            <p className="mt-4 text-xs text-muted-foreground">
              Klucz osobisty musi mieć uprawnienie `query:read`. Nie używaj go w zmiennej
              `NEXT_PUBLIC_*`.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (result.status === "error") {
    return (
      <main className="min-h-dvh bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background p-6">
          <h1 className="text-2xl font-bold">Nie udało się pobrać danych</h1>
          <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
        </div>
      </main>
    );
  }

  const { data } = result;

  return (
    <main className="min-h-dvh bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Prawdziwe dane · PostHog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Analityka PostHoga</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dane z ostatnich {data.periodDays} dni, pobierane bezpośrednio z Query API.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Zdarzenia"
            value={data.summary.events}
            description="Wszystkie zarejestrowane eventy"
          />
          <MetricCard
            label="Użytkownicy"
            value={data.summary.users}
            description="Unikalne distinct_id"
          />
          <MetricCard
            label="Aktywne dni"
            value={data.summary.activeDays}
            description="Dni z co najmniej jednym eventem"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold">Najczęstsze eventy</h2>
            <div className="mt-4 divide-y divide-border">
              {data.topEvents.map((event) => (
                <div key={event.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="truncate">{event.name}</span>
                  <span className="shrink-0 font-semibold">{formatNumber(event.count)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold">Najczęściej odwiedzane podstrony</h2>
            <div className="mt-4 divide-y divide-border">
              {data.topPages.map((page) => (
                <div key={page.url} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="truncate">{page.url}</span>
                  <span className="shrink-0 font-semibold">{formatNumber(page.views)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
