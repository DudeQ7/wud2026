import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser, getProfile, getFavoriteEventIds, getChatSessions } from "@/app/actions/panel";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";
import { findEvent } from "@/lib/events";
import { PanelHeading } from "./PanelHeading";
import { panelEvent } from "./panel-event";
import { FavoriteItem } from "./ulubione/FavoriteItem";

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

  // Ulubione z pełnymi danymi (tytuły w języku strony); wydarzenia, których już nie ma w danych, pomijamy
  const favoriteEvents = favoriteIds.flatMap((id) => {
    const event = findEvent(id, lang);
    return event ? [panelEvent(event, lang, t)] : [];
  });

  const stats = [
    { label: d.favorites, value: favoriteIds.length, href: "/panel/ulubione", link: d.seeFavorites },
    { label: d.chats, value: chatSessions.length, href: "/panel/historia", link: d.seeHistory },
  ];

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      <PanelHeading lang={lang} title={d.greeting(name)} intro={d.intro} />

      {/* Liczniki: linie 1 px zamiast kart z cieniem (§5.1) */}
      <dl className="-mt-4 grid border-y border-line sm:grid-cols-3 lg:-mt-6">
        {stats.map((stat) => (
          <div key={stat.href} className="flex flex-col gap-1 border-b border-line py-4 sm:border-r sm:border-b-0 sm:px-5 sm:first:pl-0">
            <dt className="type-meta text-text-muted">{stat.label}</dt>
            <dd className="font-heading text-[2rem] leading-tight font-semibold text-text tabular-nums">{stat.value}</dd>
            <dd>
              <Link href={localizedPath(lang, stat.href)} className={buttonVariants({ variant: "link" })}>
                {stat.link}
              </Link>
            </dd>
          </div>
        ))}
        <div className="flex flex-col gap-2 py-4 sm:px-5">
          <dt className="type-meta text-text-muted">{d.assistant}</dt>
          <dd className="type-meta text-text">{d.assistantText}</dd>
          <dd className="mt-auto">
            <Link href={localizedPath(lang, "/asystent")} className={buttonVariants({ variant: "secondary", size: "sm" })}>
              {d.askAi}
            </Link>
          </dd>
        </div>
      </dl>

      <section aria-labelledby="panel-events">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="panel-events" className="type-h3 text-gold">
            {d.yourEvents}
          </h2>
          {favoriteEvents.length > 0 && (
            <Link href={localizedPath(lang, "/panel/ulubione")} className={buttonVariants({ variant: "link" })}>
              {d.all(favoriteEvents.length)}
            </Link>
          )}
        </div>

        {favoriteEvents.length === 0 ? (
          <div className="border-y border-line py-8">
            <p className="type-body text-text">{d.noFavorites}</p>
            <Link href={localizedPath(lang, "/asystent")} className={buttonVariants({ variant: "secondary", className: "mt-6" })}>
              {d.discover}
            </Link>
          </div>
        ) : (
          <div className="grid border-t border-line md:grid-cols-2 md:gap-x-6">
            {favoriteEvents.slice(0, 4).map((event) => (
              <FavoriteItem key={event.id} lang={lang} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
