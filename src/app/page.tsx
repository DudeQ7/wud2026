import { headers } from "next/headers";
import { Suspense } from "react";
import { detectLang, eventCards } from "@/lib/assistant";
import Chat from "./Chat";

export default function Home() {
  return (
    <Suspense>
      <LocalizedChat />
    </Suspense>
  );
}

async function LocalizedChat() {
  const lang = detectLang((await headers()).get("accept-language"));
  return <Chat initialLang={lang} events={eventCards} />;
}
