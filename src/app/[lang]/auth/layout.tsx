import { notFound } from "next/navigation";
import { BottomNav } from "@/components/fs/bottom-nav";
import { Container } from "@/components/fs/layout";
import { SiteFooter } from "@/components/fs/site-footer";
import { SiteHeader } from "@/components/fs/site-header";
import { getDictionary, hasLocale } from "@/i18n";

/** Logowanie i rejestracja w ramie serwisu (nagłówek, stopka, dolna nawigacja), treść w wąskiej kolumnie */
export default async function AuthLayout({ children, params }: LayoutProps<"/[lang]/auth">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

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
        <Container className="max-w-md">{children}</Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} current="/konto" />
    </>
  );
}
