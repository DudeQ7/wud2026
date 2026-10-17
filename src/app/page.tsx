import { eventCards } from "@/lib/assistant";
import Chat from "./Chat";

export default function Home() {
  return <Chat lang="pl" events={eventCards} />;
}
