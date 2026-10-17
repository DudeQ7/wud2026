import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

// Ścieżki poza wersjami językowymi: API, powrót z Supabase (adres w konfiguracji Supabase) i pliki (sitemap.xml…)
const UNLOCALIZED = /^\/(api|auth\/callback)(\/|$)|\.[a-z0-9]+$/i;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // Polski jest bez prefiksu: /pl/repertuar → /repertuar (jeden adres na stronę)
  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // /en/…, /de/… i ścieżki bez języka idą bez zmian; reszta to polski – wewnętrznie /pl/…
  if (hasLocale(first) || UNLOCALIZED.test(pathname)) return await updateSession(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return await updateSession(request, url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
