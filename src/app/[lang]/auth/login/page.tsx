import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ params }: PageProps<"/[lang]/auth/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LoginForm lang={lang} />;
}
