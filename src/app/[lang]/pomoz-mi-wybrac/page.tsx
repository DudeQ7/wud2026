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
import { eventHref, events, localizeEvent, todayKey } from "@/lib/events"
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
  lowestPrice,
  reasonLine,
  suggest,
  wizardHref,
} from "@/lib/wizard"
import { cn } from "@/lib/utils"
import { getDictionary, hasLocale, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { visitorRouteCopy } from "@/i18n/visitor-routes"

export async function generateMetadata({ params }: PageProps<"/[lang]/pomoz-mi-wybrac">): Promise<Metadata> {
  const { lang } = await params
  return (
    (hasLocale(lang) ? visitorRouteCopy(lang)?.meta.wizard : undefined) ?? {
      title: "Pomóż mi wybrać – Filharmonia w Szczecinie",
      description: "Pięć krótkich pytań i kilka propozycji koncertów dla Ciebie. Każde pytanie możesz pominąć.",
    }
  )
}

const calendarEvents = events.map((event) => toCalendarEvent(event, calendarEditorial))

const linkText = "inline-flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"

/** „Pomóż mi wybrać” (design.md §6.13): 5 pytań → 3–5 propozycji. Stan w adresie URL, bez JS. */
export default async function WizardPage({ searchParams }: PageProps<"/[lang]/pomoz-mi-wybrac">) {
  const lang = await getLang()
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
          {/* Odpowiedzi (searchParams) czytamy w granicy Suspense – powłoka strony od nich nie zależy */}
          <Suspense fallback={<div className="h-96 bg-surface-muted" role="status" aria-busy="true" aria-label={visitorRouteCopy(lang)?.ui.loading ?? "Wczytywanie"} />}>
            <Wizard searchParams={searchParams} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}

async function Wizard({ searchParams }: Pick<PageProps<"/[lang]/pomoz-mi-wybrac">, "searchParams">) {
  const lang = await getLang()
  const params = await searchParams
  // „Dziś” zmienia się z dnia na dzień – liczymy je dopiero przy żądaniu
  await connection()
  const answers = parseAnswers(params)
  const step = parseStep(params)
  return step === "wynik" ? <Results answers={answers} today={todayKey(new Date())} lang={lang} /> : <Step answers={answers} step={step} lang={lang} />
}

function Step({ answers, step, lang }: { answers: Answers; step: Awaited<ReturnType<typeof parseStep>> & number; lang: Awaited<ReturnType<typeof getLang>> }) {
  const question = QUESTIONS[step - 1]
  const route = visitorRouteCopy(lang)
  const copy = route?.wizard
  const ui = route?.ui
  const translatedQuestion = copy?.questions[step - 1]
  const current = answers[question.key]
  const total = QUESTIONS.length

  return (
    <>
      <p className="type-meta text-text-muted">{copy?.title ?? "Pomóż mi wybrać"}</p>
      <p className="mt-1 type-eyebrow text-gold">
        {copy?.step(step, total) ?? `Krok ${step} z ${total}`}
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-1" aria-hidden>
        {QUESTIONS.map((q, i) => (
          <li key={q.key} className={cn("h-1", i < step ? "bg-ink" : "bg-line")} />
        ))}
      </ol>

      <h1 className="mt-6 type-h2 text-gold">{translatedQuestion?.title ?? question.title}</h1>

      <ul className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const selected = current === option.value
          const translated = translatedQuestion?.options.find(([value]) => value === option.value)
          return (
            <li key={option.value}>
              <Link
                href={localizedPath(lang, wizardHref({ ...answers, [question.key]: option.value }, nextStep(step)))}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "flex min-h-14 items-center justify-between gap-3 border-[1.5px] border-line-strong px-4 py-3 transition-colors",
                  selected ? "bg-ink text-on-dark" : "text-text hover:bg-bg-subtle"
                )}
              >
                <span>
                  <span className="type-ui block">{translated?.[1] ?? option.label}</span>
                  {option.hint && (
                    <span className={cn("type-meta block", selected ? "text-on-dark-muted" : "text-text-muted")}>
                      {translated?.[2] ?? option.hint}
                    </span>
                  )}
                </span>
                {selected && <Check {...iconProps} className="size-5 shrink-0" />}
              </Link>
            </li>
          )
        })}
      </ul>

      <nav aria-label={ui?.stepsLabel ?? "Kroki kreatora"} className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <Link href={localizedPath(lang, wizardHref(answers, step - 1))} className={linkText}>
            {copy?.back ?? "Wstecz"}
          </Link>
        ) : (
          <span />
        )}
        {/* „Pomiń” usuwa odpowiedź na to pytanie i idzie dalej */}
        <Link href={localizedPath(lang, wizardHref(withoutKey(answers, question.key), nextStep(step)))} className={linkText}>
          {copy?.skip ?? "Pomiń"}
        </Link>
      </nav>
    </>
  )
}

function Results({ answers, today, lang }: { answers: Answers; today: string; lang: Awaited<ReturnType<typeof getLang>> }) {
  const route = visitorRouteCopy(lang)
  const copy = route?.wizard
  const ui = route?.ui
  const label = (key: AnswerKey, value: string) => copy?.questions[ANSWER_KEYS.indexOf(key)].options.find(([optionValue]) => optionValue === value)?.[1]
  const { matches, near } = suggest(calendarEvents, answers, today)
  const chosen = ANSWER_KEYS.filter((k) => answers[k])

  return (
    <>
      <Eyebrow>{copy?.suggestions ?? "Twoje propozycje"}</Eyebrow>
      <h1 className="mt-1 type-h2 text-gold">
        {matches.length ? (copy?.heading ?? "To może Ci się spodobać") : (copy?.noMatch ?? "Nie ma dokładnego dopasowania")}
      </h1>

      {chosen.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={ui?.answersLabel ?? "Twoje odpowiedzi"}>
          {chosen.map((key) => (
            <li key={key}>
              <Link
                href={localizedPath(lang, wizardHref(answers, ANSWER_KEYS.indexOf(key) + 1))}
                className="inline-flex min-h-11 items-center border-[1.5px] border-line-strong px-3 text-[0.9375rem] font-semibold text-text hover:bg-bg-subtle"
              >
                <span className="sr-only">{ui?.changeAnswer ?? "Zmień odpowiedź: "}</span>
                {label(key, answers[key]!) ?? optionLabel(key, answers[key]!)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {matches.length > 0 && (
        <>
          <h2 className="sr-only">{ui?.suggestionsLabel ?? "Propozycje"}</h2>
          <ResultList answers={answers} matches={matches} lang={lang} />
        </>
      )}

      {matches.length === 0 && (
        <p className="mt-4 type-body text-text">
          {chosen.length
            ? (copy?.emptyChosen ?? "Przy tych odpowiedziach nic nie zostało w repertuarze.")
            : (copy?.empty ?? "W repertuarze nic nie zostało.")}{" "}
          {near && <>{copy?.near ?? "Najbliższe propozycje poniżej."}</>}
        </p>
      )}

      {near && (
        <section aria-labelledby="blisko" className="mt-10">
          <h2 id="blisko" className="type-h3 text-gold">
            {copy?.near ?? "Blisko Twojego wyboru"}
          </h2>
          <p className="mt-2 type-body text-text">
            {copy?.nearLead(label(near.dropped, answers[near.dropped] ?? "") ?? DROPPED_LABEL[near.dropped]) ?? `Bez odpowiedzi „${DROPPED_LABEL[near.dropped]}” pasuje więcej wydarzeń. To one:`}
          </p>
          <ResultList answers={withoutKey(answers, near.dropped)} matches={near.matches} lang={lang} />
        </section>
      )}

      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href={localizedPath(lang, calendarHref(answers))} className={linkText}>
          {copy?.calendar ?? "Pokaż wszystkie w kalendarzu →"}
        </Link>
        <Link href={localizedPath(lang, wizardHref({}, 1))} className={linkText}>
          {copy?.restart ?? "Zacznij od nowa"}
        </Link>
      </div>
    </>
  )
}

async function ResultList({ answers, matches, lang }: { answers: Answers; matches: ReturnType<typeof suggest>["matches"]; lang: Awaited<ReturnType<typeof getLang>> }) {
  return (
    <ul className="mt-6 grid gap-10">
      {matches.map((match) => {
        const m = { ...match, event: localizeEvent(match.event, lang) }
        const route = visitorRouteCopy(lang)
        const copy = route?.wizard
        const ui = route?.ui
        const getLabel = (key: AnswerKey) => {
          const value = answers[key]
          return value ? copy?.questions[ANSWER_KEYS.indexOf(key)].options.find(([optionValue]) => optionValue === value)?.[1] : undefined
        }
        const reasonParts = [
          getLabel("kiedy"),
          getLabel("dla"),
          getLabel("rodzaj"),
          getLabel("klimat"),
          // Budżet wymieniamy tylko, gdy znamy cenę wydarzenia – bez tego „do 50 zł” byłoby zgadywaniem
          answers.budzet && answers.budzet !== "bez-limitu" && lowestPrice(m.event) !== null
            ? (ui?.budgetUpTo(answers.budzet) ?? `do ${answers.budzet} zł`)
            : undefined,
        ].filter(Boolean)
        // Po polsku uzasadnienie składa reasonLine (etykiety odpowiedzi, klimat z dopasowania, budżet tylko ze znanej ceny);
        // wcześniej polska wersja pokazywała samo „do 50 zł” przy każdej karcie, także bez znanej ceny
        const reason =
          lang === "pl"
            ? reasonLine(answers, m)
            : reasonParts.length
              ? `${copy?.reason ?? "Pasuje do wyboru: "}${reasonParts.join(" · ")}`
              : undefined
        return (
          <li key={m.event.id} className="flex flex-col gap-4">
            <EventCard lang={lang} event={m.event} date={m.date} showAccess />
            {reason && <p className="type-meta text-text-muted">{reason}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Link href={localizedPath(lang, eventHref(m.event))} className={buttonVariants({ variant: "secondary" })}>
                {copy?.show ?? "Zobacz"}
              </Link>
              <a href={m.event.ticketsUrl} className={buttonVariants({ variant: "primary" })}>
                {copy?.buy ?? "Kup bilet"}
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
