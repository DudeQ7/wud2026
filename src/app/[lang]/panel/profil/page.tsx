import { notFound } from "next/navigation";
import { getCurrentUser, getProfile } from "@/app/actions/panel";
import { getDictionary, hasLocale } from "@/i18n";
import { PanelHeading } from "../PanelHeading";
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
    <div className="max-w-xl">
      <PanelHeading lang={lang} title={t.title} intro={t.intro} />
      <ProfileForm lang={lang} profile={profile} userEmail={user?.email || ""} />
      <p className="mt-8 border-t border-line pt-4 type-meta text-text-muted">
        {t.since} <span className="font-semibold text-text">{formattedDate}</span>
      </p>
    </div>
  );
}
