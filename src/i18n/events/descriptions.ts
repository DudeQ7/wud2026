import type { Locale } from "@/i18n/config"

// Tłumaczenia opisów wybranych wydarzeń (klucz = id z koncerty.json). Na razie tylko wydarzenia ze scenariuszy demo
// (docs/prezentacja-scenariusze.md); pozostałe opisy w EN/DE/UK zostają po polsku z notą o języku.
// `lead` to zdanie „dlaczego warto” (odpowiednik leadFrom w lib/events.ts), `more` – reszta opisu.
// Pominięte są elementy strony źródłowej, które nie są opisem (podpisy filmów, „FILMY I ZDJĘCIA”).

export type EventDescription = { lead: string; more: string[] }

const toursEn: EventDescription = {
  lead: "Both individual visitors and organised groups are welcome on the guided tour of the Philharmonic.",
  more: [
    "No booking is needed. The tour takes place regardless of how many people turn up on the day.",
    "Tickets cost 30 zł (reduced 20 zł) and are sold at the Philharmonic box office, at the ticket machine and online.",
    "The Philharmonic reserves the right to cancel a tour if the spaces are not available.",
  ],
}

const toursDe: EventDescription = {
  lead: "An der Führung durch die Philharmonie können sowohl Einzelbesucher als auch organisierte Gruppen teilnehmen.",
  more: [
    "Eine Reservierung ist nicht nötig. Die Führung findet unabhängig davon statt, wie viele Personen an diesem Tag kommen.",
    "Tickets zu 30 zł (ermäßigt 20 zł) gibt es an der Kasse der Philharmonie, am Ticketautomaten und online.",
    "Die Philharmonie behält sich vor, eine Führung abzusagen, wenn die Räume nicht zugänglich sind.",
  ],
}

const toursUk: EventDescription = {
  lead: "Брати участь в екскурсії Філармонією можуть як індивідуальні туристи, так і організовані групи.",
  more: [
    "Бронювати місця не потрібно. Екскурсія відбудеться незалежно від того, скільки охочих прийде цього дня.",
    "Квитки за 30 зл (пільгові 20 зл) продаються в касі Філармонії, в автоматі та онлайн.",
    "Філармонія залишає за собою право скасувати екскурсію, якщо простір буде недоступний.",
  ],
}

// Zwiedzanie w języku angielskim, niemieckim, polskim i polskim z PJM – ten sam opis
const TOUR_IDS = [2656, 2657, 2658, 2661]

const descriptions: Record<Exclude<Locale, "pl">, Record<number, EventDescription>> = {
  en: {
    ...Object.fromEntries(TOUR_IDS.map((id) => [id, toursEn])),
    // Paulina Przybysz | Insides – otwarcie strony głównej
    2608: {
      lead: "One of Poland's most charismatic singers invites you into the world of music that shaped her.",
      more: [
        "Paulina Przybysz returns to her roots – to the jazz and soul that filled her home from childhood with the voices of Nat King Cole, Ella Fitzgerald and Billie Holiday. Yet Insides, the material she will present, is more than a nostalgic tribute. Coltrane, Sun Ra and Dizzy Gillespie meet a sensibility shaped by hip-hop, R&B and decades of musical exploration. The singer boldly takes on classic standards and retells them in her own unique, mature voice.",
        "In Szczecin she will perform with an exceptional quintet from the front line of the new generation of Polish jazz: Marek Pędziwiatr (piano, synthesisers), Tymon Kosma (vibraphone), Olaf Węgier (tenor saxophone), Krzysztof Baranowski (double bass) and Wiktoria Jakubowska (drums). She shares with them similar inspirations, experience in the studio and on stage and – most importantly – a similar vision and understanding of the theme. In this company, respect for the classics meets bold experiment.",
        "This concert will be more than the Szczecin premiere of a new repertoire. It is a meeting with an artist who, after years of creative work, tells her own story in the language of music and reveals the sources of her success. Let the rest resound in the Symphony Hall.",
      ],
    },
    // FilHERmonia | Oda do młodości – ścieżka A (debiutant)
    2550: {
      lead: "Dutch violinist Noa Wildschut is only 24, yet she has already established herself on the international classical music scene.",
      more: [
        "At the age of six she performed live on Dutch public television at the Kinderprinsengrachtconcert 2007 in Amsterdam. A year later she made her debut in the Main Hall of the Concertgebouw in Amsterdam at the Night of the Promising concert. In September 2016 she became an exclusive recording artist for Warner Classics.",
        "Aleksandra Melaniuk is one of the most promising young conductors in Europe – a fellow of the prestigious Negaunee Conducting Program at the San Francisco Symphony and the Colburn School. She has appeared with leading orchestras such as the Helsinki Philharmonic Orchestra and the Los Angeles Philharmonic, and has worked with the Chicago Symphony Orchestra and the Royal Concertgebouw Orchestra.",
        "Together, these two outstanding artists will perform Max Bruch's Violin Concerto No. 1 – by far his best-known work and a cornerstone of the Romantic violin repertoire. The concerto matured in stages: the first complete version was performed in 1865, but the composer was not satisfied with it. After thorough revisions he consulted Joseph Joachim, who accepted the dedication and gave the premiere of the final version in Bremen in 1867.",
        "Formally the concerto has three movements, but the first is an introduction (Vorspiel) that flows into the rest of the work almost without a pause. This is what sets Bruch apart from the more classical model of the concerto: instead of a broad sonata-form opening, we are plunged straight into dramatic musical material. The middle movement is one of the most beautiful Romantic cantilenas, and the finale draws its energy from dance rhythms and lively motion.",
        "In the second half we will hear the Symphony in C minor by Felix Mendelssohn, written in 1824 when he was just 15. It was his first symphony for full orchestra, preceded by his string symphonies. It was first performed publicly in Leipzig on 1 February 1827. Nineteen days later, the young composer and pianist gave his first public performance in Szczecin, which included the world premiere of his overture to A Midsummer Night's Dream. The 200th anniversary of this event – the most important in our city's musical history – falls in a few months.",
      ],
    },
    // Jak w baroku brzmiały pory roku? – scenariusz B (rodzic)
    2612: {
      lead: "We open the new Academy season with a composer whose famous Four Seasons, written over 300 years ago, is still known all over the world.",
      more: [
        "The Red Priest, a violin virtuoso and the author of some 800 works, will introduce us to the Baroque orchestra and the music of his time. Young music lovers – meet Antonio Vivaldi!",
      ],
    },
    // Slavic Sessions – plakat w focusie na schodach
    2597: {
      lead: "Slavic Sessions was one of only five albums nominated for the 2026 Grammy Award for Best Chamber Music/Small Ensemble Performance.",
      more: [
        "It is one of the most important categories for chamber music, and the nomination alone places Mateusz Kowalski and Mak Grgić alongside the most highly regarded ensembles on today's classical scene. In 2026 the guitarists competed for the award with, among others, Neave Trio, Third Coast Percussion and Alarm Will Sound, who eventually won.",
        "The project by Polish guitarist Mateusz Kowalski and Slovenian-born Mak Grgić was recognised not as a specialist or guitar release, but as one of the best chamber recordings of the whole year.",
        "The Slovenian part of the programme consists of the traditional melodies Shepherd's Paths and The Mill, arranged by the Slovenian composer and pianist Leon Firšt. Alongside them you will hear Macedonian Girl and Chicho by Miroslav Tadić, a Bosnian-born guitarist and composer who has been bringing Balkan music into the concert repertoire for years.",
        "Nineteenth-century Polish guitar tradition is represented by Jan Nepomucen Bobrowicz, one of the greatest guitar virtuosos of his era. In his Variations Op. 6 for guitar he used the melody of Là ci darem la mano, the duet of Zerlina and Don Giovanni from Mozart's opera. The same theme had earlier inspired the young Chopin's famous piano variations.",
        "Bobrowicz also arranged Chopin's music for the guitar. These pieces recall the guitar's historical link with nineteenth-century salon culture and the attempts, made already by Chopin's contemporaries, to bring his music into the instrument's repertoire.",
        "The album also includes the world premiere recordings of two works by Miroslav Tadić. Stana's Lament for two guitars is a deeply moving lament, while Walk Dance No. 2 uses the irregular metres typical of the region's music.",
        "Mateusz Kowalski was born in Koszalin in 1995 and graduated with a Magna cum laude medal from the Fryderyk Chopin University of Music in Warsaw, where he studied with Ryszard Bałauszko. He has performed at the Musikverein in Vienna and the Shanghai Grand Theatre and has given concerts in New York, Los Angeles, Paris and London. He is particularly devoted to reviving the Polish guitar repertoire and creating new transcriptions. In 2023, at the Chopin and his Europe festival, he gave the first public performance of Chopin's Piano Concerto in F minor arranged for guitar and orchestra.",
        "Mak Grgić, a Slovenian guitarist born in Ljubljana, is one of the most versatile artists on his instrument today. He combines classical repertoire with Balkan music, flamenco, contemporary music and microtonal experiments. He is a professor at the University of South Carolina and co-founder of the EuroStrings international network of guitar festivals. The nomination for Slavic Sessions was his fourth Grammy nomination, following his albums Mak Bach, A Night in Upper Town and Entourer.",
      ],
    },
  },

  de: {
    ...Object.fromEntries(TOUR_IDS.map((id) => [id, toursDe])),
    2608: {
      lead: "Eine der charismatischsten Sängerinnen Polens lädt Sie in die Welt der Musik ein, die sie geprägt hat.",
      more: [
        "Paulina Przybysz kehrt zu ihren Wurzeln zurück – zu Jazz und Soul, die ihr Elternhaus seit ihrer Kindheit mit den Stimmen von Nat King Cole, Ella Fitzgerald und Billie Holiday erfüllten. Doch Insides, das Programm dieses Abends, ist keine bloß nostalgische Hommage. Coltrane, Sun Ra und Dizzy Gillespie treffen hier auf eine Sensibilität, die von Hip-Hop, R&B und jahrzehntelanger musikalischer Suche geprägt ist. Die Sängerin greift mutig zu klassischen Standards und erzählt sie mit ihrer unverwechselbaren, reifen Stimme neu.",
        "In Szczecin tritt Przybysz mit einem außergewöhnlichen Quintett aus der Spitze der neuen Generation des polnischen Jazz auf: Marek Pędziwiatr (Klavier, Synthesizer), Tymon Kosma (Vibraphon), Olaf Węgier (Tenorsaxophon), Krzysztof Baranowski (Kontrabass) und Wiktoria Jakubowska (Schlagzeug). Mit ihnen verbinden die Künstlerin ähnliche Inspirationen, gemeinsame Erfahrungen im Studio und auf der Bühne und vor allem eine ähnliche Vision des Themas. In diesem Kreis trifft Respekt vor der Klassik auf mutiges Experimentieren.",
        "Dieses Konzert ist mehr als die Szczeciner Premiere eines neuen Programms. Es ist eine Begegnung mit einer Künstlerin, die nach Jahren schöpferischer Arbeit ihre eigene Geschichte in der Sprache der Musik erzählt und die Quellen ihres Erfolgs offenlegt. Alles Weitere soll im Sinfoniesaal erklingen.",
      ],
    },
    2550: {
      lead: "Die niederländische Geigerin Noa Wildschut ist erst 24 Jahre alt und hat sich bereits auf der internationalen Klassikbühne etabliert.",
      more: [
        "Mit sechs Jahren trat sie live im niederländischen öffentlich-rechtlichen Fernsehen beim Kinderprinsengrachtconcert 2007 in Amsterdam auf. Ein Jahr später debütierte sie im Großen Saal des Concertgebouw Amsterdam beim Konzert Night of the Promising. Im September 2016 wurde sie Exklusivkünstlerin von Warner Classics.",
        "Aleksandra Melaniuk gehört zu den vielversprechendsten Dirigentinnen der jungen Generation in Europa – sie ist Stipendiatin des renommierten Negaunee Conducting Program der San Francisco Symphony und der Colburn School. Sie dirigierte bereits führende Orchester wie das Helsinki Philharmonic Orchestra und das Los Angeles Philharmonic und arbeitete mit dem Chicago Symphony Orchestra und dem Royal Concertgebouw Orchestra zusammen.",
        "Gemeinsam interpretieren die beiden herausragenden Künstlerinnen das Violinkonzert Nr. 1 von Max Bruch – sein mit Abstand berühmtestes Werk und eine Säule des romantischen Violinrepertoires. Das Konzert reifte in Etappen: Die erste vollständige Fassung wurde bereits 1865 aufgeführt, doch der Komponist war mit ihr nicht zufrieden. Nach gründlicher Überarbeitung beriet er sich mit Joseph Joachim, der die Widmung annahm und 1867 in Bremen die endgültige Fassung uraufführte.",
        "Formal besteht das Konzert aus drei Sätzen, doch der erste hat den Charakter eines Vorspiels und geht fast ohne Pause in den weiteren Verlauf über. Das unterscheidet Bruch vom klassischeren Konzertmodell: Statt einer breiten Sonatenexposition führt er uns sofort mitten ins dramatische Geschehen. Der Mittelsatz gehört zu den schönsten romantischen Kantilenen, und das Finale schöpft seine Energie aus tänzerischen Rhythmen und lebhafter Bewegung.",
        "Im zweiten Teil des Abends erklingt die Sinfonie c-Moll von Felix Mendelssohn, die er 1824 im Alter von nur 15 Jahren schrieb. Es war seine erste Sinfonie für großes Orchester, nach den früheren Streichersinfonien. Die öffentliche Uraufführung fand am 1. Februar 1827 in Leipzig statt. 19 Tage später trat der junge Komponist und Pianist zum ersten Mal öffentlich in Stettin auf; dabei wurde seine Ouvertüre zum Sommernachtstraum uraufgeführt. In wenigen Monaten jährt sich dieses Ereignis, das wichtigste der Musikgeschichte unserer Stadt, zum 200. Mal.",
      ],
    },
    2612: {
      lead: "Die neue Saison der Akademie beginnt mit einem Komponisten, dessen berühmte Vier Jahreszeiten vor über 300 Jahren entstanden und bis heute in der ganzen Welt bekannt sind.",
      more: [
        "Der „rote Priester“, Violinvirtuose und Autor von rund 800 Werken, stellt uns das Barockorchester und die Musik seiner Zeit vor. Junge Musikfreunde – hier kommt Antonio Vivaldi!",
      ],
    },
    2597: {
      lead: "Das Album Slavic Sessions gehörte zu nur fünf Alben, die für den Grammy 2026 in der Kategorie Best Chamber Music/Small Ensemble Performance nominiert wurden.",
      more: [
        "Es ist eine der wichtigsten Kategorien für Kammermusik, und schon die Nominierung stellt Mateusz Kowalski und Mak Grgić neben die angesehensten Ensembles der heutigen Klassikszene. 2026 konkurrierten die Gitarristen unter anderem mit dem Neave Trio, Third Coast Percussion und Alarm Will Sound, das den Preis schließlich erhielt.",
        "Das Projekt des polnischen Gitarristen Mateusz Kowalski und des aus Slowenien stammenden Mak Grgić wurde nicht als Spezial- oder Gitarrenaufnahme wahrgenommen, sondern als eine der besten Kammermusikaufnahmen des ganzen Jahres.",
        "Den slowenischen Teil des Programms bilden die traditionellen Melodien Shepherd's Paths und The Mill in Bearbeitungen des slowenischen Komponisten und Pianisten Leon Firšt. Daneben erklingen Macedonian Girl und Chicho von Miroslav Tadić – einem aus Bosnien stammenden Gitarristen und Komponisten, der seit Jahren die Musik des Balkans ins Konzertrepertoire bringt.",
        "Für die polnische Gitarrentradition des 19. Jahrhunderts steht Jan Nepomucen Bobrowicz, einer der bedeutendsten Gitarrenvirtuosen seiner Zeit. In seinen Variationen op. 6 für Gitarre verwendete er die Melodie von Là ci darem la mano, dem Duett von Zerlina und Don Giovanni aus Mozarts Oper. Dasselbe Thema lag zuvor den berühmten Klaviervariationen des jungen Chopin zugrunde.",
        "Bobrowicz übertrug auch Musik von Chopin auf die Gitarre. Diese Stücke erinnern an die historische Verbindung der Gitarre mit der Salonkultur des 19. Jahrhunderts und an die Versuche, Chopins Musik schon zu seinen Lebzeiten ins Repertoire des Instruments aufzunehmen.",
        "Das Album enthält außerdem die Welt-Ersteinspielungen zweier Werke von Miroslav Tadić. Stana's Lament für zwei Gitarren ist eine ergreifende Klage, während Walk Dance Nr. 2 die für die Musik der Region typischen unregelmäßigen Metren nutzt.",
        "Mateusz Kowalski wurde 1995 in Koszalin geboren und schloss sein Studium an der Fryderyk-Chopin-Musikuniversität in Warschau bei Ryszard Bałauszko mit der Medaille Magna cum laude ab. Er trat unter anderem im Wiener Musikverein und im Shanghai Grand Theatre auf und gab Konzerte in New York, Los Angeles, Paris und London. Besonders am Herzen liegen ihm die Wiederentdeckung des polnischen Gitarrenrepertoires und neue Transkriptionen. 2023 spielte er beim Festival Chopin und sein Europa als Erster öffentlich Chopins Klavierkonzert f-Moll in einer Fassung für Gitarre und Orchester.",
        "Mak Grgić, ein in Ljubljana geborener slowenischer Gitarrist, gehört zu den vielseitigsten Künstlern seines Instruments. Er verbindet klassisches Repertoire mit Balkanmusik, Flamenco, zeitgenössischer Musik und mikrotonalen Experimenten. Er ist Professor an der University of South Carolina und Mitbegründer des internationalen Gitarrenfestival-Netzwerks EuroStrings. Die Nominierung für Slavic Sessions war bereits seine vierte Grammy-Nominierung – zuvor waren seine Alben Mak Bach, A Night in Upper Town und Entourer nominiert.",
      ],
    },
  },

  uk: {
    ...Object.fromEntries(TOUR_IDS.map((id) => [id, toursUk])),
    2608: {
      lead: "Одна з найхаризматичніших польських вокалісток запрошує у світ музики, яка її сформувала.",
      more: [
        "Пауліна Пшибиш повертається до витоків – до джазу й соулу, що з дитинства наповнювали її дім голосами Ната Кінга Коула, Елли Фіцджеральд і Біллі Голідей. Проте Insides – програма, яку вона представить, – це не лише ностальгічна данина. Колтрейн, Сан Ра й Діззі Гіллеспі зустрічаються тут із чуттям, сформованим хіп-хопом, R&B і десятиліттями музичних пошуків. Співачка сміливо береться за класичні стандарти, щоб розповісти їх по-новому своїм неповторним, зрілим голосом.",
        "У Щецині вона виступить із винятковим квінтетом – провідними музикантами нового покоління польського джазу: Мареком Пендзівятром (фортепіано, синтезатори), Тимоном Космою (вібрафон), Олафом Венґером (тенор-саксофон), Кшиштофом Барановським (контрабас) і Вікторією Якубовською (ударні). Артистку з ними єднають схожі натхнення, спільний студійний і сценічний досвід і, найголовніше, схоже бачення теми. У цьому колі повага до класики зустрічається зі сміливим експериментом.",
        "Цей концерт буде чимось більшим, ніж щецинська прем’єра нового репертуару. Це зустріч з артисткою, яка після років творчих пошуків розповідає власну історію мовою музики й відкриває джерела свого успіху. Решта нехай прозвучить у Симфонічній залі.",
      ],
    },
    2550: {
      lead: "Нідерландській скрипальці Ноа Вільдсхут лише 24 роки, але вона вже утвердилася на міжнародній сцені класичної музики.",
      more: [
        "У шість років вона виступила наживо на нідерландському громадському телебаченні під час Kinderprinsengrachtconcert 2007 в Амстердамі. Через рік дебютувала у Великій залі Концертгебау в Амстердамі на концерті Night of the Promising. У вересні 2016 року стала ексклюзивною артисткою лейблу Warner Classics.",
        "Александра Меланюк – одна з найперспективніших диригенток молодого покоління в Європі, стипендіатка престижної програми Negaunee Conducting Program при San Francisco Symphony та Colburn School. Вона вже виступала з провідними оркестрами світу, зокрема Helsinki Philharmonic Orchestra і Los Angeles Philharmonic, а також співпрацювала з Chicago Symphony Orchestra і Royal Concertgebouw Orchestra.",
        "У виконанні цих двох видатних артисток прозвучить Перший скрипковий концерт Макса Бруха – без сумніву, найвідоміший його твір і одна з опор романтичного скрипкового репертуару. Концерт дозрівав поетапно: першу повну версію виконали вже 1865 року, але композитор був нею незадоволений; після ґрунтовних правок він радився з Йозефом Йоахімом, який прийняв посвяту й 1867 року в Бремені виконав остаточну версію.",
        "Формально концерт складається з трьох частин, але перша має характер вступу (Vorspiel) і майже без зупинки переходить у подальший розвиток твору. Саме це відрізняє Бруха від класичнішої моделі концерту: замість широкого сонатного початку ми одразу занурюємося в драматичну музичну матерію. Середня частина – одна з найкрасивіших романтичних кантилен, а фінал черпає енергію з танцювальних ритмів і стихійного руху.",
        "У другій частині вечора прозвучить Симфонія до мінор Фелікса Мендельсона, яку він написав 1824 року, коли йому було лише 15. Це була його перша симфонія для повного оркестру, якій передували струнні симфонії. Публічна прем’єра відбулася 1 лютого 1827 року в Лейпцигу. Через 19 днів у Щецині відбувся перший публічний виступ молодого композитора й піаніста, під час якого вперше прозвучала увертюра до «Сну літньої ночі». За кілька місяців виповниться 200 років від цієї події – найважливішої в усій музичній історії нашого міста.",
      ],
    },
    2612: {
      lead: "Новий сезон Академії ми відкриємо зустріччю з композитором, чиї славетні «Пори року», написані понад 300 років тому, досі знає весь світ.",
      more: [
        "Рудий священник, скрипковий віртуоз і автор близько 800 творів, познайомить нас із барокковим оркестром і музикою своєї доби. Юні меломани – зустрічайте Антоніо Вівальді!",
      ],
    },
    2597: {
      lead: "Альбом Slavic Sessions увійшов до лише п’яти альбомів, номінованих на премію «Ґреммі» 2026 у категорії Best Chamber Music/Small Ensemble Performance.",
      more: [
        "Це одна з найважливіших категорій, присвячених камерній музиці, а сама номінація ставить Матеуша Ковальського й Мака Ґрґіча поруч із найшанованішими ансамблями сучасної класичної сцени. 2026 року за статуетку разом із гітаристами змагалися, зокрема, Neave Trio, Third Coast Percussion і Alarm Will Sound, який зрештою й отримав нагороду.",
        "Проєкт польського гітариста Матеуша Ковальського та словенця Мака Ґрґіча відзначили не як спеціалізоване чи гітарне видання, а як один із найкращих камерних записів усього року.",
        "Словенську частину програми складають традиційні мелодії Shepherd’s Paths і The Mill в обробці словенського композитора й піаніста Леона Фіршта. Поряд із ними прозвучать Macedonian Girl і Chicho Мирослава Тадича – боснійського за походженням гітариста й композитора, який роками вводить музику Балкан до концертного репертуару.",
        "З польською гітарною традицією XIX століття пов’язана постать Яна Непомуцена Бобровича, одного з найвидатніших гітарних віртуозів своєї епохи. У Варіаціях op. 6 для гітари він використав мелодію Là ci darem la mano – дуету Церліни й Дон Жуана з опери Моцарта. Ця сама тема раніше лягла в основу славетних фортепіанних варіацій юного Шопена.",
        "Бобрович також перекладав музику Шопена для гітари. Ці твори нагадують про історичний зв’язок гітари із салонною культурою XIX століття та про спроби включити музику Шопена до репертуару цього інструмента, які робили ще його сучасники.",
        "На альбомі також є світові прем’єрні записи двох творів Мирослава Тадича. Stana’s Lament для двох гітар – це пронизливий плач, а Walk Dance № 2 використовує характерні для музики регіону нерегулярні метри.",
        "Матеуш Ковальський народився в Кошаліні 1995 року й закінчив Музичний університет імені Фридерика Шопена у Варшаві в класі Ришарда Балаушка з медаллю Magna cum laude. Він виступав, зокрема, у віденському Musikverein і Shanghai Grand Theatre, концертував у Нью-Йорку, Лос-Анджелесі, Парижі та Лондоні. Особливе місце в його діяльності посідають відродження польського гітарного репертуару й нові транскрипції. 2023 року на фестивалі «Шопен і його Європа» він першим публічно виконав фа-мінорний фортепіанний концерт Шопена в аранжуванні для гітари й оркестру.",
        "Мак Ґрґіч, словенський гітарист, народжений у Любляні, – один із найуніверсальніших сучасних виконавців на своєму інструменті. Він поєднує класичний репертуар із балканською музикою, фламенко, сучасною музикою й мікротоновими експериментами. Він професор University of South Carolina та співзасновник міжнародної мережі гітарних фестивалів EuroStrings. Номінація за Slavic Sessions стала вже його четвертою номінацією на «Ґреммі» – раніше відзначили його альбоми Mak Bach, A Night in Upper Town і Entourer.",
      ],
    },
  },
}

/** Przetłumaczony opis wydarzenia albo undefined (wtedy zostaje polski opis z notą o języku) */
export function eventDescription(id: number, lang: Locale): EventDescription | undefined {
  return lang === "pl" ? undefined : descriptions[lang][id]
}

/** Zdanie „dlaczego warto” w języku strony: po polsku z danych, w EN/DE/UK tylko gdy jest tłumaczenie */
export function eventLead(event: { id: number; lead?: string }, lang: Locale) {
  return lang === "pl" ? event.lead : eventDescription(event.id, lang)?.lead
}
