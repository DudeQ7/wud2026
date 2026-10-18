import type { Locale } from "@/i18n/config"

// Teksty podstron z listą wydarzeń: EDUfilharmonia i Zwiedzanie (PL / EN / DE / UK).
// Fakty o zwiedzaniu: visit.json → tours oraz opis wydarzeń „Zwiedzanie Filharmonii…” w koncerty.json
// (piątki, ok. 40 min, 30/20 zł, grupy bez rezerwacji).

type Group = { title: string; description: string; href: string }

type ListingCopy = {
  ui: { loading: string; upcoming: string }
  edu: {
    meta: { title: string; description: string }
    eyebrow: string
    title: string
    lead: string
    groupsLabel: string
    groups: Group[]
    empty: string
  }
  tours: {
    meta: { title: string; description: string }
    eyebrow: string
    title: string
    lead: string
    factsLabel: string
    facts: { when: [string, string]; languages: [string, string]; duration: [string, string]; price: [string, string] }
    groupsTitle: string
    groupsText: string
    groupsMailSubject: string
    groupsMail: string
    groupsCall: string
    upcoming: string
    empty: string
  }
}

const edugroupHrefs = {
  children: "/repertuar?dla-kogo=dzieci",
  families: "/repertuar?dla-kogo=rodziny",
  schools: "/repertuar?dla-kogo=szkoly",
  all: "/repertuar?rodzaj=edukacja",
}

const polish: ListingCopy = {
  ui: { loading: "Wczytywanie", upcoming: "Nadchodzące wydarzenia" },
  edu: {
    meta: {
      title: "EDUfilharmonia – Filharmonia w Szczecinie",
      description: "Koncerty i spektakle dla dzieci, rodzin i szkół. Wiek, czas trwania i cena przy każdym wydarzeniu.",
    },
    eyebrow: "Dla dzieci, szkół i rodzin",
    title: "EDUfilharmonia",
    lead: "Pierwsze koncerty, spektakle i spotkania z muzyką. Przy każdym wydarzeniu widać wiek, czas trwania i cenę.",
    groupsLabel: "Dla kogo",
    groups: [
      { title: "Dzieci", description: "Koncerty z opiekunami", href: edugroupHrefs.children },
      { title: "Rodziny", description: "Dzieci i dorośli razem", href: edugroupHrefs.families },
      { title: "Szkoły", description: "Koncerty i spektakle dla uczniów", href: edugroupHrefs.schools },
      { title: "Wszystko dla dzieci", description: "Filtr w kalendarzu", href: edugroupHrefs.all },
    ],
    empty: "Najbliższe wydarzenia EDU pojawią się wkrótce.",
  },
  tours: {
    meta: {
      title: "Zwiedzanie – Filharmonia w Szczecinie",
      description: "Zwiedzanie budynku z przewodnikiem po polsku, angielsku i niemiecku. Terminy, ceny i czas trwania.",
    },
    eyebrow: "Piątki · PL, EN, DE · ok. 40 minut",
    title: "Zwiedzanie",
    lead: "Zwiedzanie z przewodnikiem: historia budynku, Sala Symfoniczna i Kameralna, hol, foyer, kręcone schody i Galeria Poziom 4.",
    factsLabel: "Najważniejsze informacje",
    facts: {
      when: ["Kiedy", "W piątki, terminy poniżej"],
      languages: ["Język", "polski, angielski, niemiecki; wybrane terminy z tłumaczeniem na PJM"],
      duration: ["Czas", "ok. 40 minut"],
      price: ["Cena", "30 zł, ulgowy 20 zł · kasa, biletomat i online"],
    },
    groupsTitle: "Przychodzisz z grupą?",
    groupsText:
      "Grupy zorganizowane są mile widziane, a rezerwacja nie jest konieczna. Przy większej grupie napisz lub zadzwoń do kasy, żeby uzgodnić termin.",
    groupsMailSubject: "Zwiedzanie Filharmonii – grupa",
    groupsMail: "Napisz do kasy",
    groupsCall: "Zadzwoń do kasy",
    upcoming: "Najbliższe terminy",
    empty: "Aktualnych terminów zwiedzania nie ma w repertuarze. Sprawdź ponownie wkrótce.",
  },
}

const english: ListingCopy = {
  ui: { loading: "Loading", upcoming: "Upcoming events" },
  edu: {
    meta: {
      title: "EDUfilharmonia – Philharmonic in Szczecin",
      description: "Concerts and shows for children, families and schools. Age, duration and price for every event.",
    },
    eyebrow: "For children, schools and families",
    title: "EDUfilharmonia",
    lead: "First concerts, shows and encounters with music. Every event shows the age group, duration and price.",
    groupsLabel: "Who is it for",
    groups: [
      { title: "Children", description: "Concerts with a parent or carer", href: edugroupHrefs.children },
      { title: "Families", description: "Children and adults together", href: edugroupHrefs.families },
      { title: "Schools", description: "Concerts and shows for pupils", href: edugroupHrefs.schools },
      { title: "Everything for children", description: "Filter in the calendar", href: edugroupHrefs.all },
    ],
    empty: "Upcoming EDU events will appear here soon.",
  },
  tours: {
    meta: {
      title: "Guided tours – Philharmonic in Szczecin",
      description: "Guided tours of the building in Polish, English and German. Dates, prices and duration.",
    },
    eyebrow: "Fridays · PL, EN, DE · about 40 minutes",
    title: "Guided tours",
    lead: "A guided tour of the building: its history, the Symphony Hall and Chamber Hall, the lobby, the foyer, the spiral staircase and the Level 4 Gallery.",
    factsLabel: "Key information",
    facts: {
      when: ["When", "Fridays, dates below"],
      languages: ["Language", "Polish, English, German; selected dates with Polish Sign Language"],
      duration: ["Duration", "about 40 minutes"],
      price: ["Price", "30 zł, reduced 20 zł · box office, ticket machine and online"],
    },
    groupsTitle: "Coming with a group?",
    groupsText:
      "Organised groups are welcome and no booking is needed. For a larger group, email or call the box office to agree on a date.",
    groupsMailSubject: "Guided tour of the Philharmonic – group",
    groupsMail: "Email the box office",
    groupsCall: "Call the box office",
    upcoming: "Upcoming dates",
    empty: "There are no tour dates in the programme at the moment. Please check again soon.",
  },
}

const german: ListingCopy = {
  ui: { loading: "Wird geladen", upcoming: "Kommende Veranstaltungen" },
  edu: {
    meta: {
      title: "EDUfilharmonia – Philharmonie Szczecin",
      description: "Konzerte und Aufführungen für Kinder, Familien und Schulen. Alter, Dauer und Preis bei jeder Veranstaltung.",
    },
    eyebrow: "Für Kinder, Schulen und Familien",
    title: "EDUfilharmonia",
    lead: "Erste Konzerte, Aufführungen und Begegnungen mit Musik. Bei jeder Veranstaltung stehen Alter, Dauer und Preis.",
    groupsLabel: "Für wen",
    groups: [
      { title: "Kinder", description: "Konzerte mit Begleitperson", href: edugroupHrefs.children },
      { title: "Familien", description: "Kinder und Erwachsene gemeinsam", href: edugroupHrefs.families },
      { title: "Schulen", description: "Konzerte und Aufführungen für Schüler", href: edugroupHrefs.schools },
      { title: "Alles für Kinder", description: "Filter im Kalender", href: edugroupHrefs.all },
    ],
    empty: "Die nächsten EDU-Veranstaltungen erscheinen hier in Kürze.",
  },
  tours: {
    meta: {
      title: "Führungen – Philharmonie Szczecin",
      description: "Führungen durch das Gebäude auf Polnisch, Englisch und Deutsch. Termine, Preise und Dauer.",
    },
    eyebrow: "Freitags · PL, EN, DE · ca. 40 Minuten",
    title: "Führungen",
    lead: "Führung durch das Gebäude: seine Geschichte, der Sinfoniesaal und der Kammersaal, das Foyer, die Wendeltreppe und die Galerie Ebene 4.",
    factsLabel: "Das Wichtigste",
    facts: {
      when: ["Wann", "Freitags, Termine unten"],
      languages: ["Sprache", "Polnisch, Englisch, Deutsch; ausgewählte Termine mit polnischer Gebärdensprache"],
      duration: ["Dauer", "ca. 40 Minuten"],
      price: ["Preis", "30 zł, ermäßigt 20 zł · Kasse, Ticketautomat und online"],
    },
    groupsTitle: "Kommen Sie mit einer Gruppe?",
    groupsText:
      "Organisierte Gruppen sind willkommen, eine Reservierung ist nicht nötig. Bei einer größeren Gruppe schreiben Sie der Kasse oder rufen Sie an, um einen Termin abzustimmen.",
    groupsMailSubject: "Führung durch die Philharmonie – Gruppe",
    groupsMail: "E-Mail an die Kasse",
    groupsCall: "Kasse anrufen",
    upcoming: "Nächste Termine",
    empty: "Derzeit stehen keine Führungstermine im Spielplan. Schauen Sie bald wieder vorbei.",
  },
}

const ukrainian: ListingCopy = {
  ui: { loading: "Завантаження", upcoming: "Найближчі події" },
  edu: {
    meta: {
      title: "EDUfilharmonia – Філармонія в Щецині",
      description: "Концерти й вистави для дітей, родин і шкіл. Вік, тривалість і ціна біля кожної події.",
    },
    eyebrow: "Для дітей, шкіл і родин",
    title: "EDUfilharmonia",
    lead: "Перші концерти, вистави й зустрічі з музикою. Біля кожної події видно вік, тривалість і ціну.",
    groupsLabel: "Для кого",
    groups: [
      { title: "Діти", description: "Концерти з опікунами", href: edugroupHrefs.children },
      { title: "Родини", description: "Діти й дорослі разом", href: edugroupHrefs.families },
      { title: "Школи", description: "Концерти й вистави для учнів", href: edugroupHrefs.schools },
      { title: "Усе для дітей", description: "Фільтр у календарі", href: edugroupHrefs.all },
    ],
    empty: "Найближчі події EDU незабаром з’являться тут.",
  },
  tours: {
    meta: {
      title: "Екскурсії – Філармонія в Щецині",
      description: "Екскурсії будівлею польською, англійською та німецькою. Дати, ціни й тривалість.",
    },
    eyebrow: "П’ятниці · PL, EN, DE · близько 40 хвилин",
    title: "Екскурсії",
    lead: "Екскурсія з гідом: історія будівлі, Симфонічна й Камерна зали, хол, фоє, гвинтові сходи та Галерея Рівень 4.",
    factsLabel: "Головне",
    facts: {
      when: ["Коли", "По п’ятницях, дати нижче"],
      languages: ["Мова", "польська, англійська, німецька; окремі дати з перекладом польською жестовою мовою"],
      duration: ["Тривалість", "близько 40 хвилин"],
      price: ["Ціна", "30 зл, пільговий 20 зл · каса, автомат і онлайн"],
    },
    groupsTitle: "Приходите з групою?",
    groupsText:
      "Організовані групи вітаються, бронювання не потрібне. Для більшої групи напишіть або зателефонуйте до каси, щоб узгодити дату.",
    groupsMailSubject: "Екскурсія Філармонією – група",
    groupsMail: "Написати до каси",
    groupsCall: "Зателефонувати до каси",
    upcoming: "Найближчі дати",
    empty: "Зараз у репертуарі немає дат екскурсій. Перевірте згодом.",
  },
}

const copy: Record<Locale, ListingCopy> = { pl: polish, en: english, de: german, uk: ukrainian }

export function listingCopy(lang: Locale) {
  return copy[lang]
}
