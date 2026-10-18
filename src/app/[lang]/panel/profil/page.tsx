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
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="type-h1 text-gold">{t.title}</h1>
        <p className="mt-2 max-w-[68ch] type-body text-text">{t.intro}</p>
      </header>

      <div className="border border-line p-5 sm:p-8">
        <ProfileForm lang={lang} profile={profile} userEmail={user?.email || ""} />
      </div>

      <p className="border-t border-line pt-4 type-meta text-text-muted">
        {t.since} <span className="font-semibold text-text">{formattedDate}</span>
      </p>
    </div>
  );
}
