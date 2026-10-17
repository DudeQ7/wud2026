import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, localizedPath, stripLocale } from "@/i18n/config";

/**
 * Odświeża sesję Supabase. `rewriteTo` – adres wewnętrzny, gdy proxy przepisuje ścieżkę
 * (np. „/repertuar” → „/pl/repertuar”); ciasteczka sesji trafiają wtedy do odpowiedzi z rewrite.
 */
export async function updateSession(request: NextRequest, rewriteTo?: URL) {
  const pass = () => (rewriteTo ? NextResponse.rewrite(rewriteTo, { request }) : NextResponse.next({ request }));
  let supabaseResponse = pass();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = pass();
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — IMPORTANT: do not remove this call.
  // getUser() validates the token and refreshes it if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ścieżka bez prefiksu języka – /en/panel i /panel chronimy tak samo, przekierowanie zostaje w tym języku
  const first = request.nextUrl.pathname.split("/")[1];
  const lang = hasLocale(first) ? first : defaultLocale;
  const pathname = stripLocale(request.nextUrl.pathname);

  // Protect /panel routes — redirect to login if not authenticated
  if (!user && (pathname === "/panel" || pathname.startsWith("/panel/"))) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(lang, "/auth/login");
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/auth/login" || pathname === "/auth/register")) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(lang, "/panel");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
