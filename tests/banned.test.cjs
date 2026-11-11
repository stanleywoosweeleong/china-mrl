const { test } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('fs'),
  vm = require('vm');
const db = JSON.parse(fs.readFileSync('dist/database.json')),
  zh = require('../dist/zh.js');

test('banned list matches MARA Announcement No. 1039 and links to the standard', () => {
  const b = db.banned;
  assert.equal(b.items.length, 60);
  assert.equal(new Set(b.items.map((x) => x.zh)).size, 60);
  assert.deepEqual(
    b.items.map((x) => x.n),
    Array.from({ length: 60 }, (_, i) => i + 1)
  );
  for (const name of ['六六六', '百草枯', '甲胺磷', '硫丹', '克百威', '灭多威', '涕灭威', '氧乐果', '甲拌磷'])
    assert(
      b.items.some((x) => x.zh === name),
      name
    );
  assert.equal(b.source.date, '2026-07-13');
  assert.match(b.source.titleZh, /第1039号/);
  assert.match(b.source.url, /^https:\/\/[a-z.]+\.gov\.cn\//);
  assert.match(b.restrictedSource.url, /^https:\/\/www\.moa\.gov\.cn\//);
  // Every linked section really is that pesticide, and no pesticide is both banned and crop-restricted.
  const byId = new Map(db.pesticides.map((p) => [p.id, p]));
  for (const x of [...b.items, ...b.restricted]) {
    assert(x.en && !/[一-鿿]/.test(x.en.replace(/\([^)]*\)/g, '')), x.zh);
    for (const id of x.sections) assert(byId.get(id).zh.includes(x.zh), x.zh + ' → ' + byId.get(id).zh);
  }
  assert.equal(b.items.filter((x) => x.sections.length).length, 41);
  assert.equal(b.restricted.length, 9);
  assert(!b.restricted.some((r) => b.items.some((x) => x.zh === r.zh)));
  assert(b.restricted.every((r) => r.scope && /[一-鿿]/.test(r.scopeZh)));
});

test('banned section renders, flags limits and jumps to a pesticide in the standard', async () => {
  for (const lang of ['en', 'zh']) {
    const nodes = {},
      listeners = {},
      node = () => ({
        value: '',
        hidden: false,
        textContent: '',
        innerHTML: '',
        style: {},
        dataset: {},
        events: {},
        append() {},
        addEventListener(k, fn) {
          this.events[k] = fn;
        },
        classList: { toggle() {} },
        showModal() {},
        validity: { valid: true },
        focus() {}
      });
    const t = (s, v) =>
      (lang === 'zh' ? (zh[s] ?? s) : s).replace(/\{(\w+)\}/g, (m, k) => (v && k in v ? v[k] : m));
    const ctx = {
      I18n: { lang, t },
      document: {
        getElementById: (id) => (nodes[id] ??= node()),
        querySelectorAll: () => [],
        addEventListener(k, fn) {
          listeners[k] = fn;
        },
        createElement: node
      },
      localStorage: { getItem: () => null, setItem() {} },
      fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(db) }),
      setTimeout() {},
      clearTimeout() {},
      URL: {},
      Blob,
      console,
      window: {},
      MRL: require('../dist/rules.js')
    };
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync('dist/app.js', 'utf8'), ctx);
    await new Promise((r) => setImmediate(r));
    vm.runInContext("setTab('banned')", ctx);
    assert.equal((nodes.bannedRows.innerHTML.match(/class="exempt-row"/g) || []).length, 60);
    assert.equal((nodes.restrictedRows.innerHTML.match(/class="exempt-row"/g) || []).length, 9);
    assert.match(
      nodes.bannedRows.innerHTML,
      lang === 'zh' ? /<strong>百草枯<\/strong>/ : /<strong>Paraquat<\/strong>/
    );
    assert.match(nodes.restrictedRows.innerHTML, lang === 'zh' ? /禁止用于：蔬菜/ : /Banned on: Vegetables/);
    assert.match(nodes.bannedSource.innerHTML, /hlj\.gov\.cn/);
    // Search narrows both lists, in either language and in Traditional characters.
    nodes.bannedSearch.value = '毒死蜱';
    vm.runInContext('renderBanned()', ctx);
    assert.equal((nodes.restrictedRows.innerHTML.match(/class="exempt-row"/g) || []).length, 1);
    nodes.bannedSearch.value = 'paraquat';
    vm.runInContext('renderBanned()', ctx);
    assert.equal((nodes.bannedRows.innerHTML.match(/class="exempt-row"/g) || []).length, 1);
    // The button opens that pesticide's limits in the Entire standard.
    const paraquat = db.pesticides.find((p) => p.zh === '百草枯');
    listeners.click({
      target: {
        closest: (sel) => (sel === 'button' ? { dataset: { pesticide: String(paraquat.id) } } : null)
      }
    });
    assert.equal(vm.runInContext('tab', ctx), 'full');
    assert.equal(
      Number(nodes.resultCount.textContent),
      db.rows.filter((r) => r.pesticideId === paraquat.id).length
    );
    // Limits for a banned pesticide carry the flag, in the list and in the detail.
    assert.match(nodes.rows.innerHTML, lang === 'zh' ? /中国禁止使用/ : /Banned for use in China/);
    vm.runInContext("setTab('fresh')", ctx);
    nodes.crop.value = '榴莲';
    vm.runInContext('filter()', ctx);
    const row = db.rows.find(
      (r) => r.pesticideId === paraquat.id && r.category === '水果' && r.food.startsWith('皮不可食')
    );
    vm.runInContext(`details('${row.id}|榴莲')`, ctx);
    assert.match(
      nodes.detailContent.innerHTML,
      lang === 'zh' ? /中国禁止使用。/ : /Banned for use in China\./
    );
    assert.match(nodes.detailContent.innerHTML, /data-tab="banned"/);
  }
});
