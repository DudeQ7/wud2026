import { ticketStatus, type TicketStatus } from "@/content/availability";
import { type Dictionary, type Locale, kindLabel, localizedPath, venueLabel } from "@/i18n";
import {
  type FsEvent,
  eventHref,
  formatShortDate,
  formatTime,
  lastDate,
  nextDate,
  ticketHref,
  todayKey,
} from "@/lib/event-format";

/** Gotowe teksty wiersza wydarzenia w panelu (komponent kliencki dostaje je już w języku strony) */
export type PanelEvent = {
  id: number;
  title: string;
  kind?: string;
  /** „pt 24.10 · 19:00” – najbliższy termin, a gdy minął: ostatni */
  when?: string;
  venue?: string;
  href: string;
  ticketsUrl?: string;
  status: TicketStatus;
  statusLabel: string;
};

export function panelEvent(event: FsEvent, lang: Locale, t: Dictionary): PanelEvent {
  const date = nextDate(event, todayKey(new Date())) ?? lastDate(event);
  const status = ticketStatus(event.id);
  return {
    id: event.id,
    title: event.title,
    kind: kindLabel(t, event.kind),
    when: date ? `${formatShortDate(date, t)} · ${formatTime(date)}` : undefined,
    venue: venueLabel(t, event.venue),
    href: localizedPath(lang, eventHref(event)),
    ticketsUrl: localizedPath(lang, ticketHref(event)),
    status,
    statusLabel: t.event.status[status],
  };
}
