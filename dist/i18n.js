/* Interface language. English text is the key; zh.js and ms.js supply Simplified Chinese and Bahasa Melayu.
   The choice is stored, can be forced with ?lang=zh or ?lang=en, and otherwise follows the browser.
   Switching is applied in place: static text is swapped here, and each script re-renders what it drew
   through onChange. Nothing is reloaded. */
(function (root) {
  const load = (name, file) => root[name] || (typeof require !== 'undefined' ? require(file) : {});
  // One dictionary per language other than English.
  const DICTS = { zh: load('I18N_ZH', './zh.js'), ms: load('I18N_MS', './ms.js') };
  const LANGS = ['en', 'zh', 'ms'],
    LABELS = { en: 'EN', zh: '中文', ms: 'BM' };
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
      // Nothing chosen yet (and the choice can be kept): the welcome screen asks.
      firstVisit = true;
    } catch {}
    try {
      const prefs = root.navigator.languages || [root.navigator.language];
      if (/^zh\b/i.test(prefs[0] || '')) return 'zh';
      if (/^ms\b/i.test(prefs[0] || '')) return 'ms';
    } catch {}
    return 'en';
  }
  let firstVisit = false;
  let lang = hasDom ? pick() : 'en';
  const listeners = [];
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));
  const translate = (s, to) => (DICTS[to] && own(DICTS[to], s) ? DICTS[to][s] : s);
  const t = (s, vars) => fill(translate(s, lang), vars);
  const collapse = (s) => s.replace(/\s+/g, ' ').trim();

  // Static page text. This script runs before the others, while the page holds only its own markup, so
  // the translatable text nodes and attributes are collected once here. Switching language then touches
  // just these, not everything the scripts have rendered since.
  const texts = [],
    attrs = [],
    headOriginals = {};
  function collectStatics(scope) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode,
        key = collapse(node.nodeValue);
      if (!key || !has(key) || node.parentElement.closest('script,style,pre,[lang="zh"],[data-keep]'))
        continue;
      texts.push({ node, english: node.nodeValue, key });
    }
    for (const el of scope.querySelectorAll('[placeholder],[aria-label]'))
      for (const attr of ['placeholder', 'aria-label']) {
        const english = el.getAttribute(attr);
        if (english && has(english)) attrs.push({ el, attr, english });
      }
  }
  function applyDom(scope) {
    const dict = DICTS[lang];
    for (const { node, english, key } of texts) {
      // A node a script has since replaced is redrawn by that script.
      if (!node.isConnected) continue;
      node.nodeValue =
        dict && own(dict, key)
          ? (/^\s/.test(english) ? ' ' : '') + dict[key] + (/\s$/.test(english) ? ' ' : '')
          : english;
    }
    for (const { el, attr, english } of attrs) el.setAttribute(attr, translate(english, lang));
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
    for (const id of ['langButton', 'welcomePill']) {
      const label = document.getElementById(id);
      if (label) label.textContent = LABELS[lang];
    }
    for (const item of document.querySelectorAll?.('#langMenu [data-lang]') || [])
      item.setAttribute('aria-current', String(item.dataset.lang === lang));
    for (const item of document.querySelectorAll?.('[data-welcome-lang]') || [])
      item.setAttribute('aria-checked', String(item.dataset.welcomeLang === lang));
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
    // The switch itself updates at once; the page text follows on the next frame, so a phone can close
    // its picker and show the new choice before the heavier redraw starts.
    applyChrome();
    if (pending) return;
    pending = true;
    const redraw = () => {
      pending = false;
      applyDom(document.body);
      for (const fn of listeners) {
        try {
          fn(lang);
        } catch (e) {
          console.error(e);
        }
      }
      document.documentElement.dataset.langReady = lang;
    };
    if (typeof root.requestAnimationFrame === 'function')
      root.requestAnimationFrame(() => setTimeout(redraw, 0));
    else redraw();
  }
  let pending = false;
  if (hasDom) {
    collectStatics(document.body);
    applyChrome();
    if (lang !== 'en') applyDom(document.body);
    document.documentElement.classList.remove('i18n-pending');
    // Tells tests (and anything else) which language the page text currently shows.
    document.documentElement.dataset.langReady = lang;
    // The switch shows the active language; tapping it lists all three. It is a menu drawn by the page
    // rather than a system picker, which on phones animates shut before the choice is reported.
    const button = document.getElementById('langButton'),
      menu = document.getElementById('langMenu');
    if (button && menu) {
      const show = (open) => {
        menu.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
      };
      button.addEventListener('click', () => {
        show(menu.hidden);
        if (!menu.hidden) menu.querySelector('[aria-current="true"]')?.focus();
      });
      menu.addEventListener('click', (e) => {
        const item = e.target.closest('[data-lang]');
        if (!item) return;
        show(false);
        button.focus();
        setLang(item.dataset.lang);
      });
      document.addEventListener('pointerdown', (e) => {
        if (!menu.hidden && !e.target.closest('.lang-switch')) show(false);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || menu.hidden) return;
        show(false);
        button.focus();
      });
    }
  }
  // First visit: a welcome screen offers the languages by their own names, with the device's language
  // already selected. Choosing one shows the app in it at once; the switch at the top changes it later.
  if (hasDom && firstVisit) {
    const welcome = document.getElementById('welcome');
    if (welcome && typeof welcome.showModal === 'function') {
      const keep = () => {
        try {
          root.localStorage.setItem('china-mrl-lang', lang);
        } catch {}
      };
      welcome.addEventListener('click', (e) => {
        const item = e.target.closest('[data-welcome-lang]');
        if (item) setLang(item.dataset.welcomeLang);
        else if (e.target.closest('#welcomeDone')) welcome.close();
      });
      // Arrow keys move between the languages, as in any group of radio buttons.
      welcome.addEventListener('keydown', (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!step || !e.target.closest('[data-welcome-lang]')) return;
        e.preventDefault();
        const next = LANGS[(LANGS.indexOf(lang) + step + LANGS.length) % LANGS.length];
        setLang(next);
        welcome.querySelector(`[data-welcome-lang="${next}"]`).focus();
      });
      // However it is closed, the language on screen is the one kept.
      welcome.addEventListener('close', keep);
      welcome.showModal();
      // Focus rests on the screen itself, so no option carries a second outline beside the selected one.
      welcome.focus();
    }
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
