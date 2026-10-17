import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-xs sm:p-8">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-500">
        !
      </div>
      <h1 className="text-xl font-bold">Wystąpił błąd autoryzacji</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Link potwierdzający mógł wygasnąć lub wystąpił problem podczas przetwarzania żądania.
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/auth/login"
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          Przejdź do logowania
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Strona główna
        </Link>
      </div>
    </div>
  );
}
