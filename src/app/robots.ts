import type { MetadataRoute } from "next";

import { siteUrl } from "./site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Panel, logowanie, API i wewnętrzna analityka nie powinny trafiać do indeksu.
        disallow: ["/api/", "/panel", "/auth/", "/analityka", "/*/panel", "/*/auth", "/*/analityka"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
