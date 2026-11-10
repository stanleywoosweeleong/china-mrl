(function (root) {
  'use strict';
  function lookup(records, origin, crop, form) {
    const matches = records.filter((r) => r.origin === origin && r.crop === crop && r.form === form);
    if (matches.length !== 1) return { status: 'unverified' };
    const r = matches[0];
    if (!['conditional', 'restricted'].includes(r.status) || !r.url || !r.reviewed)
      return { status: 'unverified' };
    return r;
  }
  function catalogue(records, crops, origin, form) {
    return crops.map((c) => ({
      ...c,
      access: origin ? lookup(records, origin, c.id, form) : { status: 'unverified' }
    }));
  }
  let currentData = null,
    currentOrigin = '';
  function cropStatus(crop) {
    return currentData && currentOrigin ? lookup(currentData.records, currentOrigin, crop, 'fresh') : null;
  }
  async function init(crops, onHeaderChange = () => {}, onOriginChange = () => {}) {
    const el = (id) => document.getElementById(id),
      escape = (s) =>
        String(s ?? '').replace(
          /[&<>"']/g,
          (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
        );
    const ids = ['accessOrigin', 'accessCrop', 'accessForm'];
    // Language helpers: I18n (i18n.js) when present; English passes through otherwise.
    const I = root.I18n || {
        lang: 'en',
        t: (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v && k in v ? v[k] : m))
      },
      t = I.t,
      isZh = I.lang === 'zh',
      altLang = isZh ? 'en' : 'zh';
    let regionNames = null;
    try {
      if (isZh) regionNames = new Intl.DisplayNames(['zh-Hans'], { type: 'region' });
    } catch {}
    const countryName = (c) => {
        try {
          const n = regionNames && regionNames.of(c.code);
          // The GACC list this data comes from names the territory 中国台湾.
          if (c.code === 'TW' && isZh) return '中国台湾';
          if (n && n !== c.code) return n;
        } catch {}
        return c.name;
      },
      cropName = (c) => (isZh ? c.zh : c.en),
      cropPair = (c) => (isZh ? c.zh + ' · ' + c.en : c.en + ' · ' + c.zh),
      byCrop = (a, b) => cropName(a).localeCompare(cropName(b), isZh ? 'zh-Hans-CN' : 'en'),
      // Record text: the Chinese field when the interface is Chinese and the record has one.
      local = (r, field) => (isZh && r[field + 'Zh']) || r[field],
      statusLabel = (access) =>
        t(
          access.marketAccess === 'approved'
            ? 'Approved market access · conditions apply'
            : labels[access.status]
        );
    const evidenceLabel = (a) =>
      a.evidenceType === 'official-guide'
        ? 'Official guide'
        : a.evidenceType === 'official-list'
          ? 'Official list'
          : a.evidenceType === 'list-translation'
            ? 'GACC list via translation'
            : 'Protocol';
    const labels = {
      conditional: 'Documented access · conditions apply',
      restricted: 'Restriction documented',
      unverified: 'Not verified'
    };
    try {
      const response = await fetch('market-access.json');
      if (!response.ok) throw Error('Protocol data unavailable');
      const data = await response.json();
      if (!Array.isArray(data.records) || !Array.isArray(data.countries))
        throw Error('Invalid protocol data');
      function option(id, value, label) {
        const o = document.createElement('option');
        o.value = value;
        o.textContent = label;
        el(id).append(o);
      }
      option(ids[0], '', t('Global · select an origin'));
      el('originSelector').innerHTML = '';
      option('originSelector', '', t('Global'));
      data.countries
        .map((c) => ({ ...c, label: countryName(c) }))
        .sort((a, b) => (isZh ? a.label.localeCompare(b.label, 'zh-Hans-CN') : 0))
        .forEach((c) => {
          option(ids[0], c.code, c.label);
          option('originSelector', c.code, c.label);
        });
      const countryOf = (code) => {
        const c = data.countries.find((c) => c.code === code);
        return c ? countryName(c) : '';
      };
      crops
        .slice()
        .sort(byCrop)
        .forEach((c) => option(ids[1], c.id, cropPair(c)));
      let storedOrigin = null;
      try {
        storedOrigin = localStorage.getItem('china-mrl-origin');
      } catch {}
      const initialOrigin =
        storedOrigin == null ? 'MY' : data.countries.some((c) => c.code === storedOrigin) ? storedOrigin : '';
      el(ids[0]).value = initialOrigin;
      el('originSelector').value = initialOrigin;
      el(ids[1]).value = '榴莲';
      el('accessCoverage').textContent =
        t(
          'Coverage: {records} documented combinations across {origins} origins. All {crops} crops can be checked; other combinations return “Not verified”.',
          {
            records: data.records.length,
            origins: new Set(data.records.map((r) => r.origin)).size,
            crops: crops.length
          }
        ) +
        ' ' +
        t(data.coverage);
      function renderCatalogue() {
        const origin = el(ids[0]).value,
          form = el(ids[2]).value;
        el('accessCatalogue').hidden = !origin;
        if (!origin) return;
        const country = countryOf(origin) || origin;
        const entries = catalogue(data.records, crops, origin, form),
          counts = { conditional: 0, restricted: 0, unverified: 0 };
        entries.forEach((c) => counts[c.access.status]++);
        el('accessCatalogueTitle').textContent = t('{country} → China · {form} produce', {
          country,
          form: t(form)
        });
        el('accessCatalogueSummary').textContent = t(
          '{documented} documented · {restricted} restrictions documented · {unverified} not verified. Partial evidence coverage; zero recorded restrictions does not establish their absence.',
          { documented: counts.conditional, restricted: counts.restricted, unverified: counts.unverified }
        );
        const q = el('accessCropSearch').value.trim().toLowerCase(),
          status = el('accessStatus').value || 'all',
          category = el('accessCategory').value;
        const rows = entries
          .filter(
            (c) =>
              (status === 'all' || c.access.status === status) &&
              (!category || category === c.category) &&
              (!q || [c.en, c.zh, ...(c.aliases || [])].join(' ').toLowerCase().includes(q))
          )
          .sort(
            (a, b) =>
              ({ conditional: 0, restricted: 1, unverified: 2 })[a.access.status] -
                { conditional: 0, restricted: 1, unverified: 2 }[b.access.status] || byCrop(a, b)
          );
        el('accessListCount').textContent = t('{n} crops shown', { n: rows.length });
        el('accessCropList').innerHTML = rows.length
          ? rows
              .map(
                (c) =>
                  `<article><div><strong>${escape(cropPair(c))}</strong><small>${escape(statusLabel(c.access))}</small>${c.access.reviewed ? `<small>${t('{evidence} · reviewed {date}', { evidence: t(evidenceLabel(c.access)), date: escape(c.access.reviewed) })}</small>` : ''}</div><div><button data-access-crop="${escape(c.id)}">${t(c.access.status === 'unverified' ? 'Review status' : 'Conditions & sources')}</button>${form === 'fresh' ? `<button data-crop="${escape(c.id)}">${t('MRL limits')}</button>` : ''}</div></article>`
              )
              .join('')
          : `<p>${t('No crops match this view. Try “All crops” or another produce type. An empty list is not a prohibition or permission.')}</p>`;
      }
      function syncFreshOptions() {
        const select = el('crop');
        if (!select?.options) return;
        for (const option of select.options) {
          const c = crops.find((c) => c.id === option.value);
          if (c)
            option.textContent =
              cropPair(c) +
              (currentOrigin ? ' — ' + statusLabel(lookup(data.records, currentOrigin, c.id, 'fresh')) : '');
        }
      }
      function render() {
        const origin = el(ids[0]).value,
          crop = el(ids[1]).value,
          form = el(ids[2]).value;
        const r = lookup(data.records, origin, crop, form),
          cropRecord = crops.find((c) => c.id === crop),
          name = cropRecord ? cropName(cropRecord) : crop,
          country = countryOf(origin) || t('Global');
        currentData = data;
        currentOrigin = origin;
        syncFreshOptions();
        renderCatalogue();
        el('originSelector').value = origin;
        const place = origin ? country : t('All origins');
        el('originBrand').textContent = origin
          ? t('{country} EXPORT REFERENCE', { country: country.toUpperCase() })
          : t('GLOBAL EXPORT REFERENCE');
        el('originRoute').textContent = t('{origin} → Mainland China', { origin: place });
        el('originEyebrow').textContent = origin
          ? t('ONE STANDARD. EXPORTING FROM {country}.', { country: country.toUpperCase() })
          : t('ONE STANDARD. A GLOBAL REFERENCE.');
        el('originFooter').textContent = t('{origin}. Source-linked limits. Clear scope.', { origin: place });
        try {
          localStorage.setItem('china-mrl-origin', origin);
        } catch {}
        let html = `<p class="tag">${t('{country} → CHINA · {form}', { country: escape(country), form: t(form) })}</p><h2>${escape(name)}</h2>`;
        if (!origin)
          html += `<h3>${t('Select an origin to check market access')}</h3><p>${t('Global is an overview without a selected country. China’s MRL reference remains available for all origins. Market-access permission must be checked for a specific country, commodity and product form.')}</p>`;
        else if (r.status === 'unverified')
          html += `<h3>${t('Not verified')}</h3><p>${t('No reviewed record for this exact combination is included here. This does not mean prohibited or permitted. Confirm with the authorities linked below before shipment.')}</p>`;
        else {
          const reviewedAt = Date.parse(r.reviewed + 'T00:00:00Z'),
            stale = !Number.isFinite(reviewedAt) || Date.now() - reviewedAt > 90 * 86400000;
          const heading =
            r.status === 'restricted'
              ? 'Restriction documented'
              : r.marketAccess === 'approved'
                ? 'Approved market access · conditions apply'
                : r.evidenceType === 'official-guide'
                  ? 'Access listed in official guide · conditions apply'
                  : r.evidenceType === 'official-list'
                    ? 'Listed in an official access list · conditions apply'
                    : r.evidenceType === 'list-translation'
                      ? 'On GACC’s permitted list, per a translation · conditions apply'
                      : 'Protocol documented · conditions apply';
          const due = !stale
            ? ''
            : ' · ' +
              t(
                Number.isFinite(reviewedAt)
                  ? 'Review due (over 90 days)'
                  : 'Review due (review date unreadable)'
              );
          html += `<h3>${t(heading)}</h3><p>${escape(local(r, 'scope'))}</p><p><strong>${t('Shipment checks:')}</strong> ${t('Confirm the required facility registrations, certificates, treatments and route before dispatch. This app does not assess or clear an individual shipment.')}</p><p>${t(r.evidenceType === 'official-guide' ? 'Guide edition' : r.evidenceType === 'official-list' ? 'List edition' : r.evidenceType === 'list-translation' ? 'Translation updated' : 'Announcement')}: ${escape(r.announced)} · ${t('Document reviewed')}: ${escape(r.reviewed)}${due}</p><h4>${t('Key source conditions (summary)')}</h4><ul>${local(
            r,
            'conditions'
          )
            .map((c) => `<li>${escape(c)}</li>`)
            .join('')}</ul>`;
          if (/^https:\/\//.test(r.url))
            html += `<p><a href="${escape(r.url)}" target="_blank" rel="noopener">${escape(local(r, 'title'))} · ${escape(local(r, 'sourceLabel') || t('GACC announcement, MOFCOM republication'))} ↗</a></p>`;
        }
        if (r.additionalSources)
          html += r.additionalSources
            .filter((s) => /^https:\/\//.test(s.url))
            .map(
              (s) =>
                `<p>${escape(local(s, 'note'))} <a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(local(s, 'title'))} ↗</a></p>`
            )
            .join('');
        html +=
          form === 'fresh'
            ? `<button data-crop="${escape(crop)}">${t('View {crop} residue limits ↗', { crop: escape(name) })}</button>`
            : `<p>${t('Fresh-product MRLs are not automatically applicable to this form.')}</p>`;
        el('accessResult').innerHTML = html;
        onOriginChange();
      }
      ['accessStatus', 'accessCategory'].forEach((id) => el(id).addEventListener('change', renderCatalogue));
      el('accessCropSearch').addEventListener('input', renderCatalogue);
      el('accessCropList').addEventListener('click', (event) => {
        const button = event.target.closest('button[data-access-crop]');
        if (!button) return;
        el(ids[1]).value = button.dataset.accessCrop;
        render();
        el('accessResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      ids.forEach((id) => {
        el(id).disabled = false;
        el(id).addEventListener('change', () => {
          el('originSelector').value = el(ids[0]).value;
          render();
        });
      });
      el('originSelector').disabled = false;
      el('originSelector').addEventListener('change', () => {
        el(ids[0]).value = el('originSelector').value;
        const crop = onHeaderChange();
        if (crops.some((c) => c.id === crop)) {
          el(ids[1]).value = crop;
          el(ids[2]).value = 'fresh';
        }
        render();
      });
      render();
    } catch (e) {
      const t = (root.I18n && root.I18n.t) || ((s) => s);
      el('accessCoverage').textContent = t('Protocol coverage unavailable.');
      el('accessResult').textContent = t(
        'The market-access data could not load. Reload to retry. No access conclusion can be drawn; use the official authorities below.'
      );
    }
  }
  const api = { lookup, catalogue, cropStatus, init };
  if (typeof module !== 'undefined') module.exports = api;
  else root.MarketAccess = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
