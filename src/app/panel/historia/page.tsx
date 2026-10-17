import Link from "next/link";
import { getChatSessions } from "@/app/actions/panel";

export default async function HistoryPage() {
  const sessions = await getChatSessions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Historia zapytań i rekomendacji</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Przeglądaj swoje wcześniejsze rozmowy z Asystentem Filharmonii.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <span className="text-3xl">💬</span>
          <h2 className="mt-3 text-lg font-semibold">Brak historii rozmów</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Twoje przyszłe rozmowy z Asystentem AI zostaną automatycznie zachowane w tym miejscu, gdy jesteś zalogowany.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
            >
              Rozpocznij nową rozmowę
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const date = new Date(session.updated_at).toLocaleString("pl-PL", {
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
                    {session.title || "Rozmowa z asystentem"}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ostatnia aktywność: {date} · Język: {session.lang.toUpperCase()}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link
                    href={`/?session=${session.id}`}
                    className="inline-block rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Otwórz w asystencie
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
