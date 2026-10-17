// Buduje src/data/artysci.json (profile artystów) z ../pages/ludzie__*.md.
// Bierze tylko osoby i zespoły, które występują w koncerty.json (dopasowanie po nazwie bez polskich znaków).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGES = path.resolve(here, '../pages');
const OUT = path.resolve(here, '../../src/data/artysci.json');
const koncerty = JSON.parse(fs.readFileSync(path.resolve(here, '../../src/data/koncerty.json'), 'utf8'));

const fold = s => s.toLowerCase().replaceAll('ł', 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const clean = s => s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*|__|(?<!\w)_|_(?!\w)/g, '').replace(/\\([\[\].*])/g, '$1').replace(/\s+/g, ' ').trim();

const performing = new Set(
  koncerty.events.flatMap(e => (e.artists ?? []).map(a => fold(a.split(/ [-–] /)[0])))
);

const slugOf = (id, name) => `${id}-${fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
const people = new Map();

for (const file of fs.readdirSync(PAGES).filter(f => f.startsWith('ludzie__'))) {
  const id = Number(file.match(/^ludzie__(\d+)-/)?.[1]);
  if (!id) continue;
  const text = fs.readFileSync(path.join(PAGES, file), 'utf8');
  const name = text.match(/^# (.+)$/m)?.[1]?.trim();
  if (!name || !performing.has(fold(name))) continue;
  // Strony tej samej osoby z dopiskiem roli mają to samo id – zostaje najkrótsza nazwa pliku
  if (people.has(id) && people.get(id).file.length <= file.length) continue;

  const lines = text.split('\n').map(l => l.trim());
  const start = lines.findIndex(l => l.startsWith('# ')) + 1;
  const bio = [];
  let caption;
  for (const line of lines.slice(start)) {
    if (line.startsWith('## Media') || line === '* * *') break;
    const c = clean(line);
    if (c) bio.push(c);
  }
  const after = lines.slice(start).findIndex(l => l === '* * *');
  if (after >= 0) caption = clean(lines.slice(start)[after + 1] ?? '') || undefined;
  const photo = text.match(/https:\/\/filharmonia\.szczecin\.pl\/files\/people\/pl_\d+image_midi\.\w+/)?.[0];
  if (!bio.length) continue;
  people.set(id, { file, slug: slugOf(id, name), name, bio, ...(photo && { photo }), ...(caption && { caption }) });
}

const result = Object.fromEntries([...people.values()].map(({ file, slug, ...rest }) => [slug, rest]));
fs.writeFileSync(OUT, JSON.stringify(result, null, 1) + '\n');
console.log(`Zapisano ${Object.keys(result).length} profili (z ${performing.size} nazw w wydarzeniach) do ${OUT}`);
