import Link from "next/link";
import { notFound } from "next/navigation";
import { getChatSessions } from "@/app/actions/panel";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";
import { PanelHeading } from "../PanelHeading";

export default async function HistoryPage({ params }: PageProps<"/[lang]/panel/historia">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { intl, panel } = getDictionary(lang);
  const t = panel.history;
  const sessions = await getChatSessions();

  return (
    <div>
      <PanelHeading lang={lang} title={t.title} intro={t.intro} />

      {sessions.length === 0 ? (
        <div className="border-y border-line py-8">
          <h2 className="type-h4 text-gold">{t.emptyTitle}</h2>
          <p className="mt-2 max-w-[68ch] type-body text-text">{t.emptyText}</p>
          <Link href={localizedPath(lang, "/asystent")} className={buttonVariants({ className: "mt-6" })}>
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
              <li
                key={session.id}
                className="flex flex-col gap-3 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between lg:py-5"
              >
                <div className="min-w-0">
                  <h2 className="type-title-card text-text">{session.title || t.untitled}</h2>
                  <p className="mt-1 type-meta text-text-muted">{t.lastActivity(date, session.lang.toUpperCase())}</p>
                </div>
                <Link
                  href={localizedPath(lang, `/asystent?session=${session.id}`)}
                  className={buttonVariants({ variant: "secondary", size: "sm", className: "self-start sm:self-auto" })}
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
