// Buduje src/data/cykle.json (opisy cykli i festiwali) z ../pages/cykl__*.md.
// Klucz = dokładna nazwa cyklu z pola series w koncerty.json; przy powtórzeniu wygrywa wyższe id.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGES = path.resolve(here, '../pages');
const OUT = path.resolve(here, '../../src/data/cykle.json');
const koncerty = JSON.parse(fs.readFileSync(path.resolve(here, '../../src/data/koncerty.json'), 'utf8'));
const series = new Set(koncerty.events.map(e => e.series).filter(Boolean));

const clean = s => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*|__|(?<!\w)_|_(?!\w)/g, '').replace(/\\([\[\].])/g, '$1').replace(/\s+/g, ' ').trim();

const found = new Map();
for (const file of fs.readdirSync(PAGES).filter(f => f.startsWith('cykl__'))) {
  const idMatch = file.match(/^cykl__(\d+)-/);
  if (!idMatch) continue;
  const id = Number(idMatch[1]);
  const text = fs.readFileSync(path.join(PAGES, file), 'utf8');
  const name = text.match(/^# (.+)$/m)?.[1]?.trim();
  if (!name || !series.has(name)) continue;
  if (found.has(name) && found.get(name).id > id) continue;

  const lines = text.split('\n').map(l => l.trim());
  const start = lines.findIndex(l => l.startsWith('[CYKL WYDARZEŃ]')) + 1;
  const end = lines.findIndex((l, i) => i > start && l === 'WYDARZENIA');
  const body = lines.slice(start, end < 0 ? undefined : end);
  const description = [];
  for (const line of body) {
    if (!line) continue;
    if (line.startsWith('## ') || line.startsWith('[**') || line.startsWith('WSZYSTKIE KONCERTY')) break;
    if (line.startsWith('PROJEKT:') || /^\W*Strona internetowa/.test(clean(line))) continue;
    description.push(clean(line));
  }
  const website = text.match(/Strona internetowa[^(]*\((https?:[^)\s]+)\)/)?.[1];
  const image = text.match(/https:\/\/filharmonia\.szczecin\.pl\/files\/period\/[^\s)]+_midi\.\w+/)?.[0];
  found.set(name, { id, description, ...(image && { image }), ...(website && { website }) });
}

const result = Object.fromEntries([...found].map(([name, { id, ...rest }]) => [name, rest]));
fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
console.log(`Zapisano ${Object.keys(result).length}/${series.size} cykli do ${OUT}`);
for (const s of series) if (!result[s]) console.log('  brak opisu:', s);
