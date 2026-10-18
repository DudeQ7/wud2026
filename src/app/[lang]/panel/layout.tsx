import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getProfile } from "@/app/actions/panel";
import { BottomNav } from "@/components/fs/bottom-nav";
import { Container } from "@/components/fs/layout";
import { SiteFooter } from "@/components/fs/site-footer";
import { SiteHeader } from "@/components/fs/site-header";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";
import { PanelNav } from "./PanelNav";

// Tell Next.js 16 Cache Components that /panel routes read runtime session cookies
export const instant = false;

/** Panel klienta w tej samej ramie co reszta serwisu: nagłówek, stopka, dolna nawigacja (design.md §6.3–6.4) */
export default async function PanelLayout({ children, params }: LayoutProps<"/[lang]/panel">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const user = await getCurrentUser();

  if (!user) {
    redirect(localizedPath(lang, "/auth/login"));
  }

  const profile = await getProfile();

  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {getDictionary(lang).common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-6">
          <PanelNav
            lang={lang}
            userId={user.id}
            userEmail={user.email || ""}
            userName={profile?.full_name || user.user_metadata?.full_name}
          />
          <div className="min-w-0 lg:col-span-9">{children}</div>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} current="/konto" />
    </>
  );
}
