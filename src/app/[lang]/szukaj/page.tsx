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
import { eventDetails, eventHref, events, localizeEvent, todayKey } from "@/lib/events"
import { GROUP_LIMITS, type SearchDoc, search, total } from "@/lib/search"
import { getDictionary, hasLocale, localizedPath } from "@/i18n"
import { editorialCopy } from "@/i18n/editorial-routes"
import { getLang } from "@/i18n/server"

export async function generateMetadata({ params }: PageProps<"/[lang]/szukaj">): Promise<Metadata> {
  const { lang } = await params
  return editorialCopy(hasLocale(lang) ? lang : "pl").search.meta
}

const docs: SearchDoc[] = events.map((event) => ({
  event: toCalendarEvent(event, calendarEditorial),
  details: eventDetails(event.id),
}))

const rowLink = "block min-h-11 py-3 text-text hover:underline hover:underline-offset-4"

/** Wyszukiwarka (design.md §6.15): zwykły formularz GET, więc działa bez JS i daje link do wyników */
export default async function SearchPage({ searchParams }: PageProps<"/[lang]/szukaj">) {
  const lang = await getLang()
  const copy = editorialCopy(lang)
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {getDictionary(lang).common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container className="max-w-3xl">
          <h1 className="type-h1 text-gold">{copy.search.title}</h1>
          <Suspense fallback={<div className="mt-6 h-40 bg-surface-muted" role="status" aria-busy="true" aria-label={copy.ui.loading} />}>
            <Content searchParams={searchParams} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} current="/szukaj" />
    </>
  )
}

async function Content({ searchParams }: Pick<PageProps<"/[lang]/szukaj">, "searchParams">) {
  const lang = await getLang()
  const copy = editorialCopy(lang).search
  const params = await searchParams
  await connection()
  const raw = Array.isArray(params.q) ? params.q[0] : params.q
  const query = raw?.trim().slice(0, 100) ?? ""
  const results = query ? search(docs, query, todayKey(new Date())) : undefined
  const count = results ? total(results) : 0

  return (
    <>
      <form action={localizedPath(lang, "/szukaj")} role="search" className="mt-4">
        <label htmlFor="q" className="type-ui block text-text">
          {copy.label}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder={copy.placeholder}
            autoComplete="off"
            className="h-13 min-w-0 flex-1 border-[1.5px] border-line-strong bg-background px-3 text-base text-text placeholder:text-text-muted"
          />
          <button type="submit" className={buttonVariants({ size: "default" })}>
            <Search {...iconProps} />
            {copy.submit}
          </button>
        </div>
      </form>

      {!results && <Suggestions heading={copy.tryHeading} examples={copy.examples} />}

      {results && (
        <div aria-live="polite" className="mt-6">
          <p className="type-meta text-text-muted">
            {copy.countLabel(count, query)}
            {results.understood.length > 0 && <> · {copy.understood}: {results.understood.join(", ")}</>}
          </p>

          {count === 0 && (
            <div className="mt-4">
              <p className="type-body text-text">{copy.noResults}</p>
              <Suggestions heading={copy.popularHeading} examples={copy.examples} />
              <Link href={localizedPath(lang, "/repertuar")} className={`${buttonVariants({ variant: "secondary" })} mt-6`}>
                {copy.seeRepertoire}
              </Link>
            </div>
          )}

          {results.events.length > 0 && (
            <Group
              id="g-wydarzenia"
              title={copy.groups.events}
              count={results.events.length}
              limit={GROUP_LIMITS.events}
              showMoreLabel={copy.showMore}
              collapseLabel={copy.collapse}
            >
              {results.events.map(({ event, date }) => (
                <li key={event.id}>
                  <EventRow lang={lang} event={localizeEvent(event, lang)} times={[date]} />
                </li>
              ))}
            </Group>
          )}

          {results.artists.length > 0 && (
            <Group
              id="g-artysci"
              title={copy.groups.artists}
              count={results.artists.length}
              limit={GROUP_LIMITS.artists}
              showMoreLabel={copy.showMore}
              collapseLabel={copy.collapse}
            >
              {results.artists.map((a) => (
                <li key={a.name} className="border-b border-line">
                  <Link href={localizedPath(lang, eventHref(a.events[0]))} className={rowLink}>
                    <span className="font-semibold">{a.name}</span>
                    <span className="type-meta block text-text-muted">
                      {[a.role, copy.eventsCount(a.events.length)].filter(Boolean).join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </Group>
          )}

          {results.works.length > 0 && (
            <Group
              id="g-utwory"
              title={copy.groups.works}
              count={results.works.length}
              limit={GROUP_LIMITS.works}
              showMoreLabel={copy.showMore}
              collapseLabel={copy.collapse}
            >
              {results.works.map((w, i) => (
                <li key={`${w.event.id}-${i}`} className="border-b border-line">
                  <Link href={localizedPath(lang, eventHref(w.event))} className={rowLink}>
                    {w.composer && <span className="font-semibold">{w.composer}</span>}
                    <span className="block">{w.work}</span>
                    <span className="type-meta block text-text-muted">{localizeEvent(w.event, lang).title}</span>
                  </Link>
                </li>
              ))}
            </Group>
          )}

          {results.texts.length > 0 && (
            <Group
              id="g-teksty"
              title={copy.groups.texts}
              count={results.texts.length}
              limit={GROUP_LIMITS.texts}
              showMoreLabel={copy.showMore}
              collapseLabel={copy.collapse}
            >
              {results.texts.map((t) => (
                <li key={t.event.id} className="border-b border-line">
                  <Link href={localizedPath(lang, eventHref(t.event))} className={rowLink}>
                    <span className="type-meta block text-text-muted">{localizeEvent(t.event, lang).title}</span>
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
  showMoreLabel,
  collapseLabel,
  children,
}: {
  id: string
  title: string
  count: number
  limit: number
  showMoreLabel: (count: number) => string
  collapseLabel: string
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
            <span className="group-open:hidden">{showMoreLabel(rest.length)}</span>
            <span className="hidden group-open:inline">{collapseLabel}</span>
          </summary>
          <ul>{rest}</ul>
        </details>
      )}
    </section>
  )
}

async function Suggestions({ heading, examples }: { heading: string; examples: string[] }) {
  const lang = await getLang()
  return (
    <section aria-label={heading} className="mt-6">
      <p className="type-meta text-text-muted">{heading}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {examples.map((example) => (
          <li key={example}>
            <Link
              href={localizedPath(lang, `/szukaj?q=${encodeURIComponent(example)}`)}
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
