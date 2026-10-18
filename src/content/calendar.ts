// Tagi redakcyjne kalendarza – docelowo pola w CMS. Fakty (daty, sale, rodzaje) pochodzą z koncerty.json;
// tu jest tylko to, czego dane nie mówią wprost.

export const calendarEditorial = {
  /** „Jeśli lubisz muzykę filmową”: Morricone (Mitch&Mitch), Rocky i Kraina lodu (Trumpet Mania), muzyka z filmów i seriali */
  filmMusicIds: [2601, 2655, 2603],
  /**
   * „Klasyczne przeboje” (brief §6.2: Classical super hits) – w programie utwór, który zna każdy:
   * Bruch I Koncert skrzypcowy, Mozart Symfonia nr 40 i Requiem, Wełtawa, Rachmaninow II i III Koncert,
   * Eroica, Chopin Koncert e-moll, Pastoralna, Bolero, V Symfonia Beethovena, V Symfonia Czajkowskiego
   */
  superHitIds: [2550, 2551, 2555, 2557, 2560, 2566, 2570, 2571, 2573, 2576, 2578, 2580, 2586],
  /** „Na pierwszy raz”: cykle z prowadzeniem lub lżejszym repertuarem, dobre na pierwszą wizytę */
  firstTimeSeries: /filharmonia light|filhermonia|akademia słuchania/,
}
