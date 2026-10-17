// Treści „Odkryj Filharmonię” – streszczenia stron filharmonia.szczecin.pl (budynek, nagrody,
// orkiestra, przewodnik dla nowych słuchaczy). Docelowo z CMS. Nic ponad źródło.

export const building = {
  photo: "https://filharmonia.szczecin.pl/files/simplesites/pl_6gallery_gallery_3_midi.jpg",
  source: "https://filharmonia.szczecin.pl/budynek",
  paragraphs: [
    "Pomysł zbudowania nowej siedziby Filharmonii w miejscu nieistniejącego już Domu Koncertowego (Konzerthaus) zrodził się w 2004 roku. Filharmonicy potrzebowali większej i nowocześniejszej przestrzeni, a szczecinianie widzieli w sali koncertowej u zbiegu ulic Małopolskiej i Matejki symboliczne nawiązanie do muzycznej historii miasta.",
    "W konkursie na koncepcję, ogłoszonym trzy lata później, jury wybrało spośród czterdziestu czterech pracowni z całego świata projekt studia Barozzi/Veiga z Barcelony. Lodowa bryła budynku została okrzyknięta nową ikoną miasta, a jednocześnie tworzy spójną linię z neogotycką zabudową otoczenia.",
    "Wnętrze to ponad 12 000 metrów kwadratowych na czterech kondygnacjach: sala symfoniczna, sala kameralna, sale prób, sklep muzyczny, kawiarnia, obszerne foyer, garderoby dla artystów, magazyn instrumentów i biura. Na co dzień biała fasada może rozbłysnąć wieloma barwami.",
  ],
  halls: [
    {
      name: "Sala Symfoniczna, zwana Salą Słoneczną",
      text: "Pomieści 953 osoby. Akustykę zapewnia specjalna geometria ścian i sufitów, opracowana z barcelońskim specjalistą dr. Higini Arau. Parametry sali dają efekt porównywany do wiedeńskiego Musikvereinu.",
    },
    {
      name: "Sala Kameralna",
      text: "Zaprojektowana dla 192 osób. Czas pogłosu jest zgodny z projektem co do jednej setnej sekundy, dlatego nazywa się ją „akustyczną perełką”.",
    },
  ],
}

/** Wybór nagród z podstrony „Nagrody dla Filharmonii” */
export const awards = [
  { year: "2014", text: "Eurobuild Awards, kategoria Architectural Design of the Year" },
  { year: "2015", text: "Designs of the Year (London’s Design Museum), kategoria architecture" },
  { year: "2015", text: "Nagroda Prezydenta RP – Grand Prix dla Najlepszego Obiektu Architektury w Polsce 2013–2014" },
  { year: "2015", text: "Mies van der Rohe Award 2015 (Unia Europejska), architektura współczesna" },
  { year: "2018", text: "Srebrny Medal „Zasłużony Kulturze Gloria Artis” dla Orkiestry Symfonicznej" },
  { year: "2023", text: "Wyróżnienie wśród 200 najbardziej znaczących dzieł architektury współczesnej na świecie (C.guide)" },
  { year: "2023", text: "Złoty Medal „Zasłużony Kulturze Gloria Artis” dla Orkiestry Symfonicznej" },
]

export const orchestra = {
  source: "https://filharmonia.szczecin.pl/grupy/1-Orkiestra_Symfoniczna_Filharmonii_w_Szczecinie",
  director: { name: "Przemysław Neumann", role: "Dyrektor Naczelny i Artystyczny" },
  facts: [
    { value: "90+", label: "muzyków" },
    { value: "1948", label: "rok powstania" },
    { value: "2023", label: "Złoty Medal Gloria Artis" },
  ],
  paragraphs: [
    "Orkiestra Symfoniczna Filharmonii w Szczecinie to zespół liczący ponad 90 muzyków, za którymi stoi 75 lat historii. Powstał w 1948 roku i był jedną z pierwszych orkiestr symfonicznych na ziemiach zachodnich.",
    "Muzycy koncertowali m.in. we Włoszech, Belgii, Danii, Hiszpanii i Niemczech, gdzie zagrali w berlińskim Konzerthausie i w sali im. Herberta von Karajana w Filharmonii Berlińskiej. Występowali z solistami takimi jak Mischa Maisky, Krystian Zimerman, Branford Marsalis czy Christian Tetzlaff oraz z dyrygentami, wśród nich Antoni Wit, Jerzy Maksymiuk i Jacek Kaspszyk.",
    "Bliska więź łączyła orkiestrę z Krzysztofem Pendereckim, który osobiście dyrygował nią podczas wykonania Requiem Polskiego (2005) w hali Stoczni Szczecińskiej, największego koncertu w historii miasta, oraz Siedmiu Bram Jerozolimy (2018).",
    "Najważniejszym osiągnięciem nagraniowym są albumy z niemal wszystkimi utworami patrona zespołu, Mieczysława Karłowicza, nagrane m.in. z Bartłomiejem Niziołem i Małgorzatą Walewską oraz dyrygentami Łukaszem Borowiczem i Rune Bergmannem.",
  ],
}

/** Oś czasu: tylko daty, które podają strony FS */
export const timeline = [
  { year: "1948", text: "Powstaje Orkiestra Symfoniczna, jedna z pierwszych na ziemiach zachodnich. Pierwsze koncerty odbywają się w kamienicznych mieszkaniach, ocalałych kościołach, a nawet suterenach." },
  { year: "2004", text: "Rodzi się pomysł nowej siedziby w miejscu nieistniejącego Konzerthausu." },
  { year: "2005", text: "Krzysztof Penderecki dyryguje Requiem Polskim w hali Stoczni Szczecińskiej." },
  { year: "2007", text: "Konkurs na koncepcję nowej filharmonii. Wygrywa projekt Barozzi/Veiga z Barcelony." },
  { year: "2014", text: "Uroczyste otwarcie nowej siedziby wraz z początkiem sezonu 2014/2015." },
  { year: "2015", text: "Budynek zdobywa m.in. Grand Prix Nagrody Prezydenta RP dla najlepszego obiektu architektury." },
  { year: "2018", text: "Srebrny Medal „Zasłużony Kulturze Gloria Artis” dla Orkiestry. Penderecki dyryguje Siedmioma Bramami Jerozolimy." },
  { year: "2023", text: "Złoty Medal „Zasłużony Kulturze Gloria Artis” dla Orkiestry oraz jubileusz 75-lecia Orkiestry i 70-lecia instytucji." },
]

/** Przewodnik dla nowych słuchaczy – odpowiedzi do „Planuj wizytę” */
export const guide = [
  {
    q: "Gdzie jest szatnia?",
    a: "W holu, na wprost drzwi wejściowych. Zostawisz tu płaszcz, kurtkę lub parasolkę. Szatnia otwiera się godzinę przed wydarzeniem, a zamyka 30 minut po jego zakończeniu.",
  },
  {
    q: "Co się stanie, jeśli się spóźnię?",
    a: "Zastaniesz zamknięte drzwi sali. Bileterzy spróbują wprowadzić Cię w krótkiej przerwie między utworami albo w przerwie koncertu. Zalecamy przyjść najpóźniej 20 minut przed początkiem.",
  },
  {
    q: "Co oznaczają dzwonki?",
    a: "To przypomnienie, że koncert wkrótce się zacznie: jeden dzwonek 15 minut przed, dwa 10 minut przed, trzy 5 minut przed. Tak samo przed końcem przerwy.",
  },
  {
    q: "Kiedy klaskać?",
    a: "W muzyce klasycznej nie klaszcze się między częściami utworu, bo muzycy potrzebują skupienia. Liczbę części sprawdzisz w programie koncertu. Możesz też po prostu dołączyć do oklasków całej widowni.",
  },
  {
    q: "Co wolno robić na sali?",
    a: "Prosimy o wyłączenie telefonu, bez nagrywania i fotografowania, bez rozmów i jedzenia. Sale mają tak dobrą akustykę, że słychać nawet rozwijany cukierek. Selfie zrób po ostatniej nucie.",
  },
  {
    q: "Ile trwa koncert i przerwa?",
    a: "To zależy od utworów, a informację znajdziesz na stronie wydarzenia. Większość koncertów symfonicznych ma przerwę, zwykle 20–30 minut. Koncerty kameralne i muzyka świata zwykle są bez przerwy.",
  },
  {
    q: "Gdzie znajdę program koncertu?",
    a: "Dla każdego koncertu jest program w pliku PDF z opisem utworów i artystów. Pobierzesz go po zeskanowaniu kodu QR w Filharmonii lub ze strony wydarzenia dzień przed koncertem. Kupującym online wysyłamy link dzień wcześniej.",
  },
]
