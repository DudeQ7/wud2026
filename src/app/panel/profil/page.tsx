import { getCurrentUser, getProfile } from "@/app/actions/panel";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getProfile();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Twój profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zarządzaj swoimi danymi osobowymi oraz preferencjami asystenta.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
        <ProfileForm profile={profile} userEmail={user?.email || ""} />
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        Konto aktywne od: <span className="font-medium text-foreground">{formattedDate}</span>
      </div>
    </div>
  );
}
