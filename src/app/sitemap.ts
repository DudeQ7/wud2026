import type { MetadataRoute } from "next";
import { locales, localizedPath } from "@/i18n/config";
import { siteUrl } from "./site-url";

// Każda strona w trzech wersjach językowych – wyszukiwarki dostają powiązania hreflang
const pages = [
  { path: "/", priority: 1 },
  { path: "/repertuar", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority }) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((lang) => [lang, `${siteUrl}${localizedPath(lang, path)}`])),
    },
  }));
}
