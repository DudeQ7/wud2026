import type { MetadataRoute } from "next";

import { artists } from "@/lib/artists";
import { seriesKey } from "@/lib/calendar";
import { eventHref, events, localizeEvent } from "@/lib/events";
import { type Locale, locales, localizedPath } from "@/i18n/config";

import { siteUrl } from "./site-url";

// Wszystkie publiczne trasy w każdej wersji językowej – wyszukiwarki dostają powiązania hreflang.
const staticPaths = [
  "/",
  "/repertuar",
  "/zacznij-tutaj",
  "/pomoz-mi-wybrac",
  "/asystent",
  "/szukaj",
  "/planuj-wizyte",
  "/edu",
  "/wystawy",
  "/zwiedzanie",
  "/budynek",
  "/historia",
  "/orkiestra",
  "/artysci",
  "/partnerzy",
  "/media",
  "/kontakt",
  "/o-instytucji",
  "/deklaracja-dostepnosci",
  "/konto",
];

function urlsFor(path: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((lang) => [lang, `${siteUrl}${localizedPath(lang, path)}`])) as Record<
    Locale,
    string
  >;
}

function entry(
  urls: Record<Locale, string>,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
): MetadataRoute.Sitemap[number] {
  return {
    url: urls.pl,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: urls },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.map((path) =>
    entry(urlsFor(path), path === "/" ? 1 : path === "/repertuar" ? 0.9 : 0.6, "weekly")
  );

  const eventEntries = events.map((event) => {
    const urls = Object.fromEntries(
      locales.map((lang) => {
        const localized = localizeEvent(event, lang);
        return [lang, `${siteUrl}${localizedPath(lang, eventHref(localized))}`];
      })
    ) as Record<Locale, string>;
    return entry(urls, 0.8, "daily");
  });

  const artistEntries = artists.map((artist) => entry(urlsFor(`/artysci/${artist.slug}`), 0.5, "weekly"));

  const cycleKeys = [...new Set(events.map((event) => seriesKey(event.series)).filter(Boolean))] as string[];
  const cycleEntries = cycleKeys.map((key) => entry(urlsFor(`/cykl/${key}`), 0.5, "weekly"));

  return [...staticEntries, ...eventEntries, ...artistEntries, ...cycleEntries];
}
