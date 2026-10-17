// Scraper filharmonia.szczecin.pl -> pliki .md (node scrape.mjs [--lang=pl] [--out=../pages])
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')));
const LANG = args.lang ?? 'pl';
const BASE = 'https://filharmonia.szczecin.pl';
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, args.out ?? '../pages');
const DELAY = Number(args.delay ?? 250);
const UA = 'Mozilla/5.0 (hackathon-scraper)';
const SKIP_LANG = new Set(['en', 'de']);

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
td.remove(['script', 'style', 'noscript', 'iframe']);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const abs = (u, base) => { try { return new URL(u, base).href; } catch { return null; } };

function normalize(href, base) {
  const u = abs(href, base);
  if (!u) return null;
  const url = new URL(u);
  if (url.origin !== BASE) return null;
  url.hash = '';
  let p = url.pathname.replace(/\/+$/, '') || '/';
  const first = p.split('/')[1];
  if (SKIP_LANG.has(first) && first !== LANG) return null;
  if (/\.(pdf|jpe?g|png|gif|webp|svg|zip|docx?|xlsx?|mp3|mp4|ico)$/i.test(p)) return null;
  url.pathname = p;
  return url.href;
}

function slug(url) {
  const p = new URL(url);
  const s = (p.pathname + p.search).replace(/^\/+/, '').replace(/[\\/:*?"<>|=&]+/g, '__') || 'index';
  return (s.replace(/^pl__?/, '') || 'index').slice(0, 110);
}

async function fetchPage(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (!r.ok) return { status: r.status };
      const type = r.headers.get('content-type') ?? '';
      if (!type.includes('html')) return { status: r.status, skip: true };
      return { status: r.status, html: await r.text() };
    } catch { await sleep(1000 * (i + 1)); }
  }
  return { status: 0 };
}

function extract(html, url) {
  const $ = cheerio.load(html);
  const title = $('title').text().trim();
  const meta = {
    description: $('meta[name="description"]').attr('content') ?? '',
    ogImage: abs($('meta[property="og:image"]').attr('content') ?? '', url),
  };
  const links = new Set();
  $('a[href]').each((_, a) => { const n = normalize($(a).attr('href'), url); if (n) links.add(n); });

  const $c = cheerio.load($('.site_content').html() ?? $('body').html() ?? '');
  $c('script,style,noscript,.top_menu,.menu_buttons,.footer,.newsletter,.social_media,.fb-like,.wcagSkipButton,#buy_ticket_bar').remove();

  const media = { images: new Set(), files: new Set() };
  // obrazy: <img>, tła inline, lazy data-*
  const addImg = u => { const a = abs(u, url); if (a && !a.startsWith('data:')) media.images.add(a); };
  $c('img').each((_, e) => addImg($c(e).attr('src') ?? $c(e).attr('data-src')));
  $c('[style*="url("]').each((_, e) => {
    for (const m of ($c(e).attr('style') ?? '').matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) addImg(m[1]);
  });
  $c('a[href]').each((_, e) => {
    const h = abs($c(e).attr('href'), url);
    if (h && /\.(pdf|docx?|xlsx?|zip|mp3)(\?|$)/i.test(h)) media.files.add(h);
    if (h && /\.(jpe?g|png|gif|webp)(\?|$)/i.test(h)) media.images.add(h);
  });
  // wideo
  const videos = [];
  $('iframe[src]').each((_, e) => videos.push(abs($(e).attr('src'), url)));

  // względne linki/obrazy -> bezwzględne w markdownie
  $c('a[href]').each((_, e) => { const h = abs($c(e).attr('href'), url); if (h) $c(e).attr('href', h); });
  $c('img').each((_, e) => { const s = abs($c(e).attr('src') ?? '', url); if (s) $c(e).attr('src', s); });

  const md = td.turndown($c.html() ?? '').replace(/\n{3,}/g, '\n\n').trim();
  return { title, meta, md, links, media, videos };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const start = `${BASE}/${LANG}`;
  const queue = [start];
  const seen = new Set([start]);
  const index = [];
  const failed = [];

  while (queue.length) {
    const url = queue.shift();
    const { status, html, skip } = await fetchPage(url);
    if (skip) continue;
    if (!html) { failed.push(`${url} (HTTP ${status})`); console.log('FAIL', status, url); continue; }
    const pageLang = html.match(/<html[^>]*lang="(\w+)"/)?.[1];
    if (pageLang && pageLang !== LANG) continue; // /news, /events itp. to wersje EN/DE
    const d = extract(html, url);
    for (const l of d.links) if (!seen.has(l)) { seen.add(l); queue.push(l); }

    const file = slug(url) + '.md';
    const fm = [
      '---',
      `url: ${url}`,
      `title: ${JSON.stringify(d.title)}`,
      d.meta.description ? `description: ${JSON.stringify(d.meta.description)}` : null,
      `scraped_at: ${new Date().toISOString()}`,
      '---',
    ].filter(Boolean).join('\n');
    const list = (h, a) => a.length ? `\n\n## ${h}\n\n${a.map(x => `- ${x}`).join('\n')}` : '';
    const body = `${fm}\n\n${d.md}${list('Media: obrazy', [...new Set([d.meta.ogImage, ...d.media.images].filter(Boolean))])}${list('Media: pliki', [...d.media.files])}${list('Media: wideo', d.videos)}\n`;
    const target = path.join(OUT, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, body, 'utf8');
    index.push({ url, title: d.title, file });
    console.log(`[${index.length}/${seen.size}] ${url}`);
    await sleep(DELAY);
  }

  const idx = `# Indeks zescrapowanych stron (${index.length})\n\nŹródło: ${start}\n\n` +
    index.map(i => `- [${i.title || i.url}](${i.file}) — ${i.url}`).join('\n') + '\n' +
    (failed.length ? `\n## Błędy\n\n${failed.map(f => `- ${f}`).join('\n')}\n` : '');
  await fs.writeFile(path.join(OUT, '_INDEX.md'), idx, 'utf8');
  console.log(`Gotowe: ${index.length} stron, ${failed.length} błędów -> ${OUT}`);
}

main();
