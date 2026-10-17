import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser, getProfile, getFavoriteEventIds, getChatSessions } from "@/app/actions/panel";
import { getDictionary, hasLocale, kindLabel, localizedPath, venueLabel } from "@/i18n";
import { findEvent } from "@/lib/events";

export default async function PanelDashboardPage({ params }: PageProps<"/[lang]/panel">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const d = t.panel.dashboard;
  const user = await getCurrentUser();
  const profile = await getProfile();
  const favoriteIds = await getFavoriteEventIds();
  const chatSessions = await getChatSessions();

  const name = profile?.full_name || user?.user_metadata?.full_name || d.defaultName;

  // Match favorite events with full data (tytuły w języku strony)
  const favoriteEvents = favoriteIds.map((id) => findEvent(id, lang)).filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{d.greeting(name)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{d.intro}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{d.favorites}</span>
            <span className="text-xl">❤️</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold">{favoriteIds.length}</span>
          </div>
          <div className="mt-3">
            <Link
              href={localizedPath(lang, "/panel/ulubione")}
              className="text-xs font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {d.seeFavorites}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{d.chats}</span>
            <span className="text-xl">💬</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold">{chatSessions.length}</span>
          </div>
          <div className="mt-3">
            <Link
              href={localizedPath(lang, "/panel/historia")}
              className="text-xs font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {d.seeHistory}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{d.assistant}</span>
            <span className="text-xl">✨</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{d.assistantText}</p>
          <div className="mt-4">
            <Link
              href={localizedPath(lang, "/asystent")}
              className="inline-block rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
            >
              {d.askAi}
            </Link>
          </div>
        </div>
      </div>

      {/* Ulubione koncerty - szybki podgląd */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{d.yourEvents}</h2>
          {favoriteEvents.length > 0 && (
            <Link
              href={localizedPath(lang, "/panel/ulubione")}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              {d.all(favoriteEvents.length)}
            </Link>
          )}
        </div>

        {favoriteEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">{d.noFavorites}</p>
            <Link
              href={localizedPath(lang, "/asystent")}
              className="mt-4 inline-block rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
            >
              {d.discover}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favoriteEvents.slice(0, 4).map((event) => {
              if (!event) return null;
              const nextDate = event.dates?.[0]
                ? new Date(event.dates[0]).toLocaleString(t.intl, {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : t.panel.noDate;

              return (
                <div
                  key={event.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5"
                >
                  <div>
                    {event.kind && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {kindLabel(t, event.kind)}
                      </span>
                    )}
                    <h3 className="mt-1 font-semibold leading-snug">{event.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span aria-hidden>📅 </span>
                      {nextDate}
                      {event.venue && ` · ${venueLabel(t, event.venue)}`}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium underline underline-offset-4 hover:opacity-80"
                    >
                      {d.details}
                    </a>
                    {event.ticketsUrl && (
                      <a
                        href={event.ticketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                      >
                        {d.buyTicket}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
