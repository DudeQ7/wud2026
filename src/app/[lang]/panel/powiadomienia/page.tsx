import Link from "next/link";
import { notFound } from "next/navigation";
import { getFavoriteEventIds } from "@/app/actions/panel";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale, localizedPath } from "@/i18n";
import { PanelHeading } from "../PanelHeading";
import { buildNotifications } from "../notifications";

/** Powiadomienia (scenariusz E): „Koncert, który obserwujesz, prawie się wyprzedał” + przypomnienia o biletach */
export default async function NotificationsPage({ params }: PageProps<"/[lang]/panel/powiadomienia">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const p = t.panel.notifications;
  const items = buildNotifications(await getFavoriteEventIds(), lang, t);

  return (
    <div>
      <PanelHeading lang={lang} title={p.title} intro={p.intro} />

      {items.length === 0 ? (
        <div className="border-y border-line py-8">
          <h2 className="type-h4 text-gold">{p.emptyTitle}</h2>
          <p className="mt-2 max-w-[68ch] type-body text-text">{p.emptyText}</p>
          <Link href={localizedPath(lang, "/repertuar")} className={buttonVariants({ variant: "secondary", className: "mt-6" })}>
            {t.panel.tickets.browse}
          </Link>
        </div>
      ) : (
        <ul aria-label={p.listLabel} className="border-t border-line">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 border-b border-line py-4 lg:flex-row lg:items-center lg:justify-between lg:py-5">
              <p className="max-w-[68ch] type-body text-text">{item.text}</p>
              <div className="flex shrink-0 flex-wrap gap-2">
                {item.actions.map((action) =>
                  action.external ? (
                    <a
                      key={action.label}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: action.primary ? "primary" : "secondary", size: "sm" })}
                    >
                      {action.label}
                    </a>
                  ) : (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={buttonVariants({ variant: action.primary ? "primary" : "secondary", size: "sm" })}
                    >
                      {action.label}
                    </Link>
                  ),
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
