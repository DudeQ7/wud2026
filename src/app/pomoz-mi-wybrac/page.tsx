import { Check } from "lucide-react"
import type { Metadata } from "next"
import { connection } from "next/server"
import Link from "next/link"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { EventCard } from "@/components/fs/event-card"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { calendarEditorial } from "@/content/calendar"
import { toCalendarEvent } from "@/lib/calendar"
import { eventHref, events, todayKey } from "@/lib/events"
import {
  ANSWER_KEYS,
  type AnswerKey,
  type Answers,
  DROPPED_LABEL,
  QUESTIONS,
  calendarHref,
  nextStep,
  optionLabel,
  parseAnswers,
  parseStep,
  reasonLine,
  suggest,
  wizardHref,
} from "@/lib/wizard"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pomóż mi wybrać – Filharmonia w Szczecinie",
  description: "Pięć krótkich pytań i kilka propozycji koncertów dla Ciebie. Każde pytanie możesz pominąć.",
}

const calendarEvents = events.map((event) => toCalendarEvent(event, calendarEditorial))

const linkText = "inline-flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"

/** „Pomóż mi wybrać” (design.md §6.13): 5 pytań → 3–5 propozycji. Stan w adresie URL, bez JS. */
export default function WizardPage({ searchParams }: PageProps<"/pomoz-mi-wybrac">) {
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
          {/* Odpowiedzi (searchParams) czytamy w granicy Suspense – powłoka strony od nich nie zależy */}
          <Suspense fallback={<div className="h-96 bg-surface-muted" aria-busy="true" aria-label="Wczytywanie" />}>
            <Wizard searchParams={searchParams} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}

async function Wizard({ searchParams }: Pick<PageProps<"/pomoz-mi-wybrac">, "searchParams">) {
  const params = await searchParams
  // „Dziś” zmienia się z dnia na dzień – liczymy je dopiero przy żądaniu
  await connection()
  const answers = parseAnswers(params)
  const step = parseStep(params)
  return step === "wynik" ? <Results answers={answers} today={todayKey(new Date())} /> : <Step answers={answers} step={step} />
}

function Step({ answers, step }: { answers: Answers; step: number }) {
  const question = QUESTIONS[step - 1]
  const current = answers[question.key]
  const total = QUESTIONS.length

  return (
    <>
      <p className="type-meta text-text-muted">Pomóż mi wybrać</p>
      <p className="mt-1 type-eyebrow text-gold">
        Krok {step} z {total}
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-1" aria-hidden>
        {QUESTIONS.map((q, i) => (
          <li key={q.key} className={cn("h-1", i < step ? "bg-ink" : "bg-line")} />
        ))}
      </ol>

      <h1 className="mt-6 type-h2 text-gold">{question.title}</h1>

      <ul className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const selected = current === option.value
          return (
            <li key={option.value}>
              <Link
                href={wizardHref({ ...answers, [question.key]: option.value }, nextStep(step))}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "flex min-h-14 items-center justify-between gap-3 border-[1.5px] border-line-strong px-4 py-3 transition-colors",
                  selected ? "bg-ink text-on-dark" : "text-text hover:bg-bg-subtle"
                )}
              >
                <span>
                  <span className="type-ui block">{option.label}</span>
                  {option.hint && (
                    <span className={cn("type-meta block", selected ? "text-on-dark-muted" : "text-text-muted")}>
                      {option.hint}
                    </span>
                  )}
                </span>
                {selected && <Check {...iconProps} className="size-5 shrink-0" />}
              </Link>
            </li>
          )
        })}
      </ul>

      <nav aria-label="Kroki kreatora" className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <Link href={wizardHref(answers, step - 1)} className={linkText}>
            Wstecz
          </Link>
        ) : (
          <span />
        )}
        {/* „Pomiń” usuwa odpowiedź na to pytanie i idzie dalej */}
        <Link href={wizardHref(withoutKey(answers, question.key), nextStep(step))} className={linkText}>
          Pomiń
        </Link>
      </nav>
    </>
  )
}

function Results({ answers, today }: { answers: Answers; today: string }) {
  const { matches, near } = suggest(calendarEvents, answers, today)
  const chosen = ANSWER_KEYS.filter((k) => answers[k])

  return (
    <>
      <Eyebrow>Twoje propozycje</Eyebrow>
      <h1 className="mt-1 type-h2 text-gold">
        {matches.length ? "To może Ci się spodobać" : "Nie ma dokładnego dopasowania"}
      </h1>

      {chosen.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Twoje odpowiedzi">
          {chosen.map((key) => (
            <li key={key}>
              <Link
                href={wizardHref(answers, ANSWER_KEYS.indexOf(key) + 1)}
                className="inline-flex min-h-11 items-center border-[1.5px] border-line-strong px-3 text-[0.9375rem] font-semibold text-text hover:bg-bg-subtle"
              >
                <span className="sr-only">Zmień odpowiedź: </span>
                {optionLabel(key, answers[key]!)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {matches.length > 0 && <ResultList answers={answers} matches={matches} />}

      {matches.length === 0 && (
        <p className="mt-4 type-body text-text">
          {chosen.length
            ? "Przy tych odpowiedziach nic nie zostało w repertuarze."
            : "W repertuarze nic nie zostało."}{" "}
          {near && <>Najbliższe propozycje poniżej.</>}
        </p>
      )}

      {near && (
        <section aria-labelledby="blisko" className="mt-10">
          <h2 id="blisko" className="type-h3 text-gold">
            Blisko Twojego wyboru
          </h2>
          <p className="mt-2 type-body text-text">
            Bez odpowiedzi „{DROPPED_LABEL[near.dropped]}” pasuje więcej wydarzeń. To one:
          </p>
          <ResultList answers={withoutKey(answers, near.dropped)} matches={near.matches} />
        </section>
      )}

      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href={calendarHref(answers)} className={linkText}>
          Pokaż wszystkie w kalendarzu →
        </Link>
        <Link href={wizardHref({}, 1)} className={linkText}>
          Zacznij od nowa
        </Link>
      </div>
    </>
  )
}

function ResultList({ answers, matches }: { answers: Answers; matches: ReturnType<typeof suggest>["matches"] }) {
  return (
    <ul className="mt-6 grid gap-10">
      {matches.map((m) => {
        const reason = reasonLine(answers, m)
        return (
          <li key={m.event.id} className="flex flex-col gap-4">
            <EventCard event={m.event} date={m.date} showAccess />
            {reason && <p className="type-meta text-text-muted">{reason}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Link href={eventHref(m.event)} className={buttonVariants({ variant: "secondary" })}>
                Zobacz
              </Link>
              <a href={m.event.ticketsUrl} className={buttonVariants({ variant: "primary" })}>
                Kup bilet
              </a>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function withoutKey(answers: Answers, key: AnswerKey): Answers {
  const { [key]: _omit, ...rest } = answers
  return rest
}
