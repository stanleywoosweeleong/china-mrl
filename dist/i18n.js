/* Interface language. English text is the key; zh.js supplies Simplified Chinese (I18N_ZH).
   The choice is stored, can be forced with ?lang=zh or ?lang=en, and otherwise follows the browser. */
(function (root) {
  const ZH = root.I18N_ZH || (typeof require !== 'undefined' ? require('./zh.js') : {});
  const hasDom = typeof document !== 'undefined';
  function pick() {
    try {
      const forced = new URLSearchParams(root.location.search).get('lang');
      if (forced === 'zh' || forced === 'en') {
        try {
          root.localStorage.setItem('china-mrl-lang', forced);
        } catch {}
        return forced;
      }
    } catch {}
    try {
      const stored = root.localStorage.getItem('china-mrl-lang');
      if (stored === 'zh' || stored === 'en') return stored;
    } catch {}
    try {
      const prefs = root.navigator.languages || [root.navigator.language];
      if (/^zh\b/i.test(prefs[0] || '')) return 'zh';
    } catch {}
    return 'en';
  }
  const lang = hasDom ? pick() : 'en';
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));
  function translate(s, to) {
    return to === 'zh' && Object.prototype.hasOwnProperty.call(ZH, s) ? ZH[s] : s;
  }
  const t = (s, vars) => fill(translate(s, lang), vars);
  const collapse = (s) => s.replace(/\s+/g, ' ').trim();
  // Static page text: each text node and translatable attribute is looked up by its English wording.
  function translateDom(scope) {
    if (lang !== 'zh') return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement.closest('script,style,pre,[lang="zh"]')) continue;
      const key = collapse(node.nodeValue);
      if (key && Object.prototype.hasOwnProperty.call(ZH, key))
        node.nodeValue = node.nodeValue.replace(
          /^(\s*)[\s\S]*?(\s*)$/,
          (m, a, b) => (a ? ' ' : '') + ZH[key] + (b ? ' ' : '')
        );
    }
    for (const el of scope.querySelectorAll('[placeholder],[aria-label]'))
      for (const attr of ['placeholder', 'aria-label']) {
        const v = el.getAttribute(attr);
        if (v && Object.prototype.hasOwnProperty.call(ZH, v)) el.setAttribute(attr, ZH[v]);
      }
  }
  function setLang(next) {
    try {
      root.localStorage.setItem('china-mrl-lang', next);
    } catch {}
    const url = new URL(root.location.href);
    url.searchParams.delete('lang');
    // A full reload keeps every rendered string consistent; saved references and the origin persist.
    root.location.replace(url.href);
    if (url.href === root.location.href) root.location.reload();
  }
  if (hasDom) {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.documentElement.dataset.lang = lang;
    if (lang === 'zh') {
      document.title = translate(document.title, 'zh');
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = translate(description.content, 'zh');
      translateDom(document.body);
    }
    const toggle = document.getElementById('langToggle');
    if (toggle) {
      // The button always names the other language in that language.
      toggle.textContent = lang === 'zh' ? 'English' : '中文';
      toggle.lang = lang === 'zh' ? 'en' : 'zh-Hans';
      toggle.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
      toggle.addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));
    }
  }
  const api = { lang, t, translate, collapse, setLang };
  if (typeof module !== 'undefined') module.exports = api;
  else root.I18n = api;
})(typeof window !== 'undefined' ? window : globalThis);
