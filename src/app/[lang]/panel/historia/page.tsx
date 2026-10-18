import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getChatSessions } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";
import { cn } from "@/lib/utils";

export default async function HistoryPage({ params }: PageProps<"/[lang]/panel/historia">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { intl, panel } = getDictionary(lang);
  const t = panel.history;
  const sessions = await getChatSessions();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="type-h1 text-gold">{t.title}</h1>
        <p className="mt-2 max-w-[68ch] type-body text-text">{t.intro}</p>
      </header>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-start border border-dashed border-line-strong p-6">
          <MessageSquare {...iconProps} className="size-6 text-text" />
          <h2 className="mt-3 type-h3 text-text">{t.emptyTitle}</h2>
          <p className="mt-1 max-w-[60ch] type-body text-text">{t.emptyText}</p>
          <Link
            href={localizedPath(lang, "/asystent")}
            className={cn(buttonVariants({ variant: "secondary" }), "mt-5 w-fit")}
          >
            {t.start}
          </Link>
        </div>
      ) : (
        <ul className="border-t border-line">
          {sessions.map((session) => {
            const date = new Date(session.updated_at).toLocaleString(intl, {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <li key={session.id} className="flex flex-col justify-between gap-3 border-b border-line py-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="type-title-card text-text">{session.title || t.untitled}</h2>
                  <p className="mt-1 type-meta text-text-muted">{t.lastActivity(date, session.lang.toUpperCase())}</p>
                </div>
                <Link
                  href={localizedPath(lang, `/asystent?session=${session.id}`)}
                  className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-fit")}
                >
                  {t.open}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
