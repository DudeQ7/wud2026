// Treści redakcyjne strony głównej – docelowo z CMS. Wszystko, co faktograficzne, pochodzi z
// src/data/koncerty.json (venue_info) i src/data/visit.json; tu jest tylko wybór i krótkie opisy.

/** Polecamy (§7.1 pkt 4): 1 kafel wyróżniony + 2 mniejsze – id z koncerty.json */
export const recommended = {
  featuredId: 2558,
  featuredLead: "Laureat I nagrody 17. Konkursu Wieniawskiego gra z Orkiestrą Filharmonii.",
  otherIds: [2655, 2555],
}

/** Dla Ciebie (§6.18) – kafle nastrojów; docelowo prowadzą do kalendarza z ustawionymi filtrami */
export const moodTiles = [
  { title: "Zacznij tutaj", description: "Pierwszy raz w Filharmonii", href: "/zacznij-tutaj" },
  { title: "Dla rodzin", description: "Koncerty już od 1. roku życia", href: "/repertuar?dla-kogo=rodziny" },
  { title: "Jeśli lubisz jazz", description: "Big band, wokal, improwizacja", href: "/repertuar?rodzaj=jazz" },
  {
    title: "Jeśli lubisz muzykę filmową",
    description: "Morricone, Rocky, Kraina lodu",
    href: "/repertuar?nastroj=filmowa",
  },
  { title: "Jeśli masz 30 minut", description: "Wystawy i krótkie formy", href: "/repertuar?czas=do-45-min" },
  { title: "Coś niezwykłego", description: "Film, debata, muzyka świata", href: "/repertuar?nastroj=niezwykle" },
]

/** Odkryj Filharmonię (§6.18) – zdjęcie z galerii wskazanego wydarzenia (oryginał FS) */
export const discoverTiles: { title: string; description: string; href: string; imageFromEventId?: number }[] = [
  { title: "Orkiestra", description: "Muzycy, dyrygenci, nagrania", href: "/orkiestra", imageFromEventId: 2612 },
  // Brak zdjęcia budynku w danych FS – placeholder do czasu pozyskania materiałów.
  { title: "Budynek", description: "Architektura i nagrody", href: "/budynek" },
  { title: "Historia", description: "Od 1948 roku do dziś", href: "/historia", imageFromEventId: 2634 },
  { title: "Wystawy", description: "Galeria Poziom 4. i Art.Room", href: "/wystawy", imageFromEventId: 2642 },
  { title: "EDUfilharmonia", description: "Dla dzieci, szkół i rodzin", href: "/edu", imageFromEventId: 2629 },
  { title: "Zwiedzanie", description: "Piątki · PL, EN, DE · ok. 40 min", href: "/zwiedzanie", imageFromEventId: 2656 },
]

/** Godziny z venue_info (koncerty.json) – getUTCDay(): 0 = niedziela */
export const boxOffice = {
  phone: "+48 91 431 07 20",
  email: "kasa@filharmonia.szczecin.pl",
  summary: "wt–pt 12:00–18:00, sob 12:00–16:00\noraz godzinę przed każdym biletowanym wydarzeniem",
  hoursByWeekday: { 2: "12:00–18:00", 3: "12:00–18:00", 4: "12:00–18:00", 5: "12:00–18:00", 6: "12:00–16:00" } as Record<
    number,
    string
  >,
}

export const buildingHours = {
  // wtorek–niedziela 10:00–18:00 oraz godzinę przed każdym wydarzeniem
  hoursByWeekday: { 0: "10:00–18:00", 2: "10:00–18:00", 3: "10:00–18:00", 4: "10:00–18:00", 5: "10:00–18:00", 6: "10:00–18:00" } as Record<
    number,
    string
  >,
}

export const footerLinks = [
  { label: "Partnerzy i biznes", href: "/partnerzy" },
  { label: "Strefa mediów", href: "/media" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "O instytucji", href: "/o-instytucji" },
  { label: "Deklaracja dostępności", href: "/deklaracja-dostepnosci" },
]

export const address = "ul. Małopolska 48, 70-515 Szczecin"
