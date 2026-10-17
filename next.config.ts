import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Podgląd dev na telefonie w sieci lokalnej (http://<IP-komputera>:port) – bez tego Next blokuje
  // skrypty dev dla obcego hosta i strona nie hydratuje się (filtry, formularze nie działają).
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*"],
  images: {
    // Zdjęcia wydarzeń z koncerty.json – oryginały z serwisu FS
    remotePatterns: [
      {
        protocol: "https",
        hostname: "filharmonia.szczecin.pl",
        pathname: "/files/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
