// Treści redakcyjne strony głównej – docelowo z CMS. Wszystko, co faktograficzne, pochodzi z
// src/data/koncerty.json (venue_info) i src/data/visit.json; tu jest tylko wybór i adresy.
// Teksty kafli i linków są w słownikach (src/i18n/dictionaries) pod tymi samymi kluczami.

/** Polecamy (§7.1 pkt 4): 1 kafel wyróżniony + 2 mniejsze – id z koncerty.json; zdanie o wyróżnionym w słowniku */
export const recommended = {
  featuredId: 2558,
  otherIds: [2655, 2555],
}

/** Dla Ciebie (§6.18) – kafle nastrojów; docelowo prowadzą do kalendarza z ustawionymi filtrami */
export const moodTiles = [
  { key: "start", href: "/zacznij-tutaj" },
  { key: "families", href: "/repertuar?dla-kogo=rodziny" },
  { key: "jazz", href: "/repertuar?rodzaj=jazz" },
  { key: "film", href: "/repertuar?nastroj=filmowa" },
  { key: "short", href: "/repertuar?czas=do-45-min" },
  { key: "unusual", href: "/repertuar?nastroj=niezwykle" },
] as const

/** Odkryj Filharmonię (§6.18) – zdjęcie z galerii wskazanego wydarzenia (oryginał FS) */
export const discoverTiles: {
  key: "orchestra" | "building" | "history" | "exhibitions" | "edu" | "tours"
  href: string
  imageFromEventId?: number
}[] = [
  { key: "orchestra", href: "/orkiestra", imageFromEventId: 2612 },
  // Brak zdjęcia budynku w danych FS – kafel pokazuje fragment ilustracji schodów (motyw strony głównej)
  { key: "building", href: "/budynek" },
  { key: "history", href: "/historia", imageFromEventId: 2634 },
  { key: "exhibitions", href: "/wystawy", imageFromEventId: 2642 },
  { key: "edu", href: "/edu", imageFromEventId: 2629 },
  { key: "tours", href: "/zwiedzanie", imageFromEventId: 2656 },
]

/** Godziny z venue_info (koncerty.json) – getUTCDay(): 0 = niedziela; opis godzin w słowniku (footer.boxOfficeHours) */
export const boxOffice = {
  phone: "+48 91 431 07 20",
  email: "kasa@filharmonia.szczecin.pl",
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
  { key: "faq", href: "/faq" },
  { key: "partners", href: "/partnerzy" },
  { key: "media", href: "/media" },
  { key: "contact", href: "/kontakt" },
  { key: "about", href: "/o-instytucji" },
  { key: "accessibility", href: "/deklaracja-dostepnosci" },
] as const

export const address = "ul. Małopolska 48, 70-515 Szczecin"

/** Pierwsza wizyta w trzech krokach (Odkryj Filharmonię) – trasa po budynku jak na zwiedzaniu z przewodnikiem (visit.json → tours) */
export const firstVisitRoute = [
  { key: "foyer", href: "/budynek", photo: "https://filharmonia.szczecin.pl/files/simplesites/pl_6gallery_gallery_5_midi.jpg", position: "50% 40%" },
  { key: "hall", href: "/repertuar", photo: "https://filharmonia.szczecin.pl/files/simplesites/pl_6gallery_gallery_28_midi.jpg", position: "50% 50%" },
  { key: "gallery", href: "/wystawy", photo: "https://filharmonia.szczecin.pl/files/simplesites/pl_6gallery_gallery_33_midi.jpg", position: "50% 60%" },
] as const
