import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";

export default async function AuthErrorPage({ params }: PageProps<"/[lang]/auth/error">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).auth.error;

  return (
    <div>
      <h1 className="type-h1 text-gold">{t.title}</h1>
      <p className="mt-2 type-body text-text">{t.description}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={localizedPath(lang, "/auth/login")} className={buttonVariants()}>
          {t.toLogin}
        </Link>
        <Link href={localizedPath(lang, "/")} className={buttonVariants({ variant: "secondary" })}>
          {t.home}
        </Link>
      </div>
    </div>
  );
}
