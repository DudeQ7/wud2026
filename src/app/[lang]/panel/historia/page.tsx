import Link from "next/link";
import { notFound } from "next/navigation";
import { getChatSessions } from "@/app/actions/panel";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";

export default async function HistoryPage({ params }: PageProps<"/[lang]/panel/historia">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { intl, panel } = getDictionary(lang);
  const t = panel.history;
  const sessions = await getChatSessions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <span className="text-3xl" aria-hidden>💬</span>
          <h2 className="mt-3 text-lg font-semibold">{t.emptyTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.emptyText}</p>
          <div className="mt-6">
            <Link
              href={localizedPath(lang, "/asystent")}
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
            >
              {t.start}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const date = new Date(session.updated_at).toLocaleString(intl, {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div
                key={session.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-foreground">
                    {session.title || t.untitled}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.lastActivity(date, session.lang.toUpperCase())}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link
                    href={localizedPath(lang, `/asystent?session=${session.id}`)}
                    className="inline-block rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    {t.open}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
