import { ArrowRight, CalendarDays, Heart, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getChatSessions, getCurrentUser, getFavoriteEventIds, getProfile } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, kindLabel, localizedPath, venueLabel } from "@/i18n";
import { eventHref, findEvent, formatShortDate, formatTime } from "@/lib/events";
import { cn } from "@/lib/utils";

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

  const stats = [
    {
      key: "favorites",
      label: d.favorites,
      value: favoriteIds.length,
      href: "/panel/ulubione",
      link: d.seeFavorites,
      icon: Heart,
    },
    {
      key: "chats",
      label: d.chats,
      value: chatSessions.length,
      href: "/panel/historia",
      link: d.seeHistory,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="type-h1 text-gold">{d.greeting(name)}</h1>
        <p className="mt-2 max-w-[68ch] type-body text-text">{d.intro}</p>
      </header>

      <section aria-label={t.panel.title} className="grid gap-4 sm:grid-cols-2">
        {stats.map(({ key, label, value, href, link, icon: Icon }) => (
          <article key={key} className="flex flex-col border border-line p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="type-label text-text-muted">{label}</p>
              <Icon {...iconProps} className="size-5 shrink-0 text-text" />
            </div>
            <p className="mt-4 font-heading text-4xl leading-none font-semibold text-text tabular-nums">{value}</p>
            <Link href={localizedPath(lang, href)} className={cn(buttonVariants({ variant: "link" }), "mt-4 w-fit")}>
              {link} <ArrowRight {...iconProps} className="size-4" />
            </Link>
          </article>
        ))}

        <article className="flex flex-col border border-line p-5 sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <p className="type-label text-text-muted">{d.assistant}</p>
            <Sparkles {...iconProps} className="size-5 shrink-0 text-text" />
          </div>
          <p className="mt-3 max-w-[52ch] type-body text-text">{d.assistantText}</p>
          <Link href={localizedPath(lang, "/asystent")} className={cn(buttonVariants({ variant: "primary" }), "mt-4 w-fit")}>
            {d.askAi}
          </Link>
        </article>
      </section>

      <section aria-labelledby="ulubione-panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="ulubione-panel" className="type-h3 text-gold">
            {d.yourEvents}
          </h2>
          {favoriteEvents.length > 0 && (
            <Link href={localizedPath(lang, "/panel/ulubione")} className={cn(buttonVariants({ variant: "link" }), "w-fit")}>
              {d.all(favoriteEvents.length)}
            </Link>
          )}
        </div>

        {favoriteEvents.length === 0 ? (
          <div className="mt-4 flex flex-col items-start border border-dashed border-line-strong p-6">
            <Heart {...iconProps} className="size-6 text-text" />
            <p className="mt-3 type-body text-text">{d.noFavorites}</p>
            <Link
              href={localizedPath(lang, "/asystent")}
              className={cn(buttonVariants({ variant: "secondary" }), "mt-4 w-fit")}
            >
              {d.discover}
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {favoriteEvents.slice(0, 4).map((event) => {
              if (!event) return null;
              const next = event.dates?.[0];

              return (
                <article key={event.id} className="flex flex-col border-[1.5px] border-line-strong p-4">
                  <div>
                    {event.kind && <p className="type-eyebrow text-gold">{kindLabel(t, event.kind)}</p>}
                    <h3 className="mt-1 type-title-card text-text">{event.title}</h3>
                    <p className="mt-2 flex items-center gap-1.5 type-meta text-text-muted">
                      <CalendarDays {...iconProps} className="size-4 shrink-0" />
                      {next ? `${formatShortDate(next, t)} · ${formatTime(next)}` : t.panel.noDate}
                      {event.venue && ` · ${venueLabel(t, event.venue)}`}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                    <Link
                      href={localizedPath(lang, eventHref(event))}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      {d.details}
                    </Link>
                    {event.ticketsUrl && (
                      <a
                        href={event.ticketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: "primary", size: "sm" })}
                      >
                        {d.buyTicket}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
