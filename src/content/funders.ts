import type { Locale } from "@/i18n"

// Instytucje współfinansujące i sponsorzy (baner w stopce i w sekcji partnerów).
// UWAGA: wpis UE to element demonstracyjny w wersji monochromatycznej (dopuszczonej w zasadach oznaczania UE).
// Przed wdrożeniem FS podaje nazwę programu i numer projektu (jeśli dotyczy) oraz oficjalne pliki SVG.
// Miasto Szczecin i MKiDN to instytucje z logotypami w stopce obecnej strony FS; pliki SVG pochodzą stamtąd (białe, do użycia na ciemnym tle; przycięty tylko viewBox, bez zmian kształtu i koloru).

export const funders = [
  {
    key: "city",
    name: "Miasto Szczecin",
    href: "https://www.szczecin.eu/",
    logo: { src: "/funders/miasto-szczecin-biale.svg", width: 274, height: 132 },
  },
  {
    key: "mkidn",
    name: "Ministerstwo Kultury i Dziedzictwa Narodowego",
    short: "MKiDN",
    href: "https://www.gov.pl/web/kultura",
    logo: { src: "/funders/mkidn-mono.svg", width: 146, height: 70 },
  },
] as const

export const fundersCopy: Record<Locale, { label: string; eu: string; euLine: string }> = {
  pl: { label: "Współfinansowanie", eu: "Dofinansowane przez Unię Europejską", euLine: "Fundusze Europejskie" },
  en: { label: "Funding", eu: "Co-funded by the European Union", euLine: "European Funds" },
  de: { label: "Förderer", eu: "Kofinanziert von der Europäischen Union", euLine: "Europäische Fonds" },
  uk: { label: "Співфінансування", eu: "Співфінансується Європейським Союзом", euLine: "Європейські фонди" },
}
