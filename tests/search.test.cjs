const { test } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('fs'),
  vm = require('vm');
async function app() {
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
      click() {},
      focus() {}
    };
  }
  const data = JSON.parse(fs.readFileSync('dist/database.json'));
  const ctx = {
    document: {
      getElementById: (id) => (nodes[id] ??= node()),
      querySelectorAll: () => [],
      addEventListener(k, fn) {
        listeners[k] = fn;
      },
      createElement: node,
      activeElement: { tagName: 'BODY' }
    },
    localStorage: { getItem: () => null, setItem() {} },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(data) }),
    setTimeout: () => {},
    clearTimeout: () => {},
    URL: {},
    Blob,
    console,
    window: { print() {} },
    MRL: require('../dist/rules.js')
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('dist/app.js', 'utf8'), ctx);
  await new Promise((r) => setImmediate(r));
  vm.runInContext("setTab('full')", ctx);
  const search = (q) => {
    nodes.search.value = q;
    vm.runInContext('filter()', ctx);
    return vm.runInContext('fullCrop?fullCrop.id:null', ctx);
  };
  return { nodes, listeners, search, ctx };
}
test('crop search accepts plurals, partial names, spelling variants and aliases', async () => {
  const { search, nodes } = await app();
  for (const [q, id] of [
    ['Durian', '榴莲'],
    ['cherries', '樱桃'],
    ['Tomatoes', '番茄'],
    ['chili', '辣椒'],
    ['sugar snap pea', '食荚豌豆'],
    ['sugar snap peas', '食荚豌豆'],
    ['table grapes', '葡萄'],
    ['kiwi', '猕猴桃'],
    ['榴莲', '榴莲']
  ]) {
    assert.equal(search(q), id, q);
    assert(Number(nodes.resultCount.textContent.replace(/,/g, '')) > 0, q);
  }
  for (const [q, a, b] of [
    ['jujube', '枣(鲜)', '枣(干)'],
    ['chilli', '辣椒', '干辣椒']
  ]) {
    assert.equal(search(q), null, q);
    assert.match(
      nodes.fullSearchNote.innerHTML,
      new RegExp('data-full-crop="' + a.replace(/[()]/g, '\\$&') + '"')
    );
    assert.match(
      nodes.fullSearchNote.innerHTML,
      new RegExp('data-full-crop="' + b.replace(/[()]/g, '\\$&') + '"')
    );
  }
  nodes.category.value = '水果';
  assert.equal(search('jujube'), '枣(鲜)');
  nodes.category.value = '调味料';
  assert.equal(search('chilli'), '干辣椒');
  assert.match(nodes.fullSearchNote.textContent, /Annex A category: Spices & herbs/);
  nodes.category.value = '';
  for (const [q, id] of [
    ['button mushrooms', '双孢蘑菇'],
    ['香菇', '香菇'],
    ['raisins', '葡萄干'],
    ['walnut', '核桃'],
    ['tea', '茶叶']
  ]) {
    assert.equal(search(q), id, q);
    assert(Number(nodes.resultCount.textContent.replace(/,/g, '')) > 0, q);
  }
  assert.equal(search('grapefruit'), null);
  assert.equal(search('methyl'), null);
  assert.match(nodes.fullSearchNote.textContent, /^Enter an English/);
});
test('ambiguous crop names offer suggestions that select the crop', async () => {
  const { search, nodes, listeners } = await app();
  assert.equal(search('lettuce'), null);
  assert.match(nodes.fullSearchNote.innerHTML, /Leaf lettuce/);
  assert.match(nodes.fullSearchNote.innerHTML, /Head lettuce/);
  assert.match(nodes.fullSearchNote.innerHTML, /data-full-crop="结球莴苣"/);
  listeners.click({ target: { closest: () => ({ dataset: { fullCrop: '结球莴苣' } }) } });
  assert.equal(nodes.search.value, 'Head lettuce');
  assert.match(nodes.fullSearchNote.textContent, /Head lettuce · 结球莴苣: \d+ applicable entries/);
  assert.equal(search('莴苣'), null);
  assert.match(nodes.fullSearchNote.innerHTML, /茎用莴苣/);
  assert.equal(search('<img src=x>'), null);
  assert(!nodes.fullSearchNote.innerHTML.includes('<img'));
});
test('sorting, the crop picker ranking and the print sheet', async () => {
  const { nodes, ctx } = await app();
  vm.runInContext("setTab('fresh')", ctx);
  nodes.crop.value = '榴莲';
  vm.runInContext("sortBy = { col: 'limit', dir: 'desc' }; filter()", ctx);
  const limits = vm.runInContext('filtered.map((r) => r.mrl)', ctx);
  assert.equal(limits.length, 89);
  // Sorted within each group: other pesticides first, then those banned for use in China.
  const from = vm.runInContext('bannedFrom', ctx);
  for (const group of [[...limits].slice(0, from), [...limits].slice(from)])
    assert.deepEqual(
      group,
      [...group].sort((a, b) => b - a)
    );
  assert.equal(nodes.rows.className, 'crop-context');
  const ids = (q) => vm.runInContext(`cropMatches(normalized(${JSON.stringify(q)})).map((c) => c.id)`, ctx);
  assert.equal(ids('liulian')[0], '榴莲');
  assert.equal(ids('ll')[0], '榴莲');
  assert.equal(ids('blm')[0], '菠萝蜜');
  assert.equal(ids('Durian')[0], '榴莲');
  assert.equal(ids('musang king')[0], '榴莲');
  assert(ids('pepper').includes('甜椒'));
  assert.deepEqual(ids('zzzz'), []);
  assert.equal(ids('').length, 184);
  let printed = 0;
  ctx.window.print = () => printed++;
  ctx.document.getElementById('originSelector').selectedOptions = [{ textContent: 'Malaysia' }];
  vm.runInContext('printSheet()', ctx);
  assert.equal(printed, 1);
  assert.equal((nodes.printSheet.innerHTML.match(/class="sheet-row"/g) || []).length, 89);
  assert.match(nodes.printSheet.innerHTML, /<h1>Durian · 榴莲<\/h1>/);
  assert.match(nodes.printSheet.innerHTML, /GB 23200\.\d+/);
  assert.match(nodes.printSheet.innerHTML, /89 of 89 limits in this view/);
});
test('Traditional Chinese and regional names find crops and limits', async () => {
  const { nodes, ctx, search } = await app();
  const ids = (q) => vm.runInContext(`cropMatches(typed(${JSON.stringify(q)})).map((c) => c.id)`, ctx);
  for (const [q, id] of [
    ['榴槤', '榴莲'],
    ['榴梿', '榴莲'],
    ['鳳梨', '菠萝'],
    ['凤梨', '菠萝'],
    ['芭樂', '番石榴'],
    ['釋迦', '番荔枝'],
    ['奇異果', '猕猴桃'],
    ['牛油果', '鳄梨'],
    ['高麗菜', '结球甘蓝'],
    ['馬鈴薯', '马铃薯'],
    ['土豆', '马铃薯'],
    ['西红柿', '番茄'],
    ['蘋果', '苹果'],
    ['龍眼', '龙眼']
  ])
    assert.equal(ids(q)[0], id, q);
  // Entire-standard search: a Traditional crop name resolves the crop, and Traditional text finds rows.
  assert.equal(search('榴槤'), '榴莲');
  assert.equal(nodes.resultCount.textContent, '89');
  assert.equal(search('鳳梨'), '菠萝');
  nodes.fullSearchMode.value = 'exact';
  nodes.search.value = '馬鈴薯';
  vm.runInContext('filter()', ctx);
  assert(Number(nodes.resultCount.textContent.replace(/,/g, '')) > 50);
  nodes.fullSearchMode.value = 'applicable';
  // Search names never change which limits apply.
  const MRL = require('../dist/rules.js'),
    db = JSON.parse(fs.readFileSync('dist/database.json'));
  assert(!MRL.membership(db.crops.find((c) => c.id === '菠萝')).has('凤梨'));
});
