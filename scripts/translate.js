// npm run translate            -> fills MISSING Japanese strings, and (re)translates legal pages whose English source changed
// npm run translate -- --force -> re-translates everything (overwrites hand edits!)
// node scripts/translate.js --auto -> same, but never fails: used by `npm run build` (skips quietly without DEEPL_API_KEY)
// Needs DEEPL_API_KEY (.env.local locally, Vercel environment variable on deploy). Have a native speaker review legal pages.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const auto = process.argv.includes('--auto');
const force = process.argv.includes('--force');
const key = process.env.DEEPL_API_KEY;
if (!key) {
  if (auto) { console.log('translate: DEEPL_API_KEY not set, skipping'); process.exit(0); }
  throw new Error('Set DEEPL_API_KEY in .env.local');
}
const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
const SKIP = new Set(['nav.switchLang']); // already correct as-is
const sha = (t) => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);

// {{placeholders}} are wrapped in <x> so DeepL leaves them alone; & is escaped for XML mode.
const protect = (s) => s.replace(/&/g, '&amp;').replace(/\{\{(\w+)\}\}/g, '<x>{{$1}}</x>');
const unprotect = (s) => s.replace(/<\/?x>/g, '').replace(/&amp;/g, '&');

async function translate(texts) {
  const out = [];
  for (let i = 0; i < texts.length; i += 40) {
    const res = await fetch(`${host}/v2/translate`, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texts.slice(i, i + 40).map(protect), source_lang: 'EN', target_lang: 'JA', formality: 'prefer_more', tag_handling: 'xml', ignore_tags: ['x'] }),
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
    out.push(...(await res.json()).translations.map((t) => unprotect(t.text)));
  }
  return out;
}

const leaves = (o, p = []) => Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [[[...p, k], v]] : leaves(v, [...p, k])));
const get = (o, p) => p.reduce((a, k) => a?.[k], o);
const set = (o, p, v) => { p.slice(0, -1).reduce((a, k) => (a[k] ??= {}), o)[p.at(-1)] = v; };

async function main() {
  // 1) UI strings: only missing keys
  const enDir = 'src/i18n/locales/en';
  for (const file of fs.readdirSync(enDir).filter((f) => f.endsWith('.json'))) {
    const en = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf8'));
    const jaPath = path.join('src/i18n/locales/ja', file);
    const ja = fs.existsSync(jaPath) ? JSON.parse(fs.readFileSync(jaPath, 'utf8')) : {};
    const todo = leaves(en).filter(([p]) => !SKIP.has(p.join('.')) && (force || !get(ja, p)));
    if (!todo.length) continue;
    const tr = await translate(todo.map(([, v]) => v));
    todo.forEach(([p], i) => set(ja, p, tr[i]));
    fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2) + '\n');
    console.log(`${file}: ${todo.length} strings translated`);
  }

  // 2) Legal pages. A marker on line 1 records which English text a Japanese file was made from:
  //    changed English -> retranslated; a Japanese file without a marker (hand-written) is never touched.
  const legalDir = 'src/content/legal';
  for (const file of fs.readdirSync(legalDir).filter((f) => f.endsWith('.en.md'))) {
    const source = fs.readFileSync(path.join(legalDir, file), 'utf8');
    const hash = sha(source);
    const out = path.join(legalDir, file.replace('.en.md', '.ja.md'));
    if (fs.existsSync(out) && !force) {
      const marker = fs.readFileSync(out, 'utf8').match(/^<!-- source:(\w+) -->/);
      if (!marker || marker[1] === hash) continue;
    }
    const parts = source.split('\n').map((l) => {
      const m = l.match(/^(\s*(?:#{1,3} |[-*] ))?(.*)$/);
      return { prefix: m[1] ?? '', text: m[2] };
    });
    const idx = parts.map((p, i) => (p.text.trim() ? i : -1)).filter((i) => i >= 0);
    const tr = await translate(idx.map((i) => parts[i].text));
    idx.forEach((i, n) => { parts[i].text = tr[n]; });
    fs.writeFileSync(out, `<!-- source:${hash} -->\n` + parts.map((p) => p.prefix + p.text).join('\n'));
    console.log(`${path.basename(out)} written`);
  }
}

main().catch((e) => {
  if (auto) { console.warn(`translate skipped: ${e.message}`); process.exit(0); } // never block a deploy
  throw e;
});
