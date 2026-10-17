import { headers } from "next/headers";
import { Suspense } from "react";
import data from "@/data/filharmonia.json";
import { getLocale } from "@/lib/assistant";
import Chat from "./Chat";

export default function Home() {
  return (
    <Suspense>
      <LocalizedChat />
    </Suspense>
  );
}

async function LocalizedChat() {
  const { lang, t } = getLocale((await headers()).get("accept-language"));
  return <Chat lang={lang} t={t} events={data.events} />;
}
