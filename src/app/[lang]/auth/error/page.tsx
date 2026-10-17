import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";

export default async function AuthErrorPage({ params }: PageProps<"/[lang]/auth/error">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).auth.error;

  return (
    <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-xs sm:p-8">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-500">
        !
      </div>
      <h1 className="text-xl font-bold">{t.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href={localizedPath(lang, "/auth/login")}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          {t.toLogin}
        </Link>
        <Link
          href={localizedPath(lang, "/")}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          {t.home}
        </Link>
      </div>
    </div>
  );
}
