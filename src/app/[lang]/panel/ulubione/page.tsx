import Link from "next/link";
import { notFound } from "next/navigation";
import { getFavoriteEventIds } from "@/app/actions/panel";
import { getDictionary, hasLocale, kindLabel, localizedPath, seriesLabel, venueLabel } from "@/i18n";
import { findEvent } from "@/lib/events";
import { FavoriteItem } from "./FavoriteItem";

export default async function FavoritesPage({ params }: PageProps<"/[lang]/panel/ulubione">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.panel.favorites;
  const favoriteIds = await getFavoriteEventIds();

  // Tytuły, rodzaje, sale i cykle w języku strony – do komponentu klienckiego idą gotowe teksty
  const favoriteEvents = favoriteIds.map((id) => findEvent(id, lang)).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
      </div>

      {favoriteEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <span className="text-3xl" aria-hidden>❤️</span>
          <h2 className="mt-3 text-lg font-semibold">{t.emptyTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.emptyText}</p>
          <div className="mt-6">
            <Link
              href={localizedPath(lang, "/asystent")}
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
            >
              {t.start}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favoriteEvents.map((event) => {
            if (!event) return null;
            return (
              <FavoriteItem
                key={event.id}
                lang={lang}
                event={{
                  id: event.id,
                  title: event.title,
                  kind: kindLabel(dict, event.kind),
                  series: seriesLabel(dict, event.series),
                  dates: event.dates,
                  venue: venueLabel(dict, event.venue),
                  url: event.url,
                  ticketsUrl: event.ticketsUrl,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
