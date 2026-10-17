import { redirect } from "next/navigation";
import { getCurrentUser, getProfile } from "@/app/actions/panel";
import { PanelNav } from "./PanelNav";

// Tell Next.js 16 Cache Components that /panel routes read runtime session cookies
export const instant = false;

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
      <PanelNav
        userEmail={user.email || ""}
        userName={profile?.full_name || user.user_metadata?.full_name}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
