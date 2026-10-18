import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { iconProps } from "@/components/fs/icons";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";

export default async function AuthErrorPage({ params }: PageProps<"/[lang]/auth/error">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).auth.error;

  return (
    <div className="border border-line p-6 text-center sm:p-8">
      <AlertCircle {...iconProps} className="mx-auto size-8 text-text" />
      <h1 className="mt-4 type-h2 text-gold">{t.title}</h1>
      <p className="mx-auto mt-2 max-w-[52ch] type-body text-text">{t.description}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href={localizedPath(lang, "/auth/login")} className={buttonVariants({ variant: "primary" })}>
          {t.toLogin}
        </Link>
        <Link href={localizedPath(lang, "/")} className={buttonVariants({ variant: "secondary" })}>
          {t.home}
        </Link>
      </div>
    </div>
  );
}
