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
  t = I.t;
// The interface language can change while the app is open; relabel() redraws for the new one.
let isZh = I.lang === 'zh',
  isMs = I.lang === 'ms',
  altLang = isZh ? 'en' : 'zh';
// Primary name follows the interface language; the other language is shown as the secondary line.
// Malay names exist for fresh crops; anything without one falls back to English.
const cropName = (c) => (isZh ? c.zh : (isMs && c.ms) || c.en),
  cropAlt = (c) => (isZh ? c.en : c.zh),
  cropPair = (c) => cropName(c) + ' · ' + cropAlt(c),
  pestName = (p) => (isZh ? p.zh : p.en),
  pestAlt = (p) => (isZh ? p.en : p.zh),
  foodName = (r) => (isZh ? r.food : r.foodEn),
  foodAlt = (r) => (isZh ? r.foodEn : r.food),
  catName = (zh) => (isZh ? zh : (isMs && db.categoriesMs?.[zh]) || db.categories[zh] || zh),
  // One collator per language: localeCompare with a locale argument builds a new one on every call,
  // which made the first sort of 568 pesticide names by pinyin very slow on phones.
  collators = {},
  collator = () => {
    const tag = isZh ? 'zh-Hans-CN' : isMs ? 'ms' : 'en';
    return (collators[tag] ??= new Intl.Collator(tag));
  },
  byName = (name) => {
    const c = collator();
    return (a, b) => c.compare(name(a), name(b));
  };
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
// User-chosen sort; empty col keeps the default order (pesticide name, or food then pesticide).
let sortBy = { col: '', dir: 'asc' };
// Page to stay on for the next filter() (a language change); otherwise filtering returns to page 1.
let nextPage = 0;
// Index in `filtered` where the group of banned-pesticide limits starts (its length when there is none).
let bannedFrom = 0;
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
  banned: [
    'Know what not to use.',
    'Banned in China',
    'Pesticides China bans or restricts for use, linked to their limits in the standard.'
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
// A crop's applicable limits never change while the app is open, so they are worked out once per crop.
const resolvedRows = new Map();
function resolved(c) {
  if (!resolvedRows.has(c.id)) resolvedRows.set(c.id, MRL.resolve(db.rows, c));
  return resolvedRows.get(c.id);
}
function fromKey(k) {
  const [id, cropId] = k.split('|'),
    r = rowMap.get(id);
  if (!r) return null;
  if (cropId) {
    const c = cropMap.get(cropId);
    if (!c) return null;
    if (!resolvedByCrop.has(cropId)) resolvedByCrop.set(cropId, new Map(resolved(c).map((x) => [x.id, x])));
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
    ? new Date(ms).toLocaleDateString(isZh ? 'zh-CN' : isMs ? 'ms-MY' : 'en-GB', {
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
// What a person typed: Traditional characters become Simplified (榴槤 → 榴莲) so they match the data.
let t2s = new Map();
const simplified = (s) => (t2s.size ? [...String(s)].map((ch) => t2s.get(ch) || ch).join('') : String(s));
const typed = (s) => normalized(simplified(s));
// Every name a crop can be found by; `search` holds everyday and regional names (search only).
const cropNames = (c) => [c.en, c.zh, ...(c.ms ? [c.ms] : []), ...(c.aliases || []), ...(c.search || [])];
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
  raw = simplified(raw);
  const q = normalized(raw);
  if (!q) return null;
  const cat = $('category').value,
    pool = db.crops.filter((c) => !cat || c.category === cat || (c.extraCategories || []).includes(cat)),
    forms = singulars(q),
    names = cropNames;
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
    q = typed($('search').value),
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
          ? resolved(fullCrop)
          : db.rows
        : crop
          ? resolved(crop)
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
            c?.ms,
            ...(c?.aliases || []),
            ...(c?.search || [])
          ].join(' ')
        ).includes(q))
    );
  });
  filtered.sort((a, b) => {
    const pest = byName(pestName)(pestMap.get(a.pesticideId), pestMap.get(b.pesticideId));
    if (fullCrop || (crop && tab === 'fresh')) return pest;
    return byName(foodName)(a, b) || pest;
  });
  if (sortBy.col) {
    const dir = sortBy.dir === 'desc' ? -1 : 1,
      rowFood = (r) => (cropMap.get(r.cropId) ? cropName(cropMap.get(r.cropId)) : foodName(r)),
      compare = {
        limit: (a, b) => a.mrl - b.mrl,
        pest: (a, b) => byName(pestName)(pestMap.get(a.pesticideId), pestMap.get(b.pesticideId)),
        food: byName(rowFood)
      }[sortBy.col];
    if (compare) filtered.sort((a, b) => dir * compare(a, b));
  }
  // Limits for pesticides China bans outright form their own group after the rest, whatever the sort.
  bannedFrom = filtered.length;
  if (tab !== 'saved') {
    const isBanned = (r) => {
      const s = useStatus.get(r.pesticideId);
      return Boolean(s && !s.scope);
    };
    const others = filtered.filter((r) => !isBanned(r));
    bannedFrom = others.length;
    filtered = [...others, ...filtered.filter(isBanned)];
  }
  // The market-access checker follows the crop chosen here.
  if (tab === 'fresh' && crop && typeof MarketAccess !== 'undefined') MarketAccess.sync(crop.id);
  syncSort();
  syncCropInput();
  page = nextPage || 1;
  nextPage = 0;
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
  const all = resolved(c),
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
    `${access ? `<div class="access-banner ${access.status}"><p class="crop-access-status">${t('Selected origin: {status}. MRLs alone do not establish permission.', { status: accessText })}</p><button type="button" data-access-view="${esc(c.id)}">${t(access.status === 'unverified' ? 'Check market access' : 'View conditions')}</button></div>` : ''}<div><span class="tag">${t(c.category === '水果' ? 'SELECTED CROP · FRESH FRUIT' : 'SELECTED CROP · FRESH VEGETABLE')}</span><h2>${esc(cropName(c))} <span lang="${altLang}">${esc(cropAlt(c))}</span></h2><p>${t('{direct} direct entries · {group} group-based entries', { direct, group: all.length - direct })}</p>${unmappedNote(c)}</div><div><small>${t('PART TO BE TESTED · ANNEX A')}</small><p>${esc(partText(c))}</p><a href="standard.pdf#page=${c.annexPage}" target="_blank" rel="noopener">${t('Read Annex A, PDF p. {n} ↗', { n: c.annexPage })}</a></div>`;
}
const partText = (c) => (isZh && c.partZh) || (isMs && c.partMs) || c.part;
function rowHtml(r) {
  const p = pestMap.get(r.pesticideId),
    c = cropMap.get(r.cropId),
    k = esc(key(r)),
    name = c ? cropName(c) : foodName(r),
    alt = c ? cropAlt(c) : foodAlt(r),
    isSaved = saved.has(key(r));
  return `<tr data-key="${k}"><td><strong>${esc(name)}</strong>${alt && alt !== name ? `<small lang="${altLang}">${esc(alt)}</small>` : ''}${c ? `<small class="source-scope">${t(r.match === 'group' ? 'Via group: ' : 'Direct: ')}${esc(r.food)}</small>` : `<small>${esc(catName(r.category))}</small>`}</td><td data-label="${t('PESTICIDE')}"><strong>${esc(pestName(p))}</strong><small lang="${altLang}">${esc(pestAlt(p))}</small></td><td data-label="${t('LIMIT')}"><span class="num">${r.mrl}${r.provisional ? '*' : ''}</span><span class="unit">mg/kg</span>${r.qualifier ? `<small>${esc(r.qualifier)}</small>` : ''}${r.conflict ? `<small class="warn">${t('Conflicting matches · review')}</small>` : ''}${r.sourceNote ? `<small class="warn">${t('Source numbering note')}</small>` : ''}</td><td><span class="badge ${r.match === 'group' ? 'group' : ''}">${r.match === 'group' ? t('Group rule') : r.kind}</span><small>${t('Table {table} · p. {page}', { table: r.table, page: r.page })}</small></td><td><div class="row-actions"><button data-save="${k}" class="${isSaved ? 'saved' : ''}" aria-label="${t(isSaved ? 'Unsave' : 'Save')} ${esc(name)} ${esc(pestName(p))}" aria-pressed="${isSaved}">${isSaved ? '★' : '☆'}</button><button data-detail="${k}" class="view">${t('Details ↗')}</button></div></td></tr>`;
}
function render() {
  page = Math.min(page, Math.max(1, Math.ceil(bannedFrom / size)));
  $('resultCount').textContent = filtered.length.toLocaleString();
  const savedTotal = [...saved].filter((k) => fromKey(k)).length;
  $('savedCount').textContent = savedTotal;
  $('savedCount').hidden = !savedTotal;
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
  // With a crop selected every row is that crop, so phones can drop the repeated name. Saved items keep theirs.
  $('rows').className = fullCrop || (tab === 'fresh' && cropMap.get($('crop').value)) ? 'crop-context' : '';
  // The main list holds limits for pesticides that are not banned in China; the rest go to the Banned section.
  const main = filtered.slice(0, bannedFrom),
    banned = filtered.slice(bannedFrom),
    first = (page - 1) * size;
  $('rows').innerHTML = main
    .slice(first, page * size)
    .map(rowHtml)
    .join('');
  $('empty').hidden = filtered.length > 0;
  $('range').textContent = filtered.length
    ? (main.length
        ? t('Showing {from}–{to} of {total}', {
            from: first + 1,
            to: Math.min(page * size, main.length),
            total: main.length.toLocaleString()
          })
        : '') +
      (banned.length
        ? (main.length ? ' · ' : '') +
          t('{n} more in the Banned section below', { n: banned.length.toLocaleString() })
        : '')
    : t('0 matching numeric records');
  $('pageLabel').textContent = `${page} / ${Math.max(1, Math.ceil(main.length / size))}`;
  $('prev').disabled = page === 1;
  $('next').disabled = page * size >= main.length;
  // Banned section: this view's limits for pesticides China bans for use. Collapsed unless it is all there is.
  const shown = banned.slice(0, 200);
  $('bannedLimits').hidden = !banned.length;
  if (banned.length && !main.length) $('bannedLimits').open = true;
  $('bannedLimitsSummary').textContent = t('Banned in China · {n} limits', {
    n: banned.length.toLocaleString()
  });
  $('bannedLimitRows').className = $('rows').className;
  // Its rows are drawn only while the section is open; opening it redraws (see the toggle listener).
  $('bannedLimitRows').innerHTML = $('bannedLimits').open ? shown.map(rowHtml).join('') : '';
  $('bannedLimitsMore').hidden = banned.length <= shown.length;
  $('bannedLimitsMore').textContent = t(
    'Showing the first {n}. Choose a crop or a pesticide to see the rest.',
    {
      n: shown.length
    }
  );
  $('export').disabled = !filtered.length;
  $('print').disabled = !filtered.length;
}
$('bannedLimits').addEventListener('toggle', () => {
  if ($('bannedLimits').open && db) render();
});
function reset() {
  ['search', 'pesticide', 'kind', 'category'].forEach((id) => ($(id).value = ''));
  $('crop').value = '';
  sortBy = { col: '', dir: 'asc' };
  filter();
}
function renderTitles() {
  const [title, , sub] = titles[tab];
  $('title').textContent = t(title);
  $('subtitle').textContent = t(sub);
  $('searchTitle').textContent = t(
    tab === 'full'
      ? 'Search crops or all 10,749 source entries'
      : tab === 'saved'
        ? 'Your saved source references'
        : 'Find the limits for your crop'
  );
}
function setTab(name) {
  if (!titles[name]) return;
  if ($('detail').open) $('detail').close?.();
  tab = name;
  document
    .querySelectorAll('nav button')
    .forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  $('explorer').hidden = !['fresh', 'full', 'saved'].includes(name);
  ['sources', 'guide', 'exempt', 'access', 'banned'].forEach((id) => ($(id).hidden = id !== name));
  $('cropLabel').hidden = name !== 'fresh';
  $('categoryLabel').hidden = name !== 'full';
  $('searchModeLabel').hidden = name !== 'full';
  $('primaryFilters').classList.toggle('full-filters', name === 'full');
  $('fullSearchNote').hidden = name !== 'full';
  $('quick').hidden = name !== 'fresh';
  $('navMore').classList.toggle('active', ['full', 'exempt', 'sources', 'guide'].includes(name));
  $('navMoreItems').classList.toggle('open', false);
  renderTitles();
  ['search', 'pesticide', 'kind', 'category'].forEach((id) => ($(id).value = ''));
  if (db) {
    filter();
    if (name === 'exempt') renderExempt();
    if (name === 'banned') renderBanned();
    if (name === 'sources') renderAnnex();
    if (name === 'access' && typeof MarketAccess !== 'undefined') MarketAccess.refresh();
  }
}
let detailKey = null;
function details(k) {
  const r = filtered.find((x) => key(x) === k) || fromKey(k);
  if (!r) return;
  detailKey = k;
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
  const isSaved = saved.has(k);
  const head = `<span class="tag">GB 2763-2026 · § 4.${r.table} · ${r.kind}</span><h2 id="detailTitle">${esc(c ? cropName(c) : foodName(r))}</h2><h3>${esc(pestName(p))}</h3><p lang="${isZh ? 'en' : 'zh'}">${esc(isZh ? pestAlt(p) : r.food + ' · ' + p.zh)}</p><div class="limit"><strong>${r.mrl}${r.provisional ? '*' : ''}</strong> mg/kg ${esc(r.qualifier)}</div>${r.provisional ? `<p class="warn">${t('* Provisional limit (临时限量). This is not an analytical detection-limit marker.')}</p>` : ''}${r.conflict ? `<p class="warn">${t('More than one equally specific match has a different limit. Resolve applicability against the source before comparison.')}</p>` : ''}${note}<button type="button" class="detail-save ${isSaved ? 'saved' : ''}" data-save="${esc(k)}" aria-pressed="${isSaved}">${t(isSaved ? '★ Saved' : '☆ Save this limit')}</button>`;
  const compare = `<div class="compare-box"><h3>${t('Compare a laboratory result')}</h3><label for="labMode">${t('Report type')}</label><select id="labMode"><option value="number">${t('Quantified result')}</option><option value="nd">${t('Non-detect / below reporting limit')}</option></select><label for="lab" id="labLabel">${t('Result in mg/kg (ppm by mass)')}</label><input id="lab" type="number" inputmode="decimal" min="0" step="any" placeholder="${t('e.g. 0.015')}"><div id="comparison" role="status">${t('Enter a result to compare.')}</div><p>${t('Arithmetic only. The analyte definition, sample preparation, uncertainty, product form and market access must be assessed separately.')}</p></div>`;
  const source = `<details class="section" open><summary>${t('Applicability and source')}</summary><dl><dt>${t('Original food scope')}</dt><dd>${esc(r.food)}${isZh ? '' : '<br>' + esc(r.foodEn)}</dd><dt>${t('Source category')}</dt><dd>${esc(r.categoryScope || r.category)}</dd><dt>${t('Application')}</dt><dd>${application}</dd><dt>${t('Residue definition')}</dt><dd>${residue}</dd><dt>${t('Effective from')}</dt><dd>${esc(longDate(db.meta.effective))}</dd><dt>${t('Source location')}</dt><dd>${t('Table {table} · PDF page {page} · printed page {printed}', { table: r.table, page: r.page, printed: r.page - (db.meta.printedPageOffset ?? 16) })}</dd>${c ? `<dt>${t('Sampling portion')}</dt><dd>${esc(partText(c))}<br><a href="standard.pdf#page=${c.annexPage}" target="_blank" rel="noopener">${t('Annex A · PDF p. {n} ↗', { n: c.annexPage })}</a></dd>` : ''}</dl><a href="standard.pdf#page=${r.page}" target="_blank" rel="noopener">${t('Open the exact source page ↗')}</a></details>`;
  // Use status in China is separate information: one line at the end, pointing to its own section.
  const use = useNote(p)
    ? `<p class="use-line">${t('{status}. This is a rule on use inside China; the limit above still applies to imports.', { status: esc(useNote(p)) })} <button type="button" class="link" data-tab="banned">${t('See the banned list')}</button></p>`
    : '';
  const methods = `<details class="section"><summary>${t('Testing methods')}</summary>${methodsHtml(p, r, c)}${p.method ? `<details><summary>${t('Source testing-method text (Chinese)')}</summary><p lang="zh" class="technical">${esc(p.method)}</p></details>` : ''}</details>`;
  // The limit and the comparison come first; source detail and methods fold away below.
  $('detailContent').innerHTML =
    head +
    compare +
    source +
    methods +
    use +
    `<p>${t('Chinese source wording controls. Combined residue definitions may include metabolites or multiple active substances.')}</p>`;
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
  showDetail(k);
}
// Wide screens: a side panel that leaves the table usable. Otherwise a modal dialog.
// Must match the side-panel media query in style.css.
const PANEL_QUERY = '(min-width: 1400px)';
function showDetail(k) {
  const d = $('detail');
  document.querySelectorAll('tbody tr.selected').forEach((tr) => tr.classList.remove('selected'));
  document
    .querySelectorAll('tbody tr[data-key]')
    .forEach((tr) => tr.dataset.key === k && tr.classList.add('selected'));
  if (d.open) return;
  const wide = typeof matchMedia === 'function' && matchMedia(PANEL_QUERY).matches;
  if (wide && d.show) {
    d.show();
    document.body?.classList.add('panel-open');
  } else d.showModal();
}
$('detail').addEventListener('close', () => {
  detailKey = null;
  document.body?.classList.remove('panel-open');
  document.querySelectorAll('tbody tr.selected').forEach((tr) => tr.classList.remove('selected'));
});
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
    : t('None designated for this food category');
}
// Testing methods by clause; the clause naming this row's commodity, else its category, is marked.
function methodsHtml(p, r, c) {
  if (!p.methods?.length)
    return `<p class="technical">${t('The standard designates no testing method for this section: all of its limits are provisional (临时限量). Agree the method with your laboratory, for example an applicable GB 23200 multi-residue method.')}</p>`;
  const { rows, best } = methodMatches(p, r, c),
    none = rows.some((x) => x.l === best)
      ? ''
      : `<p class="technical">${t('The standard designates no testing method for this food category. The methods it gives for other categories are listed below; agree the method with your laboratory.')}</p>`;
  return `${none}<ul class="methods">${rows.map(({ m, l }) => `<li class="${l === best ? 'match' : ''}"><strong>${esc(isZh ? m.categories.join('、') : m.categoriesEn.join(', '))}</strong> — ${m.standards.map(esc).join(', ')} <small>${t(m.basis === 'reference' ? 'method by reference (参照)' : 'specified method (按照)')}${l === best ? t(' · applies to this entry') : ''}</small></li>`).join('')}</ul>`;
}
// Use status in China for a section of the standard: banned outright, or banned on certain crops.
let useStatus = new Map();
// Number of limit rows per section of the standard, counted once when the data loads.
const limitCount = new Map();
function useNote(p) {
  const s = useStatus.get(p.id);
  if (!s) return '';
  return s.scope
    ? t('Banned for use in China on: {scope}', { scope: isZh ? s.scopeZh : s.scope })
    : t('Banned for use in China');
}
function renderBanned() {
  if (!db?.banned) return;
  const q = typed($('bannedSearch').value),
    hit = (x) => !q || normalized([x.zh, x.en, x.scope, x.scopeZh].join(' ')).includes(q),
    limits = (x) => x.sections.reduce((n, id) => n + (limitCount.get(id) || 0), 0),
    name = (x) =>
      `<div><strong>${esc(isZh ? x.zh : x.en)}</strong><small lang="${altLang}">${esc(isZh ? x.en : x.zh)}</small>${x.scope ? `<small class="warn">${t('Banned on: {scope}', { scope: esc(isZh ? x.scopeZh : x.scope) })}</small>` : ''}</div>`,
    link = (x) =>
      x.sections.length
        ? `<button type="button" data-pesticide="${x.sections[0]}">${t('{n} limits in the standard', { n: limits(x) })}</button>`
        : `<small>${t('No limit in the standard')}</small>`,
    none = `<p>${t('No match in this list. A pesticide that is not listed here is not thereby permitted.')}</p>`;
  const banned = db.banned.items.filter(hit),
    restricted = db.banned.restricted.filter(hit);
  $('bannedHeading').textContent = t('Banned outright · {n} pesticides', { n: db.banned.items.length });
  $('bannedRows').innerHTML = banned.length
    ? banned
        .map(
          (x) =>
            `<div class="exempt-row"><span>${String(x.n).padStart(2, '0')}</span>${name(x)}${link(x)}</div>`
        )
        .join('')
    : none;
  $('restrictedRows').innerHTML = restricted.length
    ? restricted.map((x) => `<div class="exempt-row"><span>◐</span>${name(x)}${link(x)}</div>`).join('')
    : none;
  const src = db.banned.source,
    old = db.banned.restrictedSource;
  $('bannedSource').innerHTML =
    `${t('Banned list')}: <a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(isZh ? src.titleZh : src.title)} ↗</a> · ${esc(longDate(src.date))} · ${esc(isZh ? src.publisherZh : src.publisher)}. ${t('Crop-specific bans')}: <a href="${esc(old.url)}" target="_blank" rel="noopener">${esc(isZh ? old.titleZh : old.title)} ↗</a>. ${t('Checked {date}. Names in English are aids; the Chinese names control. Confirm against the ministry’s current notices before relying on this list.', { date: esc(longDate(src.reviewed)) })}`;
}
function renderExempt() {
  if (!db) return;
  const q = typed($('exemptSearch').value),
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
$('bannedSearch').addEventListener('input', renderBanned);
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
$('print').onclick = printSheet;
// A compact sheet of every limit in the current view (not just the visible page), for a lab or packhouse.
function printSheet() {
  const crop = fullCrop || (tab === 'fresh' ? cropMap.get($('crop').value) : null),
    limit = 600,
    rows = filtered.slice(0, limit),
    origin = $('originSelector').selectedOptions?.[0]?.textContent || '',
    access =
      crop && isFresh(crop) && typeof MarketAccess !== 'undefined' ? MarketAccess.cropStatus(crop.id) : null;
  const items = rows
    .map((r, i) => {
      const p = pestMap.get(r.pesticideId),
        c = cropMap.get(r.cropId),
        head =
          i === bannedFrom
            ? `<div class="sheet-group">${t('Pesticides banned for use in China · {n} limits', { n: (filtered.length - bannedFrom).toLocaleString() })}</div>`
            : '';
      return `${head}<div class="sheet-row"><div><strong>${esc(pestName(p))}</strong> <span lang="${altLang}">${esc(pestAlt(p))}</span>${crop ? '' : `<br><em>${esc(c ? cropName(c) : foodName(r))}</em>`}<small>${esc(methodText(p, r, c))}${r.match === 'group' ? ' · ' + esc(r.food) : ''}</small></div><b>${r.mrl}${r.provisional ? '*' : ''}${r.kind === 'EMRL' ? ' <i>EMRL</i>' : ''}</b></div>`;
    })
    .join('');
  $('printSheet').innerHTML =
    `<h1>${esc(crop ? cropPair(crop) : t(titles[tab][1]))}</h1><p class="sheet-meta">${t('Pesticide residue limits for China · {standard} · effective {date}', { standard: esc(db.meta.standard), date: esc(longDate(db.meta.effective)) })}${crop ? ' · ' + t('Part to be tested: {part}', { part: esc(partText(crop)) }) : ''}</p>${access && origin ? `<p class="sheet-meta">${esc(origin)}: ${t(access.marketAccess === 'approved' ? 'approved market access · conditions apply' : { conditional: 'access documented · conditions apply', restricted: 'restriction documented', unverified: 'market access not verified' }[access.status])}</p>` : ''}<p class="sheet-head"><span>${t('Pesticide · testing method')}</span><span>${t('Limit mg/kg')}</span></p><div class="sheet-rows">${items}</div><p class="sheet-note">${t('{shown} of {total} limits in this view.', { shown: rows.length, total: filtered.length })} ${t('* Provisional limit. Reference only: check the Chinese standard, the residue definition and market access before shipment. Data reviewed {date}.', { date: esc(db.meta.checked) })}</p>`;
  $('printSheet').hidden = false;
  // Phones and the installed app show the sheet on screen first: printing is not always available there.
  const onScreen =
    typeof matchMedia === 'function' &&
    (matchMedia('(max-width: 760px)').matches || matchMedia('(display-mode: standalone)').matches);
  if (onScreen && $('sheetDialog').showModal) {
    $('sheetView').innerHTML = $('printSheet').innerHTML;
    if (!$('sheetDialog').open) $('sheetDialog').showModal();
  } else window.print();
}
$('sheetPrint').onclick = () => window.print();
function syncSort() {
  document.querySelectorAll('th button.sort').forEach((b) => {
    const on = b.dataset.sort === sortBy.col;
    b.dataset.dir = on ? sortBy.dir : '';
    b.parentElement.setAttribute(
      'aria-sort',
      on ? (sortBy.dir === 'desc' ? 'descending' : 'ascending') : 'none'
    );
  });
  $('sortSelect').value = sortBy.col ? sortBy.col + ':' + sortBy.dir : '';
}
$('sortSelect').addEventListener('change', () => {
  const [col, dir] = $('sortSelect').value.split(':');
  sortBy = { col: col || '', dir: dir || 'asc' };
  filter();
});

// Crop picker: a text box over the hidden #crop select. Matches Chinese, English, aliases, pinyin and initials.
const combo = {
  input: $('cropSearch'),
  list: $('cropOptions'),
  clear: $('cropClear'),
  items: [],
  active: -1
};
function cropMatches(q) {
  const crops = freshCrops.slice().sort(byName(cropName));
  if (!q) return crops;
  const rank = (c) => {
    const names = cropNames(c).map(normalized);
    if (names.some((n) => n === q) || c.py === q) return 0;
    if (names.some((n) => n.startsWith(q)) || (c.py || '').startsWith(q) || c.pyi === q) return 1;
    if (
      [c.en, ...(c.aliases || [])].some((n) =>
        n
          .toLowerCase()
          .split(/[\s-]+/)
          .some((w) => w.startsWith(q))
      )
    )
      return 2;
    if ((c.pyi || '').startsWith(q)) return 3;
    // Loose 'contains' matches only once the query is long enough to mean something.
    if (
      (q.length >= 3 || /[一-鿿]/.test(q)) &&
      (names.some((n) => n.includes(q)) || (c.py || '').includes(q))
    )
      return 4;
    return -1;
  };
  return crops
    .map((c) => [rank(c), c])
    .filter(([r]) => r >= 0)
    .sort((a, b) => a[0] - b[0])
    .map(([, c]) => c);
}
function syncCropInput() {
  const c = cropMap.get($('crop').value);
  if (document.activeElement !== combo.input) combo.input.value = c ? cropName(c) : '';
  combo.clear.hidden = !c;
}
function closeCropList() {
  combo.list.hidden = true;
  combo.active = -1;
  combo.input.setAttribute?.('aria-expanded', 'false');
  combo.input.removeAttribute?.('aria-activedescendant');
}
function openCropList() {
  if (!db) return;
  const selected = cropMap.get($('crop').value),
    entered = typed(combo.input.value),
    q = selected && entered === normalized(cropName(selected)) ? '' : entered;
  combo.items = cropMatches(q);
  if (q && combo.active < 0) combo.active = 0;
  combo.active = Math.min(combo.active, combo.items.length - 1);
  combo.list.innerHTML = combo.items.length
    ? combo.items
        .map((c, i) => {
          const access = typeof MarketAccess !== 'undefined' ? MarketAccess.cropStatus(c.id) : null;
          return `<li role="option" id="cropOption${i}" data-crop-option="${esc(c.id)}" aria-selected="${i === combo.active}"><span>${esc(cropName(c))} <small lang="${altLang}">${esc(cropAlt(c))}</small></span>${access && access.status !== 'unverified' ? `<em>${t(access.status === 'restricted' ? 'Restriction documented' : 'Access documented')}</em>` : ''}</li>`;
        })
        .join('')
    : `<li class="none" role="option" aria-disabled="true">${t('No fresh crop matches. Try another name, or search the Entire standard.')}</li>`;
  combo.list.hidden = false;
  combo.input.setAttribute?.('aria-expanded', 'true');
  if (combo.active >= 0) {
    combo.input.setAttribute?.('aria-activedescendant', 'cropOption' + combo.active);
    document.getElementById('cropOption' + combo.active)?.scrollIntoView?.({ block: 'nearest' });
  } else combo.input.removeAttribute?.('aria-activedescendant');
}
function chooseCrop(id) {
  combo.pressing = false;
  $('crop').value = id;
  closeCropList();
  combo.input.blur?.();
  filter();
}
combo.input.addEventListener('input', () => {
  combo.active = -1;
  openCropList();
});
combo.input.addEventListener('focus', () => {
  combo.input.select?.();
  openCropList();
});
// On touch devices the box loses focus before the tap on an option is delivered, so the list must not
// close on blur while an option is being pressed. It closes on a choice, Escape, or a press elsewhere.
combo.input.addEventListener('blur', () => {
  if (combo.pressing) return;
  // Leaving the box with one clear answer typed (keyboard "Done") selects it.
  const entered = typed(combo.input.value),
    selected = cropMap.get($('crop').value);
  if (entered && !(selected && entered === normalized(cropName(selected)))) {
    const matches = cropMatches(entered),
      exact = matches.filter((c) => [...cropNames(c), c.py].some((n) => normalized(n) === entered));
    if (matches.length === 1 || exact.length === 1) return chooseCrop((exact[0] || matches[0]).id);
  }
  closeCropList();
  syncCropInput();
});
combo.input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (combo.list.hidden) openCropList();
    const n = combo.items.length;
    if (n) combo.active = (combo.active + (e.key === 'ArrowDown' ? 1 : -1) + n) % n;
    openCropList();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    // Only a highlighted option is chosen; Enter on an untouched box just closes the list.
    const c = combo.items[combo.active];
    if (!combo.list.hidden && c) chooseCrop(c.id);
    else {
      closeCropList();
      syncCropInput();
    }
  } else if (e.key === 'Escape' && !combo.list.hidden) {
    e.stopPropagation();
    closeCropList();
    syncCropInput();
    combo.input.select?.();
  }
});
for (const type of ['pointerdown', 'touchstart'])
  combo.list.addEventListener(type, () => (combo.pressing = true), { passive: true });
// A press that ends without a choice (scrolling the list) releases the flag once any tap has had time to arrive.
for (const type of ['pointerup', 'pointercancel', 'touchend', 'touchcancel'])
  combo.list.addEventListener(type, () => setTimeout(() => (combo.pressing = false), 500), { passive: true });
// With a mouse, keep focus in the box while an option is pressed.
combo.list.addEventListener('mousedown', (e) => e.preventDefault());
combo.list.addEventListener('click', (e) => {
  combo.pressing = false;
  const option = e.target.closest('[data-crop-option]');
  if (option) chooseCrop(option.dataset.cropOption);
});
// A press anywhere outside the picker ends it (the list may be open without focus after scrolling it).
for (const type of ['pointerdown', 'touchstart'])
  document.addEventListener(
    type,
    (e) => {
      if (e.target.closest?.('.combo')) return;
      combo.pressing = false;
      if (!combo.list.hidden) {
        closeCropList();
        syncCropInput();
      }
    },
    { passive: true }
  );
combo.clear.addEventListener('click', () => {
  chooseCrop('');
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b || b.id !== 'navMore') $('navMoreItems').classList.toggle('open', false);
  if (!b) {
    // Tapping anywhere on a result opens its details, unless text is being selected.
    const row = e.target.closest('tr[data-key]');
    if (row && !e.target.closest('a,input,select') && !String(globalThis.getSelection?.() ?? ''))
      details(row.dataset.key);
    return;
  }
  if (b.id === 'navMore') {
    b.setAttribute('aria-expanded', String($('navMoreItems').classList.toggle('open')));
    return;
  }
  if (b.dataset.sort) {
    const same = sortBy.col === b.dataset.sort;
    sortBy =
      same && sortBy.dir === 'desc'
        ? { col: '', dir: 'asc' }
        : { col: b.dataset.sort, dir: same ? 'desc' : 'asc' };
    filter();
    return;
  }
  if (b.dataset.accessView && typeof MarketAccess !== 'undefined') {
    setTab('access');
    MarketAccess.show(b.dataset.accessView);
    return;
  }
  if (b.dataset.pesticide) {
    setTab('full');
    ensureOptions('pesticide');
    $('pesticide').value = b.dataset.pesticide;
    filter();
    return;
  }
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
    if (b.closest?.('#detail')) {
      const on = saved.has(k);
      b.textContent = t(on ? '★ Saved' : '☆ Save this limit');
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('saved', on);
    }
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('detail').open) $('detail').close();
  if (
    e.key === '/' &&
    !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName) &&
    !$('detail').open
  ) {
    e.preventDefault();
    if (!['fresh', 'full', 'saved'].includes(tab)) setTab('fresh');
    $('search').focus();
  }
});
// Select lists and other text that carries names in the interface language.
// Each list is built once per language as markup and reused: rebuilding 568 pesticide options element by
// element on every language change is what made the switch slow on phones.
const optionMarkup = {};
const optionLists = {
  crop: () => [
    'All original fresh-produce entries',
    freshCrops
      .slice()
      .sort(byName(cropName))
      .map((c) => [c.id, cropPair(c)])
  ],
  pesticide: () => [
    'All pesticides',
    db.pesticides
      .slice()
      .sort(byName(pestName))
      .map((p) => [p.id, pesticideLabel(p)])
  ],
  category: () => ['All food categories', Object.keys(db.categories).map((zh) => [zh, categoryLabel(zh)])]
};
const pesticideLabel = (p) => `${pestName(p)} · ${pestAlt(p)}`,
  categoryLabel = (zh) => (isZh ? zh : `${catName(zh)} · ${zh}`),
  optionTag = (value, label) => `<option value="${esc(value)}">${esc(label)}</option>`;
function listMarkup(id) {
  const cache = (optionMarkup[I.lang] ??= {});
  if (!cache[id]) {
    const [first, entries] = optionLists[id]();
    cache[id] = optionTag('', t(first)) + entries.map(([v, label]) => optionTag(v, label)).join('');
  }
  return cache[id];
}
// Lists whose full contents are out of date. After a language change a list keeps only what it shows (its
// first option and the selected one); the rest is rebuilt when the list is opened or set by the app.
const staleSelects = new Set(),
  firstOption = { pesticide: 'All pesticides', category: 'All food categories' };
function fillOptions(lazy) {
  for (const id of Object.keys(optionLists)) {
    const select = $(id),
      value = select.value;
    // The crop list is hidden (the picker draws its own); it only needs its values, so it is built once.
    if (id === 'crop') {
      if (cropListBuilt) continue;
      cropListBuilt = true;
    } else if (lazy) {
      const label =
        value && (id === 'pesticide' ? pesticideLabel(pestMap.get(Number(value))) : categoryLabel(value));
      select.innerHTML = optionTag('', t(firstOption[id])) + (value ? optionTag(value, label) : '');
      select.value = value;
      staleSelects.add(id);
      continue;
    }
    staleSelects.delete(id);
    select.innerHTML = listMarkup(id);
    select.value = value;
  }
}
function ensureOptions(id) {
  if (!staleSelects.delete(id)) return;
  const select = $(id),
    value = select.value;
  select.innerHTML = listMarkup(id);
  select.value = value;
}
for (const id of ['pesticide', 'category'])
  for (const type of ['pointerdown', 'touchstart', 'mousedown', 'focus', 'keydown'])
    $(id).addEventListener(type, () => ensureOptions(id), { passive: true });
let cropListBuilt = false;
function renderAnnex() {
  $('annexText').innerHTML = db.annex
    .map((a) => `<h4>${t('PDF page {n}', { n: a.page })}</h4><pre lang="zh">${esc(a.text)}</pre>`)
    .join('');
}
// Redraws everything this script rendered, in the current language, keeping filters, page and open detail.
function relabel() {
  isZh = I.lang === 'zh';
  isMs = I.lang === 'ms';
  altLang = isZh ? 'en' : 'zh';
  renderTitles();
  if (!db) return;
  const at = page,
    open = $('detail').open ? detailKey : null;
  if ($('sheetDialog').open) $('sheetDialog').close?.();
  closeCropList();
  fillOptions(true);
  nextPage = at;
  filter();
  // Views that are not on screen are redrawn when they are next opened (setTab).
  if (tab === 'sources') renderAnnex();
  if (tab === 'exempt') renderExempt();
  if (tab === 'banned') renderBanned();
  if (open) details(open);
}
I.onChange?.(relabel);
fetch('database.json')
  .then((r) => {
    if (!r.ok) throw Error('Data request failed');
    return r.json();
  })
  .then((d) => {
    db = d;
    for (let i = 0; i + 1 < (d.t2s || '').length; i += 2) t2s.set(d.t2s[i], d.t2s[i + 1]);
    if (typeof MarketAccess !== 'undefined') MarketAccess.simplified = simplified;
    for (const r of d.rows) limitCount.set(r.pesticideId, (limitCount.get(r.pesticideId) || 0) + 1);
    for (const x of d.banned?.items || []) for (const id of x.sections) useStatus.set(id, {});
    for (const x of d.banned?.restricted || [])
      for (const id of x.sections) useStatus.set(id, { scope: x.scope, scopeZh: x.scopeZh });
    pestMap = new Map(d.pesticides.map((p) => [p.id, p]));
    cropMap = new Map(d.crops.map((c) => [c.id, c]));
    freshCrops = d.crops.filter((c) => isFresh(c));
    rowMap = new Map(d.rows.map((r) => [r.id, r]));
    d.crops.forEach((c) => MRL.membership(c).forEach((n) => knownNames.add(n)));
    fillOptions();
    $('crop').value = '榴莲';
    renderAnnex();
    filter();
    renderExempt();
    migrateSaved();
    if (typeof MarketAccess !== 'undefined')
      MarketAccess.init(
        freshCrops,
        // Changing the origin keeps the current tab; the checker follows the crop being viewed.
        () => (tab === 'fresh' ? $('crop').value : null),
        () => {
          if (tab === 'fresh') renderCrop();
        }
      ).then(() => MarketAccess.sync($('crop').value));
  })
  .catch((e) => {
    $('loadError').hidden = false;
    $('loadError').dataset.i18nKey =
      'The reference database could not load. Please reload the page; no regulatory conclusion can be drawn from this error.';
    $('loadError').textContent = t($('loadError').dataset.i18nKey);
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
