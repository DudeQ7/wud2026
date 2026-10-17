import { redirect } from "next/navigation"

import { localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"

/** „Konto” z dolnej nawigacji (§6.4) prowadzi do panelu klienta; panel sam wymaga logowania */
export default async function AccountPage() {
  redirect(localizedPath(await getLang(), "/panel"))
}
