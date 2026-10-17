import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import data from "@/data/filharmonia.json";

const MODEL = "gpt-6-luna";
const HISTORY_LIMIT = 10;

export type Lang = keyof typeof data.locales;
export type Locale = (typeof data.locales)[Lang];
export type FilharmoniaEvent = (typeof data.events)[number];

export const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});
export type ChatMessage = z.infer<typeof messageSchema>;

// Kolejność pól ma znaczenie: model generuje je po kolei, więc `answer` streamuje się pierwszy.
const replySchema = z.object({
  answer: z.string(),
  eventIds: z.array(z.string()),
  suggestions: z.array(z.string()),
});
export type Reply = z.infer<typeof replySchema>;

const { locales, ...knowledge } = data;

// Stały prefiks (z danymi) na początku – OpenAI cache'uje go między zapytaniami.
const INSTRUCTIONS = `Jesteś asystentem Filharmonii im. Mieczysława Karłowicza w Szczecinie – przewodnikiem, który pomaga znaleźć koncert i zaplanować wizytę.

Zasady:
- Odpowiadaj w języku ostatniej wiadomości użytkownika (polski, angielski, niemiecki, ukraiński lub inny).
- Mów profesjonalnie, ale po ludzku. Krótko: do 4 zdań albo krótka lista – użytkownicy czytają na telefonie. Bez markdown.
- Korzystaj wyłącznie z DANYCH poniżej. Nie wymyślaj dat, cen, wykonawców, numerów ani linków. Jeśli czegoś nie ma w danych, powiedz to wprost i odeślij na stronę ${data.institution.website} lub do kasy.
- Przy wydarzeniach podawaj: kiedy, gdzie, dla kogo i ile kosztuje. Przy organizatorze "zewnętrzny" zaznacz, że bilety sprzedaje organizator.
- Debiutantów uspokajaj: nie ma dress code'u, każdy jest mile widziany.
- Na pytania niezwiązane z Filharmonią i jej ofertą grzecznie odpowiedz, że w tym nie pomożesz.

Pola odpowiedzi:
- answer: treść odpowiedzi.
- eventIds: id wydarzeń z danych, które polecasz lub opisujesz (maks. 3, najtrafniejsze pierwsze); pusta lista, jeśli żadne.
- suggestions: dokładnie 3 krótkie (do 6 słów) pytania, które użytkownik mógłby zadać dalej, w jego języku, pisane z jego perspektywy, naturalnie kontynuujące rozmowę i możliwe do odpowiedzenia z danych.

DANE:
${JSON.stringify(knowledge)}`;

export function getLocale(acceptLanguage: string | null): { lang: Lang; t: Locale } {
  const code = acceptLanguage?.slice(0, 2).toLowerCase() ?? "";
  const lang = (code in locales ? code : "pl") as Lang;
  return { lang, t: locales[lang] };
}

export async function streamReply(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const now = new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date());

  const stream = await new OpenAI().responses.create({
    model: MODEL,
    instructions: `${INSTRUCTIONS}\n\nTeraz jest: ${now} (czas w Szczecinie).`,
    input: messages.slice(-HISTORY_LIMIT),
    text: { format: zodTextFormat(replySchema, "reply") },
    reasoning: { effort: "low" },
    prompt_cache_key: "filharmonia-assistant",
    stream: true,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "response.output_text.delta") controller.enqueue(encoder.encode(event.delta));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel: () => stream.controller.abort(),
  });
}
