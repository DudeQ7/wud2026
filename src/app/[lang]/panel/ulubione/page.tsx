import Link from "next/link";
import { notFound } from "next/navigation";
import { getFavoriteEventIds } from "@/app/actions/panel";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";
import { findEvent } from "@/lib/events";
import { PanelHeading } from "../PanelHeading";
import { panelEvent } from "../panel-event";
import { FavoriteItem } from "./FavoriteItem";

export default async function FavoritesPage({ params }: PageProps<"/[lang]/panel/ulubione">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.panel.favorites;
  const favoriteIds = await getFavoriteEventIds();

  // Tytuły, rodzaje i sale w języku strony – do komponentu klienckiego idą gotowe teksty
  const favoriteEvents = favoriteIds.flatMap((id) => {
    const event = findEvent(id, lang);
    return event ? [panelEvent(event, lang, dict)] : [];
  });

  return (
    <div>
      <PanelHeading lang={lang} title={t.title} intro={t.intro} />

      {favoriteEvents.length === 0 ? (
        <div className="border-y border-line py-8">
          <h2 className="type-h4 text-gold">{t.emptyTitle}</h2>
          <p className="mt-2 max-w-[68ch] type-body text-text">{t.emptyText}</p>
          <Link href={localizedPath(lang, "/asystent")} className={buttonVariants({ className: "mt-6" })}>
            {t.start}
          </Link>
        </div>
      ) : (
        <div className="grid border-t border-line md:grid-cols-2 md:gap-x-6">
          {favoriteEvents.map((event) => (
            <FavoriteItem key={event.id} lang={lang} event={event} removable />
          ))}
        </div>
      )}
    </div>
  );
}
