import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { iconProps } from "@/components/fs/icons";
import { Logo } from "@/components/fs/wordmark";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";

export default async function AuthLayout({ children, params }: LayoutProps<"/[lang]/auth">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="flex min-h-dvh flex-col bg-background px-4 py-6">
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.common.skipLink}
      </a>

      <header className="mx-auto flex w-full max-w-md flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo lang={lang} className="h-12" priority />
        <Link
          href={localizedPath(lang, "/")}
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-text underline-offset-4 hover:underline"
        >
          <ArrowLeft {...iconProps} className="size-5" />
          {t.auth.back}
        </Link>
      </header>

      <main id="tresc" className="mx-auto my-auto w-full max-w-md py-8">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-md border-t border-line pt-4 text-center type-meta text-text-muted">
        {t.meta.home.title}
      </footer>
    </div>
  );
}
