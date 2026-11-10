const { test } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('fs'),
  vm = require('vm');
// Saved references must be re-resolved so conflicts and CSV guards survive the Saved tab.
test('saved crop references keep conflict flags; CSV neutralises formula prefixes', async () => {
  const data = JSON.parse(fs.readFileSync('dist/database.json')),
    base = data.rows.find((r) => r.id === '312:6580');
  // Synthetic second direct row for the same pesticide with a different limit creates a conflict.
  data.rows.push({ ...base, id: '312:test', mrl: base.mrl + 1, qualifier: '-test' });
  const nodes = {},
    listeners = {};
  function node() {
    return {
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
      click() {}
    };
  }
  let exported;
  const ctx = {
    document: {
      getElementById: (id) => (nodes[id] ??= node()),
      querySelectorAll: () => [],
      addEventListener(k, fn) {
        listeners[k] = fn;
      },
      createElement: node
    },
    localStorage: {
      getItem: (k) =>
        k === 'china-mrl-v2-saved'
          ? JSON.stringify(['312:6580|榴莲', '312:test|榴莲'])
          : k === 'china-mrl-v2-migrated'
            ? '1'
            : null,
      setItem() {}
    },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(data) }),
    setTimeout: () => {},
    clearTimeout: () => {},
    URL: {
      createObjectURL(b) {
        exported = b;
        return 'blob:';
      },
      revokeObjectURL() {}
    },
    Blob,
    console,
    window: { print() {} },
    MRL: require('../dist/rules.js')
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('dist/app.js', 'utf8'), ctx);
  await new Promise((r) => setImmediate(r));
  vm.runInContext("setTab('saved')", ctx);
  assert.equal(nodes.resultCount.textContent, '2');
  assert(nodes.rows.innerHTML.includes('Conflicting matches'));
  vm.runInContext("details('312:6580|榴莲')", ctx);
  nodes.lab.value = '0.1';
  nodes.lab.events.input();
  assert(nodes.comparison.textContent.includes('Comparison blocked'));
  vm.runInContext("setTab('saved')", ctx);
  vm.runInContext('downloadCsv()', ctx);
  const csv = await exported.text();
  assert(csv.includes('"\'-test"'));
  assert(!csv.includes('"-test"'));
});
function harness(data, storage, legacy) {
  const nodes = {},
    listeners = {};
  function node() {
    return {
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
      click() {}
    };
  }
  const ctx = {
    document: {
      getElementById: (id) => (nodes[id] ??= node()),
      querySelectorAll: () => [],
      addEventListener(k, fn) {
        listeners[k] = fn;
      },
      createElement: node
    },
    localStorage: { getItem: (k) => storage[k] ?? null, setItem: (k, v) => (storage[k] = v) },
    fetch: (u) =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(u === 'data.json' ? legacy : data) }),
    setTimeout: () => {},
    clearTimeout: () => {},
    URL: {
      createObjectURL() {
        return 'blob:';
      },
      revokeObjectURL() {}
    },
    Blob,
    console,
    window: { print() {} },
    MRL: require('../dist/rules.js')
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('dist/app.js', 'utf8'), ctx);
  return { ctx, nodes };
}
test('legacy saved references migrate with their crop context', async () => {
  const data = JSON.parse(fs.readFileSync('dist/database.json')),
    legacy = JSON.parse(fs.readFileSync('dist/data.json')),
    storage = { 'china-mrl-saved': JSON.stringify(['12-0']) };
  const { nodes } = harness(data, storage, legacy);
  await new Promise((r) => setTimeout(r, 20));
  const saved = JSON.parse(storage['china-mrl-v2-saved']);
  assert.equal(saved.length, 1);
  assert.match(saved[0], /^12:\d+\|大蒜$/);
  assert.equal(storage['china-mrl-v2-migrated'], '1');
});
test('crop card flags undefined source foods; detail uses database dates', async () => {
  const data = JSON.parse(fs.readFileSync('dist/database.json')),
    { ctx, nodes } = harness(data, {}, null);
  await new Promise((r) => setImmediate(r));
  nodes.crop.value = '结球甘蓝';
  vm.runInContext('filter()', ctx);
  assert(nodes.cropCard.innerHTML.includes('Annex A does not define'));
  assert(nodes.cropCard.innerHTML.includes('甘蓝 · '));
  assert(nodes.cropCard.innerHTML.includes('page=181'));
  assert(nodes.cropCard.innerHTML.includes('new in the 2026 edition'));
  nodes.crop.value = '榴莲';
  vm.runInContext('filter()', ctx);
  assert(!nodes.cropCard.innerHTML.includes('Annex A does not define'));
  vm.runInContext("details('312:6580|')", ctx);
  assert(nodes.detailContent.innerHTML.includes('1 March 2026'));
  assert(nodes.detailContent.innerHTML.includes('printed page 236'));
});
test('unmapped cabbage rows show the earlier-edition context in both languages', () => {
  const d = JSON.parse(fs.readFileSync('dist/database.json'));
  assert.match(d.reviewNotes['白菜'].en, /GB 2763-2021 carried the same 6 mg\/kg entry/);
  assert.match(d.reviewNotes['白菜'].zh, /普通白菜\/大白菜/);
  assert.match(d.reviewNotes['甘蓝'].en, /new in the 2026 edition/);
});
