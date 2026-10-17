import { Search } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { EventRow } from "@/components/fs/event-row"
import { iconProps } from "@/components/fs/icons"
import { Container } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { calendarEditorial } from "@/content/calendar"
import { toCalendarEvent } from "@/lib/calendar"
import { eventDetails, eventHref, events, todayKey } from "@/lib/events"
import { plural } from "@/lib/calendar"
import { GROUP_LIMITS, type SearchDoc, search, total } from "@/lib/search"

export const metadata: Metadata = {
  title: "Szukaj – Filharmonia w Szczecinie",
  description: "Szukaj wydarzeń, artystów, utworów i tekstów. Działa bez polskich znaków i z literówkami.",
}

const docs: SearchDoc[] = events.map((event) => ({
  event: toCalendarEvent(event, calendarEditorial),
  details: eventDetails(event.id),
}))

const EXAMPLES = ["jazz w październiku", "Karłowicz", "dla dzieci weekend", "Beethoven", "wystawy", "Mozart"]

const rowLink = "block min-h-11 py-3 text-text hover:underline hover:underline-offset-4"

/** Wyszukiwarka (design.md §6.15): zwykły formularz GET, więc działa bez JS i daje link do wyników */
export default function SearchPage({ searchParams }: PageProps<"/szukaj">) {
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>
      <SiteHeader />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container className="max-w-3xl">
          <h1 className="type-h1 text-gold">Szukaj</h1>
          <Suspense fallback={<div className="mt-6 h-40 bg-surface-muted" role="status" aria-busy="true" aria-label="Wczytywanie" />}>
            <Content searchParams={searchParams} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter />
      <BottomNav current="/szukaj" />
    </>
  )
}

async function Content({ searchParams }: Pick<PageProps<"/szukaj">, "searchParams">) {
  const params = await searchParams
  await connection()
  const raw = Array.isArray(params.q) ? params.q[0] : params.q
  const query = raw?.trim().slice(0, 100) ?? ""
  const results = query ? search(docs, query, todayKey(new Date())) : undefined
  const count = results ? total(results) : 0

  return (
    <>
      <form action="/szukaj" role="search" className="mt-4">
        <label htmlFor="q" className="type-ui block text-text">
          Szukaj wydarzeń, artystów, utworów
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="np. jazz w październiku"
            autoComplete="off"
            className="h-13 min-w-0 flex-1 border-[1.5px] border-line-strong bg-background px-3 text-base text-text placeholder:text-text-muted"
          />
          <button type="submit" className={buttonVariants({ size: "default" })}>
            <Search {...iconProps} />
            Szukaj
          </button>
        </div>
      </form>

      {!results && <Suggestions heading="Spróbuj" />}

      {results && (
        <div aria-live="polite" className="mt-6">
          <p className="type-meta text-text-muted">
            {count} {plural(count, "wynik", "wyniki", "wyników")} dla „{query}”
            {results.understood.length > 0 && <> · rozumiem: {results.understood.join(", ")}</>}
          </p>

          {count === 0 && (
            <div className="mt-4">
              <p className="type-body text-text">Nic nie znaleźliśmy. Sprawdź pisownię albo wybierz coś z poniższych.</p>
              <Suggestions heading="Popularne wyszukiwania" />
              <Link href="/repertuar" className={`${buttonVariants({ variant: "secondary" })} mt-6`}>
                Zobacz cały repertuar
              </Link>
            </div>
          )}

          {results.events.length > 0 && (
            <Group id="g-wydarzenia" title="Wydarzenia" count={results.events.length} limit={GROUP_LIMITS.events}>
              {results.events.map(({ event, date }) => (
                <li key={event.id}>
                  <EventRow event={event} times={[date]} />
                </li>
              ))}
            </Group>
          )}

          {results.artists.length > 0 && (
            <Group id="g-artysci" title="Artyści" count={results.artists.length} limit={GROUP_LIMITS.artists}>
              {results.artists.map((a) => (
                <li key={a.name} className="border-b border-line">
                  <Link href={eventHref(a.events[0])} className={rowLink}>
                    <span className="font-semibold">{a.name}</span>
                    <span className="type-meta block text-text-muted">
                      {[a.role, `${a.events.length} ${plural(a.events.length, "wydarzenie", "wydarzenia", "wydarzeń")}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </Group>
          )}

          {results.works.length > 0 && (
            <Group id="g-utwory" title="Utwory" count={results.works.length} limit={GROUP_LIMITS.works}>
              {results.works.map((w, i) => (
                <li key={`${w.event.id}-${i}`} className="border-b border-line">
                  <Link href={eventHref(w.event)} className={rowLink}>
                    {w.composer && <span className="font-semibold">{w.composer}</span>}
                    <span className="block">{w.work}</span>
                    <span className="type-meta block text-text-muted">{w.event.title}</span>
                  </Link>
                </li>
              ))}
            </Group>
          )}

          {results.texts.length > 0 && (
            <Group id="g-teksty" title="Teksty i materiały" count={results.texts.length} limit={GROUP_LIMITS.texts}>
              {results.texts.map((t) => (
                <li key={t.event.id} className="border-b border-line">
                  <Link href={eventHref(t.event)} className={rowLink}>
                    <span className="type-meta block text-text-muted">{t.event.title}</span>
                    <span className="block type-body">{t.snippet}</span>
                  </Link>
                </li>
              ))}
            </Group>
          )}
        </div>
      )}
    </>
  )
}

/** Grupa wyników: h2 z licznikiem; powyżej limitu reszta zwija się w <details> (bez JS) */
function Group({
  id,
  title,
  count,
  limit,
  children,
}: {
  id: string
  title: string
  count: number
  limit: number
  children: React.ReactNode[]
}) {
  const shown = children.slice(0, limit)
  const rest = children.slice(limit)
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="type-h3 text-gold">
        {title} <span className="type-meta text-text-muted">({count})</span>
      </h2>
      <ul className="mt-2 border-t border-line">{shown}</ul>
      {rest.length > 0 && (
        <details className="group">
          <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Pokaż pozostałe ({rest.length})</span>
            <span className="hidden group-open:inline">Zwiń</span>
          </summary>
          <ul>{rest}</ul>
        </details>
      )}
    </section>
  )
}

function Suggestions({ heading }: { heading: string }) {
  return (
    <section aria-label={heading} className="mt-6">
      <p className="type-meta text-text-muted">{heading}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <li key={example}>
            <Link
              href={`/szukaj?q=${encodeURIComponent(example)}`}
              className="inline-flex min-h-11 items-center border-[1.5px] border-line-strong px-3 text-[0.9375rem] font-semibold text-text hover:bg-bg-subtle"
            >
              {example}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
