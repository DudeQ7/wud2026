import type { Locale } from "@/i18n/config"
import { plural } from "@/i18n/plural"

// Słownik wzorcowy – EN i DE muszą mieć ten sam kształt (typ Dictionary).
// Treści z koncerty.json (tytuły, opisy, cykle) są tylko po polsku i nie przechodzą przez słownik.
export const pl = {
  lang: "pl" as Locale,
  /** Format dat Intl */
  intl: "pl-PL",
  /** Skróty dni jak w kalendarzu FS: „pon 19.10”, „nd 22.11” (od niedzieli) */
  weekdaysShort: ["nd", "pon", "wt", "śr", "czw", "pt", "sob"],

  meta: {
    home: {
      title: "Filharmonia im. Mieczysława Karłowicza w Szczecinie",
      description: "Koncerty, wystawy i zwiedzanie Filharmonii w Szczecinie. Sprawdź, co gramy dziś i wkrótce.",
    },
    repertoire: {
      title: "Repertuar – Filharmonia w Szczecinie",
      description: "Koncerty, wystawy, zwiedzanie i wydarzenia dla dzieci. Filtruj po dniu, rodzaju, wieku dziecka i miejscu.",
    },
    assistant: {
      title: "Asystent Filharmonii w Szczecinie",
      description: "Asystent AI Filharmonii im. Mieczysława Karłowicza w Szczecinie",
    },
  },

  common: {
    skipLink: "Przejdź do treści",
    logoAlt: "Filharmonia Szczecin – strona główna",
    menu: "Menu",
    language: "Wersja językowa",
  },

  nav: {
    label: "Dolna",
    calendar: "Kalendarz",
    search: "Szukaj",
    assistant: "Asystent",
    plan: "Planuj",
    account: "Konto",
  },

  footerPages: {
  "partners": {
    "title": "Partnerzy i biznes",
    "eyebrow": "Współpraca z Filharmonią",
    "lead": "Filharmonia zaprasza do długoterminowej współpracy oraz wspólnego tworzenia pojedynczych wydarzeń.",
    "links": [
      "Oferta partnerstwa",
      "Kontakt w sprawie współpracy"
    ]
  },
  "media": {
    "title": "Strefa mediów",
    "eyebrow": "Materiały i informacje",
    "lead": "Materiały do pobrania i kontakty do zespołu Filharmonii znajdziesz w oficjalnym serwisie.",
    "links": [
      "Materiały do pobrania",
      "Kontakt z Filharmonią",
      "Artyści",
      "Orkiestra"
    ]
  },
  "about": {
    "title": "O instytucji",
    "eyebrow": "Filharmonia w Szczecinie",
    "lead": "Poznaj Filharmonię im. Mieczysława Karłowicza w Szczecinie: jej orkiestrę, historię i budynek.",
    "links": [
      "Orkiestra",
      "Historia",
      "Budynek",
      "Dyrekcja — oficjalny serwis FS"
    ]
  },
  "accessibility": {
    "title": "Deklaracja dostępności",
    "eyebrow": "Dostępność serwisu i wizyty",
    "lead": "To prototyp przygotowany na hackathon WUD 2026. Jego zgodność z WCAG 2.2 AA nie została jeszcze potwierdzona pełnym audytem. Oficjalna deklaracja Filharmonii dotyczy jej własnego serwisu.",
    "links": [
      "Oficjalna deklaracja dostępności FS",
      "Dostępność podczas wizyty",
      "Kontakt i pomoc"
    ]
  },
  "contact": {
    "title": "Kontakt",
    "eyebrow": "Jesteśmy do Twojej dyspozycji",
    "lead": "Pytania o bilety, miejsca lub wizytę? Skontaktuj się z kasą Filharmonii.",
    "links": [],
    "boxOffice": "Kasa biletowa",
    "location": "Gdzie nas znajdziesz",
    "institution": "Filharmonia im. Mieczysława Karłowicza w Szczecinie",
    "directions": "Dojazd, parking i dostępność",
    "otherContacts": "Pozostałe kontakty — oficjalny serwis FS",
    "hours": "wt–czw 13:00–18:00, pt 13:00–20:00, sob 12:00–16:00 oraz godzinę przed każdym biletowanym wydarzeniem organizowanym przez Filharmonię"
  }
},

  footer: {
    boxOffice: "Kasa biletowa",
    boxOfficeHours: "wt–pt 12:00–18:00, sob 12:00–16:00\noraz godzinę przed każdym biletowanym wydarzeniem",
    navLabel: "Stopka",
    links: {
      partners: "Partnerzy i biznes",
      media: "Strefa mediów",
      contact: "Kontakt",
      about: "O instytucji",
      accessibility: "Deklaracja dostępności",
    },
    copyright: "© 2026 Filharmonia im. Mieczysława Karłowicza w Szczecinie",
  },

  event: {
    buyTicket: "Kup bilet",
    see: "Zobacz",
    photoAlt: (name: string) => `${name} – zdjęcie artysty`,
    facts: { when: "Kiedy", where: "Gdzie", lineup: "Skład", series: "Cykl" },
    /** Łącznik godzin: „17:00 i 19:00” */
    timesJoin: " i ",
    lineupPair: (first: string, second: string) => `${first} i ${second}`,
    lineupMany: (first: string, count: number) => `${first} i ${count} muzyków`,
    wheelchair: "Dostęp dla wózków · winda",
    exhibition: "Wystawa",
    openUntil: (date: string) => `Otwarta do ${date}`,
    age: (age: string) => `Wiek ${age}`,
    galleryPrice: "bilet 10 zł",
    photoPlaceholder: "Zdjęcie do pozyskania od FS",
    /** Krótkie rodzaje z koncerty.json → tłumaczenie; brak klucza = tekst z danych */
    kinds: {} as Record<string, string>,
    /** Nazwy sal → tłumaczenie; brak klucza = nazwa z danych */
    venues: {} as Record<string, string>,
    /** Nazwy cykli (bez sezonu, po formatSeries) → tłumaczenie; brak klucza = nazwa z danych */
    series: {} as Record<string, string>,
  },

  home: {
    today: {
      chooseDay: "Wybierz dzień",
      empty: "Tego dnia nie ma wydarzeń. Zajrzyj do pełnego kalendarza.",
      tabs: {
        today: { label: "Dziś", heading: "Dziś w Filharmonii", when: "dziś" },
        tomorrow: { label: "Jutro", heading: "Jutro w Filharmonii", when: "jutro" },
        weekend: { label: "Ten weekend", heading: "Weekend w Filharmonii", when: "w sobotę" },
      },
      buildingOpen: (hours: string) => `Budynek otwarty ${hours}`,
      buildingBeforeEvent: "Budynek otwarty godzinę przed wydarzeniem",
      boxOfficeOpen: (when: string, hours: string) => `Kasa ${when} ${hours}`,
      boxOfficeBeforeEvent: (when: string) => `Kasa ${when}: godzinę przed biletowanym wydarzeniem`,
      phone: (phone: string) => `tel. ${phone}`,
      fullDay: "Cały dzień w kalendarzu →",
    },
    upcoming: { title: "Najbliższe wydarzenia", all: "Pełny repertuar →" },
    recommended: {
      title: "Polecamy",
      featuredLead: "Laureat I nagrody 17. Konkursu Wieniawskiego gra z Orkiestrą Filharmonii.",
    },
    forYou: {
      title: "Dla Ciebie",
      lead: "Nie musisz znać muzyki klasycznej. Wybierz, na co masz ochotę.",
      cta: {
        eyebrow: "5 pytań · 3–5 propozycji",
        title: "Pomóż mi wybrać",
        description: "Powiedz, z kim, kiedy i w jakim nastroju chcesz przyjść. Podpowiemy konkretne wydarzenia.",
        action: "Zaczynamy",
      },
      tiles: {
        start: { title: "Zacznij tutaj", description: "Pierwszy raz w Filharmonii" },
        families: { title: "Dla rodzin", description: "Koncerty już od 1. roku życia" },
        jazz: { title: "Jeśli lubisz jazz", description: "Big band, wokal, improwizacja" },
        film: { title: "Jeśli lubisz muzykę filmową", description: "Morricone, Rocky, Kraina lodu" },
        short: { title: "Jeśli masz 30 minut", description: "Wystawy i krótkie formy" },
        unusual: { title: "Coś niezwykłego", description: "Film, debata, muzyka świata" },
      },
    },
    discover: {
      title: "Odkryj Filharmonię",
      lead: "Wejdź nie tylko na koncert: orkiestra, budynek, wystawy i 78 lat historii.",
      tiles: {
        orchestra: { title: "Orkiestra", description: "Muzycy, dyrygenci, nagrania" },
        building: { title: "Budynek", description: "Architektura i nagrody" },
        history: { title: "Historia", description: "Od 1948 roku do dziś" },
        exhibitions: { title: "Wystawy", description: "Galeria Poziom 4. i Art.Room" },
        edu: { title: "EDUfilharmonia", description: "Dla dzieci, szkół i rodzin" },
        tours: { title: "Zwiedzanie", description: "Piątki · PL, EN, DE · ok. 40 min" },
      },
    },
    newsletter: {
      title: "Bądź na bieżąco",
      lead: "Nowe koncerty i start sprzedaży biletów prosto na Twój e-mail.",
    },
    partners: { title: "Partnerzy", logo: "logo partnera", link: "Partnerzy i biznes →" },
  },

  newsletter: {
    email: "E-mail (wymagane)",
    placeholder: "np. anna@przyklad.pl",
    emailError: "Wpisz adres e-mail w formacie anna@przyklad.pl.",
    consent: "Zgadzam się na newsletter Filharmonii. Mogę zrezygnować w każdej chwili.",
    privacy: "Polityka prywatności",
    consentError: "Zaznacz zgodę, żebyśmy mogli wysyłać newsletter.",
    error: "Błąd:",
    submit: "Zapisz się",
    thanks: "Dziękujemy! Sprawdź skrzynkę i potwierdź zapis.",
  },

  calendar: {
    title: "Repertuar",
    intro: "Koncerty, wystawy, zwiedzanie i wydarzenia dla dzieci. Wybierz filtr albo wpisz, czego szukasz.",
    loading: "Wczytywanie repertuaru",
    searchLabel: "Szukaj wykonawcy, kompozytora lub tytułu",
    searchPlaceholder: "np. Karłowicz, Mendelssohn, jazz",
    clearSearch: "Wyczyść wyszukiwanie",
    quickFilters: "Szybkie filtry",
    quick: { today: "Dziś", weekend: "Ten weekend", kids: "Dla dzieci", jazz: "Jazz", exhibitions: "Wystawy" },
    count: (n: number) => `${n} ${plural(n, "wydarzenie", "wydarzenia", "wydarzeń")}`,
    shown: (limit: number, count: number) => `Widzisz ${limit} z ${count}`,
    showMore: "Pokaż kolejne wydarzenia",
    activeFilters: "Aktywne filtry",
    removeFilter: (label: string) => `Usuń filtr: ${label}`,
    clearAll: "Wyczyść wszystkie",
    emptyTitle: "Nic nie pasuje do tych filtrów",
    tryWithout: "Spróbuj bez jednego z nich:",
    withoutFilter: (label: string) => `Bez filtra „${label}”`,
    clearFilters: "Wyczyść filtry",
    quote: (text: string) => `„${text}”`,
    rangeFrom: (day: string) => `od ${day}`,
    rangeTo: (day: string) => `do ${day}`,
    age: (n: number) => `Wiek ${n} ${plural(n, "rok", "lata", "lat")}`,
    when: {
      dzis: "Dziś",
      jutro: "Jutro",
      weekend: "Ten weekend",
      tydzien: "Najbliższe 7 dni",
      miesiac: "Najbliższy miesiąc",
    },
    types: {
      symfoniczny: "Symfoniczny",
      kameralny: "Kameralny",
      jazz: "Jazz",
      "muzyka-swiata": "Muzyka świata",
      edukacja: "Edukacja i dzieci",
      wystawa: "Wystawa",
      zwiedzanie: "Zwiedzanie",
      festiwal: "Festiwal",
      spotkania: "Film, debata, wykład",
    },
    audiences: { dzieci: "Dzieci", rodziny: "Rodziny", szkoly: "Szkoły", seniorzy: "Seniorzy" },
    places: { symfoniczna: "Sala Symfoniczna", kameralna: "Sala Kameralna", galerie: "Galerie", hol: "Hol i foyer" },
    durations: { "do-45-min": "Do 45 min", "do-90-min": "Do 90 min", dluzej: "Dłużej niż 90 min" },
    moods: { filmowa: "Muzyka filmowa", niezwykle: "Coś niezwykłego" },
    sheet: {
      open: "Wszystkie filtry",
      title: "Filtry",
      close: "Zamknij filtry",
      when: "Kiedy",
      dateRange: "Albo wybierz zakres dat",
      from: "Od",
      to: "Do",
      type: "Rodzaj",
      audience: "Dla kogo",
      age: "Wiek dziecka (w latach)",
      ageHint: "Pokażemy wydarzenia z sugerowanym wiekiem, który pasuje.",
      mood: "Nastrój",
      place: "Miejsce",
      placeNote: "Wszystkie sale i galerie mają wejście bez progów i windę.",
      duration: "Czas trwania",
      durationNote: "Uwzględniamy wydarzenia z podanym czasem trwania. Wystawy możesz oglądać tak długo, jak chcesz.",
      series: "Cykl i festiwal",
      chooseSeries: "Wybierz cykl",
      allSeries: "Wszystkie cykle",
      selected: (n: number) => `wybrano ${n}`,
      clear: "Wyczyść",
      show: (n: number) => `Pokaż ${n} ${plural(n, "wynik", "wyniki", "wyników")}`,
    },
  },

  auth: {
    back: "Wróć do Asystenta",
    email: "Adres e-mail",
    emailPlaceholder: "twoj@email.pl",
    password: "Hasło",
    login: {
      title: "Logowanie",
      intro: "Zaloguj się do swojego konta, aby zarządzać ulubionymi koncertami i zapisanymi rozmowami.",
      submit: "Zaloguj się",
      pending: "Logowanie...",
      noAccount: "Nie masz jeszcze konta?",
      registerLink: "Zarejestruj się",
    },
    register: {
      title: "Rejestracja",
      intro: "Utwórz darmowe konto, aby zapisywać ulubione koncerty i personalizować rekomendacje.",
      fullName: "Imię i nazwisko",
      fullNamePlaceholder: "Jan Kowalski",
      password: "Hasło (min. 8 znaków)",
      submit: "Zarejestruj się",
      pending: "Tworzenie konta...",
      haveAccount: "Masz już konto?",
      loginLink: "Zaloguj się",
    },
    error: {
      title: "Wystąpił błąd autoryzacji",
      description: "Link potwierdzający mógł wygasnąć lub wystąpił problem podczas przetwarzania żądania.",
      toLogin: "Przejdź do logowania",
      home: "Strona główna",
    },
    errors: {
      invalidEmail: "Nieprawidłowy adres email",
      passwordMin: (n: number) => `Hasło musi mieć co najmniej ${n} znaków`,
      nameMin: "Imię i nazwisko musi mieć co najmniej 2 znaki",
      invalidLoginData: "Błędne dane logowania",
      wrongCredentials: "Nieprawidłowy login lub hasło.",
      invalidRegisterData: "Błędne dane rejestracji",
      registerFailed: "Błąd podczas rejestracji.",
      accountExists: "Konto z tym adresem e-mail już istnieje. Przejdź do strony logowania lub podaj inny e-mail.",
      credentialsMismatch: "Nieprawidłowe dane logowania lub konto już istnieje z innym hasłem.",
    },
  },

  panel: {
    title: "Panel Melomana",
    userFallback: "Użytkownik",
    nav: {
      dashboard: "Pulpit",
      favorites: "Ulubione koncerty",
      history: "Historia zapytań",
      profile: "Mój profil",
    },
    assistantLink: "Asystent AI Filharmonii",
    logout: "Wyloguj się",
    noDate: "Brak ustalonej daty",
    dashboard: {
      greeting: (name: string) => `Witaj, ${name}! 👋`,
      defaultName: "Melomanie",
      intro: "Oto Twój osobisty pulpit Filharmonii im. Mieczysława Karłowicza w Szczecinie.",
      favorites: "Ulubione koncerty",
      seeFavorites: "Zobacz listę ulubionych →",
      chats: "Zapisane rozmowy",
      seeHistory: "Przeglądaj historię rozmów →",
      assistant: "Asystent Filharmonii",
      assistantText: "Szukasz koncertu na weekend, biletów rodzinnych lub informacji o dojeździe?",
      askAi: "Zapytaj AI teraz",
      yourEvents: "Twoje wybrane wydarzenia",
      all: (n: number) => `Wszystkie (${n})`,
      noFavorites: "Nie dodałeś jeszcze żadnego koncertu do ulubionych.",
      discover: "Przejdź do asystenta i odkryj koncerty",
      details: "Szczegóły",
      buyTicket: "Kup bilet",
    },
    favorites: {
      title: "Ulubione koncerty i wydarzenia",
      intro: "Tutaj znajdziesz wszystkie wydarzenia, które zapisałeś na później.",
      emptyTitle: "Brak zapisanych koncertów",
      emptyText: "Przeglądaj wydarzenia podczas rozmowy z Asystentem Filharmonii i klikaj serduszko, aby zapisać je tutaj.",
      start: "Rozpocznij rozmowę z Asystentem",
      remove: "Usuń z ulubionych",
      removeButton: "✕ Usuń",
      details: "Szczegóły wydarzenia",
      buyTicket: "Kup bilet online",
      loginRequired: "Zaloguj się, aby dodawać koncerty do ulubionych",
    },
    history: {
      title: "Historia zapytań i rekomendacji",
      intro: "Przeglądaj swoje wcześniejsze rozmowy z Asystentem Filharmonii.",
      emptyTitle: "Brak historii rozmów",
      emptyText: "Twoje przyszłe rozmowy z Asystentem AI zostaną automatycznie zachowane w tym miejscu, gdy jesteś zalogowany.",
      start: "Rozpocznij nową rozmowę",
      untitled: "Rozmowa z asystentem",
      lastActivity: (date: string, lang: string) => `Ostatnia aktywność: ${date} · Język: ${lang}`,
      open: "Otwórz w asystencie",
    },
    profile: {
      title: "Twój profil",
      intro: "Zarządzaj swoimi danymi osobowymi oraz preferencjami asystenta.",
      since: "Konto aktywne od:",
      email: "Adres e-mail (login)",
      emailHint: "Adres e-mail jest powiązany z Twoim kontem i nie może być zmieniony z tego miejsca.",
      fullName: "Imię i nazwisko",
      fullNamePlaceholder: "Jan Kowalski",
      phone: "Numer telefonu (opcjonalnie)",
      contactLang: "Domyślny język kontaktu",
      langOptions: { pl: "Polski", en: "English (angielski)", de: "Deutsch (niemiecki)" },
      save: "Zapisz zmiany w profilu",
      saving: "Zapisywanie zmian...",
      notLoggedIn: "Musisz być zalogowany",
      updateFailed: "Nie udało się zaktualizować profilu",
      updated: "Profil został zaktualizowany",
    },
  },
}

export type Dictionary = typeof pl
