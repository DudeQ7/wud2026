// Najczęstsze pytania (FAQ). Odpowiedzi to te same fakty co w „Planuj wizytę” (src/data/visit.json, przewodnik dla
// nowych słuchaczy, dane obiektu z koncerty.json) i te same tłumaczenia (i18n/visitor-routes) – nic ponad źródło.
// Docelowo z CMS (typ treści „FAQ, informacja praktyczna” z briefu §8, też źródło wiedzy dla asystenta).

import { guide } from "@/content/about"
import { buildingAccess, firstVisit } from "@/content/event"
import visit from "@/data/visit.json"
import { type Locale, getDictionary } from "@/i18n"
import { visitorRouteCopy } from "@/i18n/visitor-routes"
import { venueInfo } from "@/lib/events"

export type FaqItem = { q: string; a: string[]; list?: readonly string[] }
export type FaqGroup = { id: string; title: string; items: FaqItem[] }

type Questions = Record<
  "tickets" | "buy" | "discounts" | "box" | "getting" | "transport" | "parking" | "before" | "arrive" | "wear" | "cafe"
  | "hall" | "access" | "wheelchair" | "accessTickets" | "building" | "tours" | "hours",
  string
>

const questions: Record<Locale, Questions> = {
  pl: {
    tickets: "Bilety i kasa",
    buy: "Jak kupić bilet?",
    discounts: "Czy są bilety ulgowe?",
    box: "Kiedy czynna jest kasa?",
    getting: "Dojazd i parking",
    transport: "Jak dojechać komunikacją miejską?",
    parking: "Gdzie zaparkować?",
    before: "Przed koncertem",
    arrive: "Kiedy przyjść?",
    wear: "Co na siebie włożyć?",
    cafe: "Czy można coś zjeść lub wypić?",
    hall: "Na sali",
    access: "Dostępność",
    wheelchair: "Czy budynek jest dostępny dla osób na wózku?",
    accessTickets: "Jakie bilety przysługują osobom z niepełnosprawnością?",
    building: "Budynek",
    tours: "Czy można zwiedzić budynek?",
    hours: "Kiedy budynek jest otwarty?",
  },
  en: {
    tickets: "Tickets and box office",
    buy: "How do I buy a ticket?",
    discounts: "Are there concession tickets?",
    box: "When is the box office open?",
    getting: "Getting here and parking",
    transport: "How do I get here by public transport?",
    parking: "Where can I park?",
    before: "Before the concert",
    arrive: "When should I arrive?",
    wear: "What should I wear?",
    cafe: "Can I get something to eat or drink?",
    hall: "In the hall",
    access: "Accessibility",
    wheelchair: "Is the building wheelchair accessible?",
    accessTickets: "Are there tickets for disabled visitors?",
    building: "The building",
    tours: "Can I tour the building?",
    hours: "When is the building open?",
  },
  de: {
    tickets: "Tickets und Kasse",
    buy: "Wie kaufe ich ein Ticket?",
    discounts: "Gibt es ermäßigte Tickets?",
    box: "Wann ist die Kasse geöffnet?",
    getting: "Anfahrt und Parken",
    transport: "Wie komme ich mit öffentlichen Verkehrsmitteln hin?",
    parking: "Wo kann ich parken?",
    before: "Vor dem Konzert",
    arrive: "Wann sollte ich kommen?",
    wear: "Was soll ich anziehen?",
    cafe: "Kann ich etwas essen oder trinken?",
    hall: "Im Saal",
    access: "Barrierefreiheit",
    wheelchair: "Ist das Gebäude rollstuhlgerecht?",
    accessTickets: "Gibt es Tickets für Menschen mit Behinderung?",
    building: "Das Gebäude",
    tours: "Kann ich das Gebäude besichtigen?",
    hours: "Wann ist das Gebäude geöffnet?",
  },
  uk: {
    tickets: "Квитки та каса",
    buy: "Як купити квиток?",
    discounts: "Чи є пільгові квитки?",
    box: "Коли працює каса?",
    getting: "Як дістатися і де паркуватися",
    transport: "Як доїхати громадським транспортом?",
    parking: "Де припаркуватися?",
    before: "Перед концертом",
    arrive: "Коли приходити?",
    wear: "Що вдягнути?",
    cafe: "Чи можна щось з'їсти або випити?",
    hall: "У залі",
    access: "Доступність",
    wheelchair: "Чи доступна будівля для людей на візку?",
    accessTickets: "Які квитки для людей з інвалідністю?",
    building: "Будівля",
    tours: "Чи можна оглянути будівлю?",
    hours: "Коли відкрита будівля?",
  },
}

/** Teksty strony /faq (nagłówek, spis treści, pomoc na końcu) */
export const faqPage: Record<
  Locale,
  {
    meta: { title: string; description: string }
    eyebrow: string
    title: string
    lead: string
    toc: string
    moreTitle: string
    moreText: string
    assistant: string
    call: string
    /** Link z karty wydarzenia i z „Planuj wizytę” */
    more: string
  }
> = {
  pl: {
    meta: {
      title: "Najczęstsze pytania (FAQ) – Filharmonia w Szczecinie",
      description: "Bilety, kasa, dojazd, parking, strój, szatnia, oklaski i dostępność. Krótkie odpowiedzi przed wizytą.",
    },
    eyebrow: "FAQ",
    title: "Najczęstsze pytania",
    lead: "Krótkie odpowiedzi na pytania, które słyszymy najczęściej: o bilety, dojazd, strój i to, jak wygląda koncert.",
    toc: "Na tej stronie",
    moreTitle: "Nie ma tu Twojego pytania?",
    moreText: "Zapytaj asystenta albo zadzwoń do kasy.",
    assistant: "Zapytaj asystenta",
    call: "Zadzwoń do kasy",
    more: "Więcej odpowiedzi: najczęstsze pytania →",
  },
  en: {
    meta: {
      title: "Frequently asked questions – Philharmonic in Szczecin",
      description: "Tickets, box office, getting here, parking, what to wear, cloakroom, applause and accessibility.",
    },
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    lead: "Short answers to the questions we hear most: tickets, getting here, what to wear and what a concert is like.",
    toc: "On this page",
    moreTitle: "Can't find your question?",
    moreText: "Ask the assistant or call the box office.",
    assistant: "Ask the assistant",
    call: "Call the box office",
    more: "More answers: frequently asked questions →",
  },
  de: {
    meta: {
      title: "Häufige Fragen (FAQ) – Philharmonie Stettin",
      description: "Tickets, Kasse, Anfahrt, Parken, Kleidung, Garderobe, Applaus und Barrierefreiheit.",
    },
    eyebrow: "FAQ",
    title: "Häufige Fragen",
    lead: "Kurze Antworten auf die häufigsten Fragen: Tickets, Anfahrt, Kleidung und wie ein Konzert abläuft.",
    toc: "Auf dieser Seite",
    moreTitle: "Ihre Frage ist nicht dabei?",
    moreText: "Fragen Sie den Assistenten oder rufen Sie die Kasse an.",
    assistant: "Assistenten fragen",
    call: "Kasse anrufen",
    more: "Weitere Antworten: häufige Fragen →",
  },
  uk: {
    meta: {
      title: "Часті запитання (FAQ) – Філармонія у Щецині",
      description: "Квитки, каса, як дістатися, паркування, що вдягнути, гардероб, оплески та доступність.",
    },
    eyebrow: "FAQ",
    title: "Часті запитання",
    lead: "Короткі відповіді на найчастіші запитання: квитки, як дістатися, що вдягнути і як проходить концерт.",
    toc: "На цій сторінці",
    moreTitle: "Не знайшли свого запитання?",
    moreText: "Запитайте асистента або зателефонуйте в касу.",
    assistant: "Запитати асистента",
    call: "Зателефонувати в касу",
    more: "Більше відповідей: часті запитання →",
  },
}

const firstVisitText = (title: string) => firstVisit.find((card) => card.title === title)?.text ?? ""

/** Grupy pytań w kolejności ścieżki gościa: bilet → dojazd → przed koncertem → na sali → dostępność → budynek */
export function faqGroups(lang: Locale): FaqGroup[] {
  const q = questions[lang]
  const copy = visitorRouteCopy(lang)?.visit
  const guideItem = (index: number): FaqItem => {
    const translated = copy?.guide[index]
    return { q: translated?.[0] ?? guide[index].q, a: [translated?.[1] ?? guide[index].a] }
  }

  return [
    {
      id: "bilety",
      title: q.tickets,
      items: [
        { q: q.buy, a: [copy?.ticket ?? "Bilety kupisz online lub w kasie. Przy każdym wydarzeniu znajdziesz przycisk „Kup bilet”."] },
        { q: q.discounts, a: [copy?.discounts ?? venueInfo.discounts] },
        { q: q.box, a: [getDictionary(lang).footer.boxOfficeHours] },
      ],
    },
    {
      id: "dojazd",
      title: q.getting,
      items: [
        { q: q.transport, a: [copy?.bus ?? visit.publicTransport.bus, copy?.tram ?? visit.publicTransport.tram] },
        { q: q.parking, a: [copy?.parking ?? visit.parking] },
      ],
    },
    {
      id: "przed-koncertem",
      title: q.before,
      items: [
        { q: q.arrive, a: [copy?.opens ?? firstVisitText("Kiedy przyjść?")] },
        { q: q.wear, a: [copy?.outfit ?? firstVisitText("Co na siebie włożyć?")] },
        guideItem(0),
        guideItem(1),
        guideItem(2),
        { q: q.cafe, a: [copy?.cafes ?? visit.cafes] },
      ],
    },
    { id: "na-sali", title: q.hall, items: [guideItem(3), guideItem(4), guideItem(5), guideItem(6)] },
    {
      id: "dostepnosc",
      title: q.access,
      items: [
        { q: q.wheelchair, a: [copy?.access ?? visit.accessibility], list: copy?.accessItems ?? buildingAccess },
        { q: q.accessTickets, a: [copy?.accessTickets ?? visit.accessibilityTickets] },
      ],
    },
    {
      id: "budynek",
      title: q.building,
      items: [
        { q: q.tours, a: [copy?.tours ?? visit.tours] },
        { q: q.hours, a: [copy?.buildingHoursText ?? venueInfo.building_hours] },
      ],
    },
  ]
}
