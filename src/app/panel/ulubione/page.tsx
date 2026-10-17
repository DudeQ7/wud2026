import Link from "next/link";
import { getFavoriteEventIds } from "@/app/actions/panel";
import koncerty from "@/data/koncerty.json";
import { FavoriteItem } from "./FavoriteItem";

export default async function FavoritesPage() {
  const favoriteIds = await getFavoriteEventIds();

  const favoriteEvents = favoriteIds
    .map((id) => koncerty.events.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ulubione koncerty i wydarzenia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tutaj znajdziesz wszystkie wydarzenia, które zapisałeś na później.
        </p>
      </div>

      {favoriteEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <span className="text-3xl">❤️</span>
          <h2 className="mt-3 text-lg font-semibold">Brak zapisanych koncertów</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Przeglądaj wydarzenia podczas rozmowy z Asystentem Filharmonii i klikaj serduszko, aby zapisać je tutaj.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
            >
              Rozpocznij rozmowę z Asystentem
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favoriteEvents.map((event) => {
            if (!event) return null;
            return <FavoriteItem key={event.id} event={event} />;
          })}
        </div>
      )}
    </div>
  );
}
