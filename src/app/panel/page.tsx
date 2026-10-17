import Link from "next/link";
import { getCurrentUser, getProfile, getFavoriteEventIds, getChatSessions } from "@/app/actions/panel";
import koncerty from "@/data/koncerty.json";

export default async function PanelDashboardPage() {
  const user = await getCurrentUser();
  const profile = await getProfile();
  const favoriteIds = await getFavoriteEventIds();
  const chatSessions = await getChatSessions();

  const name = profile?.full_name || user?.user_metadata?.full_name || "Melomanie";

  // Match favorite events with full data
  const favoriteEvents = favoriteIds
    .map((id) => koncerty.events.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Witaj, {name}! 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Oto Twój osobisty pulpit Filharmonii im. Mieczysława Karłowicza w Szczecinie.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Ulubione koncerty</span>
            <span className="text-xl">❤️</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold">{favoriteIds.length}</span>
          </div>
          <div className="mt-3">
            <Link
              href="/panel/ulubione"
              className="text-xs font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              Zobacz listę ulubionych →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Zapisane rozmowy</span>
            <span className="text-xl">💬</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold">{chatSessions.length}</span>
          </div>
          <div className="mt-3">
            <Link
              href="/panel/historia"
              className="text-xs font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              Przeglądaj historię rozmów →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Asystent Filharmonii</span>
            <span className="text-xl">✨</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Szukasz koncertu na weekend, biletów rodzinnych lub informacji o dojeździe?
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-block rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
            >
              Zapytaj AI teraz
            </Link>
          </div>
        </div>
      </div>

      {/* Ulubione koncerty - szybki podgląd */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Twoje wybrane wydarzenia</h2>
          {favoriteEvents.length > 0 && (
            <Link
              href="/panel/ulubione"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Wszystkie ({favoriteEvents.length})
            </Link>
          )}
        </div>

        {favoriteEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nie dodałeś jeszcze żadnego koncertu do ulubionych.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
            >
              Przejdź do asystenta i odkryj koncerty
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favoriteEvents.slice(0, 4).map((event) => {
              if (!event) return null;
              const nextDate = event.dates?.[0]
                ? new Date(event.dates[0]).toLocaleString("pl-PL", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "Brak ustalonej daty";

              return (
                <div
                  key={event.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5"
                >
                  <div>
                    {event.kind_label && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {event.kind_label}
                      </span>
                    )}
                    <h3 className="mt-1 font-semibold leading-snug">{event.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      📅 {nextDate}
                      {event.venue && ` · ${event.venue}`}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium underline underline-offset-4 hover:opacity-80"
                    >
                      Szczegóły
                    </a>
                    {event.tickets_url && (
                      <a
                        href={event.tickets_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                      >
                        Kup bilet
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
