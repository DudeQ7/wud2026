import { redirect } from "next/navigation"

/** „Konto” z dolnej nawigacji (§6.4) prowadzi do panelu klienta; panel sam wymaga logowania */
export default function AccountPage() {
  redirect("/panel")
}
