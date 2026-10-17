// Buduje ../Data/koncerty.json z ../pages/wydarzenia__*.md (tylko nadchodzące)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGES = path.resolve(here, '../pages');
const TODAY = new Date(process.argv[2] ?? '2026-10-17T00:00:00');
const MONTHS = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
const DOW = 'poniedziałek|wtorek|środa|czwartek|piątek|sobota|niedziela';
const dateRe = new RegExp(`(${DOW}), (\\d{1,2}) (${MONTHS.join('|')}) (\\d{4}) (\\d{1,2}):(\\d{2})`, 'g');

const link = s => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
const clean = s => link(s).replace(/\*\*|__|(?<!\w)_|_(?!\w)/g, '').replace(/\\([\[\]])/g, '$1').replace(/\s+/g, ' ').trim();
const pad = n => String(n).padStart(2, '0');

function section(lines, name, stops) {
  const i = lines.findIndex(l => l.trim() === name);
  if (i < 0) return [];
  const out = [];
  for (let j = i + 1; j < lines.length; j++) {
    const t = lines[j].trim();
    if (stops.includes(t)) break;
    if (t) out.push(t);
  }
  return out;
}

function parse(file) {
  const raw = fs.readFileSync(path.join(PAGES, file), 'utf8');
  const [, fm, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const url = fm.match(/^url: (.*)$/m)[1];
  const lines = body.split('\n');
  const h1 = lines.findIndex(l => l.startsWith('# '));
  if (h1 < 0) return null;
  const head = lines.slice(0, h1).join('\n');
  const title = clean(lines[h1].slice(2));

  const dates = [...head.matchAll(dateRe)].map(m => {
    const [, , d, mon, y, hh, mm] = m;
    return `${y}-${pad(MONTHS.indexOf(mon) + 1)}-${pad(d)}T${pad(hh)}:${mm}`;
  });
  const uniq = [...new Set(dates)].sort();
  if (!uniq.length) return null;
  if (new Date(uniq.at(-1)) < TODAY) return null;
  const upcoming = uniq.filter(d => new Date(d) >= TODAY);

  const cyc = head.match(/\[([^\]]+)\]\(https:\/\/filharmonia\.szczecin\.pl\/cykl\/(?!-)[^)]*\)/);
  const rest = lines.slice(h1 + 1);
  const nonEmpty = rest.map(l => l.trim()).filter(Boolean);
  const VEN = /^(Sala|Galeria|Art.Room|Foyer|Hol(?![a-z])|Plac|Taras)/i;
  const type = nonEmpty[0] && !VEN.test(nonEmpty[0]) && !/^(ARTYŚCI|UTWORY)$/.test(nonEmpty[0]) ? nonEmpty[0] : null;
  const vcand = VEN.test(nonEmpty[0] ?? '') ? nonEmpty[0] : nonEmpty[1];
  const venue = vcand && vcand.length < 120 && VEN.test(vcand) ? vcand.replace(/\.$/, '') : null;

  const STOPS = ['ARTYŚCI', 'UTWORY', 'AKTUALNOŚCI', 'FILMY I ZDJĘCIA', 'SZCZEGÓŁY'];
  const artists = section(rest, 'ARTYŚCI', STOPS).filter(l => /^-\s/.test(l)).map(l => clean(l.replace(/^-\s*/, ''))).filter(Boolean);
  const program = section(rest, 'UTWORY', STOPS).filter(l => /^-\s/.test(l)).map(l => clean(l.replace(/^-\s*/, ''))).filter(Boolean);

  const stopIdx = rest.findIndex(l => ['AKTUALNOŚCI', 'FILMY I ZDJĘCIA', 'SZCZEGÓŁY'].includes(l.trim()));
  const bodyLines = rest.slice(0, stopIdx < 0 ? undefined : stopIdx);
  // opis = akapity po bloku ARTYŚCI/UTWORY
  let start = 0;
  bodyLines.forEach((l, i) => { if (/^-\s/.test(l.trim()) || /^(ARTYŚCI|UTWORY)$/.test(l.trim())) start = i + 1; });
  const descParas = bodyLines.slice(start).map(l => clean(l)).filter(l => l && !/^\*\s\*\s\*$/.test(l) && !/^Pobierz program/.test(l));
  const durationLine = descParas.find(p => /^Przybliżony czas trwania/.test(p)) ?? null;
  const duration = durationLine ? (durationLine.match(/(\d+)\s*minut/)?.[1] ? +durationLine.match(/(\d+)\s*minut/)[1] : null) : null;
  const description = descParas.filter(p => p !== durationLine).join('\n\n');

  const text = raw;
  const prices = [...new Set([...text.matchAll(/(\d{1,3}(?:[\/–-]\d{1,3})*)\s*zł/g)].map(m => m[0]))];
  const programPdf = text.match(/\((https:\/\/filharmonia\.szczecin\.pl\/files\/events\/[^)]+\.pdf)\)/)?.[1] ?? null;
  const images = [...new Set([...text.matchAll(/https:\/\/filharmonia\.szczecin\.pl\/files\/(?:events|gallery)[^\s)"]+\.(?:jpe?g|png|webp)/gi)].map(m => m[0]))].slice(0, 3);

  const id = +url.match(/wydarzenia\/(\d+)/)?.[1];
  const kind = /zwiedzani/i.test(title) ? 'zwiedzanie' : /warsztat|akademia|bajka|niedzielne|dla dzieci|norwid/i.test(title + ' ' + (type ?? '')) ? 'edukacja/rodzinne' : /koncert|recital|inauguracja|jazz|session/i.test(`${type} ${title}`) ? 'koncert' : (type ?? 'wydarzenie').toLowerCase();

  const e = { id, title, type: kind, kind_label: type, series: cyc ? clean(cyc[1]) : null, venue, dates: upcoming, all_dates_count: uniq.length,
    duration_min: duration, artists, program, prices_pln: prices, tickets_url: 'https://bilety.filharmonia.szczecin.pl/', url, program_pdf: programPdf, images, description };
  e.briefing = brief(e);
  return e;
}

const pl = d => {
  const x = new Date(d);
  return `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}, godz. ${pad(x.getHours())}:${pad(x.getMinutes())}`;
};
function firstSentences(t, n, max = 320) {
  const para = t.split('\n\n').find(p => p.length > 60) ?? t;
  const s = para.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+(\s|$)/g) ?? [t];
  let o = ''; for (const x of s.slice(0, n)) { if ((o + x).length > max && o) break; o += x; }
  return o.trim().slice(0, max + 80);
}
function brief(e) {
  const when = e.dates.length > 3 ? `${pl(e.dates[0])} (najbliższy termin; łącznie ${e.dates.length} terminów, ostatni ${pl(e.dates.at(-1))})` : e.dates.map(pl).join(' oraz ');
  const parts = [`${e.title} – ${e.kind_label ?? e.type}${e.series ? ` w cyklu „${e.series}”` : ''}. Termin: ${when}${e.venue ? `, ${e.venue}` : ''}.`];
  if (e.artists.length) parts.push(`Wykonawcy: ${e.artists.slice(0, 6).join('; ')}.`);
  if (e.program.length) parts.push(`W programie: ${e.program.slice(0, 5).join('; ')}.`);
  if (e.duration_min) parts.push(`Czas trwania ok. ${e.duration_min} min.`);
  if (e.prices_pln.length) parts.push(`Ceny wspomniane na stronie: ${e.prices_pln.join(', ')}.`);
  const d = firstSentences(e.description, 2);
  if (d) parts.push(d);
  return parts.join(' ');
}

const raw = fs.readdirSync(PAGES).filter(f => /^wydarzenia__\d+/.test(f)).map(parse).filter(Boolean);
// to samo wydarzenie bywa wystawione kilka razy (osobne ID dla różnych terminów) – łączę
const byKey = new Map();
for (const e of raw) {
  const p = byKey.get(e.title + '|' + e.venue);
  if (!p) { e.ids = [e.id]; byKey.set(e.title + '|' + e.venue, e); continue; }
  p.ids.push(e.id);
  p.dates = [...new Set([...p.dates, ...e.dates])].sort();
  p.all_dates_count += e.all_dates_count;
  if (e.description.length > p.description.length) p.description = e.description;
}
const events = [...byKey.values()].map(e => { e.briefing = brief(e); return e; })
  .sort((a, b) => a.dates[0].localeCompare(b.dates[0]) || a.id - b.id);

const out = {
  meta: {
    source: 'https://filharmonia.szczecin.pl/pl',
    generated_for: 'chatbot – briefing o nadchodzących wydarzeniach Filharmonii w Szczecinie',
    as_of: TODAY.toISOString().slice(0, 10),
    language: 'pl',
    count: events.length,
    ticket_site: 'https://bilety.filharmonia.szczecin.pl/',
    venue_info: {
      name: 'Filharmonia im. Mieczysława Karłowicza w Szczecinie',
      address: 'ul. Małopolska 48, 70-515 Szczecin',
      building_hours: 'wtorek–niedziela 10:00–18:00 oraz godzinę przed każdym wydarzeniem (poza dniami ustawowo wolnymi)',
      box_office: 'wtorek–piątek 12:00–18:00, sobota 12:00–16:00 oraz godzinę przed każdym biletowanym wydarzeniem; tel. +48 91 431 07 20, kasa@filharmonia.szczecin.pl',
      secretariat: 'poniedziałek–piątek 8:00–16:00; tel. +48 91 430 95 11, sekretariat@filharmonia.szczecin.pl',
      infoline: 'wtorek–czwartek 10:00–16:00, tel. +48 539 949 454',
      halls: ['Sala symfoniczna', 'Sala kameralna', 'Galeria Poziom 4.', 'Art.Room', 'Foyer', 'Hol'],
      discounts: 'Bilet ulgowy: dzieci do 6 lat, uczniowie, studenci do 26 lat, seniorzy 60+, osoby z niepełnosprawnością. Abonament: zniżka przy zakupie min. 7 biletów przez jedną osobę (z wyjątkami). Galerie: bilet 10 zł w wybrane soboty i niedziele 12:00–16:00. Zwiedzanie: 30/20 zł.',
      sources: ['https://filharmonia.szczecin.pl/bilety', 'https://filharmonia.szczecin.pl/godziny_otwarcia', 'https://filharmonia.szczecin.pl/kontakt']
    },
    note: 'Pole "briefing" to gotowy krótki opis do wstawienia w kontekst modelu; pozostałe pola to dane strukturalne. Ceny biletów są podawane tylko jeśli występują w opisie wydarzenia.',
  },
  events,
};
fs.writeFileSync(path.resolve(here, '../Data/koncerty.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`Zapisano ${events.length} wydarzeń`);
