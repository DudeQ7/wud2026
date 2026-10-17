import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getProfile } from "@/app/actions/panel";
import { hasLocale, localizedPath } from "@/i18n";
import { PanelNav } from "./PanelNav";

// Tell Next.js 16 Cache Components that /panel routes read runtime session cookies
export const instant = false;

export default async function PanelLayout({ children, params }: LayoutProps<"/[lang]/panel">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const user = await getCurrentUser();

  if (!user) {
    redirect(localizedPath(lang, "/auth/login"));
  }

  const profile = await getProfile();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
      <PanelNav
        lang={lang}
        userEmail={user.email || ""}
        userName={profile?.full_name || user.user_metadata?.full_name}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
