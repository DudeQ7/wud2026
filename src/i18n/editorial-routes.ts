import type { Locale } from "@/i18n/config"
import { awards, building, orchestra, timeline } from "@/content/about"
import { plural } from "@/lib/calendar"

function pluralUk(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export type EditorialCopy = {
  ui: {
    loading: string
    sourceLabel: string
    sourceLink: string
    discoverEyebrow: string
    institution: string
    polishDetailsNote: string
  }
  search: {
    meta: { title: string; description: string }
    title: string
    label: string
    placeholder: string
    submit: string
    tryHeading: string
    popularHeading: string
    examples: string[]
    countLabel: (count: number, query: string) => string
    understood: string
    noResults: string
    seeRepertoire: string
    groups: { events: string; artists: string; works: string; texts: string }
    eventsCount: (count: number) => string
    showMore: (count: number) => string
    collapse: string
  }
  artists: {
    meta: { title: string; description: string }
    title: string
    lead: string
    noPhoto: string
    back: string
    artistEyebrow: string
    upcoming: string
    emptyUpcoming: string
  }
  series: {
    metaDescription: (name: string) => string
    eyebrow: (season?: string) => string
    lead: (total: number, nextDate: string | undefined, lastDate: string) => string
    seeInCalendar: string
    program: string
    emptyProgram: string
    artists: string
  }
  building: {
    meta: { title: string; description: string }
    title: string
    lead: string
    photoAlt: string
    paragraphs: string[]
    hallsHeading: string
    halls: { name: string; text: string }[]
    awardsHeading: string
    awards: { year: string; text: string }[]
    toursCta: string
    visitCta: string
  }
  history: {
    meta: { title: string; description: string }
    title: string
    lead: string
    timeline: { year: string; text: string }[]
  }
  orchestra: {
    meta: { title: string; description: string }
    title: string
    facts: { value: string; label: string }[]
    paragraphs: string[]
    directorRole: string
    artistsLink: string
  }
}

const polish: EditorialCopy = {
  ui: {
    loading: "Wczytywanie",
    sourceLabel: "Źródło:",
    sourceLink: "strona Filharmonii",
    discoverEyebrow: "Odkryj Filharmonię",
    institution: "Filharmonia w Szczecinie",
    polishDetailsNote: "",
  },
  search: {
    meta: {
      title: "Szukaj – Filharmonia w Szczecinie",
      description: "Szukaj wydarzeń, artystów, utworów i tekstów. Działa bez polskich znaków i z literówkami.",
    },
    title: "Szukaj",
    label: "Szukaj wydarzeń, artystów, utworów",
    placeholder: "np. jazz w październiku",
    submit: "Szukaj",
    tryHeading: "Spróbuj",
    popularHeading: "Popularne wyszukiwania",
    examples: ["jazz w październiku", "Karłowicz", "dla dzieci weekend", "Beethoven", "wystawy", "Mozart"],
    countLabel: (count, query) => `${count} ${plural(count, "wynik", "wyniki", "wyników")} dla „${query}”`,
    understood: "rozumiem",
    noResults: "Nic nie znaleźliśmy. Sprawdź pisownię albo wybierz coś z poniższych.",
    seeRepertoire: "Zobacz cały repertuar",
    groups: {
      events: "Wydarzenia",
      artists: "Artyści",
      works: "Utwory",
      texts: "Teksty i materiały",
    },
    eventsCount: (count) => `${count} ${plural(count, "wydarzenie", "wydarzenia", "wydarzeń")}`,
    showMore: (count) => `Pokaż pozostałe (${count})`,
    collapse: "Zwiń",
  },
  artists: {
    meta: {
      title: "Artyści – Filharmonia w Szczecinie",
      description: "Dyrygenci, soliści i zespoły występujący w tym sezonie.",
    },
    title: "Artyści",
    lead: "Dyrygenci, soliści i zespoły występujący w tym sezonie. Przy każdym profilu znajdziesz ich najbliższe koncerty.",
    noPhoto: "Brak zdjęcia",
    back: "← Artyści",
    artistEyebrow: "Artysta",
    upcoming: "Najbliższe wydarzenia",
    emptyUpcoming: "Nie ma teraz zapowiedzianych wydarzeń z udziałem tego artysty.",
  },
  series: {
    metaDescription: (name) => `Program, artyści i bilety: ${name}.`,
    eyebrow: (season) => (season ? `Cykl · sezon ${season.replace(/\/20/, "/")}` : "Cykl"),
    lead: (total, next, last) =>
      `${total} ${plural(total, "wydarzenie", "wydarzenia", "wydarzeń")}${next ? `, najbliższe ${next}` : ""}. Ostatni termin: ${last}.`,
    seeInCalendar: "Zobacz w kalendarzu",
    program: "Program",
    emptyProgram: "Wszystkie wydarzenia cyklu już się odbyły.",
    artists: "Artyści",
  },
  building: {
    meta: {
      title: "Budynek – Filharmonia w Szczecinie",
      description: "Lodowa bryła projektu Barozzi/Veiga: architektura, sale i nagrody.",
    },
    title: "Budynek",
    lead: "Lodowa bryła projektu Barozzi/Veiga z Barcelony, ikona Szczecina od sezonu 2014/2015.",
    photoAlt: "Filharmonia w Szczecinie",
    paragraphs: building.paragraphs,
    hallsHeading: "Sale",
    halls: building.halls,
    awardsHeading: "Nagrody",
    awards,
    toursCta: "Zwiedzanie z przewodnikiem",
    visitCta: "Planuj wizytę",
  },
  history: {
    meta: {
      title: "Historia – Filharmonia w Szczecinie",
      description: "Od orkiestry w kamienicznych mieszkaniach w 1948 roku do ikony Szczecina: oś czasu Filharmonii.",
    },
    title: "Historia",
    lead: "Orkiestra powstawała dzięki marzeniom entuzjastów, którzy wśród powojennych zgliszczy organizowali pierwsze koncerty. Dziś Filharmonia jest dumą Szczecina.",
    timeline,
  },
  orchestra: {
    meta: {
      title: "Orkiestra – Filharmonia w Szczecinie",
      description: "Orkiestra Symfoniczna Filharmonii w Szczecinie: ponad 90 muzyków i 75 lat historii.",
    },
    title: "Orkiestra",
    facts: orchestra.facts,
    paragraphs: orchestra.paragraphs,
    directorRole: orchestra.director.role,
    artistsLink: "Artyści występujący w tym sezonie →",
  },
}

const english: EditorialCopy = {
  ui: {
    loading: "Loading",
    sourceLabel: "Source:",
    sourceLink: "Philharmonic website",
    discoverEyebrow: "Discover the Philharmonic",
    institution: "Philharmonic in Szczecin",
    polishDetailsNote: "Detailed editorial description in Polish:",
  },
  search: {
    meta: {
      title: "Search – Philharmonic in Szczecin",
      description: "Search events, artists, works and texts. Works without Polish diacritics and tolerates typos.",
    },
    title: "Search",
    label: "Search events, artists, works",
    placeholder: "e.g. jazz, Beethoven, weekend",
    submit: "Search",
    tryHeading: "Try",
    popularHeading: "Popular searches",
    examples: ["jazz", "Karłowicz", "children weekend", "Beethoven", "exhibitions", "Mozart"],
    countLabel: (count, query) => `${count} ${count === 1 ? "result" : "results"} for “${query}”`,
    understood: "understood",
    noResults: "Nothing found. Check the spelling or choose one of the suggestions below.",
    seeRepertoire: "See full programme",
    groups: {
      events: "Events",
      artists: "Artists",
      works: "Works",
      texts: "Texts and materials",
    },
    eventsCount: (count) => `${count} ${count === 1 ? "event" : "events"}`,
    showMore: (count) => `Show remaining (${count})`,
    collapse: "Collapse",
  },
  artists: {
    meta: {
      title: "Artists – Philharmonic in Szczecin",
      description: "Conductors, soloists and ensembles performing this season.",
    },
    title: "Artists",
    lead: "Conductors, soloists and ensembles performing this season. Each profile lists their upcoming concerts.",
    noPhoto: "No photo",
    back: "← Artists",
    artistEyebrow: "Artist",
    upcoming: "Upcoming events",
    emptyUpcoming: "There are currently no upcoming events featuring this artist.",
  },
  series: {
    metaDescription: (name) => `Programme, artists and tickets: ${name}.`,
    eyebrow: (season) => (season ? `Series · season ${season.replace(/\/20/, "/")}` : "Series"),
    lead: (total, next, last) =>
      `${total} ${total === 1 ? "event" : "events"}${next ? `, next on ${next}` : ""}. Final date: ${last}.`,
    seeInCalendar: "View in calendar",
    program: "Programme",
    emptyProgram: "All events in this series have already taken place.",
    artists: "Artists",
  },
  building: {
    meta: {
      title: "The Building – Philharmonic in Szczecin",
      description: "The ice-like volume designed by Barozzi/Veiga: architecture, concert halls and awards.",
    },
    title: "The Building",
    lead: "An ice-like volume designed by Barozzi/Veiga from Barcelona — an icon of Szczecin since the 2014/2015 season.",
    photoAlt: "Philharmonic in Szczecin",
    paragraphs: [
      "The idea of building a new home for the Philharmonic on the site of the former Konzerthaus was born in 2004. Musicians needed a larger, modern space, while residents saw a concert hall at the corner of Małopolska and Matejki streets as a symbolic link to the city’s musical history.",
      "In the architectural competition announced three years later, the jury selected the design by Barozzi/Veiga from Barcelona out of forty-four entries from around the world. The ice-like silhouette was hailed as a new icon of the city while forming a coherent line with the surrounding neo-Gothic buildings.",
      "Inside, more than 12,000 square metres span four floors: the Symphony Hall, Chamber Hall, rehearsal rooms, music shop, café, spacious foyer, artist dressing rooms, instrument storage and offices. White by day, the glass facade can glow in many colours after dark.",
    ],
    hallsHeading: "Concert halls",
    halls: [
      {
        name: "Symphony Hall (Sun Hall)",
        text: "Seats 953 people. Its acoustics come from the geometry of the walls and ceiling developed with Barcelona acoustician Dr Higini Arau, achieving parameters compared to Vienna’s Musikverein.",
      },
      {
        name: "Chamber Hall",
        text: "Designed for 192 listeners. Its reverberation time matches the acoustic model to within one hundredth of a second, earning it the nickname “acoustic gem”.",
      },
    ],
    awardsHeading: "Awards",
    awards: [
      { year: "2014", text: "Eurobuild Awards, Architectural Design of the Year" },
      { year: "2015", text: "Designs of the Year (London Design Museum), architecture category" },
      { year: "2015", text: "Award of the President of Poland – Grand Prix for Best Architectural Building in Poland 2013–2014" },
      { year: "2015", text: "EU Prize for Contemporary Architecture – Mies van der Rohe Award 2015" },
      { year: "2018", text: "Silver Medal for Merit to Culture – Gloria Artis for the Symphony Orchestra" },
      { year: "2023", text: "Selected among the 200 most significant works of contemporary architecture in the world (C.guide)" },
      { year: "2023", text: "Gold Medal for Merit to Culture – Gloria Artis for the Symphony Orchestra" },
    ],
    toursCta: "Guided tours",
    visitCta: "Plan a visit",
  },
  history: {
    meta: {
      title: "History – Philharmonic in Szczecin",
      description: "From tenement concerts in 1948 to an architectural icon of Szczecin: the Philharmonic timeline.",
    },
    title: "History",
    lead: "The orchestra grew out of the dreams of enthusiasts who organised the first concerts amidst post-war ruins. Today the Philharmonic is the pride of Szczecin.",
    timeline: [
      { year: "1948", text: "The Symphony Orchestra is founded — one of the first in western Poland. Early concerts take place in apartments, surviving churches and basements." },
      { year: "2004", text: "The idea of a new building on the site of the former Konzerthaus is born." },
      { year: "2005", text: "Krzysztof Penderecki conducts his Polish Requiem in the Szczecin Shipyard hall." },
      { year: "2007", text: "International competition for the new Philharmonic building won by Barozzi/Veiga from Barcelona." },
      { year: "2014", text: "Grand opening of the new building at the start of the 2014/2015 season." },
      { year: "2015", text: "The building wins the EU Mies van der Rohe Award and the Grand Prix of the President of Poland." },
      { year: "2018", text: "Silver Gloria Artis Medal for the Orchestra. Penderecki conducts The Seven Gates of Jerusalem." },
      { year: "2023", text: "Gold Gloria Artis Medal for the Orchestra, marking 75 years of the Orchestra and 70 years of the institution." },
    ],
  },
  orchestra: {
    meta: {
      title: "Orchestra – Philharmonic in Szczecin",
      description: "Szczecin Philharmonic Symphony Orchestra: over 90 musicians and 75 years of history.",
    },
    title: "Orchestra",
    facts: [
      { value: "90+", label: "musicians" },
      { value: "1948", label: "founded" },
      { value: "2023", label: "Gold Gloria Artis Medal" },
    ],
    paragraphs: [
      "The Szczecin Philharmonic Symphony Orchestra brings together more than 90 musicians and 75 years of history. Founded in 1948, it was one of the first symphony orchestras in western Poland.",
      "The orchestra has performed in Italy, Belgium, Denmark, Spain and Germany, including the Konzerthaus Berlin and the Herbert von Karajan Hall at the Berliner Philharmonie, alongside soloists such as Mischa Maisky, Krystian Zimerman, Branford Marsalis and Christian Tetzlaff, and conductors including Antoni Wit, Jerzy Maksymiuk and Jacek Kaspszyk.",
      "A close bond linked the orchestra with Krzysztof Penderecki, who personally conducted it in the Polish Requiem (2005) at the Szczecin Shipyard hall — the largest concert in the city’s history — and The Seven Gates of Jerusalem (2018).",
      "Its flagship recording achievement is the series of albums featuring nearly all works by the institution’s patron, Mieczysław Karłowicz, recorded with Bartłomiej Nizioł, Małgorzata Walewska, Łukasz Borowicz and Rune Bergmann.",
    ],
    directorRole: "General and Artistic Director",
    artistsLink: "Artists performing this season →",
  },
}

const german: EditorialCopy = {
  ui: {
    loading: "Wird geladen",
    sourceLabel: "Quelle:",
    sourceLink: "Website der Philharmonie",
    discoverEyebrow: "Philharmonie entdecken",
    institution: "Philharmonie Szczecin",
    polishDetailsNote: "Ausführliche redaktionelle Beschreibung auf Polnisch:",
  },
  search: {
    meta: {
      title: "Suche – Philharmonie Szczecin",
      description: "Veranstaltungen, Künstler, Werke und Texte suchen. Funktioniert ohne Sonderzeichen und mit Tippfehlern.",
    },
    title: "Suche",
    label: "Veranstaltungen, Künstler, Werke suchen",
    placeholder: "z. B. Jazz, Beethoven, Wochenende",
    submit: "Suchen",
    tryHeading: "Versuchen Sie",
    popularHeading: "Beliebte Suchen",
    examples: ["Jazz", "Karłowicz", "Kinder Wochenende", "Beethoven", "Ausstellungen", "Mozart"],
    countLabel: (count, query) => `${count} ${count === 1 ? "Ergebnis" : "Ergebnisse"} für „${query}“`,
    understood: "verstanden",
    noResults: "Nichts gefunden. Prüfen Sie die Schreibweise oder wählen Sie einen Vorschlag unten.",
    seeRepertoire: "Gesamtes Programm ansehen",
    groups: {
      events: "Veranstaltungen",
      artists: "Künstler",
      works: "Werke",
      texts: "Texte und Materialien",
    },
    eventsCount: (count) => `${count} ${count === 1 ? "Veranstaltung" : "Veranstaltungen"}`,
    showMore: (count) => `Weitere anzeigen (${count})`,
    collapse: "Einklappen",
  },
  artists: {
    meta: {
      title: "Künstler – Philharmonie Szczecin",
      description: "Dirigenten, Solisten und Ensembles dieser Spielzeit.",
    },
    title: "Künstler",
    lead: "Dirigenten, Solisten und Ensembles dieser Spielzeit. Bei jedem Profil finden Sie die nächsten Konzerte.",
    noPhoto: "Kein Foto",
    back: "← Künstler",
    artistEyebrow: "Künstler",
    upcoming: "Kommende Veranstaltungen",
    emptyUpcoming: "Derzeit sind keine Veranstaltungen mit diesem Künstler angekündigt.",
  },
  series: {
    metaDescription: (name) => `Programm, Künstler und Tickets: ${name}.`,
    eyebrow: (season) => (season ? `Reihe · Spielzeit ${season.replace(/\/20/, "/")}` : "Reihe"),
    lead: (total, next, last) =>
      `${total} ${total === 1 ? "Veranstaltung" : "Veranstaltungen"}${next ? `, nächste am ${next}` : ""}. Letzter Termin: ${last}.`,
    seeInCalendar: "Im Kalender ansehen",
    program: "Programm",
    emptyProgram: "Alle Veranstaltungen dieser Reihe haben bereits stattgefunden.",
    artists: "Künstler",
  },
  building: {
    meta: {
      title: "Das Gebäude – Philharmonie Szczecin",
      description: "Der eisige Baukörper von Barozzi/Veiga: Architektur, Säle und Auszeichnungen.",
    },
    title: "Das Gebäude",
    lead: "Der eisige Baukörper nach dem Entwurf von Barozzi/Veiga aus Barcelona – seit der Spielzeit 2014/2015 eine Ikone von Szczecin.",
    photoAlt: "Philharmonie in Szczecin",
    paragraphs: [
      "Die Idee, am Standort des ehemaligen Konzerthauses einen neuen Sitz der Philharmonie zu errichten, entstand 2004. Die Musiker brauchten größere und modernere Räume, und die Bürger sahen im Konzertsaal an der Ecke Małopolska- und Matejki-Straße eine symbolische Anknüpfung an die Musikgeschichte der Stadt.",
      "Im drei Jahre später ausgeschriebenen Architekturwettbewerb wählte die Jury unter 44 Büros aus aller Welt den Entwurf von Barozzi/Veiga aus Barcelona. Der eisige Baukörper wurde als neue Ikone der Stadt gefeiert und fügt sich zugleich in die neugotische Nachbarschaft ein.",
      "Im Inneren verteilen sich über 12.000 Quadratmeter auf vier Geschosse: Sinfoniesaal, Kammersaal, Probenräume, Musikgeschäft, Café, weitläufiges Foyer, Künstlergarderoben, Instrumentenlager und Büros. Tagsüber weiß, kann die Glasfassade abends in vielen Farben leuchten.",
    ],
    hallsHeading: "Säle",
    halls: [
      {
        name: "Sinfoniesaal (Sonnensaal)",
        text: "Bietet 953 Plätze. Die Akustik entsteht durch die Geometrie von Wänden und Decke, entwickelt mit dem Barceloner Akustiker Dr. Higini Arau – vergleichbar mit dem Wiener Musikverein.",
      },
      {
        name: "Kammersaal",
        text: "Für 192 Zuhörer entworfen. Die Nachhallzeit entspricht auf eine Hundertstelsekunde genau der Berechnung, weshalb er als „akustisches Juwel“ gilt.",
      },
    ],
    awardsHeading: "Auszeichnungen",
    awards: [
      { year: "2014", text: "Eurobuild Awards, Kategorie Architectural Design of the Year" },
      { year: "2015", text: "Designs of the Year (London Design Museum), Kategorie Architektur" },
      { year: "2015", text: "Preis des Präsidenten der Republik Polen – Grand Prix für das beste Bauwerk Polens 2013–2014" },
      { year: "2015", text: "Mies van der Rohe Award 2015 (Europäische Union), zeitgenössische Architektur" },
      { year: "2018", text: "Silbermedaille „Gloria Artis“ für das Sinfonieorchester" },
      { year: "2023", text: "Auszeichnung unter den 200 bedeutendsten Werken zeitgenössischer Architektur weltweit (C.guide)" },
      { year: "2023", text: "Goldmedaille „Gloria Artis“ für das Sinfonieorchester" },
    ],
    toursCta: "Führungen mit Guide",
    visitCta: "Besuch planen",
  },
  history: {
    meta: {
      title: "Geschichte – Philharmonie Szczecin",
      description: "Von Wohnungskonzerten 1948 bis zur Architekturikone in Szczecin: die Zeitleiste der Philharmonie.",
    },
    title: "Geschichte",
    lead: "Das Orchester entstand aus den Träumen von Musikbegeisterten, die inmitten der Nachkriegstrümmer erste Konzerte veranstalteten. Heute ist die Philharmonie der Stolz von Szczecin.",
    timeline: [
      { year: "1948", text: "Gründung des Sinfonieorchesters als eines der ersten in Westpolen. Erste Konzerte finden in Wohnungen, erhaltenen Kirchen und Kellern statt." },
      { year: "2004", text: "Die Idee eines Neubaus am Ort des ehemaligen Konzerthauses entsteht." },
      { year: "2005", text: "Krzysztof Penderecki dirigiert sein Polnisches Requiem in der Halle der Stettiner Werft." },
      { year: "2007", text: "Architekturwettbewerb für die neue Philharmonie – Sieger ist Barozzi/Veiga aus Barcelona." },
      { year: "2014", text: "Feierliche Eröffnung des neuen Gebäudes zum Auftakt der Spielzeit 2014/2015." },
      { year: "2015", text: "Das Gebäude erhält u. a. den Mies van der Rohe Award und den Grand Prix des polnischen Präsidenten." },
      { year: "2018", text: "Silbermedaille „Gloria Artis“ für das Orchester. Penderecki dirigiert „Die sieben Tore von Jerusalem“." },
      { year: "2023", text: "Goldmedaille „Gloria Artis“ zum 75-jährigen Jubiläum des Orchesters und 70-jährigen Bestehen der Institution." },
    ],
  },
  orchestra: {
    meta: {
      title: "Orchester – Philharmonie Szczecin",
      description: "Sinfonieorchester der Philharmonie Szczecin: über 90 Musikerinnen und Musiker und 75 Jahre Geschichte.",
    },
    title: "Orchester",
    facts: [
      { value: "90+", label: "Musiker" },
      { value: "1948", label: "Gründungsjahr" },
      { value: "2023", label: "Goldmedaille Gloria Artis" },
    ],
    paragraphs: [
      "Das Sinfonieorchester der Philharmonie in Szczecin zählt über 90 Musikerinnen und Musiker und blickt auf 75 Jahre Geschichte zurück. Es wurde 1948 als eines der ersten Sinfonieorchester in den westlichen Regionen Polens gegründet.",
      "Das Orchester gastierte u. a. in Italien, Belgien, Dänemark, Spanien und Deutschland – darunter im Konzerthaus Berlin und im Herbert-von-Karajan-Saal der Berliner Philharmonie – und trat mit Solisten wie Mischa Maisky, Krystian Zimerman, Branford Marsalis und Christian Tetzlaff sowie Dirigenten wie Antoni Wit, Jerzy Maksymiuk und Jacek Kaspszyk auf.",
      "Eine enge Verbindung bestand zu Krzysztof Penderecki, der das Orchester beim Polnischen Requiem (2005) in der Stettiner Werfthalle – dem größten Konzert in der Geschichte der Stadt – sowie bei den „Sieben Toren von Jerusalem“ (2018) selbst dirigierte.",
      "Zu den wichtigsten Einspielungen zählen die Alben mit fast sämtlichen Werken des Namenspatrons Mieczysław Karłowicz, aufgenommen u. a. mit Bartłomiej Nizioł, Małgorzata Walewska, Łukasz Borowicz und Rune Bergmann.",
    ],
    directorRole: "Intendant und Künstlerischer Leiter",
    artistsLink: "Künstler dieser Spielzeit →",
  },
}

const ukrainian: EditorialCopy = {
  ui: {
    loading: "Завантаження",
    sourceLabel: "Джерело:",
    sourceLink: "сайт Філармонії",
    discoverEyebrow: "Відкрийте Філармонію",
    institution: "Філармонія в Щецині",
    polishDetailsNote: "Детальний редакційний опис польською мовою:",
  },
  search: {
    meta: {
      title: "Пошук – Філармонія в Щецині",
      description: "Шукайте події, артистів, твори й тексти. Працює без польських діакритичних знаків і з одруківками.",
    },
    title: "Пошук",
    label: "Шукайте події, артистів, твори",
    placeholder: "напр. джаз, Beethoven, вихідні",
    submit: "Шукати",
    tryHeading: "Спробуйте",
    popularHeading: "Популярні запити",
    examples: ["jazz", "Karłowicz", "діти вихідні", "Beethoven", "виставки", "Mozart"],
    countLabel: (count, query) => `${count} ${pluralUk(count, "результат", "результати", "результатів")} для «${query}»`,
    understood: "розпізнано",
    noResults: "Нічого не знайдено. Перевірте написання або оберіть один із варіантів нижче.",
    seeRepertoire: "Дивитися весь репертуар",
    groups: {
      events: "Події",
      artists: "Артисти",
      works: "Твори",
      texts: "Тексти й матеріали",
    },
    eventsCount: (count) => `${count} ${pluralUk(count, "подія", "події", "подій")}`,
    showMore: (count) => `Показати решту (${count})`,
    collapse: "Згорнути",
  },
  artists: {
    meta: {
      title: "Артисти – Філармонія в Щецині",
      description: "Диригенти, солісти й ансамблі цього сезону.",
    },
    title: "Артисти",
    lead: "Диригенти, солісти й ансамблі цього сезону. У кожному профілі ви знайдете їхні найближчі концерти.",
    noPhoto: "Немає фото",
    back: "← Артисти",
    artistEyebrow: "Артист",
    upcoming: "Найближчі події",
    emptyUpcoming: "Наразі немає анонсованих подій за участю цього артиста.",
  },
  series: {
    metaDescription: (name) => `Програма, артисти та квитки: ${name}.`,
    eyebrow: (season) => (season ? `Цикл · сезон ${season.replace(/\/20/, "/")}` : "Цикл"),
    lead: (total, next, last) =>
      `${total} ${pluralUk(total, "подія", "події", "подій")}${next ? `, найближча ${next}` : ""}. Остання дата: ${last}.`,
    seeInCalendar: "Дивитися в календарі",
    program: "Програма",
    emptyProgram: "Усі події цього циклу вже відбулися.",
    artists: "Артисти",
  },
  building: {
    meta: {
      title: "Будівля – Філармонія в Щецині",
      description: "Крижана брила за проєктом Barozzi/Veiga: архітектура, зали та нагороди.",
    },
    title: "Будівля",
    lead: "Крижана брила за проєктом студії Barozzi/Veiga з Барселони — ікона Щецина від сезону 2014/2015.",
    photoAlt: "Філармонія в Щецині",
    paragraphs: [
      "Ідея збудувати нову резиденцію Філармонії на місці колишнього Концертгаузу народилася у 2004 році. Музикантам був потрібен більший і сучасніший простір, а мешканці бачили в концертній залі на розі вулиць Малопольської та Матейка символічне продовження музичної історії міста.",
      "У конкурсі, оголошеному три роки по тому, журі обрало з-поміж сорока чотирьох бюро з усього світу проєкт студії Barozzi/Veiga з Барселони. Крижана брила будівлі стала новою іконою міста й водночас гармонійно поєдналася з неоготичною забудовою довкола.",
      "Усередині — понад 12 000 квадратних метрів на чотирьох поверхах: Симфонічна зала, Камерна зала, репетиційні зали, музична крамниця, кав’ярня, просторе фоє, гримерні для артистів, сховище інструментів та офіси. Білий удень фасад увечері може світитися багатьма кольорами.",
    ],
    hallsHeading: "Зали",
    halls: [
      {
        name: "Симфонічна зала (Сонячна зала)",
        text: "Вміщує 953 особи. Акустику забезпечує геометрія стін і стелі, розроблена з барселонським акустиком д-ром Іґіні Арау; за параметрами залу порівнюють із віденським Музікферайном.",
      },
      {
        name: "Камерна зала",
        text: "Спроєктована для 192 слухачів. Час реверберації збігається з розрахунками з точністю до однієї сотої секунди, тому її називають «акустичною перлиною».",
      },
    ],
    awardsHeading: "Нагороди",
    awards: [
      { year: "2014", text: "Eurobuild Awards, категорія Architectural Design of the Year" },
      { year: "2015", text: "Designs of the Year (London Design Museum), категорія архітектура" },
      { year: "2015", text: "Нагорода Президента РП – Гран-прі для найкращого об’єкта архітектури в Польщі 2013–2014" },
      { year: "2015", text: "Премія ЄС Mies van der Rohe Award 2015 за сучасну архітектуру" },
      { year: "2018", text: "Срібна медаль «Заслужений культурі Gloria Artis» для Симфонічного оркестру" },
      { year: "2023", text: "Відзнака серед 200 найвизначніших творів сучасної архітектури світу (C.guide)" },
      { year: "2023", text: "Золота медаль «Заслужений культурі Gloria Artis» для Симфонічного оркестру" },
    ],
    toursCta: "Екскурсії з гідом",
    visitCta: "Плануй візит",
  },
  history: {
    meta: {
      title: "Історія – Філармонія в Щецині",
      description: "Від оркестру в кам’яницях у 1948 році до ікони Щецина: хронологія Філармонії.",
    },
    title: "Історія",
    lead: "Оркестр народжувався завдяки мріям ентузіастів, які серед повоєнних руїн організовували перші концерти. Сьогодні Філармонія є гордістю Щецина.",
    timeline: [
      { year: "1948", text: "Засновано Симфонічний оркестр — один із перших на західних землях Польщі. Перші концерти відбуваються у квартирах, вцілілих костелах і підвалах." },
      { year: "2004", text: "Народжується ідея нової будівлі на місці колишнього Концертгаузу." },
      { year: "2005", text: "Кшиштоф Пендерецький диригує «Польським реквіємом» у цеху Щецинської корабельні." },
      { year: "2007", text: "Конкурс на концепцію нової філармонії виграє бюро Barozzi/Veiga з Барселони." },
      { year: "2014", text: "Урочисте відкриття нової будівлі на початку сезону 2014/2015." },
      { year: "2015", text: "Будівля здобуває премію Mies van der Rohe Award та Гран-прі Нагороди Президента РП." },
      { year: "2018", text: "Срібна медаль «Gloria Artis» для Оркестру. Пендерецький диригує «Сімома брамами Єрусалима»." },
      { year: "2023", text: "Золота медаль «Gloria Artis» для Оркестру та ювілей 75-річчя Оркестру і 70-річчя інституції." },
    ],
  },
  orchestra: {
    meta: {
      title: "Оркестр – Філармонія в Щецині",
      description: "Симфонічний оркестр Філармонії в Щецині: понад 90 музикантів і 75 років історії.",
    },
    title: "Оркестр",
    facts: [
      { value: "90+", label: "музикантів" },
      { value: "1948", label: "рік заснування" },
      { value: "2023", label: "Золота медаль Gloria Artis" },
    ],
    paragraphs: [
      "Симфонічний оркестр Філармонії в Щецині об’єднує понад 90 музикантів і має за плечима 75 років історії. Заснований у 1948 році, він був одним із перших симфонічних оркестрів на західних землях Польщі.",
      "Музиканти виступали в Італії, Бельгії, Данії, Іспанії та Німеччині, зокрема в берлінському Концертгаузі та залі ім. Герберта фон Караяна у Берлінській філармонії, разом із солістами Мішею Майським, Крістіаном Цімерманом, Бренфордом Марсалісом, Крістіаном Тецлаффом і диригентами Антонієм Вітом, Єжи Максимюком та Яцеком Каспшиком.",
      "Тісний зв’язок єднав оркестр із Кшиштофом Пендерецьким, який особисто диригував ним під час виконання «Польського реквієму» (2005) у залі Щецинської корабельні — найбільшого концерту в історії міста — та «Семи брам Єрусалима» (2018).",
      "Найважливішим звукозаписним досягненням є альбоми з майже всіма творами патрона оркестру Мечислава Карловича, записані з Бартломієм Нізьолом, Малґожатою Валевською, Лукашем Боровичем і Руне Берґманном.",
    ],
    directorRole: "Генеральний і художній директор",
    artistsLink: "Артисти цього сезону →",
  },
}

const copy: Record<Locale, EditorialCopy> = { pl: polish, en: english, de: german, uk: ukrainian }

export function editorialCopy(lang: Locale) {
  return copy[lang]
}
