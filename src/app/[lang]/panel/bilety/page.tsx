import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/app/actions/panel";
import { buttonVariants } from "@/components/ui/button";
import { mockTickets } from "@/content/tickets";
import { getDictionary, hasLocale, localizedPath, venueLabel } from "@/i18n";
import { eventHref, formatLongDate, formatTime, nextDate, todayKey } from "@/lib/event-format";
import { findEvent } from "@/lib/events";
import { PanelHeading } from "../PanelHeading";

/** Moje bilety (scenariusz E): bilety bez szukania w poczcie – na razie przykładowe, docelowo z iksoris */
export default async function TicketsPage({ params }: PageProps<"/[lang]/panel/bilety">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const p = t.panel.tickets;
  // Odczyt sesji (cookies) czyni stronę dynamiczną – bilety są osobiste, a data „dziś” zmienia się codziennie
  await getCurrentUser();
  const today = todayKey(new Date());

  const tickets = mockTickets
    .flatMap((ticket) => {
      const event = findEvent(ticket.eventId, lang);
      const date = event && nextDate(event, today);
      return event && date ? [{ ticket, event, date }] : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <PanelHeading lang={lang} title={p.title} intro={p.intro} />
      <p className="mb-6 max-w-[68ch] border-l-2 border-line-strong pl-4 type-meta text-text-muted">{p.demoNote}</p>

      {tickets.length === 0 ? (
        <div className="border-y border-line py-8">
          <h2 className="type-h4 text-gold">{p.emptyTitle}</h2>
          <p className="mt-2 max-w-[68ch] type-body text-text">{p.emptyText}</p>
          <Link href={localizedPath(lang, "/repertuar")} className={buttonVariants({ className: "mt-6" })}>
            {p.browse}
          </Link>
        </div>
      ) : (
        <ul aria-label={p.listLabel} className="grid border-t border-line md:grid-cols-2 md:gap-x-6">
          {tickets.map(({ ticket, event, date }) => {
            const href = localizedPath(lang, eventHref(event));
            const seatCount = ticket.seatTo - ticket.seatFrom + 1;
            return (
              <li key={ticket.id} className="flex flex-col gap-3 border-b border-line py-4 lg:py-5">
                <div className="flex flex-col gap-1">
                  <p className="type-label text-text-muted">{formatLongDate(date.slice(0, 10), t)}</p>
                  <h2 className="type-title-card text-text">
                    <Link href={href} className="underline-offset-4 hover:underline">
                      {event.title}
                    </Link>
                  </h2>
                  <p className="type-meta text-text-muted tabular-nums">
                    {[formatTime(date), venueLabel(t, event.venue)].join(" · ")}
                  </p>
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-y border-line py-3 type-meta">
                  <dt className="font-semibold text-text-muted">{p.count(seatCount)}</dt>
                  <dd className="text-text">{p.seats(ticket.row, ticket.seatFrom, ticket.seatTo)}</dd>
                  <dt className="font-semibold text-text-muted">{p.order}</dt>
                  <dd className="text-text tabular-nums">{ticket.order}</dd>
                </dl>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/api/events/${event.id}/ics`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    {p.addToCalendar}
                  </a>
                  {event.programPdf ? (
                    <a
                      href={event.programPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      {p.programPdf}
                    </a>
                  ) : (
                    <Link href={href} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                      {p.program}
                    </Link>
                  )}
                  <Link href={localizedPath(lang, "/planuj-wizyte")} className={buttonVariants({ variant: "link" })}>
                    {p.planVisit}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
