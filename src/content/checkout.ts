// Ekran „Kup bilet” w prototypie (/kup-bilet/[slug]). Docelowo zakup w serwisie przez API iksoris
// (brief §8: rezerwacja miejsc, płatność, bilety klienta). Do tego czasu ekran pokazuje, jak będzie wyglądał zakup,
// i prowadzi do obecnej kasy online FS. Obietnice kroków opierają się na briefie i design.md (§6.17, §9.2):
// plan sali z alternatywą listy, bez limitu czasu, bilet w portfelu, program dzień przed koncertem (visit.json).

import type { Locale } from "@/i18n"

type CheckoutCopy = {
  meta: (title: string) => string
  eyebrow: string
  back: string
  prototype: string
  title: string
  lead: string
  stepsLabel: string
  steps: [title: string, text: string][]
  buy: string
  buyHint: string
  phone: string
  integration: string
}

export const checkoutCopy: Record<Locale, CheckoutCopy> = {
  pl: {
    meta: (title) => `Kup bilet: ${title} – Filharmonia w Szczecinie`,
    eyebrow: "Kup bilet",
    back: "Wróć do wydarzenia",
    prototype: "Wersja prototypowa",
    title: "Tu kupisz bilet w trzech krokach",
    lead: "Docelowo cały zakup odbędzie się tutaj, bez wychodzenia ze strony i bez zakładania konta. W prototypie sprzedaż prowadzi jeszcze obecna kasa online Filharmonii.",
    stepsLabel: "Jak będzie wyglądał zakup",
    steps: [
      ["Wybierz miejsca", "Na planie sali albo z listy rzędów, wygodnej też z czytnikiem ekranu. Cenę widzisz od razu."],
      ["Zapłać", "BLIK, karta, Apple Pay lub Google Pay. Bez pośpiechu: rezerwację przedłużysz jednym przyciskiem."],
      ["Odbierz bilet", "Na e-mail, w swoim koncie i w portfelu w telefonie. Dzień przed koncertem dostaniesz link do programu."],
    ],
    buy: "Przejdź do kasy online",
    buyHint: "Otworzy się obecna strona sprzedaży Filharmonii. Wybierz tam to wydarzenie i termin.",
    phone: "Wolisz przez telefon? Kasa:",
    integration: "W wersji docelowej ten ekran łączy się z systemem biletowym iksoris: miejsca, płatność i status biletów na żywo.",
  },
  en: {
    meta: (title) => `Buy tickets: ${title} – Philharmonic in Szczecin`,
    eyebrow: "Buy tickets",
    back: "Back to the event",
    prototype: "Prototype",
    title: "Buy your ticket here in three steps",
    lead: "In the finished site, the whole purchase will happen here, without leaving the page or creating an account. In this prototype, sales still run through the Philharmonic's current online box office.",
    stepsLabel: "How buying will work",
    steps: [
      ["Choose your seats", "On the hall plan or from a list of rows that also works with a screen reader. You see the price straight away."],
      ["Pay", "BLIK, card, Apple Pay or Google Pay. No rush: extend your reservation with one button."],
      ["Get your ticket", "By email, in your account and in your phone's wallet. The day before the concert you'll get a link to the programme."],
    ],
    buy: "Go to the online box office",
    buyHint: "This opens the Philharmonic's current ticket shop. Choose this event and date there.",
    phone: "Prefer the phone? Box office:",
    integration: "In the finished site, this screen connects to the iksoris ticketing system: seats, payment and live ticket status.",
  },
  de: {
    meta: (title) => `Tickets kaufen: ${title} – Philharmonie Stettin`,
    eyebrow: "Tickets kaufen",
    back: "Zurück zur Veranstaltung",
    prototype: "Prototyp",
    title: "Hier kaufen Sie Ihr Ticket in drei Schritten",
    lead: "Später läuft der gesamte Kauf hier, ohne die Seite zu verlassen und ohne Kundenkonto. Im Prototyp verkauft noch die bisherige Online-Kasse der Philharmonie.",
    stepsLabel: "So wird der Kauf ablaufen",
    steps: [
      ["Plätze wählen", "Im Saalplan oder aus einer Liste der Reihen, die auch mit Screenreader gut funktioniert. Den Preis sehen Sie sofort."],
      ["Bezahlen", "BLIK, Karte, Apple Pay oder Google Pay. Ohne Eile: Die Reservierung verlängern Sie mit einem Klick."],
      ["Ticket erhalten", "Per E-Mail, im Kundenkonto und in der Wallet Ihres Telefons. Am Tag vor dem Konzert erhalten Sie den Link zum Programm."],
    ],
    buy: "Zur Online-Kasse",
    buyHint: "Es öffnet sich der bisherige Ticketshop der Philharmonie. Wählen Sie dort diese Veranstaltung und den Termin.",
    phone: "Lieber telefonisch? Kasse:",
    integration: "Später ist dieser Bildschirm mit dem Ticketsystem iksoris verbunden: Plätze, Zahlung und Ticketstatus live.",
  },
  uk: {
    meta: (title) => `Купити квиток: ${title} – Філармонія у Щецині`,
    eyebrow: "Купити квиток",
    back: "Повернутися до події",
    prototype: "Прототип",
    title: "Тут ви купите квиток за три кроки",
    lead: "У готовій версії вся покупка відбуватиметься тут, без переходу на інший сайт і без створення акаунта. У прототипі продаж ще веде нинішня онлайн-каса Філармонії.",
    stepsLabel: "Як виглядатиме покупка",
    steps: [
      ["Оберіть місця", "На плані зали або зі списку рядів, зручного і з програмою зчитування екрана. Ціну видно одразу."],
      ["Оплатіть", "BLIK, картка, Apple Pay або Google Pay. Без поспіху: бронювання можна продовжити однією кнопкою."],
      ["Отримайте квиток", "На e-mail, в акаунті та в гаманці телефона. За день до концерту надішлемо посилання на програму."],
    ],
    buy: "Перейти до онлайн-каси",
    buyHint: "Відкриється нинішній квитковий сайт Філармонії. Оберіть там цю подію та дату.",
    phone: "Зручніше телефоном? Каса:",
    integration: "У готовій версії цей екран підключено до квиткової системи iksoris: місця, оплата і статус квитків у реальному часі.",
  },
}
