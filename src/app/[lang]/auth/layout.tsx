import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";

export default async function AuthLayout({ children, params }: LayoutProps<"/[lang]/auth">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="flex min-h-dvh flex-col justify-between bg-background px-4 py-8 text-foreground">
      <header className="mx-auto w-full max-w-md">
        <Link
          href={localizedPath(lang, "/asystent")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span>
          <span>{t.auth.back}</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-md my-auto py-8">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-md text-center text-xs text-muted-foreground">
        {t.meta.home.title}
      </footer>
    </div>
  );
}
