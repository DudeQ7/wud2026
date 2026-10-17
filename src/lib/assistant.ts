import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import locales from "@/data/locales.json";
import koncerty from "@/data/koncerty.json";
import visit from "@/data/visit.json";

const MODEL = "gpt-6-luna";
const HISTORY_LIMIT = 10;

const { meta, events } = koncerty;

export type Lang = keyof typeof locales;
const langSchema = z.enum(Object.keys(locales) as [Lang, ...Lang[]]);
const LANG_NAMES: Record<Lang, string> = { pl: "polski", en: "angielski", de: "niemiecki" };

// Pola kart, których model nie może zmyślić (terminy, linki) – tytuł, rodzaj i miejsce tłumaczy model.
export const eventCards = events.map(({ id, dates, url, tickets_url }) => ({ id, dates, url, ticketsUrl: tickets_url }));
export type EventCard = (typeof eventCards)[number];

// Link do nawigacji budowany z adresu – model go nie pisze, tylko sygnalizuje `showMap`.
export const venue = {
  name: meta.venue_info.name,
  address: visit.address,
  mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${meta.venue_info.name}, ${visit.address}`)}`,
};
export type Venue = typeof venue;

export const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});
export type ChatMessage = z.infer<typeof messageSchema>;

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(100),
  lang: langSchema,
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Kolejność pól ma znaczenie: model generuje je po kolei, więc `answer` streamuje się pierwszy.
const replySchema = z.object({
  answer: z.string(),
  events: z.array(z.object({ id: z.number().int(), title: z.string(), kind: z.string(), place: z.string() })),
  showMap: z.boolean(),
  suggestions: z.array(z.string()),
});
export type Reply = z.infer<typeof replySchema>;

// Do modelu idzie gotowy `briefing` z pełną listą terminów – bez opisów i obrazków, żeby kontekst był mały.
const knowledge = {
  venue: meta.venue_info,
  visit,
  ticketSite: meta.ticket_site,
  events: events.map(({ id, dates, briefing }) => ({ id, dates, briefing })),
};

// Stały prefiks (z danymi) na początku – OpenAI cache'uje go między zapytaniami.
const INSTRUCTIONS = `Jesteś asystentem Filharmonii im. Mieczysława Karłowicza w Szczecinie – przewodnikiem, który pomaga znaleźć koncert i zaplanować wizytę.

Zasady:
- Zawsze odpowiadaj w JĘZYKU INTERFEJSU (podany na końcu), niezależnie od języka wiadomości użytkownika. W tym języku pisz wszystkie pola odpowiedzi (answer, events, suggestions).
- Mów profesjonalnie, ale po ludzku. Krótko: do 4 zdań albo krótka lista – użytkownicy czytają na telefonie. Bez markdown.
- Korzystaj wyłącznie z DANYCH poniżej (stan na ${meta.as_of}). Nie wymyślaj dat, cen, wykonawców, numerów ani linków. Jeśli czegoś nie ma w danych, powiedz to wprost i odeślij na stronę ${meta.source}, do kasy lub infolinii.
- Praktyczne informacje o wizycie (dojazd, parking, dostępność, kawiarnie, zwiedzanie, kontakt, godziny kasy) bierz z DANE.visit – są aktualniejsze niż DANE.venue.
- Przy wydarzeniach podawaj: co, kiedy, gdzie i dla kogo. Ceny podawaj tylko wtedy, gdy są w danych; w przeciwnym razie odeślij do ${meta.ticket_site}.
- Polecaj wyłącznie terminy, które jeszcze nie minęły.
- Osoby, które pierwszy raz idą do filharmonii, zachęcaj ciepło i bez onieśmielania.
- Na pytania niezwiązane z Filharmonią i jej ofertą grzecznie odpowiedz, że w tym nie pomożesz.

Pola odpowiedzi:
- answer: treść odpowiedzi.
- events: wydarzenia z danych, które polecasz lub opisujesz (maks. 3, najtrafniejsze pierwsze); pusta lista, jeśli żadne. Dla każdego: id z danych, title – tytuł w języku odpowiedzi (nazw własnych, nazwisk i tytułów utworów nie tłumacz), kind – rodzaj wydarzenia i dla kogo (do 6 słów), place – sala (krótko), wszystko w języku odpowiedzi.
- showMap: true, gdy użytkownik pyta o dojazd, lokalizację, adres, parking lub jak trafić – interfejs pokaże wtedy kartę z adresem i trasą w Google Maps (nie wklejaj linku do mapy w answer). W pozostałych przypadkach false.
- suggestions: dokładnie 3 krótkie (do 6 słów) pytania, które użytkownik mógłby zadać dalej, w języku odpowiedzi, pisane z jego perspektywy, naturalnie kontynuujące rozmowę i możliwe do odpowiedzenia z danych.

DANE:
${JSON.stringify(knowledge)}`;

export async function streamReply({ messages, lang }: ChatRequest): Promise<ReadableStream<Uint8Array>> {
  const now = new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date());

  const stream = await new OpenAI().responses.create({
    model: MODEL,
    instructions: `${INSTRUCTIONS}\n\nTeraz jest: ${now} (czas w Szczecinie).\nJĘZYK INTERFEJSU: ${LANG_NAMES[lang]} (${lang}).`,
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
