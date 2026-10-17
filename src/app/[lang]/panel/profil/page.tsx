import { notFound } from "next/navigation";
import { getCurrentUser, getProfile } from "@/app/actions/panel";
import { getDictionary, hasLocale } from "@/i18n";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage({ params }: PageProps<"/[lang]/panel/profil">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { intl, panel } = getDictionary(lang);
  const t = panel.profile;
  const user = await getCurrentUser();
  const profile = await getProfile();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(intl, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
        <ProfileForm lang={lang} profile={profile} userEmail={user?.email || ""} />
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        {t.since} <span className="font-medium text-foreground">{formattedDate}</span>
      </div>
    </div>
  );
}
