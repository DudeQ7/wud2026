import type { NextConfig } from "next";

/** Wersja testowa (preview / dev) – czerwony favicon (różowy nagłówek tylko w lokalnym devie); produkcja bez zmian */
const isTestEnv = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_IS_TEST_ENV: isTestEnv ? "1" : "" },
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
