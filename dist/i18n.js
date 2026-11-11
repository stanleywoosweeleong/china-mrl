/* Interface language. English text is the key; zh.js and ms.js supply Simplified Chinese and Bahasa Melayu.
   The choice is stored, can be forced with ?lang=zh or ?lang=en, and otherwise follows the browser.
   Switching is applied in place: static text is swapped here, and each script re-renders what it drew
   through onChange. Nothing is reloaded. */
(function (root) {
  const load = (name, file) => root[name] || (typeof require !== 'undefined' ? require(file) : {});
  // One dictionary per language other than English.
  const DICTS = { zh: load('I18N_ZH', './zh.js'), ms: load('I18N_MS', './ms.js') };
  const LANGS = ['en', 'zh', 'ms'];
  const hasDom = typeof document !== 'undefined';
  const own = (dict, key) => Object.prototype.hasOwnProperty.call(dict, key),
    // Text is translatable when any language has it.
    has = (key) => Object.values(DICTS).some((dict) => own(dict, key));
  function pick() {
    try {
      const forced = new URLSearchParams(root.location.search).get('lang');
      if (LANGS.includes(forced)) {
        try {
          root.localStorage.setItem('china-mrl-lang', forced);
        } catch {}
        return forced;
      }
    } catch {}
    try {
      const stored = root.localStorage.getItem('china-mrl-lang');
      if (LANGS.includes(stored)) return stored;
    } catch {}
    try {
      const prefs = root.navigator.languages || [root.navigator.language];
      if (/^zh\b/i.test(prefs[0] || '')) return 'zh';
      if (/^ms\b/i.test(prefs[0] || '')) return 'ms';
    } catch {}
    return 'en';
  }
  let lang = hasDom ? pick() : 'en';
  const listeners = [];
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));
  const translate = (s, to) => (DICTS[to] && own(DICTS[to], s) ? DICTS[to][s] : s);
  const t = (s, vars) => fill(translate(s, lang), vars);
  const collapse = (s) => s.replace(/\s+/g, ' ').trim();

  // Static page text. The English wording of every translated text node and attribute is remembered,
  // so either language can be shown at any time.
  const textOriginals = new WeakMap(),
    attrOriginals = new WeakMap(),
    headOriginals = {};
  function applyDom(scope) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      let english = textOriginals.get(node);
      if (english === undefined) {
        if (node.parentElement.closest('script,style,pre,[lang="zh"]')) continue;
        if (!has(collapse(node.nodeValue))) continue;
        english = node.nodeValue;
        textOriginals.set(node, english);
      }
      const key = collapse(english);
      node.nodeValue =
        DICTS[lang] && own(DICTS[lang], key)
          ? (/^\s/.test(english) ? ' ' : '') + DICTS[lang][key] + (/\s$/.test(english) ? ' ' : '')
          : english;
    }
    for (const el of scope.querySelectorAll('[placeholder],[aria-label]')) {
      let english = attrOriginals.get(el);
      if (!english) {
        english = {};
        for (const attr of ['placeholder', 'aria-label']) {
          const v = el.getAttribute(attr);
          if (v && has(v)) english[attr] = v;
        }
        attrOriginals.set(el, english);
      }
      for (const [attr, v] of Object.entries(english)) el.setAttribute(attr, translate(v, lang));
    }
    // Text a script set from a single key (status lines) follows the language too.
    for (const el of scope.querySelectorAll('[data-i18n-key]')) el.textContent = t(el.dataset.i18nKey);
  }
  function applyChrome() {
    document.documentElement.lang = { zh: 'zh-Hans', ms: 'ms' }[lang] || 'en';
    document.documentElement.dataset.lang = lang;
    headOriginals.title ??= document.title;
    document.title = translate(headOriginals.title, lang);
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      headOriginals.description ??= description.content;
      description.content = translate(headOriginals.description, lang);
    }
    const select = document.getElementById('langSelect');
    if (select) select.value = lang;
  }
  function setLang(next) {
    if (!LANGS.includes(next)) return;
    if (next === lang) return;
    lang = next;
    try {
      root.localStorage.setItem('china-mrl-lang', next);
    } catch {}
    try {
      // A ?lang= in the address would override the stored choice on the next visit.
      const url = new URL(root.location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        root.history.replaceState(null, '', url.href);
      }
    } catch {}
    if (!hasDom) return;
    applyChrome();
    applyDom(document.body);
    for (const fn of listeners) {
      try {
        fn(lang);
      } catch (e) {
        console.error(e);
      }
    }
  }
  if (hasDom) {
    applyChrome();
    if (lang !== 'en') applyDom(document.body);
    document.documentElement.classList.remove('i18n-pending');
    // The switch shows the active language and lists the others.
    const select = document.getElementById('langSelect');
    if (select) select.addEventListener('change', () => setLang(select.value));
  }
  const api = {
    get lang() {
      return lang;
    },
    t,
    translate,
    collapse,
    setLang,
    // Scripts register here to redraw what they rendered when the language changes.
    onChange(fn) {
      listeners.push(fn);
    }
  };
  if (typeof module !== 'undefined') module.exports = api;
  else root.I18n = api;
})(typeof window !== 'undefined' ? window : globalThis);
