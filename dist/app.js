const $ = (id) => document.getElementById(id),
  esc = (s) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
// Language: I18n (i18n.js) supplies t(); without it (unit tests) English passes through.
const I =
    typeof I18n !== 'undefined'
      ? I18n
      : { lang: 'en', t: (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v && k in v ? v[k] : m)) },
  t = I.t,
  isZh = I.lang === 'zh',
  altLang = isZh ? 'en' : 'zh';
// Primary name follows the interface language; the other language is shown as the secondary line.
const cropName = (c) => (isZh ? c.zh : c.en),
  cropAlt = (c) => (isZh ? c.en : c.zh),
  cropPair = (c) => cropName(c) + ' · ' + cropAlt(c),
  pestName = (p) => (isZh ? p.zh : p.en),
  pestAlt = (p) => (isZh ? p.en : p.zh),
  foodName = (r) => (isZh ? r.food : r.foodEn),
  foodAlt = (r) => (isZh ? r.foodEn : r.food),
  catName = (zh) => (isZh ? zh : db.categories[zh] || zh),
  byName = (name) => (a, b) => name(a).localeCompare(name(b), isZh ? 'zh-Hans-CN' : 'en');
let db = null,
  filtered = [],
  page = 1,
  tab = 'fresh',
  saved = new Set(),
  pestMap = new Map(),
  cropMap = new Map(),
  rowMap = new Map(),
  resolvedByCrop = new Map(),
  knownNames = new Set();
const size = 20;
let fullCrop = null,
  fullSuggestions = [],
  freshCrops = [];
const isFresh = (c) => ['水果', '蔬菜'].includes(c.category);
try {
  const a = JSON.parse(localStorage.getItem('china-mrl-v2-saved') || '[]');
  if (Array.isArray(a)) saved = new Set(a.filter((x) => typeof x === 'string'));
} catch {}
const titles = {
  access: [
    'Check the other export gate.',
    'Market access',
    'Country, commodity and product form determine which import protocol applies.'
  ],
  fresh: [
    'Know the limit. See the source.',
    'Fresh produce',
    'China’s pesticide residue standard, made easier to explore for fresh produce exporters.'
  ],
  full: [
    'The entire standard, within reach.',
    'Entire standard',
    'All indexed MRL entries in GB 2763-2026, across all food categories.'
  ],
  saved: [
    'Your reference shortlist.',
    'Saved references',
    'Saved on this browser, with the original food scope and crop context.'
  ],
  exempt: [
    'Know when an exemption applies.',
    'Exempt pesticides',
    'All 44 entries from Annex B, with links to the original text.'
  ],
  sources: [
    'Every number has a source.',
    'Sources & coverage',
    'Coverage, interpretation rules and the original government-hosted document.'
  ],
  guide: [
    'Understand both export gates.',
    'Export essentials',
    'A residue limit and permission to import are two separate requirements.'
  ]
};
const key = (r) => r.id + '|' + (r.cropId || '');
function fromKey(k) {
  const [id, cropId] = k.split('|'),
    r = rowMap.get(id);
  if (!r) return null;
  if (cropId) {
    const c = cropMap.get(cropId);
    if (!c) return null;
    if (!resolvedByCrop.has(cropId))
      resolvedByCrop.set(cropId, new Map(MRL.resolve(db.rows, c).map((x) => [x.id, x])));
    return resolvedByCrop.get(cropId).get(id) || null;
  }
  return r;
}
let toastTimer;
function toast(m) {
  $('toast').textContent = m;
  $('toast').style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($('toast').style.display = 'none'), 2500);
}
function longDate(d) {
  const ms = Date.parse(d + 'T00:00:00Z');
  return Number.isFinite(ms)
    ? new Date(ms).toLocaleDateString(isZh ? 'zh-CN' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
    : String(d);
}
function normalized(s) {
  return String(s).toLowerCase().replace(/[\s-]/g, '');
}
// Crop recognition for the full-standard search: exact names first, then whole words of crop names. Plurals are accepted; several matches become suggestions.
function singulars(q) {
  const v = new Set([q]);
  if (/ies$/.test(q)) v.add(q.slice(0, -3) + 'y');
  if (/oes$|(ch|sh|x)es$/.test(q)) v.add(q.slice(0, -2));
  if (/[^s]s$/.test(q)) v.add(q.slice(0, -1));
  return [...v];
}
function findSearchCrop(raw) {
  fullSuggestions = [];
  const q = normalized(raw);
  if (!q) return null;
  const cat = $('category').value,
    pool = db.crops.filter((c) => !cat || c.category === cat || (c.extraCategories || []).includes(cat)),
    forms = singulars(q),
    names = (c) => [c.en, c.zh, ...(c.aliases || [])];
  const exact = pool.filter((c) => names(c).some((n) => forms.includes(normalized(n))));
  if (exact.length === 1) return exact[0];
  if (exact.length) {
    fullSuggestions = exact;
    return null;
  }
  const words = singulars(String(raw).trim().toLowerCase().replace(/\s+/g, ' ')),
    zh = /[一-鿿]/.test(raw),
    wordsOf = (n) =>
      ' ' +
      n
        .toLowerCase()
        .replace(/[-,()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() +
      ' ';
  const partial = pool.filter((c) =>
    names(c).some((n) =>
      zh ? /[一-鿿]/.test(n) && n.includes(q) : words.some((w) => wordsOf(n).includes(' ' + w + ' '))
    )
  );
  if (partial.length === 1) return partial[0];
  fullSuggestions = partial.slice(0, 8);
  return null;
}
function filter() {
  if (!db) return;
  const crop = cropMap.get($('crop').value),
    q = normalized($('search').value),
    pid = Number($('pesticide').value),
    kind = $('kind').value;
  fullSuggestions = [];
  fullCrop =
    tab === 'full' && $('fullSearchMode').value !== 'exact' ? findSearchCrop($('search').value) : null;
  let rows =
    tab === 'saved'
      ? [...saved].map(fromKey).filter(Boolean)
      : tab === 'full'
        ? fullCrop
          ? MRL.resolve(db.rows, fullCrop)
          : db.rows
        : crop
          ? MRL.resolve(db.rows, crop)
          : db.rows.filter((r) => ['水果', '蔬菜'].includes(r.category));
  filtered = rows.filter((r) => {
    const p = pestMap.get(r.pesticideId),
      c = cropMap.get(r.cropId);
    return (
      (!pid || r.pesticideId === pid) &&
      (!(tab === 'full') || !$('category').value || r.category === $('category').value) &&
      (!kind || (kind === 'provisional' ? r.provisional : r.kind === kind)) &&
      (fullCrop ||
        !q ||
        normalized(
          [
            r.food,
            r.foodEn,
            r.categoryEn,
            p.en,
            p.enSource,
            p.zh,
            p.residue,
            c?.en,
            c?.zh,
            ...(c?.aliases || [])
          ].join(' ')
        ).includes(q))
    );
  });
  filtered.sort((a, b) => {
    const pest = byName(pestName)(pestMap.get(a.pesticideId), pestMap.get(b.pesticideId));
    if (fullCrop || (crop && tab === 'fresh')) return pest;
    return byName(foodName)(a, b) || pest;
  });
  page = 1;
  renderSearchNote();
  renderCrop();
  render();
}
function renderSearchNote() {
  $('fullSearchNote').hidden = tab !== 'full';
  if (tab !== 'full') return;
  if (fullCrop) {
    const direct = filtered.filter((r) => r.match === 'direct').length;
    $('fullSearchNote').textContent =
      t(
        '{name}: {n} applicable entries after filters — {direct} direct + {group} group-based. Group entries follow Annex A and explicit exclusions; original food scopes are shown below.',
        { name: cropPair(fullCrop), n: filtered.length, direct, group: filtered.length - direct }
      ) +
      ' ' +
      (isFresh(fullCrop)
        ? t('Fresh produce only; processed forms need separate classification.')
        : t('Annex A category: {category}. Other product forms need separate classification.', {
            category: catName(fullCrop.category)
          }));
    const u = MRL.unmapped(db.rows, fullCrop, knownNames);
    if (u.length)
      $('fullSearchNote').textContent +=
        ' ' +
        t(
          u.length === 1
            ? 'Review: 1 source row names a food Annex A does not define ({foods}); not applied.'
            : 'Review: {n} source rows name a food Annex A does not define ({foods}); not applied.',
          { n: u.length, foods: [...new Set(u.map((r) => r.food))].join(', ') }
        );
  } else if (fullSuggestions.length) {
    $('fullSearchNote').innerHTML =
      `${t('Several crops match “{query}”. Choose one to include its food-group limits:', { query: esc($('search').value.trim()) })} ${fullSuggestions.map((c) => `<button type="button" class="crop-suggestion" data-full-crop="${esc(c.id)}">${esc(cropPair(c))}</button>`).join(' ')} <span>${t('Meanwhile, results below search the original source text.')}</span>`;
  } else
    $('fullSearchNote').textContent =
      $('fullSearchMode').value === 'exact'
        ? t(
            'Exact source text: searches original food and pesticide wording only. Food-group limits may apply even when the crop name does not appear in a row.'
          )
        : t(
            'Enter an English or Chinese crop name (plurals and partial names work) to include applicable food-group limits. Other queries search the original source text across all food categories.'
          );
}
function unmappedNote(c) {
  const u = MRL.unmapped(db.rows, c, knownNames);
  if (!u.length) return '';
  const items = u
    .map(
      (r) =>
        `${esc(r.food)} · ${esc(pestName(pestMap.get(r.pesticideId)))} ${r.mrl} mg/kg (<a href="standard.pdf#page=${r.page}" target="_blank" rel="noopener">${t('PDF p. {n}', { n: r.page })}</a>)`
    )
    .join('; ');
  const context = [...new Set(u.map((r) => r.food))]
    .map((food) => db.reviewNotes?.[food]?.[isZh ? 'zh' : 'en'])
    .filter(Boolean)
    .map((note) => ' ' + esc(note))
    .join('');
  return `<p class="warn unmapped-note">${t(
    u.length === 1
      ? 'Review: 1 source row names a food that Annex A does not define, so it is not applied here: {items}. Confirm with the source whether it applies to {crop}.'
      : 'Review: {n} source rows name a food that Annex A does not define, so they are not applied here: {items}. Confirm with the source whether they apply to {crop}.',
    { n: u.length, items, crop: esc(cropName(c)) }
  )}${context}</p>`;
}
function renderCrop() {
  const c = cropMap.get($('crop').value);
  $('cropCard').hidden = tab !== 'fresh' || !c;
  if (!c) return;
  const all = MRL.resolve(db.rows, c),
    direct = all.filter((r) => r.match === 'direct').length,
    access = typeof MarketAccess !== 'undefined' ? MarketAccess.cropStatus(c.id) : null;
  const accessText =
    access &&
    t(
      access.marketAccess === 'approved'
        ? 'approved market access · conditions apply'
        : {
            conditional: 'access documented · conditions apply',
            restricted: 'restriction documented',
            unverified: 'market access not verified'
          }[access.status]
    );
  $('cropCard').innerHTML =
    `<div><span class="tag">${t(c.category === '水果' ? 'SELECTED CROP · FRESH FRUIT' : 'SELECTED CROP · FRESH VEGETABLE')}</span><h2>${esc(cropName(c))} <span lang="${altLang}">${esc(cropAlt(c))}</span></h2><p>${t('{direct} direct entries · {group} group-based entries', { direct, group: all.length - direct })}</p>${unmappedNote(c)}${access ? `<p class="crop-access-status">${t('Selected origin: {status}. MRLs alone do not establish permission.', { status: accessText })}</p>` : ''}</div><div><small>${t('PART TO BE TESTED · ANNEX A')}</small><p>${esc(partText(c))}</p><a href="standard.pdf#page=${c.annexPage}" target="_blank" rel="noopener">${t('Read Annex A, PDF p. {n} ↗', { n: c.annexPage })}</a></div>`;
}
const partText = (c) => (isZh && c.partZh) || c.part;
function render() {
  page = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));
  $('resultCount').textContent = filtered.length.toLocaleString();
  $('savedCount').textContent = [...saved].filter((k) => fromKey(k)).length;
  $('resultLabel').textContent = t(
    tab === 'full'
      ? fullCrop
        ? 'applicable entries'
        : filtered.length === 1
          ? 'source row'
          : 'source rows'
      : tab === 'saved'
        ? 'saved references'
        : 'matching limits'
  );
  $('rows').innerHTML = filtered
    .slice((page - 1) * size, page * size)
    .map((r) => {
      const p = pestMap.get(r.pesticideId),
        c = cropMap.get(r.cropId),
        k = esc(key(r)),
        name = c ? cropName(c) : foodName(r),
        alt = c ? cropAlt(c) : foodAlt(r),
        isSaved = saved.has(key(r));
      return `<tr><td><strong>${esc(name)}</strong>${alt && alt !== name ? `<small lang="${altLang}">${esc(alt)}</small>` : ''}${c ? `<small class="source-scope">${t(r.match === 'group' ? 'Via group: ' : 'Direct: ')}${esc(r.food)}</small>` : `<small>${esc(catName(r.category))}</small>`}</td><td><strong>${esc(pestName(p))}</strong><small lang="${altLang}">${esc(pestAlt(p))}</small></td><td><span class="num">${r.mrl}${r.provisional ? '*' : ''}</span><span class="unit">mg/kg</span>${r.qualifier ? `<small>${esc(r.qualifier)}</small>` : ''}${r.conflict ? `<small class="warn">${t('Conflicting matches · review')}</small>` : ''}${r.sourceNote ? `<small class="warn">${t('Source numbering note')}</small>` : ''}</td><td><span class="badge ${r.match === 'group' ? 'group' : ''}">${r.match === 'group' ? t('Group rule') : r.kind}</span><small>${t('Table {table} · p. {page}', { table: r.table, page: r.page })}</small></td><td><div class="row-actions"><button data-save="${k}" class="${isSaved ? 'saved' : ''}" aria-label="${t(isSaved ? 'Unsave' : 'Save')} ${esc(name)} ${esc(pestName(p))}" aria-pressed="${isSaved}">${isSaved ? '★' : '☆'}</button><button data-detail="${k}" class="view">${t('Details ↗')}</button></div></td></tr>`;
    })
    .join('');
  $('empty').hidden = filtered.length > 0;
  $('range').textContent = filtered.length
    ? t('Showing {from}–{to} of {total}', {
        from: (page - 1) * size + 1,
        to: Math.min(page * size, filtered.length),
        total: filtered.length.toLocaleString()
      })
    : t('0 matching numeric records');
  $('pageLabel').textContent = `${page} / ${Math.max(1, Math.ceil(filtered.length / size))}`;
  $('prev').disabled = page === 1;
  $('next').disabled = page * size >= filtered.length;
  $('export').disabled = !filtered.length;
  $('print').disabled = !filtered.length;
}
function reset() {
  ['search', 'pesticide', 'kind', 'category'].forEach((id) => ($(id).value = ''));
  $('crop').value = '';
  filter();
}
function setTab(name) {
  if (!titles[name]) return;
  tab = name;
  document
    .querySelectorAll('nav button')
    .forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  const [title, , sub] = titles[name];
  $('title').textContent = t(title);
  $('subtitle').textContent = t(sub);
  $('explorer').hidden = !['fresh', 'full', 'saved'].includes(name);
  ['sources', 'guide', 'exempt', 'access'].forEach((id) => ($(id).hidden = id !== name));
  $('cropLabel').hidden = name !== 'fresh';
  $('categoryLabel').hidden = name !== 'full';
  $('searchModeLabel').hidden = name !== 'full';
  $('primaryFilters').classList.toggle('full-filters', name === 'full');
  $('fullSearchNote').hidden = name !== 'full';
  $('quick').hidden = name !== 'fresh';
  $('searchTitle').textContent = t(
    name === 'full'
      ? 'Search crops or all 10,749 source entries'
      : name === 'saved'
        ? 'Your saved source references'
        : 'Find the limits for your crop'
  );
  ['search', 'pesticide', 'kind', 'category'].forEach((id) => ($(id).value = ''));
  if (db) {
    filter();
    if (name === 'exempt') renderExempt();
  }
}
function details(k) {
  const r = filtered.find((x) => key(x) === k) || fromKey(k);
  if (!r) return;
  const p = pestMap.get(r.pesticideId),
    c = cropMap.get(r.cropId),
    note = r.sourceNote ? `<p class="warn">${esc(t(r.sourceNote))}</p>` : '';
  const residue = `<span lang="zh">${esc(p.residue || t('Read the source section.'))}</span>${
    !isZh && p.residueEn
      ? `<br><span class="translation">${esc(p.residueEn)}</span><small class="translation-note">${t('English rendering for navigation; the Chinese definition controls.')}</small>`
      : ''
  }`;
  const application = t(
    c
      ? r.match === 'group'
        ? 'Food-group match under Annex A, after explicit exclusions.'
        : 'The source table names this commodity.'
      : 'Original source-table row; select a fresh crop to see group applicability.'
  );
  $('detailContent').innerHTML =
    `<span class="tag">GB 2763-2026 · § 4.${r.table} · ${r.kind}</span><h2>${esc(c ? cropName(c) : foodName(r))}</h2><h3>${esc(pestName(p))}</h3><p>${esc(isZh ? pestAlt(p) : r.food + ' · ' + p.zh)}</p><div class="limit"><strong>${r.mrl}${r.provisional ? '*' : ''}</strong> mg/kg ${esc(r.qualifier)}</div>${r.provisional ? `<p class="warn">${t('* Provisional limit (临时限量). This is not an analytical detection-limit marker.')}</p>` : ''}${r.conflict ? `<p class="warn">${t('More than one equally specific match has a different limit. Resolve applicability against the source before comparison.')}</p>` : ''}${note}<dl><dt>${t('Original food scope')}</dt><dd>${esc(r.food)}${isZh ? '' : '<br>' + esc(r.foodEn)}</dd><dt>${t('Source category')}</dt><dd>${esc(r.categoryScope || r.category)}</dd><dt>${t('Application')}</dt><dd>${application}</dd><dt>${t('Residue definition')}</dt><dd>${residue}</dd><dt>${t('Effective from')}</dt><dd>${esc(longDate(db.meta.effective))}</dd><dt>${t('Source location')}</dt><dd>${t('Table {table} · PDF page {page} · printed page {printed}', { table: r.table, page: r.page, printed: r.page - (db.meta.printedPageOffset ?? 16) })}</dd>${c ? `<dt>${t('Sampling portion')}</dt><dd>${esc(partText(c))}<br><a href="standard.pdf#page=${c.annexPage}" target="_blank" rel="noopener">${t('Annex A · PDF p. {n} ↗', { n: c.annexPage })}</a></dd>` : ''}</dl><a href="standard.pdf#page=${r.page}" target="_blank" rel="noopener">${t('Open the exact source page ↗')}</a>${methodsHtml(p, r, c)}${p.method ? `<details><summary>${t('Source testing-method text (Chinese)')}</summary><p lang="zh" class="technical">${esc(p.method)}</p></details>` : ''}<p>${t('Chinese source wording controls. Combined residue definitions may include metabolites or multiple active substances.')}</p><div class="compare-box"><h3>${t('Compare a laboratory result')}</h3><label for="labMode">${t('Report type')}</label><select id="labMode"><option value="number">${t('Quantified result')}</option><option value="nd">${t('Non-detect / below reporting limit')}</option></select><label for="lab" id="labLabel">${t('Result in mg/kg (ppm by mass)')}</label><input id="lab" type="number" min="0" step="any" placeholder="${t('e.g. 0.015')}"><div id="comparison" role="status">${t('Enter a result to compare.')}</div><p>${t('Arithmetic only. The analyte definition, sample preparation, uncertainty, product form and market access must be assessed separately.')}</p></div>`;
  const update = () => {
    const input = $('lab'),
      nd = $('labMode').value === 'nd';
    $('labLabel').textContent = t(
      nd ? 'Laboratory reporting limit in mg/kg' : 'Result in mg/kg (ppm by mass)'
    );
    const v = input.value === '' || !input.validity.valid ? null : Number(input.value);
    const result = r.conflict
      ? { status: 'review', text: 'Comparison blocked until the conflicting source matches are resolved.' }
      : MRL.compare(nd ? null : v, r.mrl, nd ? 'nd' : 'number', nd ? v : null);
    $('comparison').textContent =
      result.status === 'above'
        ? t('Above the displayed limit by {amount} mg/kg.', { amount: result.amount })
        : t(result.text);
    $('comparison').className = result.status;
  };
  $('lab').addEventListener('input', update);
  $('labMode').addEventListener('change', () => {
    $('lab').value = '';
    update();
  });
  $('detail').showModal();
}
function methodMatches(p, r, c) {
  const names = c ? MRL.membership(c) : new Set([MRL.parseFood(r.food).base]),
    broad = (x) => Boolean(db.categories[x]) || ['植物源性食品', '动物源性食品'].includes(x);
  const level = (m) =>
    m.categories.some((x) => names.has(MRL.parseFood(x).base))
      ? 'commodity'
      : m.appliesTo.includes(r.category) && m.categories.some((x) => broad(MRL.parseFood(x).base))
        ? 'category'
        : '';
  const rows = (p.methods || []).map((m) => ({ m, l: level(m) }));
  return { rows, best: rows.some((x) => x.l === 'commodity') ? 'commodity' : 'category' };
}
function methodText(p, r, c) {
  if (!p.methods?.length) return t('None designated (provisional limits)');
  const { rows, best } = methodMatches(p, r, c);
  const hit = rows.filter((x) => x.l === best);
  return hit.length
    ? hit
        .map(({ m }) => m.standards.join(', ') + (m.basis === 'reference' ? t(' (by reference)') : ''))
        .join('; ')
    : t('See source text');
}
// Testing methods by clause; the clause naming this row's commodity, else its category, is marked.
function methodsHtml(p, r, c) {
  if (!p.methods?.length)
    return `<h4>${t('Testing method')}</h4><p class="technical">${t('The standard designates no testing method for this section: all of its limits are provisional (临时限量). Agree the method with your laboratory, for example an applicable GB 23200 multi-residue method.')}</p>`;
  const { rows, best } = methodMatches(p, r, c);
  return `<h4>${t('Testing methods')}</h4><ul class="methods">${rows.map(({ m, l }) => `<li class="${l === best ? 'match' : ''}"><strong>${esc(isZh ? m.categories.join('、') : m.categoriesEn.join(', '))}</strong> — ${m.standards.map(esc).join(', ')} <small>${t(m.basis === 'reference' ? 'method by reference (参照)' : 'specified method (按照)')}${l === best ? t(' · applies to this entry') : ''}</small></li>`).join('')}</ul>`;
}
function renderExempt() {
  if (!db) return;
  const q = normalized($('exemptSearch').value),
    rows = db.exemptions.filter((x) => normalized(x.en + ' ' + (x.enSource || '') + ' ' + x.zh).includes(q));
  $('exemptRows').innerHTML = rows.length
    ? rows
        .map(
          (x) =>
            `<div class="exempt-row"><span>${String(x.id).padStart(2, '0')}</span><div><strong>${esc(pestName(x))}</strong><small lang="${altLang}">${esc(pestAlt(x))}</small></div><a href="standard.pdf#page=${x.page}" target="_blank" rel="noopener">${t('Annex B ↗')}</a></div>`
        )
        .join('')
    : `<p>${t('No matching Annex B entry. This does not establish an exemption.')}</p>`;
}
function downloadCsv() {
  const head = [
    'Standard',
    'Effective date',
    'Research snapshot',
    'Selected crop',
    'Food scope English (navigation aid)',
    'Food scope Chinese',
    'Category',
    'Original category scope',
    'Pesticide English',
    'Pesticide Chinese',
    'Residue definition Chinese',
    'Residue definition English (navigation aid)',
    'Limit mg/kg',
    'Limit type',
    'Provisional',
    'Qualifier',
    'Testing method (standards)',
    'Match basis',
    'Sampling portion',
    'Table',
    'PDF page',
    'Source',
    'Source numbering note',
    'Applicability note'
  ].map((h) => t(h));
  const rows = filtered.map((r) => {
    const p = pestMap.get(r.pesticideId),
      c = cropMap.get(r.cropId);
    return [
      db.meta.standard,
      db.meta.effective,
      db.meta.checked,
      c ? cropName(c) : '',
      r.foodEn,
      r.food,
      r.categoryEn,
      r.categoryScope || r.category,
      p.en,
      p.zh,
      p.residue,
      p.residueEn || '',
      r.mrl,
      r.kind,
      t(r.provisional ? 'Yes' : 'No'),
      r.qualifier,
      methodText(p, r, c),
      t({ direct: 'Direct', group: 'Group rule' }[r.match] || 'Original source row'),
      c ? partText(c) : '',
      r.table,
      r.page,
      db.meta.source + '#page=' + r.page,
      r.sourceNote ? t(r.sourceNote) : '',
      t(
        r.conflict
          ? 'Conflicting matches; review required'
          : 'Confirm applicability, current rules and market access separately'
      )
    ];
  });
  const quote = (v) =>
    '"' +
    String(v ?? '')
      .replace(/^[=+\-@\t\r]/, "'$&")
      .replace(/"/g, '""') +
    '"';
  const csv = [head, ...rows].map((r) => r.map(quote).join(',')).join('\r\n');
  const u = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = u;
  a.download = 'GB-2763-2026-reference.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
  toast(t('Exported {n} rows with sources', { n: filtered.length.toLocaleString() }));
}
$('search').addEventListener('input', filter);
['crop', 'category', 'pesticide', 'kind', 'fullSearchMode'].forEach((id) =>
  $(id).addEventListener('change', filter)
);
$('exemptSearch').addEventListener('input', renderExempt);
$('reset').onclick = reset;
$('prev').onclick = () => {
  page--;
  render();
};
$('next').onclick = () => {
  page++;
  render();
};
$('export').onclick = downloadCsv;
$('print').onclick = () => window.print();
document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.tab) setTab(b.dataset.tab);
  if (b.dataset.crop) {
    if (tab !== 'fresh') setTab('fresh');
    ['search', 'pesticide', 'kind'].forEach((id) => ($(id).value = ''));
    $('crop').value = b.dataset.crop;
    filter();
  }
  if (b.dataset.fullCrop) {
    const c = cropMap.get(b.dataset.fullCrop);
    if (c) {
      $('search').value = cropName(c);
      filter();
      $('search').focus();
    }
  }
  if (b.dataset.detail) details(b.dataset.detail);
  if (b.dataset.save) {
    const k = b.dataset.save;
    saved.has(k) ? saved.delete(k) : saved.add(k);
    try {
      localStorage.setItem('china-mrl-v2-saved', JSON.stringify([...saved]));
      toast(t(saved.has(k) ? 'Saved with source and crop context' : 'Reference removed'));
    } catch {
      toast(t('Browser storage unavailable; saved for this session only'));
    }
    tab === 'saved' ? filter() : render();
  }
});
document.addEventListener('keydown', (e) => {
  if (
    e.key === '/' &&
    !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName) &&
    !$('detail').open
  ) {
    e.preventDefault();
    if (!['fresh', 'full', 'saved'].includes(tab)) setTab('fresh');
    $('search').focus();
  }
});
fetch('database.json')
  .then((r) => {
    if (!r.ok) throw Error('Data request failed');
    return r.json();
  })
  .then((d) => {
    db = d;
    pestMap = new Map(d.pesticides.map((p) => [p.id, p]));
    cropMap = new Map(d.crops.map((c) => [c.id, c]));
    freshCrops = d.crops.filter((c) => isFresh(c));
    rowMap = new Map(d.rows.map((r) => [r.id, r]));
    d.crops.forEach((c) => MRL.membership(c).forEach((n) => knownNames.add(n)));
    function option(id, value, label) {
      const o = document.createElement('option');
      o.value = value;
      o.textContent = label;
      $(id).append(o);
    }
    freshCrops
      .slice()
      .sort(byName(cropName))
      .forEach((c) => option('crop', c.id, cropPair(c)));
    d.pesticides
      .slice()
      .sort(byName(pestName))
      .forEach((p) => option('pesticide', p.id, `${pestName(p)} · ${pestAlt(p)}`));
    Object.entries(d.categories).forEach(([zh, en]) => option('category', zh, isZh ? zh : `${en} · ${zh}`));
    $('crop').value = '榴莲';
    $('annexText').innerHTML = d.annex
      .map((a) => `<h4>${t('PDF page {n}', { n: a.page })}</h4><pre lang="zh">${esc(a.text)}</pre>`)
      .join('');
    filter();
    renderExempt();
    migrateSaved();
    if (typeof MarketAccess !== 'undefined')
      MarketAccess.init(
        freshCrops,
        () => {
          const selected = tab === 'fresh' ? $('crop').value : null;
          setTab('access');
          return selected;
        },
        () => {
          if (tab === 'fresh') renderCrop();
        }
      );
  })
  .catch((e) => {
    $('loadError').hidden = false;
    $('loadError').textContent = t(
      'The reference database could not load. Please reload the page; no regulatory conclusion can be drawn from this error.'
    );
    $('export').disabled = true;
    $('print').disabled = true;
    console.error(e);
  });

async function migrateSaved() {
  try {
    if (localStorage.getItem('china-mrl-v2-migrated')) return;
    const old = JSON.parse(localStorage.getItem('china-mrl-saved') || '[]');
    if (!Array.isArray(old) || !old.length) return;
    const response = await fetch('data.json');
    if (!response.ok) return;
    const legacy = await response.json();
    for (const row of legacy.filter((r) => old.includes(r.id))) {
      const match = db.rows.find(
        (r) =>
          r.table === row.table &&
          r.food === row.commodityZh &&
          r.category === { Fruit: '水果', Vegetable: '蔬菜' }[row.category]
      );
      if (match) {
        const c = cropMap.get(row.commodityZh),
          applied = c && fromKey(match.id + '|' + c.id);
        saved.add(applied ? key(applied) : key(match));
      }
    }
    localStorage.setItem('china-mrl-v2-saved', JSON.stringify([...saved]));
    localStorage.setItem('china-mrl-v2-migrated', '1');
    render();
  } catch {
    /* Preserve legacy saved state if migration cannot complete. */
  }
}
