import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage({ params }: PageProps<"/[lang]/auth/register">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <RegisterForm lang={lang} />;
}
