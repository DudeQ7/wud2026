import { Heart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getFavoriteEventIds } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, kindLabel, localizedPath, seriesLabel, venueLabel } from "@/i18n";
import { eventHref, findEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      <header>
        <h1 className="type-h1 text-gold">{t.title}</h1>
        <p className="mt-2 max-w-[68ch] type-body text-text">{t.intro}</p>
      </header>

      {favoriteEvents.length === 0 ? (
        <div className="flex flex-col items-start border border-dashed border-line-strong p-6">
          <Heart {...iconProps} className="size-6 text-text" />
          <h2 className="mt-3 type-h3 text-text">{t.emptyTitle}</h2>
          <p className="mt-1 max-w-[60ch] type-body text-text">{t.emptyText}</p>
          <Link
            href={localizedPath(lang, "/asystent")}
            className={cn(buttonVariants({ variant: "secondary" }), "mt-5 w-fit")}
          >
            {t.start}
          </Link>
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
                  href: localizedPath(lang, eventHref(event)),
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
