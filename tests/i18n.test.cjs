const { test } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('fs'),
  vm = require('vm');
const zh = require('../dist/zh.js'),
  ms = require('../dist/ms.js'),
  { staticKeys, scriptKeys } = require('../scripts/i18n_keys.cjs'),
  db = JSON.parse(fs.readFileSync('dist/database.json')),
  access = JSON.parse(fs.readFileSync('dist/market-access.json'));
const placeholders = (s) => (s.match(/\{\w+\}/g) || []).sort().join();

test('every interface string has a Chinese and a Malay translation', () => {
  const missing = [...staticKeys(), ...scriptKeys()].filter((k) => !(k in zh));
  assert.deepEqual(missing, []);
  assert.deepEqual(
    [...staticKeys(), ...scriptKeys()].filter((k) => !(k in ms)),
    []
  );
  // Strings reached through variables rather than literal t('…') calls.
  const indirect = [
    ...db.rows.filter((r) => r.sourceNote).map((r) => r.sourceNote),
    access.coverage,
    ...['fresh', 'frozen', 'dried', 'processed'],
    'Comparison blocked until the conflicting source matches are resolved.',
    'Review due (over 90 days)',
    'Review due (review date unreadable)',
    'Official guide',
    'Official list',
    'Protocol'
  ];
  const MRL = require('../dist/rules.js');
  for (const args of [
    [null, NaN],
    [null, 1, 'nd'],
    [null, 1, 'nd', 0.5],
    [null, 1, 'nd', 2],
    [null, 1],
    [1, 1],
    [0.5, 1]
  ])
    indirect.push(MRL.compare(...args).text);
  assert.deepEqual(
    indirect.filter((k) => !(k in zh)),
    []
  );
  assert.deepEqual(
    indirect.filter((k) => !(k in ms)),
    []
  );
});
test('Malay translations keep their placeholders and are not left in English', () => {
  // Words that are the same in both languages.
  const same = new Set(['Malaysia', 'CHINA', 'Durian', 'Tomato', 'Global', 'EMRL:']);
  for (const [en, my] of Object.entries(ms)) {
    assert.equal(placeholders(my), placeholders(en), en);
    // Identical text is fine only for shared words and strings that are just placeholders and symbols.
    assert(my !== en || same.has(en) || !/[a-z]{4}/.test(en.replace(/\{\w+\}/g, '')), 'untranslated: ' + en);
  }
});
test('translations keep their placeholders and contain Chinese', () => {
  for (const [en, cn] of Object.entries(zh)) {
    assert.equal(placeholders(cn), placeholders(en), en);
    assert(/[一-鿿]/.test(cn) || en === 'CHINA', en);
  }
});
test('data shown in Chinese mode has Chinese text', () => {
  assert(db.crops.every((c) => c.partZh && /[一-鿿]/.test(c.partZh)));
  for (const r of access.records) {
    assert(r.scopeZh && /[一-鿿]/.test(r.scopeZh), r.origin + r.crop);
    assert.equal(r.conditionsZh.length, r.conditions.length, r.origin + r.crop);
  }
});
test('Chinese mode renders Chinese names first and translated text', async () => {
  const nodes = {},
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
      click() {},
      focus() {}
    });
  const t = (s, v) => (zh[s] ?? s).replace(/\{(\w+)\}/g, (m, k) => (v && k in v ? v[k] : m));
  const ctx = {
    I18n: { lang: 'zh', t },
    document: {
      getElementById: (id) => (nodes[id] ??= node()),
      querySelectorAll: () => [],
      addEventListener() {},
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
  assert.equal(nodes.resultCount.textContent, '89');
  vm.runInContext("setTab('fresh')", ctx);
  nodes.crop.value = '榴莲';
  vm.runInContext('filter()', ctx);
  assert.equal(nodes.title.textContent, '查清限量，核对原文。');
  assert.match(nodes.cropCard.innerHTML, /<h2>榴莲 <span lang="en">Durian<\/span>/);
  assert.match(nodes.cropCard.innerHTML, /直接列名 1 项 · 按类别适用 88 项/);
  assert.match(nodes.cropCard.innerHTML, /菠萝蜜、榴莲测定果肉/);
  assert.match(nodes.rows.innerHTML, /按类别适用：/);
  vm.runInContext("details('312:6580|榴莲')", ctx);
  const d = nodes.detailContent.innerHTML;
  assert.match(d, /<h3>氯氰菊酯和高效氯氰菊酯<\/h3>/);
  assert.match(d, /实施日期<\/dt><dd>2026年3月1日/);
  assert(!d.includes('English rendering'));
  nodes.lab.value = '1.5';
  nodes.lab.events.input();
  assert.equal(nodes.comparison.textContent, '超出所显示的限量 0.5 mg/kg。');
  vm.runInContext("setTab('full')", ctx);
  nodes.search.value = '莴苣';
  vm.runInContext('filter()', ctx);
  assert.match(nodes.fullSearchNote.innerHTML, /有多种作物符合“莴苣”/);
});

test('Malay mode renders Malay names, categories and parts', async () => {
  const nodes = {},
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
      click() {},
      focus() {}
    });
  const t = (s, v) => (ms[s] ?? s).replace(/\{(\w+)\}/g, (m, k) => (v && k in v ? v[k] : m));
  const ctx = {
    I18n: { lang: 'ms', t },
    document: {
      getElementById: (id) => (nodes[id] ??= node()),
      querySelectorAll: () => [],
      addEventListener() {},
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
  vm.runInContext("setTab('fresh')", ctx);
  nodes.crop.value = '菠萝蜜';
  vm.runInContext('filter()', ctx);
  assert.equal(nodes.title.textContent, 'Ketahui hadnya. Lihat sumbernya.');
  assert.match(nodes.cropCard.innerHTML, /<h2>Nangka <span lang="zh">菠萝蜜<\/span>/);
  assert.match(nodes.cropCard.innerHTML, /TANAMAN DIPILIH · BUAH SEGAR/);
  assert.match(nodes.cropCard.innerHTML, /Uji isi; berat biji dikira/);
  assert.match(nodes.rows.innerHTML, /Melalui kumpulan: /);
  // Malay names find crops; every fresh crop and food category has one.
  const ids = (q) => vm.runInContext(`cropMatches(typed(${JSON.stringify(q)})).map((c) => c.id)`, ctx);
  assert.equal(ids('nangka')[0], '菠萝蜜');
  assert.equal(ids('manggis')[0], '山竹');
  assert.equal(ids('kacang panjang')[0], '豇豆');
  assert(db.crops.filter((c) => ['水果', '蔬菜'].includes(c.category)).every((c) => c.ms && c.partMs));
  assert.deepEqual(Object.keys(db.categoriesMs).sort(), Object.keys(db.categories).sort());
});
