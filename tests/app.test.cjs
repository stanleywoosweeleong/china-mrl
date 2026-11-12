const { test } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('fs'),
  vm = require('vm');
test('application navigation, filters, source detail, save and export', async () => {
  const nodes = {},
    listeners = {},
    created = [],
    data = JSON.parse(fs.readFileSync('dist/database.json'));
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
      showModal() {
        this.open = true;
      },
      validity: { valid: true },
      click() {
        this.clicked = true;
      }
    };
  }
  const document = {
    getElementById: (id) => (nodes[id] ??= node()),
    querySelectorAll: () => [],
    addEventListener(k, fn) {
      listeners[k] = fn;
    },
    createElement() {
      const n = node();
      created.push(n);
      return n;
    }
  };
  let exported;
  const ctx = {
    document,
    localStorage: { getItem: () => null, setItem() {} },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(data) }),
    setTimeout: () => {},
    clearTimeout: () => {},
    URL: {
      createObjectURL(b) {
        exported = b;
        return 'blob:test';
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
  assert.equal(nodes.crop.value, '榴莲');
  assert(nodes.cropCard.innerHTML.includes('Durian'));
  assert.equal(nodes.resultCount.textContent, '89');
  vm.runInContext("setTab('full')", ctx);
  assert.equal(nodes.resultCount.textContent, '10,749');
  nodes.category.value = '蔬菜';
  vm.runInContext('filter()', ctx);
  assert.equal(nodes.resultCount.textContent, '3,460');
  nodes.category.value = '';
  nodes.search.value = 'durian';
  vm.runInContext('filter()', ctx);
  assert.equal(nodes.resultCount.textContent, '89');
  assert(nodes.fullSearchNote.textContent.includes('1 direct + 88 group-based'));
  assert(nodes.rows.innerHTML.includes('Via group:'));
  nodes.search.value = '榴莲';
  vm.runInContext('filter()', ctx);
  assert.equal(nodes.resultCount.textContent, '89');
  nodes.fullSearchMode.value = 'exact';
  nodes.fullSearchMode.events.change();
  assert.equal(nodes.resultCount.textContent, '1');
  assert(nodes.fullSearchNote.textContent.includes('Exact source text'));
  vm.runInContext("details('312:6580|')", ctx);
  assert(nodes.detailContent.innerHTML.includes('standard.pdf#page=252'));
  assert(nodes.detailContent.innerHTML.includes('氯氰菊酯(异构体之和)'));
  nodes.lab.value = '1.1';
  nodes.lab.events.input();
  assert(nodes.comparison.textContent.includes('Above'));
  nodes.labMode.value = 'nd';
  nodes.labMode.events.change();
  assert(nodes.comparison.textContent.includes('reporting limit'));
  nodes.lab.value = '2';
  nodes.lab.events.input();
  assert(nodes.comparison.textContent.includes('cannot establish'));
  listeners.click({ target: { closest: () => ({ dataset: { save: '312:6580|' } }) } });
  vm.runInContext("setTab('saved')", ctx);
  assert.equal(nodes.resultCount.textContent, '1');
  vm.runInContext('downloadCsv()', ctx);
  const csv = await exported.text();
  assert(csv.includes('Cypermethrin + beta-cypermethrin'));
  assert(csv.includes('榴莲'));
  assert(csv.includes('252'));
  assert(created.some((n) => n.clicked));
  // The printed sheet keeps residue qualifiers such as 以脂肪计 beside the value.
  vm.runInContext("setTab('full')", ctx);
  nodes.search.value = 'aldrin';
  vm.runInContext('filter()', ctx);
  vm.runInContext('printSheet()', ctx);
  assert(nodes.printSheet.innerHTML.includes('以脂肪计'));
  vm.runInContext("setTab('exempt')", ctx);
  nodes.exemptSearch.value = 'Bacillus';
  vm.runInContext('renderExempt()', ctx);
  assert(nodes.exemptRows.innerHTML.includes('Bacillus thuringiensis'));
  vm.runInContext("setTab('fresh')", ctx);
  nodes.search.value = 'zz-nonexistent';
  vm.runInContext('filter()', ctx);
  assert.equal(nodes.resultCount.textContent, '0');
  assert.equal(nodes.empty.hidden, false);
});
