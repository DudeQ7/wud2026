import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col justify-between bg-background px-4 py-8 text-foreground">
      <header className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>←</span>
          <span>Wróć do Asystenta</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-md my-auto py-8">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-md text-center text-xs text-muted-foreground">
        Filharmonia im. Mieczysława Karłowicza w Szczecinie
      </footer>
    </div>
  );
}
