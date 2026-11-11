// Lists every English string the interface can show: static page text and t('…') keys in the scripts.
// Used by tests (coverage of dist/zh.js) and runnable directly to print keys missing a translation.
const fs = require('fs'),
  path = require('path');
const dist = path.resolve(__dirname, '../dist');
const collapse = (s) => s.replace(/\s+/g, ' ').trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
// Text that is the same in both languages: brand, identifiers, symbols, units.
const SAME = /^(m|rl|EN|GB 2763-2026|MRL|mg\/kg|SHA-256: [0-9a-f]+|中文|中|\/|…|[^A-Za-z]*)$/;
function staticKeys() {
  let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  html = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const body = html.slice(html.indexOf('<body'));
  const keys = new Set();
  for (const part of body.split(/<[^>]+>/)) {
    const key = collapse(decode(part));
    if (key && !SAME.test(key)) keys.add(key);
  }
  for (const m of html.matchAll(/(?:placeholder|aria-label)="([^"]+)"/g)) keys.add(decode(m[1]));
  keys.add(decode(html.match(/<title>([^<]+)<\/title>/)[1]));
  keys.add(decode(collapse(html.match(/name="description"\s+content="([^"]+)"/)[1])));
  return keys;
}
function scriptKeys() {
  const keys = new Set();
  for (const file of ['app.js', 'market-access.js', 'pwa.js']) {
    const src = fs.readFileSync(path.join(dist, file), 'utf8');
    // Every single-quoted literal with letters that sits inside a t(...) call, including ternary branches.
    for (const call of src.matchAll(/\bt\(\s*([\s\S]*?)\)\s*[;,)}\n+`<]/g))
      for (const lit of call[1].matchAll(/'((?:[^'\\]|\\.)*[A-Za-z](?:[^'\\]|\\.)*)'/g)) {
        const key = lit[1].replace(/\\'/g, "'");
        // Skip code identifiers ('group', 'official-guide') and template fragments.
        if (!/^[a-z-]+$/.test(key) && !/[`\n]|\\n/.test(key)) keys.add(key);
      }
  }
  return keys;
}
module.exports = { staticKeys, scriptKeys };
if (require.main === module) {
  let zh = {};
  try {
    zh = require(path.join(dist, 'zh.js'));
  } catch {}
  const missing = [...staticKeys(), ...scriptKeys()].filter((k) => !(k in zh));
  console.log(JSON.stringify(missing, null, 1));
  console.error(missing.length + ' missing');
}
