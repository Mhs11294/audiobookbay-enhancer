// ==UserScript==
// @name         AudiobookBay Enhancer
// @namespace    https://github.com/Mhs11294/audiobookbay-enhancer
// @version      0.2.5
// @description  Card list view, infinite scroll, category/language/format/bitrate filters, Goodreads ratings & links, Colophon-inspired themes for ABB
// @license      MIT
// @homepageURL  https://github.com/Mhs11294/audiobookbay-enhancer
// @supportURL   https://github.com/Mhs11294/audiobookbay-enhancer/issues
// @updateURL    https://raw.githubusercontent.com/Mhs11294/audiobookbay-enhancer/main/abb-enhancer.user.js
// @downloadURL  https://raw.githubusercontent.com/Mhs11294/audiobookbay-enhancer/main/abb-enhancer.user.js
// @match        https://audiobookbay.lu/*
// @match        https://*.audiobookbay.lu/*
// @match        http://audiobookbay.lu/*
// @connect      www.goodreads.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(() => {
  'use strict';

  /* =====================================================================
     1. Theme roster (Colophon palette, verbatim)
        Token order: [bg, fg, mutedFg, card, secondary, accent, accentFg,
                      border, input, ring, brand, brandSoft]
     ===================================================================== */
  const RAW = {
    /* --- dark --- */
    'rr-dark':              ['#120f0e','#ededec','#aaa39e','#1b1816','#262321','#34251a','#d9af7f','#2c2826','#393431','#79716b','#d3a46e','#402d1d'],
    'catppuccin-mocha':     ['#1e1e2e','#cdd6f4','#a6adc8','#313244','#3b3c4f','#3c3d50','#cea9fa','#585b70','#3d3e51','#cba6f7','#cba6f7','#45475a'],
    'catppuccin-macchiato': ['#24273a','#cad3f5','#a5adcb','#363a4f','#3f4459','#40445a','#d5b4ff','#5b6078','#41455c','#c6a0f6','#c6a0f6','#494d64'],
    'catppuccin-frappe':    ['#303446','#c6d0f5','#adb5d6','#414559','#494e63','#4a4f64','#c6d0f5','#626880','#4b5066','#ca9ee6','#d0a4ed','#51576d'],
    'solarized-dark':       ['#002b36','#8e9fa1','#879ea5','#073642','#133d48','#024558','#9eb0b2','#153a44','#1e4049','#268bd2','#41a1ea','#004053'],
    'nord':                 ['#2e3440','#eceff4','#d8dee9','#3b4252','#464d5c','#434c5e','#eceff4','#454b57','#505561','#88c0d0','#88c0d0','#4c566a'],
    'monokai':              ['#272822','#f8f8f2','#aaa691','#3b3a32','#47463e','#434239','#66d9ef','#40413b','#4b4c46','#66d9ef','#66d9ef','#49483e'],
    'sonokai':              ['#2c2e34','#e2e2e3','#a5aab7','#33353f','#3e4049','#363944','#76cce0','#181819','#4c4e53','#76cce0','#76cce0','#414550'],
    'ayu-dark':             ['#0d1017','#bfbdb6','#7e879e','#141821','#1c222a','#1b202a','#e6b450','#1b1f29','#262f33','#e6b450','#e6b450','#212732'],
    'ayu-mirage':           ['#1f2430','#cccac2','#929daf','#282e3b','#2f3844','#2d3443','#fc6',   '#171b24','#36444b','#fc6',   '#fc6',   '#313949'],
    'everforest-dark':      ['#2d353b','#d3c6aa','#a5b2a9','#343f44','#3b484c','#3d484d','#b4cd8c','#4f585e','#425255','#a7c080','#a7c080','#475258'],
    'iceberg':              ['#161821','#c6c8d1','#8a8fa9','#1e2132','#282b3c','#272c42','#e2e4ed','#0f1117','#343640','#84a0c6','#84a0c6','#5b6389'],
    'kanagawa-wave':        ['#1f1f28','#dcd7ba','#99988f','#2a2a37','#373341','#363646','#dcd7ba','#16161d','#453c47','#7e9cd8','#7e9cd8','#2d4f67'],
    'kanagawa-dragon':      ['#181616','#c5c9c5','#899289','#282727','#303130','#393836','#c5c9c5','#0d0c0c','#343534','#8ba4b0','#8ba4b0','#2d4f67'],
    'nightfox':             ['#192330','#cdcecf','#8e9bad','#212e3f','#2b3848','#29394f','#cdcecf','#39506d','#38414d','#719cd6','#729ed8','#3c5372'],
    'rose-pine':            ['#191724','#e0def4','#928eac','#1f1d2e','#2a283a','#26233a','#ebbcba','#524f67','#3b3948','#ebbcba','#ebbcba','#403d52'],
    'rose-pine-moon':       ['#232136','#e0def4','#9e9ab8','#2a273f','#35324a','#393552','#ed9d9a','#56526e','#444258','#ea9a97','#ea9a97','#44415a'],
    'tokyo-night':          ['#1a1b26','#c0caf5','#8b96c3','#292e42','#32384d','#283457','#c0caf5','#3b4261','#37394a','#7aa2f7','#7aa2f7','#394b70'],
    'tokyo-night-storm':    ['#24283b','#c0caf5','#949fcd','#292e42','#32384d','#2e3c64','#c0caf5','#3b4261','#40455c','#7aa2f7','#7aa2f7','#394b70'],
    'night-owl':            ['#011627','#d6deeb','#94a0b0','#0b2942','#19344d','#15334b','#82aaff','#5f7e97','#25384a','#82aaff','#82aaff','#1d3b53'],
    'github-dark':          ['#0d1117','#e6edf3','#848c98','#161b22','#22272e','#1f242c','#3b8bff','#30363d','#31363c','#2f81f7','#3889ff','#13233a'],
    'vitesse-dark':         ['#121212','#dbd7ca','#9c9991','#181818','#232322','#222',   '#599f81','#252525','#343331','#4d9375','#529879','#292929'],
    'flexoki-dark':         ['#100f0f','#cecdc3','#8a8883','#1c1b1a','#262624','#343331','#cecdc3','#282726','#2f2f2d','#4385be','#4b8dc6','#403e3c'],
    'dracula':              ['#282a36','#f8f8f2','#90a2d7','#343746','#424450','#424450','#ccabff','#191a21','#21222c','#906ce8','#bd93f9','#44475a'],
    'onedark':              ['#282c34','#abb2bf','#939aa9','#2c313a','#21252b','#323842','#6dbcfc','#181a1f','#1d1f23','#828997','#61afef','#3e4451'],
    /* --- light --- */
    'rr-light':             ['#fbfaf8','#191615','#5d554f','#fff',   '#f1f0ee','#f7eddf','#62341d','#e5e2df','#d9d5d0','#90837b','#804d35','#f2e4cf'],
    'nord-light':           ['#e5e9f0','#2e3440','#4c566a','#eceff4','#dde1e6','#e1e6ee','#2e3440','#d8dee9','#c9cdd5','#5e81ac','#40628b','#d8dee9'],
    'ayu-light':            ['#f8f9fa','#5c6166','#616c7c','#fcfcfc','#f0f0f1','#f2f2f3','#5c6166','#eaedef','#e1e2e4','#cc7a00','#9c5d00','#e8eaed'],
    'everforest-light':     ['#f4f0d9','#5b6971','#5c6b5b','#fdf6e3','#efecd9','#e6e2cc','#546169','#bdc3af','#d9dec8','#7a8c00','#5e6e00','#e0dcc7'],
    'gruvbox-light':        ['#fbf1c7','#3c3836','#716355','#f9f5d7','#ece6ca','#ebdbb2','#3c3836','#bdae93','#e1d3b0','#af3a03','#af3a03','#d5c4a1'],
    'iceberg-light':        ['#dcdfe7','#33374c','#555b73','#e8e9ec','#dadbe0','#c9cdd7','#33374c','#cad0de','#c2c5d0','#2d539e','#2d539e','#a7b2cd'],
    'kanagawa-lotus':       ['#e5ddb0','#545464','#5c5b52','#f2ecbc','#efdeb2','#e4d794','#434252','#d5cea3','#ddc3a1','#4d699b','#3f5b8b','#9fb5c9'],
    'rose-pine-dawn':       ['#faf4ed','#464261','#696582','#fffaf3','#f4ebe4','#f2e9e1','#464261','#cecacd','#e4d8d1','#c87471','#a0514e','#dfdad9'],
    'tokyo-night-day':      ['#d0d5e3','#2a51ae','#4e557a','#e1e2e7','#d5d7e4','#c4c8da','#1b409c','#a8aecb','#b8c2dd','#2272dd','#0053b3','#b3b8d1'],
    'light-owl':            ['#f6f6f6','#403f53','#696878','#fbfbfb','#ededee','#e0e7ea','#403f53','#d9d9d9','#dadade','#4876d6','#3965c4','#d3e8f8'],
    'github-light':         ['#f6f8fa','#1f2328','#626a73','#fff',   '#edeeee','#f4f6f8','#0567d8','#d0d7de','#d4d7d9','#0969da','#0064d5','#ddf4ff'],
    'vitesse-light':        ['#f7f7f7','#393a34','#696a65','#fff',   '#f0f0ef','#f1f0e9','#1c6b48','#f0f0f0','#dadad9','#1c6b48','#1c6b48','#e7e5db'],
    'flexoki-light':        ['#f2f0e5','#100f0f','#65645f','#fffcf0','#ece9de','#dad8ce','#16559c','#e6e4d9','#ceccc3','#205ea6','#205ea6','#cecdc3'],
    'one-light':            ['#fafafa','#383a42','#686b76','#fff',   '#f0f0f1','#e5e5e6','#383a42','#dbdbdc','#dcdcde','#4078f2','#2e63db','#dbdbdc'],
    'alucard':              ['#ece9df','#1f1f1f','#666046','#fffbeb','#edeadb','#ece9df','#6348c7','#bcbab3','#ccc9c1','#644ac9','#644ac9','#dedccf'],
    'latte':                ['#e6e9ef','#4c4f69','#5c5f77','#eff1f5','#dbdfe5','#dfdbed','#6d27c3','#d2d6df','#c3c7d2','#6a6e8b','#812fe6','#ccd0da'],
    'solarized':            ['#f9f2df','#38525a','#51666d','#fdf6e3','#ede8d5','#f6efdc','#015f98','#dddbcb','#cdcfc3','#547884','#0069a7','#eee8d5'],
  };
  const TOKENS = ['bg', 'fg', 'mut', 'card', 'sec', 'acc', 'accFg', 'bd', 'input', 'ring', 'brand', 'brandSoft'];
  const SCHEMES = Object.fromEntries(Object.entries(RAW).map(([k, v]) =>
    [k, Object.fromEntries(TOKENS.map((t, i) => [t, v[i]]))]));

  const LIGHT_SCHEMES = new Set([
    'rr-light', 'nord-light', 'ayu-light', 'everforest-light', 'gruvbox-light', 'iceberg-light',
    'kanagawa-lotus', 'rose-pine-dawn', 'tokyo-night-day', 'light-owl', 'github-light',
    'vitesse-light', 'flexoki-light', 'one-light', 'alucard', 'latte', 'solarized',
  ]);
  const LABEL_OVERRIDES = {
    'rr-dark': 'Default Dark', 'rr-light': 'Default Light', 'github-dark': 'GitHub Dark',
    'github-light': 'GitHub Light', 'onedark': 'One Dark', 'latte': 'Catppuccin Latte',
  };
  const DEFAULT_SCHEME = 'rr-dark';

  const schemeKind  = k => (LIGHT_SCHEMES.has(k) ? 'light' : 'dark');
  const schemeLabel = k => LABEL_OVERRIDES[k] ||
    k.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const luminance = hex => {                       // relative luminance of #rgb / #rrggbb
    const h = hex.length === 4 ? [...hex.slice(1)].map(c => c + c).join('') : hex.slice(1);
    const n = parseInt(h, 16);
    return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  };
  const schemesByKind = kind => Object.keys(SCHEMES)   // darkest → lightest within each group
    .filter(k => schemeKind(k) === kind)
    .sort((a, b) => luminance(SCHEMES[a].bg) - luminance(SCHEMES[b].bg));

  /* =====================================================================
     2. Site vocabulary
     ===================================================================== */
  // Site taxonomy — the full list from the advanced-search "exclude categories" form, A–Z.
  // [display name, URL slug under /audio-books/type/]
  const CATEGORIES = [
    ['(Post)apocalyptic', 'postapocalyptic'], ['Action', 'action'], ['Adults', 'adults'],
    ['Adventure', 'adventure'], ['Anthology', 'anthology'], ['Art', 'art'],
    ['Autobiography & Biographies', 'autobiography-biographies'], ['Bestsellers', 'bestsellers'],
    ['Business', 'business'], ['Children', 'children'], ['Classic', 'classic'],
    ['Computer', 'computer'], ['Contemporary', 'contemporary'], ['Crime', 'crime'],
    ['Detective', 'detective'], ['Doctor Who', 'doctor-who-sci-fi'], ['Documentary', 'documentary'],
    ['Education', 'education'], ['Fantasy', 'fantasy'], ['Full Cast', 'full-cast'], ['Gay', 'gay'],
    ['General Fiction', 'general-fiction'], ['Historical Fiction', 'historical-fiction'],
    ['History', 'history'], ['Horror', 'horror'], ['Humor', 'humor'], ['Lecture', 'lecture'],
    ['Lesbian', 'lesbian'], ['LGBT', 'lgbt'], ['Libertarian', 'libertarian'],
    ['Light Novel', 'light-novel'], ['Literature', 'literature'], ['LitRPG', 'litrpg'],
    ['Military', 'military'], ['Misc. Non-fiction', 'general-non-fiction'], ['Mystery', 'mystery'],
    ['Novel', 'novel'], ['Other', 'other'], ['Paranormal', 'paranormal'],
    ['Plays & Theater', 'plays-theater'], ['Poetry', 'poetry'], ['Political', 'political'],
    ['Radio Productions', 'radio-productions'], ['Romance', 'romance'], ['Sci-Fi', 'sci-fi'],
    ['Science', 'science'], ['Self-help', 'self-help'], ['Sex Scenes', 'sex-scenes'],
    ['Short Story', 'short-story'], ['Spiritual & Religious', 'spiritual'],
    ['Sport & Recreation', 'sports'], ['Suspense', 'suspense'], ['Teen & Young Adult', 'teen-young-adult'],
    ['Thriller', 'thriller'], ['True Crime', 'true-crime'], ['Tutorial', 'tutorial'],
    ['Violence', 'violence'], ['Westerns', 'westerns'], ['Zombies', 'zombies'],
  ];
  const LANGUAGES = ['english', 'dutch', 'french', 'spanish', 'german', 'portuguese'];
  const KNOWN_FORMATS = ['mp3', 'm4b', 'm4a', 'flac', 'ogg'];
  const FORMATS = [...KNOWN_FORMATS.map(f => [f, f.toUpperCase()]), ['other', 'Other']];
  const BITRATES = [ // [key, label, test(kbps)] — 0 means not stated / "??"
    ['gt128',   'above 128 kbps', k => k > 128],
    ['128',     '128 kbps',       k => k === 128],
    ['mid',     '65–127 kbps',    k => k > 64 && k < 128],
    ['64',      '64 kbps',        k => k === 64],
    ['lt64',    'below 64 kbps',  k => k > 0 && k < 64],
    ['unknown', 'unknown',        k => !k],
  ];
  const BITRATE_TEST = Object.fromEntries(BITRATES.map(([k, , t]) => [k, t]));

  const NAV_LINKS = [
    ['Login',   '/member/login',            'Login and share your audio books'],
    ['Request', '/forum/general-requests/', 'Request audio books'],
    ['Forum',   '/forum/',                  'AudioBook Bay Forum'],
    ['Donate',  '/member/donate.php',       'Donations'],
  ];

  const POST_LINK_SEL   = 'a[href*="audio-books"], .postTitle a, h2 a, h3 a';
  const FILL_TARGET     = 24;  // keep at least this many visible cards while hybrid filters are on
  const MAX_EMPTY_PAGES = 3;   // consecutive pages that add nothing before we call it the end
  const MAX_BURST_PAGES = 30;  // pages a hidden filter may auto-fetch before pausing for confirmation
  const PAGE_GAP        = 750; // ms between auto-fetched pages while filling for a hidden filter
  const COLOPHON_KEY    = kind => `colophon:scheme-${kind}`;
  const ICON_SEARCH = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="11" cy="11" r="7.5"/><path d="m20 20-4.2-4.2"/></svg>';

  /* =====================================================================
     3. Utilities
     ===================================================================== */
  const INVISIBLES = /[\u00ad\u061c\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069\ufeff]/g;
  const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(INVISIBLES, '').replace(/\s+/g, ' ').trim();
  const esc = s => (s || '').replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const abs = (href, base) => { try { return new URL(href, base).href; } catch { return href; } };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const storage = (getStore, prefix = '') => ({
    get: k => { try { return getStore().getItem(prefix + k); } catch { return null; } },
    set: (k, v) => {
      try { v ? getStore().setItem(prefix + k, v) : getStore().removeItem(prefix + k); }
      catch { /* storage unavailable */ }
    },
  });
  const local   = storage(() => localStorage);              // shared with Colophon
  const session = storage(() => sessionStorage, 'abb-hyb-'); // hybrid filters between pages
  const presetStore = storage(() => localStorage, 'abb-presets-'); // saved filter sets, survive the session
  const HYB_KEYS = ['lang', 'cat', 'catEx', 'catAll', 'date', 'local'];
  const clearHybridFilters = () => HYB_KEYS.forEach(k => session.set(k, ''));   // set('') removes the key

  // Close a popover on outside pointer or Escape.
  function dismissOnOutside(scope, close) {
    document.addEventListener('pointerdown', e => { if (!scope.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* =====================================================================
     4. Page context
     ===================================================================== */
  const isBook   = /^\/abss\//.test(location.pathname);
  const isForum  = /^\/forum(\/|$)/.test(location.pathname);
  const isSearch = new URLSearchParams(location.search).has('s');
  const urlCat   = (location.pathname.match(/^\/audio-books\/type\/([^/]+)/) || [])[1] || '';
  const urlLang  = (location.pathname.match(/^\/audio-books\/tag\/([^/]+)/)  || [])[1] || '';


  /* =====================================================================
     5. Settings & theme
     ===================================================================== */
  const SETTINGS_KEY = 'abb-settings';
  const colophonScheme = local.get(COLOPHON_KEY('dark'));
  const settings = Object.assign({
    theme: SCHEMES[colophonScheme] ? colophonScheme : DEFAULT_SCHEME,
    infinite: true,        // ∞ Scroll
    grTitles: true,        // show Goodreads' canonical titles
    sort: 'posted',        // list sort order
    blockScripts: true,    // drop third-party <script src> (ads / pop-unders)
  }, GM_getValue(SETTINGS_KEY, {}));

  // One-off migration from the v10 per-key values
  {
    let touched = false;
    const OLD = { 'abb-theme': 'theme', 'abb-infinite': 'infinite', 'abb-gr-titles': 'grTitles' };
    for (const [old, key] of Object.entries(OLD)) {
      const v = GM_getValue(old);
      if (v !== undefined) { settings[key] = v; GM_deleteValue(old); touched = true; }
    }
    if (!SCHEMES[settings.theme]) { settings.theme = DEFAULT_SCHEME; touched = true; }
    if (touched) GM_setValue(SETTINGS_KEY, settings);
  }
  // The one way to change a setting: updates the object and persists it.
  function setting(key, value) {
    settings[key] = value;
    GM_setValue(SETTINGS_KEY, settings);
  }
  const CSS_VARS = {
    bg: '--background', fg: '--foreground', mut: '--muted-foreground', card: '--card',
    sec: '--secondary', acc: '--accent', accFg: '--accent-foreground', bd: '--border',
    input: '--input', ring: '--ring', brand: '--brand', brandSoft: '--brand-soft',
  };
  function applyTheme(name) {
    const s = SCHEMES[name];
    const style = document.documentElement.style;
    for (const [token, cssVar] of Object.entries(CSS_VARS)) style.setProperty(cssVar, s[token]);
    document.documentElement.dataset.abbScheme = schemeKind(name);
  }
  function setTheme(name) {  // apply + persist + keep Colophon in sync
    if (!SCHEMES[name]) return;
    setting('theme', name);
    applyTheme(name);
    local.set(COLOPHON_KEY(schemeKind(name)), name);
  }
  applyTheme(settings.theme);

  /* ---- Third-party script blocking (document-start) ----
     Neutralise external <script src> from hosts we don't recognise before they load — the same
     MutationObserver technique consent managers use. Inline scripts are left alone. Toggle via the
     Tampermonkey menu; if you run uBlock Origin this is largely redundant and can stay off. */
  const SCRIPT_ALLOW = /(^|\.)(audiobookbay\.lu|cloudflare\.com|cloudflareinsights\.com)$/i;
  const blockedScripts = [];
  if (settings.blockScripts) {
    const neutralise = node => {
      if (node.nodeType !== 1 || node.tagName !== 'SCRIPT') return;
      const src = node.getAttribute('src');
      if (!src) return;
      let host; try { host = new URL(src, location.href).hostname; } catch { return; }
      if (SCRIPT_ALLOW.test(host)) return;
      node.type = 'text/blocked';          // no longer a JavaScript MIME type
      node.removeAttribute('src');
      node.remove();
      blockedScripts.push(host);
    };
    new MutationObserver(muts => { for (const m of muts) m.addedNodes.forEach(neutralise); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
  GM_registerMenuCommand(
    `Third-party scripts: ${settings.blockScripts ? 'blocked' : 'allowed'} — click to toggle`,
    () => { setting('blockScripts', !settings.blockScripts); location.reload(); });

  /* =====================================================================
     6. Styles
     ===================================================================== */
  const CSS = `
    /* ---- base ---- */
    html[data-abb-scheme="dark"]  { color-scheme: dark; }
    html[data-abb-scheme="light"] { color-scheme: light; }
    html, body { background: var(--background) !important; margin: 0 !important; }
    html.abb-boot body { visibility: hidden !important; }   /* hidden until init() has built the UI */
    body.abb-list, body.abb-content, body.abb-forum, body.abb-book, body.abb-page {
      color: var(--foreground);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    body.abb-list > *:not(#abb-root), body.abb-content > *:not(#abb-root), body.abb-forum > *:not(#abb-root) { display: none !important; }
    #abb-root { max-width: 1240px; margin: 0 auto; padding: 20px 24px 60px; font-size: 15px; line-height: 1.5; text-align: left; }
    #abb-root * { box-sizing: border-box; }
    #abb-root a { color: inherit; text-decoration: none; }

    /* ---- shared controls ---- */
    .abb-btn {
      display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px;
      background: var(--secondary); color: var(--foreground); border: 1px solid var(--border);
      border-radius: 8px; font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap;
    }
    .abb-btn:hover { background: var(--brand-soft); color: var(--brand); }
    .abb-icon { width: 32px; padding: 0; justify-content: center; }
    .abb-input {
      background: var(--secondary); color: var(--foreground); border: 1px solid var(--input);
      border-radius: 8px; padding: 7px 12px; font: inherit; font-size: 13px; outline: none;
    }
    .abb-input:focus-visible { border-color: var(--ring); box-shadow: 0 0 0 2px var(--ring); }
    .abb-pop {
      position: absolute; right: 0; top: calc(100% + 6px); z-index: 200; display: none;
      background: var(--card); border: 1px solid var(--border); border-radius: 12px;
      padding: 12px; box-shadow: 0 10px 25px rgba(0,0,0,.3);
    }
    .is-open > .abb-pop { display: block; }
    .abb-badge {
      display: inline-block; background: var(--secondary); color: var(--muted-foreground);
      padding: 3px 9px; border-radius: 999px; font-size: 11.5px; white-space: nowrap;
    }
    .abb-badge.abb-cat { color: var(--brand); border: 1px solid var(--brand-soft); }
    .abb-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    .abb-chip {
      background: var(--secondary); color: var(--foreground); border: 1px solid var(--border);
      padding: 4px 11px; border-radius: 999px; font-size: 12px; line-height: 1.55;
    }
    .abb-links { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .abb-dl {
      display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
      background: var(--brand-soft); color: var(--brand); border: 1px solid var(--border);
      border-radius: 8px; font-size: 12.5px; font-weight: 600;
    }
    .abb-dl:hover { background: var(--brand); color: var(--background); }
    .abb-note { font-size: 12px; color: var(--muted-foreground); }
    .abb-desc { color: var(--muted-foreground); text-align: left; }
    .abb-desc p { margin: 0 0 8px; }
    .abb-desc .abb-body { color: var(--foreground); }

    /* ---- header (shared by list + book pages) ---- */
    .abb-header {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 0 12px; padding: 12px 20px; margin-bottom: 16px;
      background: var(--card); border: 1px solid var(--border); border-radius: 12px;
    }
    .abb-header h1 { font-size: 18px; font-weight: 700; margin: 0; }
    .abb-nav { display: flex; align-items: center; gap: 4px; }
    .abb-nav > a { color: var(--muted-foreground); font-size: 13px; padding: 6px 12px; border-radius: 8px; }
    .abb-nav > a:hover { background: var(--secondary); color: var(--foreground); }
    .abb-search { display: flex; align-items: center; margin: 0 0 0 8px; }
    .abb-search .abb-input {
      width: 0; height: 32px; padding: 0; margin-right: 0; opacity: 0; border-color: transparent;
      transition: width .25s ease, opacity .2s, padding .25s, margin .25s;
    }
    .abb-header.abb-search-open .abb-search .abb-input {
      width: 220px; padding: 0 12px; margin-right: 6px; opacity: 1; border-color: var(--input);
    }
    .abb-search .abb-adv {
      max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap; font-size: 12px;
      transition: max-width .25s ease, opacity .2s, margin .25s;
    }
    .abb-header.abb-search-open .abb-search .abb-adv { max-width: 120px; opacity: 1; margin-right: 10px; }
    .abb-theme { position: relative; margin-left: 8px; }
    .abb-theme-btn span { display: none; }      /* theme name lives in the tooltip */
    .abb-theme-pop { right: 0; width: 340px; max-height: 380px; overflow-y: auto; }
    .abb-pop-title {
      font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
      color: var(--muted-foreground); margin: 0 0 6px;
    }
    .abb-swatches { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-bottom: 12px; }
    .abb-swatches:last-child { margin-bottom: 0; }
    .abb-swatch {
      text-align: left; border: 1px solid var(--border); border-radius: 6px; padding: 6px 8px;
      font: inherit; font-size: 11.5px; cursor: pointer;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .abb-swatch:hover { border-color: var(--ring); }
    .abb-swatch.is-active { border-color: var(--brand); box-shadow: inset 0 0 0 1px var(--brand); }

    /* Site stylesheets on member/forum pages reach into our header — pin the essentials */
    #abb-root .abb-header, #abb-root .abb-header h1, #abb-root .abb-toolbar, #abb-root .abb-btn {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
    }
    #abb-root .abb-header h1 { font-size: 18px !important; color: var(--foreground) !important; }
    #abb-root .abb-logo, #abb-root .abb-nav > a, #abb-root .abb-adv { text-decoration: none !important; }
    #abb-root .abb-logo { color: var(--foreground) !important; }
    #abb-root .abb-nav > a, #abb-root .abb-adv { color: var(--muted-foreground) !important; }
    #abb-root .abb-nav > a:hover { color: var(--foreground) !important; }
    #abb-root .abb-adv:hover { color: var(--brand) !important; }
    #abb-root .abb-btn { color: var(--foreground) !important; }
    #abb-root .abb-btn:hover { color: var(--brand) !important; }

    /* ---- list mode ---- */
    .abb-toolbar { position: sticky; top: 8px; z-index: 5; display: flex; flex-wrap: wrap; gap: 8px;
      align-items: center; padding: 10px; margin: 12px 0;
      background: color-mix(in oklab, var(--background) 92%, transparent);
      backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 12px;
    }
    .abb-toolbar .abb-input[type="search"] { flex: 1; min-width: 170px; }
    .abb-count { font-size: 12px; color: var(--muted-foreground); margin-left: auto; }
    .abb-switch {
      display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12.5px;
      color: var(--muted-foreground); user-select: none; white-space: nowrap;
    }
    .abb-switch input { cursor: pointer; accent-color: var(--brand); }
    #abb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); gap: 12px; }
    .abb-card {
      display: flex; flex-wrap: wrap; gap: 14px; padding: 14px; border-radius: 12px;
      background: var(--card); border: 1px solid var(--border); align-items: center;
      transition: background .15s, border-color .15s;
      content-visibility: auto; contain-intrinsic-size: auto 190px;   /* off-screen cards skip layout & paint */
    }
    .abb-card:hover { background: var(--brand-soft); border-color: var(--accent); }
    .abb-row { display: flex; gap: 14px; align-items: center; width: 100%; }
    .abb-cover {
      width: 72px; height: 108px; object-fit: cover; border-radius: 8px;
      flex-shrink: 0; background: var(--secondary);
    }
    .abb-main { min-width: 0; flex: 1; }
    .abb-title {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      font-weight: 600; font-size: 15px; line-height: 1.35; margin-bottom: 8px;
    }
    .abb-title:hover { color: var(--brand); }
    .abb-by { color: var(--muted-foreground); font-weight: 400; font-size: 13px; }
    .abb-badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .abb-actions { display: flex; gap: 6px; margin-left: auto; flex-shrink: 0; }
    .abb-toggle { font-size: 14px; transition: transform .2s, background .15s, color .15s; }
    #abb-root .abb-btn.abb-gr {
      font-family: Georgia, "Times New Roman", serif !important;
      font-weight: 700; font-size: 17px; line-height: 1; padding-bottom: 3px;
    }
    #abb-root .abb-gr { opacity: .55; }
    #abb-root .abb-gr.is-direct { opacity: 1; color: var(--brand) !important; border-color: var(--brand) !important; }

    .abb-card.abb-open .abb-toggle { transform: rotate(90deg); }
    .abb-panel {
      display: none; width: 100%; margin-top: 12px; padding-top: 14px;
      border-top: 1px solid var(--border); font-size: 13.5px; line-height: 1.6;
    }
    .abb-card.abb-open .abb-panel { display: block; }
    .abb-panel .abb-desc { max-height: 240px; overflow-y: auto; padding-right: 6px; margin-bottom: 12px; }
    .abb-panel-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .abb-more { margin-left: auto; font-size: 12px; color: var(--muted-foreground); }
    .abb-more:hover { color: var(--brand); }
    .abb-status { text-align: center; color: var(--muted-foreground); padding: 28px; font-size: 13px; }
    .abb-status.is-action { cursor: pointer; color: var(--brand); }
    .abb-sentinel { height: 1px; }
    .abb-gr-badge { color: var(--brand); border-color: var(--brand-soft); }

    /* category multi-select popover */
    .abb-multi { position: relative; }
    .abb-multi > summary { list-style: none; cursor: pointer; display: flex; align-items: center; min-width: 190px; white-space: nowrap; }
    .abb-multi > summary::-webkit-details-marker { display: none; }
    .abb-multi > summary::after { content: '⌄'; margin-left: auto; padding-left: 8px; color: var(--muted-foreground); }
    .abb-multi-list { margin: 8px 0; }
    .abb-multi-group { margin-bottom: 10px; }
    .abb-multi-group h4 {
      margin: 0 0 4px; padding: 0 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em;
      text-transform: uppercase; color: var(--muted-foreground);
    }
    .abb-multi-panel {
      position: absolute; z-index: 30; top: calc(100% + 6px); left: 0; width: 380px; max-width: calc(100vw - 32px);
      max-height: 60vh; overflow: auto;
      background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.35);
    }
    .abb-multi-group { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; }
    .abb-multi-group h4 { grid-column: 1 / -1; }
    .abb-multi-list label, .abb-multi-mode {
      display: flex; align-items: flex-start; gap: 8px; min-width: 0; font-size: 13px; line-height: 1.35;
      padding: 4px 6px; border-radius: 6px; cursor: pointer; white-space: normal; overflow-wrap: anywhere;
    }
    .abb-multi input[type="checkbox"] { accent-color: var(--brand); margin: 2px 0 0; flex: none; }
    .abb-multi-list label:hover { background: var(--secondary); }
    .abb-multi-mode { border-bottom: 1px solid var(--border); padding-bottom: 8px; border-radius: 0; color: var(--muted-foreground); }
    .abb-multi-clear { width: 100%; justify-content: center; }

    /* ---- book page (/abss/) ---- */
    body.abb-book .post, body.abb-book .commentZone {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 14px; padding: 28px 32px; margin: 0 0 20px;
    }
    /* the site's fixed column widths / floats must not survive inside the card */
    body.abb-book .post, body.abb-book .postTitle, body.abb-book .postInfo, body.abb-book .postContent,
    body.abb-book .postContent > *, body.abb-book .abb-desc, body.abb-book .abb-desc > *, body.abb-book .abb-desc p {
      float: none !important; width: auto !important; max-width: none !important; min-width: 0 !important;
      margin-left: 0 !important; margin-right: 0 !important;
    }
    body.abb-book .postTitle h1 { font-size: 22px; line-height: 1.3; margin: 0 0 16px; color: var(--foreground); }
    body.abb-book .postInfo {
      font-size: 13px; line-height: 2.3; color: var(--muted-foreground);
      background: var(--secondary); border-radius: 10px; padding: 8px 14px; margin-bottom: 22px;
    }
    body.abb-book .postInfo a {
      display: inline-block; background: var(--card); color: var(--brand); border: 1px solid var(--border);
      border-radius: 999px; padding: 0 10px; margin: 0 2px; line-height: 1.9; font-size: 12px;
    }
    body.abb-book .postInfo a:hover { background: var(--brand-soft); }
    body.abb-book .postInfo span[style] { margin-left: 16px !important; }
    body.abb-book .postInfo h2 { display: inline; font: inherit; margin: 0; padding: 0; border: 0; }
    body.abb-book .postContent {
      display: grid !important; grid-template-columns: 250px minmax(0, 1fr); gap: 24px 28px; align-items: start;
    }
    body.abb-book .postContent > .center { grid-column: 1; text-align: center; }
    body.abb-book .postContent > .center p { margin: 0 0 10px; font-size: 12.5px; color: var(--muted-foreground); }
    body.abb-book .postContent > .center a { color: var(--brand); }
    body.abb-book .postContent img[itemprop="image"] {
      display: block; width: 100%; max-width: 250px; height: auto; margin: 0 auto; border-radius: 10px;
    }
    body.abb-book .postContent > .abb-desc { grid-column: 2; justify-self: stretch; font-size: 14.5px; line-height: 1.65; }
    body.abb-book .postContent > .abb-links, body.abb-book .postContent > .abb-torrent,
    body.abb-book .postContent > .abb-trackers { grid-column: 1 / -1; }
    body.abb-book .abb-torrent {
      width: 100%; border-collapse: collapse; font-size: 12.5px; border: 1px solid var(--border) !important;
    }
    body.abb-book .abb-torrent td {
      border: 1px solid var(--border); padding: 6px 12px; width: auto !important;
      word-break: break-all; color: var(--foreground);
    }
    body.abb-book .abb-torrent td:first-child:not([colspan]) { color: var(--muted-foreground); white-space: nowrap; }
    body.abb-book .abb-torrent span { color: inherit !important; font: inherit !important; }
    body.abb-book .abb-torrent a, body.abb-book .commentZone a { color: var(--brand); }

	/* collapsible tracker list (built by collapseTrackers) */
    body.abb-book .abb-trackers {
      background: var(--secondary); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 14px;
    }
    body.abb-book .abb-trackers > summary {
      list-style: none; cursor: pointer; display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; font-size: 13.5px; color: var(--foreground); user-select: none;
    }
    body.abb-book .abb-trackers > summary::-webkit-details-marker { display: none; }
    body.abb-book .abb-trackers > summary:hover { color: var(--brand); }
    body.abb-book .abb-caret { display: inline-block; font-size: 11px; color: var(--muted-foreground); transition: transform .15s; }
    body.abb-book .abb-trackers[open] > summary .abb-caret { transform: rotate(90deg); }
    body.abb-book .abb-tracker-count { margin-left: auto; font-size: 12px; color: var(--muted-foreground); }
    body.abb-book .abb-trackers .abb-tracker-table {
      width: 100%; margin: 0; border: 0; border-top: 1px solid var(--border); border-radius: 0; background: transparent;
    }

    body.abb-book .commentZone h3 { font-size: 16px; margin: 0 0 12px; color: var(--foreground); }
    body.abb-book .commentZone h3 small, body.abb-book .commentmetadata { color: var(--muted-foreground); font-weight: 400; }
    body.abb-book .commentList { list-style: none; margin: 0 0 24px; padding: 0; }
    body.abb-book .commentList > li { display: flex; gap: 12px; padding: 12px 0; border-top: 1px solid var(--border); background: none; }
    body.abb-book .commentList .avatar { border-radius: 50%; }
    body.abb-book .commentAuthor { font-weight: 600; }
    body.abb-book .commentRight p { margin: 6px 0 0; }
    body.abb-book #commentform input[type="text"], body.abb-book #commentform textarea {
      background: var(--secondary); color: var(--foreground); border: 1px solid var(--input);
      border-radius: 8px; padding: 8px 10px; font: inherit; font-size: 13px; outline: none;
    }
    body.abb-book #commentform input[type="text"] { width: 320px; }
    body.abb-book #commentform textarea { width: 100%; max-width: 640px; }
    body.abb-book #commentform input[type="submit"], body.abb-book #commentform #submit {
      height: 36px !important; line-height: 34px !important; padding: 0 16px !important; width: auto !important;
      background: var(--brand) !important; color: var(--background) !important; border: 0 !important;
      border-radius: 8px !important; font: inherit !important; font-size: 13px !important; cursor: pointer;
    }
    body.abb-book .comment-rating { display: inline-block; vertical-align: middle; margin-right: 12px; }
    body.abb-book #commentform label small { color: var(--muted-foreground); }

    /* ---- generic main-template page (login, donate, advanced search, …) ---- */
    body.abb-content #content { float: none !important; width: auto !important; margin: 0 !important; padding: 0 !important; }
    .abb-page-card {
      background: var(--card); border: 1px solid var(--border); border-radius: 14px;
      padding: 28px 32px; margin-bottom: 20px; color: var(--foreground);
      font-size: 14.5px; line-height: 1.6;
    }
    .abb-page-card h1, .abb-page-card h2, .abb-page-card h3 {
      font-family: inherit !important; color: var(--foreground); line-height: 1.3; margin: 0 0 14px;
    }
    .abb-page-card h1 { font-size: 22px; } .abb-page-card h2 { font-size: 18px; } .abb-page-card h3 { font-size: 16px; }
    .abb-page-card p { margin: 0 0 10px; }
    .abb-page-card a { color: var(--brand); }
    .abb-page-card hr { border: 0; border-top: 1px solid var(--border); margin: 16px 0; }
    .abb-page-card img { max-width: 100%; height: auto; border-radius: 8px; }
    .abb-page-card table { border-collapse: collapse; }
    .abb-page-card table, .abb-page-card td, .abb-page-card th { border: 0 !important; }
    .abb-page-card td, .abb-page-card th { padding: 8px 10px; vertical-align: middle; color: var(--foreground); }
    .abb-page-card [bgcolor], .abb-page-card [style*="background"] { background: var(--secondary) !important; }
    .abb-page-card input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]),
    .abb-page-card textarea, .abb-page-card select {
      background: var(--secondary); color: var(--foreground); border: 1px solid var(--input);
      border-radius: 8px; padding: 8px 10px; font: inherit; font-size: 13px; outline: none;
    }
    .abb-page-card input:focus-visible, .abb-page-card textarea:focus-visible { border-color: var(--ring); }
    .abb-page-card input[type="submit"], .abb-page-card input[type="button"], .abb-page-card input[type="reset"], .abb-page-card button {
      background: var(--brand) !important; background-image: none !important; color: var(--background) !important;
      border: 0 !important; border-radius: 8px !important; padding: 9px 16px !important; margin-right: 8px;
      font: inherit; font-size: 13px; cursor: pointer;
    }
    .abb-page-card input[type="reset"] { background: var(--secondary) !important; color: var(--foreground) !important; }
    .abb-page-card input:-webkit-autofill, .abb-forum-body input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px var(--secondary) inset !important;
      -webkit-text-fill-color: var(--foreground) !important;
    }

    .abb-wallets { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .abb-wallet {
      background: var(--secondary); border: 1px solid var(--border); border-radius: 12px;
      padding: 18px; text-align: center;
    }
    .abb-wallet img { display: block; width: 200px; max-width: 100%; height: auto; margin: 0 auto 12px; padding: 8px; background: #fff; border-radius: 10px; }
    .abb-wallet h3 { margin: 0 0 8px; font-size: 16px; }
    .abb-wallet code { display: block; font-size: 12px; line-height: 1.5; word-break: break-all; color: var(--muted-foreground); margin-bottom: 12px; }
    .abb-wallet-actions { display: flex; gap: 8px; justify-content: center; }
    .abb-page-card .abb-wallet-actions .abb-btn {
      height: 32px; background: var(--secondary) !important; color: var(--foreground) !important;
      border: 1px solid var(--border) !important; padding: 0 12px !important; margin: 0;
    }
    .abb-page-card .abb-wallet-actions .abb-btn:hover { background: var(--brand-soft) !important; color: var(--brand) !important; }

    /* advanced search page (rebuilt by tidyAdvancedSearch) */
    .abb-adv-search h1 { margin-bottom: 6px; }
    .abb-adv-intro { margin: 0 0 18px !important; max-width: 70ch; font-size: 13.5px; }
    .abb-adv-row { display: flex; gap: 8px; margin-bottom: 16px; }
    .abb-adv-search .abb-adv-row input[type="search"] { flex: 1 1 auto; min-width: 0; height: 40px; font-size: 14px; }
    .abb-page-card .abb-adv-go, .abb-page-card .abb-adv-go:hover { height: 40px; margin: 0; padding: 0 20px !important; }
    .abb-page-card .abb-adv-go:hover { filter: brightness(1.12); }
    .abb-adv-options { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; }
    .abb-adv-label { font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--muted-foreground); margin-right: 4px; }
    .abb-adv-sep { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }
    .abb-chip-check {
      display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 12px; border-radius: 999px;
      background: var(--secondary); border: 1px solid var(--border); font-size: 13px; cursor: pointer; user-select: none;
    }
    .abb-chip-check:hover { border-color: var(--accent); }
    .abb-adv-search input[type="checkbox"] { accent-color: var(--brand); width: 15px; height: 15px; margin: 0; flex: none; }
    .abb-adv-section { background: var(--secondary); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 12px; }
    .abb-adv-section > summary {
      list-style: none; cursor: pointer; display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; font-size: 14px; font-weight: 600; user-select: none;
    }
    .abb-adv-section > summary::-webkit-details-marker { display: none; }
    .abb-adv-section > summary:hover { color: var(--brand); }
    .abb-adv-section .abb-caret { display: inline-block; font-size: 11px; color: var(--muted-foreground); transition: transform .15s; }
    .abb-adv-section[open] > summary .abb-caret { transform: rotate(90deg); }
    .abb-adv-count { margin-left: auto; font-size: 12px; font-weight: 500; color: var(--muted-foreground); }
    .abb-adv-body { border-top: 1px solid var(--border); padding: 12px 16px 14px; }
    .abb-adv-body .abb-adv-all { background: var(--card); margin-bottom: 12px; }
    .abb-adv-search ul.columns {
      display: grid !important; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2px 12px;
      list-style: none; margin: 0 !important; padding: 0 !important; column-count: auto !important;
    }
    .abb-adv-search ul.columns li { float: none !important; width: auto !important; margin: 0 !important; padding: 0 !important; }
    .abb-adv-search ul.columns label {
      display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-radius: 6px; font-size: 13px; line-height: 1.3; cursor: pointer;
    }
    .abb-adv-search ul.columns label:hover { background: var(--card); }

    /* ---- forum (SMF 1.1, "Headline" theme) — recolour in place ---- */
    html.abb-forum-html, body.abb-forum {
      margin: 0 !important; padding: 0 !important;
      background: var(--background) !important; background-image: none !important;
    }
    .abb-forum-body { color: var(--foreground); font-size: 14px; line-height: 1.5; }
    .abb-forum-body :not(pre):not(code):not(.code):not(.abb-gr) {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
    }
    .abb-forum-body, .abb-forum-body td, .abb-forum-body th, .abb-forum-body div, .abb-forum-body span,
    .abb-forum-body li, .abb-forum-body label, .abb-forum-body b { color: var(--foreground) !important; font-size: 14px; }
    .abb-forum-body a { color: var(--brand) !important; text-transform: none !important; }
    .abb-forum-body .smalltext, .abb-forum-body .smalltext * { color: var(--muted-foreground) !important; font-size: 12.5px !important; }
    .abb-forum-body .middletext { font-size: 13px !important; }
    .abb-forum-body .smalltext a { color: var(--brand) !important; }

    /* every theme wrapper: no fixed width, no background sprites */
    .abb-forum-body #wrapper, .abb-forum-body #header, .abb-forum-body #head-l, .abb-forum-body #head-r,
    .abb-forum-body #headerarea, .abb-forum-body #bodyarea, .abb-forum-body #main, .abb-forum-body #upper_section,
    .abb-forum-body #content_section, .abb-forum-body #main_content_section, .abb-forum-body .frame,
    .abb-forum-body div:not(.tborder):not(.catbg):not(.titlebg):not(.windowbg):not(.windowbg2):not(.windowbg3):not(.quote):not(.code):not(.abb-forum-tools) {
      width: auto !important; max-width: none !important; min-width: 0 !important;
      background-color: transparent !important; background-image: none !important; box-shadow: none !important;
    }
    .abb-forum-body > table:first-of-type td { padding: 0 !important; }             /* the title strip */

	/* current location directory trail */
    .abb-forum-body h1.nav, .abb-forum-body div.nav, .abb-forum-body td.nav,
    .abb-forum-body .nav b, .abb-forum-body .nav span {
      font-size: 13px !important; font-weight: 500 !important; color: var(--muted-foreground) !important;
      line-height: 1.6; background: none !important;
    }
    .abb-forum-body h1.nav, .abb-forum-body div.nav { margin: 0 0 14px !important; padding: 0 !important; }
    .abb-forum-body a.nav, .abb-forum-body .nav a { color: var(--muted-foreground) !important; text-decoration: none; }
    .abb-forum-body .nav a:hover { color: var(--brand) !important; }
    .abb-forum-body .nav a:last-of-type, .abb-forum-body .nav b:last-of-type a { color: var(--foreground) !important; font-weight: 600 !important; }

    /* topic pages: breadcrumb and previous/next topic share one line; tighter pages/buttons bar */
    .abb-forum-body .abb-crumbs { display: flex !important; align-items: baseline; flex-wrap: wrap; gap: 6px 16px; margin: 0 0 10px !important; }
    .abb-forum-body .abb-crumb-trail { flex: 1 1 auto; min-width: 0; }
    .abb-forum-body .abb-topic-nav { flex: none; margin-left: auto; display: inline-flex; gap: 14px; white-space: nowrap; }
    .abb-forum-body .nav .abb-topic-nav a, .abb-forum-body .nav .abb-topic-nav a:last-of-type {
      color: var(--muted-foreground) !important; font-size: 13px !important; font-weight: 500 !important; text-decoration: none;
    }
    .abb-forum-body .nav .abb-topic-nav a:hover { color: var(--brand) !important; }
    .abb-forum-body .abb-topic-bar { margin: 0 0 10px !important; }
    .abb-forum-body .abb-topic-bar td { padding: 4px 0 !important; vertical-align: middle !important; }

    /* panels: .tborder is the card, table.bordercolor's background is the 1px grid line */
    .abb-forum-body .tborder {
      background: var(--card) !important; border: 1px solid var(--border) !important;
      border-radius: 12px; overflow: hidden; margin: 0 0 16px !important;
    }
    .abb-forum-body table.bordercolor { background: var(--border) !important; margin-top: 0 !important; }
    .abb-forum-body .windowbg, .abb-forum-body .windowbg2 { background: var(--card) !important; }
    .abb-forum-body .windowbg3 { background: var(--secondary) !important; }
    .abb-forum-body td { padding: 10px 12px !important; border: 0 !important; }
    .abb-forum-body .catbg, .abb-forum-body .catbg2, .abb-forum-body .titlebg, .abb-forum-body .titlebg2 {
      background: var(--secondary) !important; background-image: none !important; border: 0 !important;
      color: var(--foreground) !important; font-weight: 600; padding: 10px 14px !important;
    }
    /* Panel headers. The Headline theme has titlebg/titlebg2/catbg/catbg2/catbg3 variants and puts the
       class on <td> in some templates and on <tr> in others — match by substring and cover both */
    .abb-forum-body [class*="titlebg"], .abb-forum-body [class*="catbg"],
    .abb-forum-body tr[class*="titlebg"] > td, .abb-forum-body tr[class*="titlebg"] > th,
    .abb-forum-body tr[class*="catbg"] > td, .abb-forum-body tr[class*="catbg"] > th {
      background: var(--secondary) !important; background-image: none !important;
      color: var(--foreground) !important; font-weight: 600; font-size: 13px !important;
      border-bottom: 0 !important;
    }
    .abb-forum-body [class*="titlebg"] a, .abb-forum-body [class*="catbg"] a,
    .abb-forum-body tr[class*="titlebg"] > td a, .abb-forum-body tr[class*="catbg"] > td a {
      color: var(--foreground) !important; text-decoration: none;
    }
    .abb-forum-body [class*="titlebg"] a:hover, .abb-forum-body [class*="catbg"] a:hover,
    .abb-forum-body tr[class*="titlebg"] > td a:hover, .abb-forum-body tr[class*="catbg"] > td a:hover { color: var(--brand) !important; }

    .abb-forum-body td img { vertical-align: middle; }
    .abb-forum-body td img[alt="No New Posts"] { opacity: .45; }

    /* topics / posts */
    .abb-forum-body .post, .abb-forum-body .signature { color: var(--foreground) !important; line-height: 1.6; }
    .abb-forum-body .signature { color: var(--muted-foreground) !important; border-top: 1px solid var(--border); }
    .abb-forum-body .quoteheader, .abb-forum-body .codeheader { color: var(--muted-foreground) !important; font-size: 12px !important; margin-top: 8px; }
    .abb-forum-body .quote, .abb-forum-body .code {
      background: var(--secondary) !important; color: var(--foreground) !important; border: 0 !important;
      border-left: 3px solid var(--brand) !important; border-radius: 8px; padding: 10px 12px; margin: 4px 0 10px;
    }
    .abb-forum-body .code { font-family: ui-monospace, Menlo, Consolas, monospace !important; font-size: 12.5px; white-space: pre-wrap; }

    /* posted-date popover (reuses the category popover chrome) */
    .abb-date .abb-multi-panel { width: 300px; }
    .abb-date .abb-multi-group { grid-template-columns: 1fr; }
    .abb-multi input[type="radio"] { accent-color: var(--brand); margin: 2px 0 0; flex: none; }
    .abb-date-range { display: none; grid-template-columns: 1fr 1fr; gap: 8px; padding: 4px 6px 10px; }
    .abb-date.abb-date-custom .abb-date-range { display: grid; }
    .abb-date-range label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--muted-foreground); }
    .abb-date-range input[type="date"] { height: 32px; padding: 0 8px; font-size: 13px; min-width: 0; }

    .abb-multi-actions { display: flex; gap: 8px; }
    .abb-multi-actions .abb-btn { flex: 1 1 0; width: auto; justify-content: center; }
    #abb-root .abb-multi-apply, #abb-root .abb-multi-apply:hover {
      background: var(--brand) !important; color: var(--background) !important; border-color: transparent !important;
    }
    #abb-root .abb-multi-apply:hover:not(:disabled) { filter: brightness(1.12); }
    #abb-root .abb-multi-apply:disabled, #abb-root .abb-multi-apply:disabled:hover {
      opacity: .45; cursor: not-allowed; filter: none;
    }

    /* category exclude toggle */
    .abb-multi-list label { position: relative; padding-right: 28px; }
    #abb-root .abb-cat-ex {
      position: absolute; right: 4px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; padding: 0;
      border-radius: 50%; border: 1px solid var(--border); background: transparent; color: var(--muted-foreground);
      font: inherit; font-size: 13px; line-height: 16px; text-align: center; cursor: pointer; opacity: 0.2;
    }
    #abb-root .abb-multi-list label:hover .abb-cat-ex, #abb-root .abb-multi-list label.is-ex .abb-cat-ex { opacity: 1; }
    #abb-root .abb-cat-ex:hover { border-color: #e5484d; color: #e5484d; }
    .abb-multi-list label.is-ex { color: #e5484d; }
    .abb-multi-list label.is-ex > span { text-decoration: line-through; }
    .abb-multi-list label.is-ex input { opacity: .35; }
    #abb-root .abb-multi-list label.is-ex .abb-cat-ex { background: #e5484d; border-color: #e5484d; color: #fff; }

    /* saved filter sets */
    .abb-presets > summary { min-width: 120px; }
    .abb-presets .abb-multi-panel { width: 340px; }
    .abb-preset-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; max-height: 50vh; overflow-y: auto; }
    .abb-preset { display: flex; align-items: stretch; gap: 4px; }
    #abb-root .abb-preset-go {
      flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left;
      padding: 8px 10px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: inherit; font: inherit; cursor: pointer;
    }
    #abb-root .abb-preset-go:hover { background: var(--secondary); border-color: var(--border); }
    .abb-preset-go strong { font-size: 13.5px; font-weight: 600; }
    .abb-preset-go small { font-size: 11.5px; color: var(--muted-foreground); line-height: 1.35; overflow-wrap: anywhere; }
    #abb-root .abb-preset-upd, #abb-root .abb-preset-del {
      flex: none; width: 28px; border-radius: 8px; border: 1px solid transparent; background: transparent;
      color: var(--muted-foreground); font-size: 15px; cursor: pointer;
    }
    #abb-root .abb-preset-upd:hover { color: var(--brand); border-color: var(--border); }
    #abb-root .abb-preset-del:hover { color: #e5484d; border-color: var(--border); }
    .abb-preset-empty { font-size: 12.5px; color: var(--muted-foreground); padding: 6px 2px 8px; }
    .abb-preset-new { display: flex; gap: 8px; border-top: 1px solid var(--border); padding-top: 10px; }
    .abb-preset-new .abb-input { flex: 1 1 auto; min-width: 0; }
    #abb-root .abb-preset-new .abb-multi-apply { flex: none; width: auto; padding: 0 16px !important; }

    .abb-date-range input[type="date"]:invalid { border-color: #e5484d !important; }   /* hand-typed future date */

    /* two-column pages (profile, personal messages) — cells tagged by initForumMode */
    .abb-forum-body table.abb-two-col {
      display: grid !important; grid-template-columns: 230px minmax(0, 1fr); gap: 20px; align-items: start; width: 100% !important;
    }
    .abb-forum-body table.abb-two-col > tbody, .abb-forum-body table.abb-two-col > tbody > tr { display: contents; }
    .abb-forum-body td.abb-side, .abb-forum-body td.abb-main { display: block; width: auto !important; padding: 0 !important; }

    /* the nav box: same card look as the content box */
    .abb-forum-body .abb-side > table {
      width: 100% !important; margin: 0 !important; border-spacing: 0 !important;
      background: var(--card) !important; border: 1px solid var(--border) !important; border-radius: 12px; overflow: hidden;
    }
    .abb-forum-body .abb-side > table > tbody > tr > td { padding: 8px 14px !important; border-top: 1px solid var(--border); }
    .abb-forum-body .abb-side > table > tbody > tr:first-child > td { border-top: 0; }
    .abb-forum-body .abb-side td[class*="catbg"], .abb-forum-body .abb-side td[class*="titlebg"] { padding: 9px 14px !important; }
    .abb-forum-body .abb-side [class*="windowbg"] { background: var(--card) !important; }
    .abb-forum-body .abb-side [class*="windowbg"] br { display: none; }
    .abb-forum-body .abb-side [class*="windowbg"] b { display: contents; }   /* bold wrapper on the current page must not add a second row of padding */

    .abb-forum-body .abb-side [class*="windowbg"] a, .abb-forum-body .abb-side [class*="windowbg"] b {
      display: block; padding: 4px 0; font-size: 13px !important; line-height: 1.4;
    }
    /* the content box: full width, our card look instead of the cellspacing=1 "bordercolor" grid */
    .abb-forum-body .abb-main > table, .abb-forum-body .abb-main > form > table {
      width: 100% !important; margin: 0 0 16px !important; border-spacing: 0 !important;
      background: var(--card) !important; border: 1px solid var(--border) !important; border-radius: 12px; overflow: hidden;
    }
    .abb-forum-body .abb-main > table > tbody > tr > td { padding: 12px 16px !important; border-top: 1px solid var(--border); }
    .abb-forum-body .abb-main > table > tbody > tr:first-child > td { border-top: 0; }
    .abb-forum-body .abb-main [class*="windowbg"] { background: var(--card) !important; }
    .abb-forum-body .abb-main table table { width: 100% !important; }         /* the Name/Posts/… detail grid */
    .abb-forum-body .abb-main table table td { padding: 5px 8px !important; border: 0 !important; vertical-align: top; }
    .abb-forum-body .abb-main table table td:first-child { width: 160px; color: var(--muted-foreground); white-space: nowrap; }
    .abb-forum-body .abb-main table table td:first-child b { font-weight: 500; }
    .abb-forum-body .abb-main hr { border: 0 !important; border-top: 1px solid var(--border) !important; margin: 10px 0; height: 0; }
    .abb-forum-body .abb-main .signature:empty { display: none; }

    /* our chip row (surviving SMF nav items) */
    .abb-forum-tools { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; margin: -4px 0 14px; }
    .abb-forum-body .abb-forum-tools .abb-btn {
      display: inline-flex; align-items: center; height: 32px; padding: 0 12px !important;
      background: var(--secondary) !important; color: var(--foreground) !important;
      border: 1px solid var(--border) !important; border-radius: 8px !important;
      font-size: 13px !important; text-decoration: none !important;
    }
    .abb-forum-body .abb-forum-tools .abb-btn:hover { background: var(--brand-soft) !important; color: var(--brand) !important; }

    /* forum search: drop-down under its button (built by buildForumSearch) */
    .abb-forum-tools .abb-forum-search { position: relative; display: flex; margin: 0 !important; padding: 0 !important; }
    .abb-forum-tools .abb-forum-search-pop {
      display: none; position: absolute; z-index: 30; top: calc(100% + 6px); right: 0;
      align-items: center; gap: 8px; padding: 8px; width: 440px; max-width: calc(100vw - 32px);
      background: var(--card); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.35);
    }
    .abb-forum-tools .abb-forum-search.is-open .abb-forum-search-pop { display: flex; }
    .abb-forum-tools .abb-forum-search.is-open .abb-forum-search-btn { background: var(--brand-soft) !important; color: var(--brand) !important; }
    .abb-forum-tools .abb-forum-search-pop .abb-input {
      flex: 1 1 auto; min-width: 0; height: 34px; padding: 0 12px; font: inherit; font-size: 13px; outline: none;
      background: var(--secondary) !important; color: var(--foreground) !important;
      border: 1px solid var(--input) !important; border-radius: 8px;
    }
    .abb-forum-tools .abb-forum-search-pop .abb-input:focus-visible { border-color: var(--ring) !important; }
    .abb-forum-body .abb-forum-tools .abb-forum-search-go {
      flex: none; background: var(--brand) !important; color: var(--background) !important; border-color: transparent !important;
    }
    .abb-forum-tools .abb-forum-search-pop .abb-adv { flex: none; font-size: 12px; white-space: nowrap; color: var(--muted-foreground) !important; text-decoration: none; }
    .abb-forum-tools .abb-forum-search-pop .abb-adv:hover { color: var(--brand) !important; }

    /* forms & buttons */
    .abb-forum-body input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]):not([type="image"]),
    .abb-forum-body textarea, .abb-forum-body select {
      background: var(--secondary) !important; color: var(--foreground) !important;
      border: 1px solid var(--input) !important; border-radius: 8px; padding: 7px 10px; font-size: 13px; outline: none;
    }
    .abb-forum-body input[type="submit"], .abb-forum-body input[type="button"], .abb-forum-body button, .abb-forum-body .buttonlist a {
      height: 32px !important; padding: 0 14px !important; background: var(--brand) !important; background-image: none !important;
      color: var(--background) !important; border: 0 !important; border-radius: 8px !important;
      font-size: 13px !important; cursor: pointer; text-shadow: none !important;
    }

    /* ---- any other page (login, forum, …): colours only ---- */
    body.abb-page a { color: var(--brand); }

   `;

  // Injected at document-start so the first paint is already themed. Our own <style> element
  // (not GM_addStyle) so list mode can tell it apart from the site's stylesheets when it strips them.
  const styleEl = document.createElement('style');
  styleEl.id = 'abb-style';
  styleEl.textContent = CSS;
  (document.head || document.documentElement).appendChild(styleEl);
  document.documentElement.classList.add('abb-boot');

  /* =====================================================================
     7. Parsing & detail helpers
     ===================================================================== */
  function findPosts(doc) {
    for (const sel of ['.post', 'article', 'div[class*="post"]', '.entry']) {
      const nodes = [...doc.querySelectorAll(sel)].filter(n =>
        n.querySelector(POST_LINK_SEL) && n.querySelector('.postInfo, p'));
      if (nodes.length) return nodes;
    }
    return [];
  }

  /* ---------- Goodreads resolver ---------- */
  // Fallback when nothing is found: Google restricted to Goodreads.
  const goodreadsSearchUrl = title => 'https://www.google.com/search?q=' +
    encodeURIComponent('site:goodreads.com ' + title);

  // Strip edition noise ABB uploaders add: [Unabridged], (MP3), 64 Kbps, "Book 3", …
  const cleanTitle = t => t
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\b(unabridged|abridged|audiobook|audio book|m4b|mp3|flac|\d+\s*kbps|narrated by.*$)\b/gi, ' ')
    .replace(/\s+/g, ' ').trim();

  // Progressively simpler queries: full → "title author" → bare title.
  function goodreadsQueries(raw) {
    const full = cleanTitle(raw);
    const [titlePart, ...rest] = full.split(/\s+[-–—]\s+/);      // "Title - Author"
    const author = rest.pop() || '';
    const bare = titlePart.replace(/\s*[(:].*$/, '').trim();      // drop "(Series #12" / ": subtitle"
    return [...new Set([full, `${bare} ${author}`.trim(), bare].filter(q => q.length > 2))];
  }

  /* --- cache: hits are permanent, misses expire, transient failures are never cached --- */
  const GR_CACHE_KEY = 'abb-gr-cache-v4';   // v4 adds Goodreads' canonical title
  const GR_MISS_TTL  = 24 * 3600 * 1000;
  const GR_GAP       = 400;                        // ms between requests
  const GR_BACKOFF   = [20, 45, 90, 180];          // seconds, per consecutive block
  const grCache = GM_getValue(GR_CACHE_KEY, {});   // key → { url: string|null, t: ms }

  let grSaveTimer = 0;
  function saveGrCache() {                     // debounced: many lookups → one write
    clearTimeout(grSaveTimer);
    grSaveTimer = setTimeout(flushGrCache, 2000);
  }
  function flushGrCache() {
    clearTimeout(grSaveTimer); grSaveTimer = 0;
    const keys = Object.keys(grCache);
    if (keys.length > 3000) keys.slice(0, keys.length - 3000).forEach(k => delete grCache[k]);
    GM_setValue(GR_CACHE_KEY, grCache);
  }
  addEventListener('pagehide', flushGrCache);  // don't lose the last batch on navigation

  const grCached = key => {                 // object = hit, null = recent miss, undefined = look it up
    const e = grCache[key];
    if (!e) return undefined;
    if (e.url) return e;
    return Date.now() - e.t < GR_MISS_TTL ? null : undefined;
  };
  const fmtCount = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(n < 10000 ? 1 : 0) + 'k' : String(n);
  GM_registerMenuCommand('Clear Goodreads cache', () => { GM_setValue(GR_CACHE_KEY, {}); location.reload(); });

  class GrTransient extends Error {
    constructor(msg, { blocked = false, backoff = 0 } = {}) { super(msg); this.blocked = blocked; this.backoff = backoff; }
  }
  const gmFetch = (url, headers = { Accept: 'application/json' }) => new Promise((resolve, reject) =>
    GM_xmlhttpRequest({ method: 'GET', url, timeout: 20000, headers,
      onload: resolve,
      onerror:   () => reject(new GrTransient('network error', { backoff: 5000 })),
      ontimeout: () => reject(new GrTransient('timeout',       { backoff: 5000 })) }));

  // Series / volume number in a title: "Book 2", "Book Two", "Vol. 3", "Part 4", "(Catalina #1)". 0 if none.
  const NUM_WORDS = Object.fromEntries('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'
    .split(' ').map((w, i) => [w, i + 1]));
  function seriesNum(s) {
    const m = (s || '').match(/(?:\b(?:book|vol(?:ume)?|part|no\.?)\s*|#\s*)(\d{1,3}|[a-z]+)\b/i);
    if (!m) return 0;
    return /^\d+$/.test(m[1]) ? Number(m[1]) : (NUM_WORDS[m[1].toLowerCase()] || 0);
  }

  // Study guides, summaries and the like: Goodreads lists them as books, often above the novel itself
  const GR_JUNK_TITLE  = /\b(study guide|summary|summaries|summar(?:y|ies) (?:&|and) analysis|workbook|conversation starters|key takeaways|sidekick|cliff'?s ?notes|sparknotes)\b|^analysis of\b/i;
  const GR_JUNK_AUTHOR = /\b(supersummary|sparknotes|bookrags|instaread|blinkist|cliffsnotes|gradesaver|litcharts|bright summaries|worth books|summary|summaries|readtrepreneur|book ?habits|swift ?reads)\b/i;
  const isStudyGuide = (title, author) => GR_JUNK_TITLE.test(title || '') || GR_JUNK_AUTHOR.test(author || '');

  // What the ABB title tells us about the book, for ranking Goodreads' candidates
  function grContext(raw) {
    const parts = cleanTitle(raw).split(/\s+[-–—]\s+/);
    return { author: parts.length > 1 ? parts[parts.length - 1] : '', num: seriesNum(parts[0]) };
  }

  // Goodreads' own search-box endpoint: small JSON, no HTML parsing, copes with the full ABB title.
  async function goodreadsLookup(q, ctx = {}) {
    const r = await gmFetch('https://www.goodreads.com/book/auto_complete?format=json&q=' + encodeURIComponent(q));
    if (r.status === 429 || r.status === 403) throw new GrTransient('blocked ' + r.status, { blocked: true });
    if (r.status !== 200)                     throw new GrTransient('http ' + r.status, { backoff: 10000 });
    let list;
    try { list = JSON.parse(r.responseText); } catch { throw new GrTransient('not JSON (bot check?)', { blocked: true }); }
    if (!Array.isArray(list)) throw new GrTransient('unexpected JSON', { backoff: 10000 });
    // Study guides / summaries are never the book. Dropping them all makes this query a miss,
    // so the next, simpler query gets its turn.
    const cands = list.filter(b => !isStudyGuide(b.bookTitleBare || b.title, b.author?.name));
    if (!cands.length) return null;
    // Score rather than trust rank 1: Goodreads' order still counts, but the uploader's author
    // and series number ("Book 2") outrank it, and popular editions beat self-published duplicates.
    const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const ratings = b => Number(b.ratingsCount) || 0;
    const abbAuthor = norm(ctx.author), stem = norm(cands[0].bookTitleBare).split(' ').slice(0, 3).join(' ');
    const score = (b, i) => {
      let s = 3 - i * 0.5 + Math.min(3, Math.log10(ratings(b) + 1)) * 0.4;
      if (ratings(cands[0]) < 10 && i > 0 && norm(b.bookTitleBare).startsWith(stem) && ratings(b) > ratings(cands[0])) s += 2;
      const sur = norm(b.author?.name).split(' ').pop();
      if (abbAuthor && sur.length > 2) s += abbAuthor.includes(sur) ? 3 : -3;
      if (ctx.num) { const n = seriesNum(b.title) || seriesNum(b.bookTitleBare); if (n) s += n === ctx.num ? 3 : -5; }
      return s;
    };
    let best = cands[0], bestScore = -Infinity;
    cands.forEach((b, i) => { const s = score(b, i); if (s > bestScore) { best = b; bestScore = s; } });
    return {
      url: 'https://www.goodreads.com/book/show/' + best.bookId,
      title: (best.bookTitleBare || '').replace(/\s+/g, ' ').trim(),
      rating: parseFloat(best.avgRating) || 0,
      count: Number(best.ratingsCount) || 0,
      series: (best.title.match(/\(([^()]*#[^()]*)\)\s*$/) || [])[1] || '',   // "Windy Peaks #1"
      author: (best.author?.name || '').replace(/\s+/g, ' ').trim(),
    };
  }

  // Only trust a Goodreads title for display if it visibly matches what the uploader wrote:
  // ≥60% of its significant words appear in the ABB title, or the author's surname does plus one word —
  // and it is written in the same script. Goodreads often returns a translated edition (Chinese, Russian…)
  // whose title still contains the English words, which would otherwise pass the word test.
  const normT = s => (s || '').toLowerCase().replace(/[’'"]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const latinShare = s => {
    const letters = (s || '').match(/\p{L}/gu) || [];
    return letters.length ? letters.filter(ch => /\p{Script=Latin}/u.test(ch)).length / letters.length : 1;
  };
  function grPlausible(abbTitle, info) {
    if (!info.title || isStudyGuide(info.title, info.author)) return false;
    if (latinShare(abbTitle) >= 0.7 && latinShare(info.title) < 0.7) return false;   // different script
    const n1 = seriesNum(abbTitle), n2 = seriesNum(info.title);
    if (n1 && n2 && n1 !== n2) return false;                                           // "Book 2" must never become "Book One"
    const a = normT(abbTitle);
    const words = normT(info.title).split(' ').filter(w => w.length > 2);
    const hits = words.filter(w => a.includes(w)).length;
    const surname = normT(info.author).split(' ').pop();
    return (words.length > 0 && hits / words.length >= 0.6) ||
           (surname.length > 2 && a.includes(surname) && hits >= 1);
  }

  // Evict cached hits the older ranking got wrong — study guides, and editions whose series number
  // contradicts the ABB title — so they are looked up again next time they scroll into view.
  let grSwept = 0;
  for (const [k, e] of Object.entries(grCache)) {
    if (!e.url) continue;
    const n1 = seriesNum(k), n2 = seriesNum(e.title);
    if (isStudyGuide(e.title, e.author) || (n1 && n2 && n1 !== n2)) { delete grCache[k]; grSwept++; }
  }
  if (grSwept) saveGrCache();

  /* --- queue: one request at a time; a block pauses everything with growing backoff --- */
  const grQueue = [];
  let grBusy = false, grPausedUntil = 0, grBlockStreak = 0, grTimer = 0;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const grBroadcast = msg => grQueue.forEach(j => j.onState?.(msg));

  function resolveGoodreads(title, onDone, onState, priority = false) {
    const key = title.toLowerCase();
    const hit = grCached(key);
    if (hit !== undefined) { if (hit) onDone(hit); else onState?.('Not on Goodreads — opens a Google search'); return; }
    const job = { key, title, onDone, onState, tries: 0 };
    priority ? grQueue.unshift(job) : grQueue.push(job);
    onState?.('Goodreads: queued…');
    grPump();
  }

  async function grPump() {
    if (grBusy || grTimer || !grQueue.length) return;
    const wait = grPausedUntil - Date.now();
    if (wait > 0) {
      grBroadcast(`Goodreads paused (rate limited) — retrying in ${Math.ceil(wait / 1000)} s`);
      grTimer = setTimeout(() => { grTimer = 0; grPump(); }, Math.min(wait, 5000) + 50);
      return;
    }
    grBusy = true;
    const job = grQueue.shift();
    job.onState?.('Goodreads: searching…');
    try {
      let info = null;
      const ctx = grContext(job.title);
      for (const q of goodreadsQueries(job.title)) {
        info = await goodreadsLookup(q, ctx);
        console.debug('[ABB] goodreads', JSON.stringify(q), '→', info?.url || 'no match');
        if (info) break;
        await sleep(GR_GAP);
      }
      grBlockStreak = 0;
      grCache[job.key] = { ...(info || { url: null }), t: Date.now() };
      saveGrCache();
      if (info) job.onDone(grCache[job.key]); else job.onState?.('Not on Goodreads — opens a Google search');
    } catch (err) {
      console.warn('[ABB] goodreads:', job.title, '—', err.message);
      if (err.blocked) {
        // Site-wide throttle, not this book's fault: pause, keep the job at the front, don't burn a try.
        grPausedUntil = Date.now() + GR_BACKOFF[Math.min(grBlockStreak++, GR_BACKOFF.length - 1)] * 1000;
        grQueue.unshift(job);
      } else {
        if (err.backoff) grPausedUntil = Date.now() + err.backoff;
        if (++job.tries < 3) grQueue.unshift(job);
        else job.onState?.('Goodreads lookup failed — opens a Google search');
      }
    }
    await sleep(GR_GAP);
    grBusy = false;
    grPump();
  }

  // Wire a card/page button: fallback link now, direct link when resolved.
  function attachGoodreads(anchor, title, { onInfo, onMiss } = {}) {
    anchor.href = goodreadsSearchUrl(cleanTitle(title));
    anchor.title = 'Goodreads (not looked up yet)';
    const done = info => {
      anchor.href = info.url;
      anchor.title = `Open on Goodreads — ★ ${info.rating.toFixed(2)} (${fmtCount(info.count)} ratings)`;
      anchor.classList.add('is-direct');
      onInfo?.(info);
    };
    const state = msg => { anchor.title = msg; if (/^Not on Goodreads|failed/.test(msg)) onMiss?.(); };
    const hit = grCached(title.toLowerCase());
    if (hit) { done(hit); return; }
    let queued = false;
    const kick = priority => { if (!queued) { queued = true; grVisible.unobserve(anchor); resolveGoodreads(title, done, state, priority); } };
    anchor.addEventListener('mouseenter', () => kick(true), { once: true });
    anchor._grKick = kick;
    grVisible.observe(anchor);
  }
  // Toolbar filter options. c = card.dataset (gr: pending | ok | miss)
  const GR_FILTERS = [
    ['r45',  '★ 4.5 and up',          c => c.gr === 'ok' && +c.grRating >= 4.5],
    ['r40',  '★ 4.0 and up',          c => c.gr === 'ok' && +c.grRating >= 4.0],
    ['r35',  '★ 3.5 and up',          c => c.gr === 'ok' && +c.grRating >= 3.5],
    ['n1k',  '1k+ ratings',           c => c.gr === 'ok' && +c.grCount >= 1000],
    ['n10k', '10k+ ratings',          c => c.gr === 'ok' && +c.grCount >= 10000],
    ['new',  'Under 100 ratings',     c => c.gr === 'ok' && +c.grCount < 100],
    ['miss', 'Not found', c => c.gr === 'miss'],
  ];
  const GR_TEST = Object.fromEntries(GR_FILTERS.map(([k, , t]) => [k, t]));
  const grVisible = new IntersectionObserver(entries =>
    entries.forEach(e => e.isIntersecting && e.target._grKick?.(false)), { rootMargin: '300px 0px' });

  /* ---------- Categories ---------- */
  const catNorm = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '');
  const catSlugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const CAT_SLUG_BY_NORM = Object.fromEntries(CATEGORIES.map(([n, s]) => [catNorm(n), s]));
  const CAT_NORM_BY_SLUG = Object.fromEntries(CATEGORIES.map(([n, s]) => [s, catNorm(n)]));

  // Listing pages print categories as plain text: "Category: Adults&nbsp; Gay&nbsp; Romance&nbsp; <br>Language: …".
  // Archive/book pages sometimes link them. Handle both; names map to slugs via CATEGORIES.
  function parseCategories(post) {
    const info = post.querySelector('.postInfo');
    if (!info) return [];
    const links = [...info.querySelectorAll('a[href*="/type/"]')];
    let names;
    if (links.length) {
      names = links.map(a => strip(a.textContent));
    } else {
      let raw = '';
      for (const n of info.childNodes) {                       // only the first line, up to <br>
        if (n.nodeName === 'BR') break;
        if (n.nodeType === 3 || n.nodeName === 'A' || n.nodeName === 'SPAN') raw += n.textContent;
      }
      raw = raw.replace(/^\s*Category:\s*/i, '').replace(/Language:.*$/i, '');
      names = raw.split(/\u00A0+/).map(s => s.replace(/\s+/g, ' ').trim());
    }
    return [...new Set(names.filter(Boolean))].map(name => {
      const norm = catNorm(name);
      return { name, norm, slug: CAT_SLUG_BY_NORM[norm] || catSlugify(name) };
    });
  }

  const sizeMb = s => {
    const m = (s || '').match(/([0-9.]+)\s*([KMGT])?/i);
    return m ? parseFloat(m[1]) * ({ K: 1 / 1024, M: 1, G: 1024, T: 1048576 }[(m[2] || 'M').toUpperCase()] || 1) : 0;
  };

  // "12 Sep 2026" (the Posted: value) → local-midnight timestamp; 0 if absent or unparseable
  const MONTH_ABBR = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
  const MONTH_IDX  = Object.fromEntries(MONTH_ABBR.map((m, i) => [m, i]));

  // Torrent-info tables carry "Creation Date: Wed, 24 Jun 2026 01:08:57 +0200" and the site's search can be
  // confined to that table (tt=3), so searching the phrase "jun 2026" returns one month's uploads directly.
  const monthPhrase = (y, m) => `${MONTH_ABBR[m]} ${y}`;                                    // "sep 2026"
  const MONTH_PHRASE_RE = /"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})"/i;
  // The month phrase in a search string, if any → { y, m, rest } (rest = the user's own keywords)
  function parseDateSearch(s) {
    const m = (s || '').match(MONTH_PHRASE_RE);
    return m ? { y: +m[2], m: MONTH_IDX[m[1].toLowerCase()], rest: s.replace(m[0], '').replace(/\s+/g, ' ').trim() } : null;
  }
  // Months overlapping [lo, hi] (timestamps; hi = 0 → now, lo = 0 → 2008, before the site existed), newest first
  function monthsBetween(lo, hi) {
    const out = [], end = new Date(hi || Date.now()), start = new Date(lo || new Date(2008, 0, 1));
    for (let y = end.getFullYear(), m = end.getMonth();
         y > start.getFullYear() || (y === start.getFullYear() && m >= start.getMonth()); ) {
      out.push({ y, m });
      if (--m < 0) { m = 11; y--; }
    }
    return out;
  }
  function parsePosted(s) {
    const m = (s || '').match(/(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{4})/);
    if (!m) return 0;
    const mo = MONTH_IDX[m[2].toLowerCase()];
    return mo === undefined ? 0 : new Date(+m[3], mo, +m[1]).getTime();
  }

  function parseCard(post) {
    const link = post.querySelector(POST_LINK_SEL);
    const text = post.textContent.replace(/\s+/g, ' ');
    const grab = re => (text.match(re) || [])[1] || '';
    const cats = parseCategories(post);
    return {
      title: link ? strip(link.textContent) : '',
      url: link?.href || '',
      img: post.querySelector('img')?.src || '',
      categories: cats.map(c => c.name),
      catKeys: [...new Set(cats.flatMap(c => [c.slug, c.norm]))],
      format: grab(/Format:\s*([A-Za-z0-9]+)/i).toLowerCase(),
      bitrate: grab(/Bitrate:\s*([0-9]+\s*[KkMm]?bps|\?+)/i),
      kbps: (m => m ? Math.round(parseFloat(m[1]) * (/m/i.test(m[2]) ? 1000 : 1)) : 0)
            (grab(/Bitrate:\s*([0-9.]+\s*[KkMm]?bps)/i).match(/([0-9.]+)\s*([KkMm]?)/)),
      size: grab(/File Size:\s*([0-9.]+\s*[KMGTP]?i?[Bb])/),
      mb: sizeMb(grab(/File Size:\s*([0-9.]+\s*[KMGT])/i)),
      language: grab(/Language:\s*([A-Za-z&'\- ]+?)(?:\s*Keywords|$)/i).trim(),
      posted: grab(/Posted:\s*([0-9]{1,2} \w{3,9} [0-9]{4})/),
    };
  }

  const ALLOWED_TAGS = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'A', 'SPAN']);

  // Copy a node keeping only basic formatting tags.
  function sanitizeNode(node, base, newTab) {
    const out = el('div');
    (function walk(src, dst) {
      for (const child of src.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          dst.appendChild(document.createTextNode(child.textContent.replace(INVISIBLES, '')));
        } else if (child.nodeType === Node.ELEMENT_NODE && ALLOWED_TAGS.has(child.tagName)) {
          const copy = el(child.tagName.toLowerCase());
          if (child.tagName === 'A') {
            copy.href = abs(child.getAttribute('href') || '#', base);
            if (newTab) copy.target = '_blank';
          }
          walk(child, copy);
          dst.appendChild(copy);
        }
      }
    })(node, out);
    return out;
  }

  const CHIP_LABEL = {
    series: '📚 Series', length: '⏱ Length', runtime: '⏱ Runtime', duration: '⏱ Duration',
    language: '🌐 Language', 'release date': '📅 Released', publisher: '🏢 Publisher',
  };
  const COMPACT_CHIPS = new Set(['series', 'length', 'runtime', 'duration', 'language']);
  const LABEL_RE = new RegExp('^(' + [
    'series', 'release date', 'language', 'format', 'length', 'publisher', 'categories',
    'category', 'narrated by', 'by', 'author', 'runtime', 'duration', 'narrator',
  ].join('|') + ')\\b[\\s:·•\\-–—|]*(.*)$', 'i');

  // Uploaders paste Amazon's details table, whose cells read "Listening Length ‏ : ‎ 12 hours and
  // 32 minutes". strip() now kills the bidi marks; this clears whatever separator they leave behind
  // so we never print "Length:  : 12 hours".
  const cleanChipValue = v => strip(v).replace(/^[\s:;,·•|\-–—]+/, '').replace(/[\s:;,·•|\-–—.]+$/, '');
  // "12 hours and 32 minutes" → "12h 32m"; anything unrecognised is left exactly as written
  const prettyLength = v => {
    const m = v.match(/^(?:(\d+)\s*(?:hours?|hrs?|h)\b)?(?:\s*(?:and|,|&)?\s*(\d+)\s*(?:minutes?|mins?|m)\b)?$/i);
    return m && (m[1] || m[2]) ? [m[1] && m[1] + 'h', m[2] && m[2] + 'm'].filter(Boolean).join(' ') : v;
  };
  const pushChip = (chips, chip, value) => {
    const v = cleanChipValue(value);
    if (v) chips.push([chip, chip.startsWith('⏱') ? prettyLength(v) : v]);
  };
  const splitSegs = p => p.innerHTML.split(/<br\s*\/?>/i);

  // Description element: chips (credits, series, length…) on top, cleaned prose below.
  // `full` keeps more label lines as chips (book page); compact mode chips only the essentials.
  function buildDescription(source, base, { newTab = true, full = false } = {}) {
    const wrap = el('div', 'abb-desc');
    const clean = sanitizeNode(source, base, newTab);
    const chips = [];
    const chipFor = label => ((full ? label in CHIP_LABEL : COMPACT_CHIPS.has(label)) ? CHIP_LABEL[label] : null);

    const written   = [...source.querySelectorAll('a .author')].map(s => strip(s.textContent));
    const narrators = [...source.querySelectorAll('a .narrator')].map(s => strip(s.textContent));
    if (written.length)   chips.push(['✍ Written by', written.join(', ')]);
    if (narrators.length) chips.push(['🎙 Read by', narrators.join(', ')]);
    const abr = source.querySelector('.is_abridged')?.textContent.trim();
    if (full && abr) chips.push(['📖 ' + abr[0].toUpperCase() + abr.slice(1).toLowerCase(), '']);

    // Flatten every <br>-separated line of every paragraph into one stream
    const lines = [];
    clean.querySelectorAll('p').forEach((p, pi) =>
      splitSegs(p).forEach((seg, si) => {
        const text = strip(seg);
        if (text) lines.push({ pi, si, text });
      }));

    const drop = new Set(); // "pi:si" of segments to remove
    for (let i = 0; i < lines.length; i++) {
      const L = lines[i], key = `${L.pi}:${L.si}`;
      // Credit/spec lines already shown as badges or chips
      if (/^(written|read)\s+by\b/i.test(L.text) || /^(format|bitrate)\s*:/i.test(L.text) ||
          /^(un)?abridged$/i.test(L.text) ||
          (/^(by|narrated by)\b\s*:?/i.test(L.text) && L.text.length < 100)) {
        drop.add(key);
        continue;
      }
      const m = L.text.match(LABEL_RE);
      if (!m) continue; // ordinary prose
      const label = m[1].toLowerCase().trim(), value = cleanChipValue(m[2]), chip = chipFor(label);
      if (value && value.length < 80) {
        drop.add(key);
        if (chip) pushChip(chips, chip, value);
      } else if (!value) {
        // bare label → value may be on the next line
        const nxt = lines[i + 1];
        if (nxt && nxt.text.length < 80 && !LABEL_RE.test(nxt.text)) {
          drop.add(key);
          drop.add(`${nxt.pi}:${nxt.si}`);
          if (chip) pushChip(chips, chip, nxt.text);
          i++;
        }
      }
      // long value → real content, left in place
    }

    clean.querySelectorAll('p').forEach((p, pi) => {
      const kept = splitSegs(p).filter((seg, si) => !drop.has(`${pi}:${si}`) && strip(seg));
      if (kept.length) p.innerHTML = kept.join('<br>'); else p.remove();
    });

    if (chips.length) {
      const row = el('div', 'abb-chips');
      chips.forEach(([label, value]) => row.appendChild(el('span', 'abb-chip', value ? `${label}: ${value}` : label)));
      wrap.appendChild(row);
    }
    const body = el('div', 'abb-body');
    body.append(...clean.childNodes);
    wrap.appendChild(body);
    return wrap;
  }

  // .torrent / magnet links from a detail page; builds a magnet from the info-hash table if none exists.
  function collectLinks(scope, html, base) {
    const links = new Map(); // href → label
    const add = (href, label) => { if (href && !links.has(href)) links.set(href, label); };

    scope.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href');
      if (h.startsWith('magnet:')) add(h, '🧲 Magnet');
      else if (/\.torrent(\?|$)|download\.php|\/downld/i.test(h)) add(abs(h, base), '⬇ Torrent');
    });
    const inline = html.match(/magnet:\?xt=urn:btih:[A-Za-z0-9]+[^"'\s<>]*/);
    if (inline) add(inline[0], '🧲 Magnet');

    if (![...links.keys()].some(h => h.startsWith('magnet:'))) {
      const cellsAfter = re => [...scope.querySelectorAll('td')]
        .filter(td => re.test(td.textContent.trim()))
        .map(td => td.nextElementSibling?.textContent.trim()).filter(Boolean);
      const [hash] = cellsAfter(/^info hash:?$/i);
      if (/^[a-f0-9]{40}$/i.test(hash || '')) {
        const name = scope.querySelector('h1[itemprop="name"], .postTitle h1')?.textContent.trim() || '';
        const trackers = [...new Set(cellsAfter(/^(announce url|tracker):?$/i))]
          .map(t => '&tr=' + encodeURIComponent(t)).join('');
        add(`magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(name)}${trackers}`, '🧲 Magnet');
      }
    }
    return links;
  }

  function linksRow(links) {
    const row = el('div', 'abb-links');
    if (!links.size) row.appendChild(el('span', 'abb-note', 'No download links found.'));
    links.forEach((label, href) => {
      const a = el('a', 'abb-dl', label);
      a.href = href;
      row.appendChild(a);
    });
    return row;
  }

  async function fetchDoc(url) {
    const res = await fetch(url, { credentials: 'omit' });
    if (res.status === 429 || res.status === 503) {           // throttled — not the end of results
      const secs = Number(res.headers.get('Retry-After')) || 30;
      throw Object.assign(new Error(`HTTP ${res.status}`), { retryAfter: Math.min(secs, 300) * 1000 });
    }
    const html = await res.text();
    return { res, html, doc: new DOMParser().parseFromString(html, 'text/html') };
  }

  // Only the full book page has a date; fetch it on demand (once per book) when a card is expanded.
  async function goodreadsPublished(title) {
    const key = title.toLowerCase(), e = grCache[key];
    if (!e?.url) return '';
    if (e.pub !== undefined) return e.pub;
    try {
      const r = await gmFetch(e.url, { Accept: 'text/html' });
      const m = r.responseText.match(/First published\s+([A-Z][a-z]+ \d{1,2}, \d{4})/) ||
                r.responseText.match(/Published\s+([A-Z][a-z]+ \d{1,2}, \d{4})/);
      e.pub = m ? m[1] : '';
    } catch { return ''; }        // transient: leave undefined so it's retried next time
    saveGrCache();
    return e.pub;
  }

  /* =====================================================================
     8. Shared header: logo · nav · expanding search · theme picker
     ===================================================================== */
  function buildHeader() {
    const header = el('header', 'abb-header');
    header.innerHTML = `
      <a class="abb-logo" href="/"><h1>📚 AudioBook Bay</h1></a>
      <nav class="abb-nav">
        ${NAV_LINKS.map(([label, href, title]) => `<a href="${href}" title="${esc(title)}">${label}</a>`).join('')}
        <form class="abb-search" method="get" action="/">
          <a class="abb-adv" href="/member/advanced_search" title="Advanced search">Advanced →</a>
          <input class="abb-input" type="search" name="s" maxlength="50" placeholder="Search AudioBook Bay…" autocomplete="off">
          <button type="button" class="abb-btn abb-icon" title="Search" aria-label="Search">${ICON_SEARCH}</button>
        </form>
        <div class="abb-theme">
          <button type="button" class="abb-btn abb-icon abb-theme-btn" title="Theme">🎨<span></span></button>
          <div class="abb-pop abb-theme-pop"></div>
        </div>
      </nav>`;
    // Home means a clean slate: drop every hybrid filter so the listing never resumes a crawl.
    // auxclick covers middle-click (new tabs inherit sessionStorage in Chromium).
    const logo = header.querySelector('.abb-logo');
    ['click', 'auxclick'].forEach(ev => logo.addEventListener(ev, clearHybridFilters));
    wireSearch(header);
    wireThemePicker(header);
    return header;
  }

  function wireSearch(header) {
    const form = header.querySelector('.abb-search');
    const input = form.querySelector('input');
    const adv = form.querySelector('.abb-adv');
    const btn = form.querySelector('button');
    const setOpen = open => {
      header.classList.toggle('abb-search-open', open);
      input.tabIndex = adv.tabIndex = open ? 0 : -1;
      if (open) input.focus();
    };
    setOpen(false);
    btn.addEventListener('click', () => {
      const open = header.classList.contains('abb-search-open');
      if (open && input.value.trim()) form.requestSubmit();
      else setOpen(!open);
    });
    form.addEventListener('submit', e => { if (!input.value.trim()) e.preventDefault(); });
    dismissOnOutside(form, () => setOpen(false));
  }

  function wireThemePicker(header) {
    const wrap = header.querySelector('.abb-theme');
    const btn = wrap.querySelector('.abb-theme-btn');
    const label = btn.querySelector('span');
    const pop = wrap.querySelector('.abb-theme-pop');

    const sync = () => {
      label.textContent = schemeLabel(settings.theme);
      btn.title = 'Theme · ' + label.textContent;
      pop.querySelectorAll('.abb-swatch').forEach(sw =>
        sw.classList.toggle('is-active', sw.dataset.scheme === settings.theme));
    };

    for (const kind of ['dark', 'light']) {
      pop.appendChild(el('div', 'abb-pop-title', `${kind} themes`));
      const grid = el('div', 'abb-swatches');
      schemesByKind(kind).forEach(k => {
        const s = SCHEMES[k];
        const sw = el('button', 'abb-swatch', schemeLabel(k));
        sw.type = 'button';
        sw.dataset.scheme = k;
        sw.style.background = s.card;   // per-scheme preview colours (legitimately dynamic)
        sw.style.color = s.fg;
        sw.addEventListener('click', () => { setTheme(k); sync(); wrap.classList.remove('is-open'); });
        grid.appendChild(sw);
      });
      pop.appendChild(grid);
    }
    sync();
    btn.addEventListener('click', () => wrap.classList.toggle('is-open'));
    dismissOnOutside(wrap, () => wrap.classList.remove('is-open'));
  }

  /* =====================================================================
     9. List mode (home, categories, tags, search results)
     ===================================================================== */
  function initListMode() {
    document.body.classList.add('abb-list');
    // Everything visible on a list page is ours — the site's stylesheets are dead weight here.
    document.querySelectorAll('link[rel~="stylesheet"], style:not(#abb-style)').forEach(n => n.remove());
    const root = el('div');
    root.id = 'abb-root';
    const toolbar = el('div', 'abb-toolbar');
    toolbar.innerHTML = `
      <input class="abb-input" type="search" id="abb-q" placeholder="Filter loaded titles… (Enter = site search)">
      <details class="abb-multi" id="abb-cat">
        <summary class="abb-input">Category · any</summary>
        <div class="abb-multi-panel">
          <label class="abb-multi-mode"><input type="checkbox" id="abb-cat-all"> Must match all selected</label>
          <div class="abb-multi-list"></div>
          <button type="button" class="abb-btn abb-multi-clear">Clear</button>
        </div>
      </details>
      <select class="abb-input" id="abb-lang"></select>
      <select class="abb-input" id="abb-fmt"></select>
      <select class="abb-input" id="abb-bit"></select>
      <select class="abb-input" id="abb-gr"></select>
      <details class="abb-multi abb-date" id="abb-date">
        <summary class="abb-input">Posted · any</summary>
        <div class="abb-multi-panel">
          <div class="abb-multi-group"><h4>Posted</h4>
            <label><input type="radio" name="abb-date" value="any" checked> Any time</label>
            <label><input type="radio" name="abb-date" value="today"> Today</label>
            <label><input type="radio" name="abb-date" value="7d"> Last 7 days</label>
            <label><input type="radio" name="abb-date" value="month"> This month</label>
            <label><input type="radio" name="abb-date" value="lastmonth"> Last month</label>
            <label><input type="radio" name="abb-date" value="custom"> Custom range</label>
          </div>
          <div class="abb-date-range">
            <label>From <input type="date" id="abb-date-from" class="abb-input"></label>
            <label>To <input type="date" id="abb-date-to" class="abb-input"></label>
          </div>
          <div class="abb-multi-actions">
            <button type="button" class="abb-btn abb-multi-clear" id="abb-date-clear">Clear</button>
            <button type="button" class="abb-btn abb-multi-apply" id="abb-date-apply" disabled>Search</button>
          </div>
        </div>
      </details>
      <select class="abb-input" id="abb-sort"></select>
      <details class="abb-multi abb-presets" id="abb-presets">
        <summary class="abb-input">User-specified presets</summary>
        <div class="abb-multi-panel">
          <div class="abb-preset-list"></div>
          <div class="abb-preset-new">
            <input class="abb-input" type="text" id="abb-preset-name" placeholder="Name this filter set…" maxlength="40">
            <button type="button" class="abb-btn abb-multi-apply" id="abb-preset-save">Save</button>
          </div>
        </div>
      </details>
      <label class="abb-switch"><input type="checkbox" id="abb-inf"> ∞ Scroll</label>
      <label class="abb-switch"><input type="checkbox" id="abb-grt"> Goodreads titles</label>
      <span class="abb-count"></span>`;
    const grid = el('div');
    grid.id = 'abb-grid';
    const statusEl = el('div', 'abb-status');
    const sentinel = el('div', 'abb-sentinel');
    root.append(buildHeader(), toolbar, grid, statusEl, sentinel);
    document.body.appendChild(root);

    const $ = s => root.querySelector(s);
    const qInput = $('#abb-q'), langSel = $('#abb-lang'), fmtSel = $('#abb-fmt'), bitSel = $('#abb-bit'),
          grSel = $('#abb-gr'), sortSel = $('#abb-sort'), infChk = $('#abb-inf'), grtChk = $('#abb-grt'),
          countEl = $('.abb-count');


    /* --- Hybrid (client-side) filters: ride along in sessionStorage between pages --- */
    const hyb = {
      lang: urlLang ? '' : (session.get('lang') || ''),
      cats:   (session.get('cat')   || '').split(',').filter(Boolean),
      exCats: (session.get('catEx') || '').split(',').filter(Boolean),
      date: (() => { try { return JSON.parse(session.get('date') || '{}'); } catch { return {}; } })(),
    };
    if (urlCat && !hyb.cats.includes(urlCat)) { hyb.cats.push(urlCat); hyb.exCats = hyb.exCats.filter(s => s !== urlCat); }
    const setHyb = (k, v) => { hyb[k] = v; session.set(k, v); };
    if (urlLang) session.set('lang', ''); // a built-in URL filter supersedes the hybrid one
    const dateActive = () => {
      const { preset, from, to } = hyb.date;
      return Boolean(preset && preset !== 'any' && (preset !== 'custom' || from || to));
    };
    const hybridActive = () => Boolean(hyb.lang || hyb.cats.length || hyb.exCats.length || dateActive());

    // Old date ranges come from the site's search rather than from paging back (see the Posted
    // block). Such a filter only makes sense on its month-search page: arriving anywhere else with
    // one in session, drop it rather than start a thousand-page crawl. Conversely a hand-typed
    // /?s="may 2012"&tt=3 adopts that month as the filter.
    const curSearch  = new URLSearchParams(location.search).get('s') || '';
    const dateSearch = isSearch ? parseDateSearch(curSearch) : null;            // { y, m, rest } on a month-search page
    const dateViaSearch = () => dateActive() && !['today', '7d'].includes(hyb.date.preset);
    if (dateViaSearch() && !dateSearch) { hyb.date = {}; session.set('date', ''); }
    if (dateSearch && !dateActive()) {
      const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      hyb.date = { preset: 'custom', from: iso(new Date(dateSearch.y, dateSearch.m, 1)), to: iso(new Date(dateSearch.y, dateSearch.m + 1, 0)) };
      session.set('date', JSON.stringify(hyb.date));
    }

    /* --- Dropdowns --- */
    function fillSelect(sel, anyLabel, options, selected) {
      sel.replaceChildren(new Option(anyLabel, 'any'),
        ...options.map(([value, label]) => new Option(label, value)));
      sel.value = [...sel.options].some(o => o.value === selected) ? selected : 'any';
    }
    fillSelect(langSel, 'Language · any',
      LANGUAGES.map(l => ['lang:' + l, 'Language · ' + l[0].toUpperCase() + l.slice(1)]),
      'lang:' + (urlLang || hyb.lang));
    fillSelect(fmtSel, 'Format · any',
      FORMATS.map(([f, l]) => ['fmt:' + f, 'Format · ' + l]), 'any');
    fillSelect(bitSel, 'Bitrate · any',
      BITRATES.map(([k, l]) => ['bit:' + k, 'Bitrate · ' + l]), 'any');
    fillSelect(grSel, 'Goodreads · any', GR_FILTERS.map(([k, l]) => ['gr:' + k, 'Goodreads · ' + l]), 'any');

    // Client-only choices a saved preset parked in session for this page (see applyPreset) — consumed once
    try {
      const local = JSON.parse(session.get('local') || 'null');
      if (local) {
        [[fmtSel, local.fmt], [bitSel, local.bit], [grSel, local.gr]]
          .forEach(([sel, v]) => { if ([...sel.options].some(o => o.value === v)) sel.value = v; });
        qInput.value = local.q || '';
      }
    } catch { /* ignore */ }
    session.set('local', '');

    // Client-only filters: hide/show, then let the pump top up if the sentinel is now visible
    const localFilter = () => { applyFilters(); pump(); };
    fmtSel.addEventListener('change', localFilter);
    bitSel.addEventListener('change', localFilter);
    grSel.addEventListener('change', localFilter);
    // Anything that needs Goodreads data for cards the reader hasn't reached: a GR filter or a GR sort
    function sortsByGoodreads() { return /^(rating|count)$/.test(sortSel.value); }
    function wantsGoodreads()   { return grSel.value !== 'any' || sortsByGoodreads(); }
    function pendingGoodreads() { return grid.querySelectorAll('.abb-card[data-gr="pending"]').length; }
    function kickPendingGoodreads() {
      grid.querySelectorAll('.abb-card[data-gr="pending"] .abb-gr').forEach(a => a._grKick?.(false));
    }
    // A card that resolves (or misses) may now pass/fail the GR filter, or belong elsewhere in a GR sort
    grid.addEventListener('abb:goodreads', () => {
      if (grSel.value !== 'any') localFilter();
      if (sortsByGoodreads()) scheduleSort();
    });

    const refilter = () => { applyFilters(); burst = 0; burstPaused = false; pump(); };
    const goTo = href => { location.href = href; };

    /* --- Category: multi-select panel, always client-side. Each row is include (checkbox) or exclude
           (the "−" toggle): "Sci-Fi or Thriller, but nothing that is also Fantasy". --- */
    const catBox = $('#abb-cat'), catSummary = catBox.querySelector('summary'),
          catList = catBox.querySelector('.abb-multi-list'), catAllChk = $('#abb-cat-all');
    catList.innerHTML = `<div class="abb-multi-group">` +
      CATEGORIES.map(([n, s]) => `<label><input type="checkbox" value="${esc(s)}" data-name="${esc(n)}"> <span>${esc(n)}</span>` +
        `<button type="button" class="abb-cat-ex" title="Exclude ${esc(n)}" aria-label="Exclude ${esc(n)}">−</button></label>`).join('') +
      `</div>`;
    const catBoxes = [...catList.querySelectorAll('input')];
    const catName = slug => catBoxes.find(b => b.value === slug)?.dataset.name || slug;
    const syncCatBoxes = () => catBoxes.forEach(b => {
      const ex = hyb.exCats.includes(b.value);
      b.checked = !ex && hyb.cats.includes(b.value);
      b.closest('label').classList.toggle('is-ex', ex);
    });
    syncCatBoxes();
    catAllChk.checked = session.get('catAll') === '1';
    const hasCat = (c, slug) => { const k = c.dataset.cats.split(' '); return k.includes(slug) || k.includes(CAT_NORM_BY_SLUG[slug]); };

    function updateCatSummary() {
      const n = hyb.cats.length, x = hyb.exCats.length;
      const inc = !n ? '' : n === 1 ? catName(hyb.cats[0]) : `${n} selected${catAllChk.checked ? ' (all)' : ''}`;
      const exc = !x ? '' : x === 1 ? `− ${catName(hyb.exCats[0])}` : `− ${x} excluded`;
      catSummary.textContent = 'Category · ' + ([inc, exc].filter(Boolean).join(' ') || 'any');
    }
    const saveCats = () => {
      session.set('cat', hyb.cats.join(','));
      session.set('catEx', hyb.exCats.join(','));
      session.set('catAll', catAllChk.checked ? '1' : '');
      syncCatBoxes(); updateCatSummary(); refilter();
    };
    catList.addEventListener('change', e => {                    // include checkbox
      if (e.target.type !== 'checkbox') return;
      hyb.exCats = hyb.exCats.filter(s => s !== e.target.value);   // ticking an excluded one un-excludes it
      hyb.cats = catBoxes.filter(b => b.checked).map(b => b.value);
      saveCats();
    });
    catList.addEventListener('click', e => {                     // "−" exclude toggle
      const btn = e.target.closest('.abb-cat-ex');
      if (!btn) return;
      e.preventDefault();
      const slug = btn.closest('label').querySelector('input').value;
      hyb.exCats = hyb.exCats.includes(slug) ? hyb.exCats.filter(s => s !== slug) : [...hyb.exCats, slug];
      hyb.cats = hyb.cats.filter(s => s !== slug);
      saveCats();
    });
    catAllChk.addEventListener('change', saveCats);
    catBox.querySelector('.abb-multi-clear').addEventListener('click', () => { hyb.cats = []; hyb.exCats = []; saveCats(); });
    dismissOnOutside(catBox, () => { catBox.open = false; });
    updateCatSummary();

    /* --- Posted date. Today / 7 days are trimmed client-side from the listing. Anything older is
           served by the site's search on the torrent creation date ("sep 2026", tt=3), one month per
           search, newest first — see parseDateSearch. State rides in session like categories. --- */
    const dateBox = $('#abb-date'), dateSummary = dateBox.querySelector('summary'),
          dateRadios = [...dateBox.querySelectorAll('input[type="radio"]')],
          dateFrom = $('#abb-date-from'), dateTo = $('#abb-date-to');
    const DAY = 86_400_000, DATE_PRESETS = { today: 0, '7d': 7 };
    const startOfDay = ms => { const x = new Date(ms); x.setHours(0, 0, 0, 0); return x.getTime(); };
    const fromISO = s => (s ? startOfDay(new Date(s + 'T00:00:00')) : 0);   // local midnight, not UTC
    // Recomputed on every filter pass so "last 7 days" / "this month" stay right in a long-open tab
    function dateBounds() {
      const { preset, from, to } = hyb.date;
      if (!dateActive()) return [0, 0];
      if (preset === 'custom') return [fromISO(from), to ? fromISO(to) + DAY - 1 : 0];   // "to" is inclusive
      if (preset === 'month' || preset === 'lastmonth') {
        const now = new Date(), m = now.getMonth() - (preset === 'lastmonth' ? 1 : 0);
        // the search matches the torrent's creation date; the post itself may go up a day or two later
        return [new Date(now.getFullYear(), m, 1).getTime(), new Date(now.getFullYear(), m + 1, 3).getTime() - 1];
      }
      return [startOfDay(Date.now() - (DATE_PRESETS[preset] ?? 0) * DAY), 0];
    }

    // Months to ask the site's search for. Deliberately NOT derived from dateBounds(): the presets'
    // two-day slack is for trimming cards, and would otherwise make us search the *following* month.
    function dateMonths() {
      const { preset, from, to } = hyb.date;
      if (preset === 'month' || preset === 'lastmonth') {
        const now = new Date(), d = new Date(now.getFullYear(), now.getMonth() - (preset === 'lastmonth' ? 1 : 0), 1);
        return [{ y: d.getFullYear(), m: d.getMonth() }];
      }
      return monthsBetween(fromISO(from), to ? fromISO(to) : 0);      // custom: one search per month in range
    }

    // /?s="sep 2026"&tt=3 — tt=3 confines the search to the torrent-info table, where the creation date
    // lives. With the user's own keywords the restriction is dropped so title/description match too.
    const dateSearchUrl = ({ y, m }, kw) => {
      const u = new URL('/', location.origin);
      u.searchParams.set('s', `"${monthPhrase(y, m)}"${kw ? ' ' + kw : ''}`);
      if (!kw) u.searchParams.set('tt', '3');
      return u.href;
    };
    const dateKw = dateSearch ? dateSearch.rest : (isSearch ? curSearch : '');   // keywords to carry along

    // Months still to fetch after the one this page shows, newest first (empty unless on a month search)
    let dateQueue = dateSearch && dateViaSearch()
      ? dateMonths().filter(({ y, m }) => y * 12 + m < dateSearch.y * 12 + dateSearch.m)
      : [];

    const fmtDay = ms => new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    function updateDateSummary() {
      const { preset, from, to } = hyb.date;
      dateSummary.textContent =
        !dateActive()         ? 'Posted · any'
        : preset !== 'custom' ? 'Posted · ' + dateRadios.find(r => r.value === preset).parentElement.textContent.trim().toLowerCase()
        : from && to          ? `Posted · ${fmtDay(fromISO(from))} – ${fmtDay(fromISO(to))}`
        : from                ? `Posted · since ${fmtDay(fromISO(from))}`
        :                       `Posted · until ${fmtDay(fromISO(to))}`;
    }
    const onDateChange = () => {
      hyb.date = { preset: dateRadios.find(r => r.checked)?.value || 'any', from: dateFrom.value, to: dateTo.value };
      session.set('date', JSON.stringify(hyb.date));
      updateDateSummary();
      syncDateInputs();
      if (dateViaSearch()) {
        const months = dateMonths();
        if (!dateSearch || dateSearch.y !== months[0].y || dateSearch.m !== months[0].m) { goTo(dateSearchUrl(months[0], dateKw)); return; }
        dateQueue = months.slice(1);                            // same newest month as this page: stay, refresh the queue
        if (!nextPage && dateQueue.length) { nextPage = dateSearchUrl(dateQueue.shift(), dateKw); emptyPages = 0; }
      } else if (dateSearch) {                                  // leaving a month search: back to the plain listing / search
        goTo(dateKw ? `/?s=${encodeURIComponent(dateKw)}` : '/'); return;
      }
      refilter();
    };
    const dateApply = $('#abb-date-apply');
    const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    // Custom range is staged: picking dates only shows the inputs and arms "Search"; nothing runs until it's clicked.
    // Future dates are greyed out (max = today) and the two pickers bound each other.
    const syncDateInputs = () => {
      const today = todayISO();
      dateFrom.max = dateTo.value && dateTo.value < today ? dateTo.value : today;
      dateTo.max = today; dateTo.min = dateFrom.value || '';
      dateBox.classList.toggle('abb-date-custom', dateRadios.find(r => r.checked)?.value === 'custom');
      dateApply.disabled = !(dateFrom.value || dateTo.value);
    };
    (dateRadios.find(r => r.value === hyb.date.preset) || dateRadios[0]).checked = true;
    dateFrom.value = hyb.date.from || ''; dateTo.value = hyb.date.to || '';
    dateRadios.forEach(r => r.addEventListener('change', () => {
      if (r.value === 'custom') { syncDateInputs(); dateFrom.focus(); return; }     // presets apply at once; custom waits for Search
      onDateChange();
    }));
    [dateFrom, dateTo].forEach(i => {
      i.addEventListener('input', () => { dateRadios.find(r => r.value === 'custom').checked = true; syncDateInputs(); });
      i.addEventListener('keydown', e => { if (e.key === 'Enter' && !dateApply.disabled) { e.preventDefault(); dateApply.click(); } });
    });
    dateApply.addEventListener('click', () => {
      if (!dateFrom.checkValidity() || !dateTo.checkValidity()) { (dateFrom.checkValidity() ? dateTo : dateFrom).focus(); return; }   // typed a future date
      if (dateFrom.value && dateTo.value && dateFrom.value > dateTo.value) [dateFrom.value, dateTo.value] = [dateTo.value, dateFrom.value];
      onDateChange();
    });
    $('#abb-date-clear').addEventListener('click', () => { dateRadios[0].checked = true; dateFrom.value = dateTo.value = ''; onDateChange(); });
    dismissOnOutside(dateBox, () => { dateBox.open = false; });
    updateDateSummary();
    syncDateInputs();

    /* --- Language: small archives, so read the archive; categories ride along in session --- */
    langSel.addEventListener('change', () => {
      const lang = langSel.value === 'any' ? '' : langSel.value.slice(5);
      if (isSearch) { setHyb('lang', lang); refilter(); return; }
      session.set('lang', '');
      const path = lang ? `/audio-books/tag/${lang}/` : '/';
      if (path === location.pathname) { hyb.lang = ''; refilter(); } else goTo(path);
    });

    qInput.addEventListener('input', applyFilters);
    qInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && qInput.value.trim()) goTo('/?s=' + encodeURIComponent(qInput.value.trim()));
    });

    infChk.checked = settings.infinite;
    infChk.addEventListener('change', () => { setting('infinite', infChk.checked); pump(); });

    grtChk.checked = settings.grTitles;
    grtChk.addEventListener('change', () => {
      setting('grTitles', grtChk.checked);
      grid.querySelectorAll('.abb-card').forEach(renderTitle);
      if (sortSel.value === 'title') applySort();
    });

    /* --- Sort --- */
    const SORTS = [
      ['posted', 'Sort · newest first'],
      ['rating', 'Sort · Goodreads rating'],
      ['count',  'Sort · most rated'],
      ['size',   'Sort · largest file'],
      ['title',  'Sort · title A–Z'],
    ];
    const displayedTitle = c => (grtChk.checked && c.dataset.grSure === '1' ? c.dataset.grTitle : c.dataset.abbTitle) || '';
    const SORT_KEY = {                     // smaller sorts first; unresolved GR data sinks to the bottom
      posted: c => +c.dataset.order,
      rating: c => -(+c.dataset.grRating || 0),
      count:  c => -(+c.dataset.grCount  || 0),
      size:   c => -(+c.dataset.mb || 0),
      title:  c => displayedTitle(c).toLowerCase().replace(/^(the|an?)\s+/, ''),
    };
    sortSel.replaceChildren(...SORTS.map(([k, l]) => new Option(l, k)));
    sortSel.value = SORTS.some(([k]) => k === settings.sort) ? settings.sort : 'posted';

    function applySort() {
      const key = SORT_KEY[sortSel.value] || SORT_KEY.posted;
      [...grid.children]
        .sort((a, b) => { const x = key(a), y = key(b); return x < y ? -1 : x > y ? 1 : +a.dataset.order - +b.dataset.order; })
        .forEach(c => grid.appendChild(c));
    }
    // Goodreads results arrive about one a second; batch the re-sorts so cards don't hop under the cursor
    let sortTimer = 0;
    function scheduleSort() { clearTimeout(sortTimer); sortTimer = setTimeout(applySort, 500); }
    sortSel.addEventListener('change', () => {
      setting('sort', sortSel.value);
      applySort();
      if (sortsByGoodreads()) { kickPendingGoodreads(); applyFilters(); }
    });

    /* --- Saved filter sets. Everything the toolbar knows, under a name in localStorage. Applying one
           writes the hybrid parts into session, parks the client-only parts (format, bitrate, Goodreads,
           text) in a one-shot session key, and navigates to whichever page the set needs. --- */
    const presetBox = $('#abb-presets'), presetSummary = presetBox.querySelector('summary'),
          presetList = presetBox.querySelector('.abb-preset-list'),
          presetName = $('#abb-preset-name'), presetSave = $('#abb-preset-save');
    const loadPresets = () => { try { const v = JSON.parse(presetStore.get('list') || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
    const savePresets = list => presetStore.set('list', list.length ? JSON.stringify(list) : '');
    const snapshot = () => ({
      cats: hyb.cats, ex: hyb.exCats, all: catAllChk.checked, lang: urlLang || hyb.lang || '',
      date: dateActive() ? hyb.date : null,
      fmt: fmtSel.value, bit: bitSel.value, gr: grSel.value, sort: sortSel.value, q: qInput.value.trim(),
    });
    const describe = p => {
      const bits = [];
      if (p.cats?.length) bits.push(p.cats.map(catName).join(p.all ? ' + ' : ', '));
      if (p.ex?.length)   bits.push('− ' + p.ex.map(catName).join(', '));
      if (p.lang)         bits.push(p.lang[0].toUpperCase() + p.lang.slice(1));
      [fmtSel, bitSel, grSel].forEach((sel, i) => {
        const v = p[['fmt', 'bit', 'gr'][i]], o = [...sel.options].find(o => o.value === v);
        if (o && v !== 'any') bits.push(o.text);
      });
      if (p.date) bits.push(p.date.preset === 'custom'
        ? [p.date.from, p.date.to].filter(Boolean).join(' – ')
        : dateRadios.find(r => r.value === p.date.preset)?.parentElement.textContent.trim().toLowerCase());
      if (p.q) bits.push(`“${p.q}”`);
      if (p.sort && p.sort !== 'posted') bits.push(SORTS.find(([k]) => k === p.sort)?.[1].replace('Sort · ', ''));
      return bits.filter(Boolean).join(' · ') || 'no filters';
    };
    function applyPreset(p) {
      session.set('cat', (p.cats || []).join(','));
      session.set('catEx', (p.ex || []).join(','));
      session.set('catAll', p.all ? '1' : '');
      session.set('date', p.date ? JSON.stringify(p.date) : '');
      session.set('lang', p.lang || '');                       // client-side on search pages; the tag archive elsewhere
      session.set('local', JSON.stringify({ fmt: p.fmt, bit: p.bit, gr: p.gr, q: p.q || '' }));   // consumed once, on arrival
      setting('sort', p.sort || 'posted');
      hyb.date = p.date || {};
      goTo(dateViaSearch() ? dateSearchUrl(dateMonths()[0], '')
         : p.lang          ? `/audio-books/tag/${p.lang}/`
         :                   '/');
    }
    function renderPresets() {
      const list = loadPresets();
      presetSummary.textContent = list.length ? `Presets · ${list.length}` : 'User-specified Presets';
      presetList.replaceChildren(...list.map((p, i) => {
        const row = el('div', 'abb-preset');
        const go = el('button', 'abb-preset-go'); go.type = 'button'; go.title = 'Apply this filter set';
        go.append(el('strong', '', p.name), el('small', '', describe(p)));
        go.addEventListener('click', () => applyPreset(p));
        const upd = el('button', 'abb-preset-upd', '↻'); upd.type = 'button'; upd.title = 'Overwrite with the current filters';
        upd.addEventListener('click', () => { list[i] = { ...snapshot(), name: p.name }; savePresets(list); renderPresets(); });
        const del = el('button', 'abb-preset-del', '×'); del.type = 'button'; del.title = 'Delete';
        del.addEventListener('click', () => { list.splice(i, 1); savePresets(list); renderPresets(); });
        row.append(go, upd, del);
        return row;
      }));
      if (!list.length) presetList.appendChild(el('div', 'abb-preset-empty', 'No saved sets yet — set your filters, name them below and click Save.'));
    }
    const doSavePreset = () => {
      const name = presetName.value.trim();
      if (!name) { presetName.focus(); return; }
      const list = loadPresets(), i = list.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      const p = { ...snapshot(), name };
      if (i >= 0) list[i] = p; else list.push(p);              // same name overwrites
      savePresets(list); presetName.value = ''; renderPresets();
    };
    presetSave.addEventListener('click', doSavePreset);
    presetName.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSavePreset(); } });
    dismissOnOutside(presetBox, () => { presetBox.open = false; });
    renderPresets();

    // Show Goodreads' canonical title (+ author) when we have a confident match and the toggle is on.
    function renderTitle(card) {
      const a = card.querySelector('.abb-title');
      const useGr = grtChk.checked && card.dataset.grSure === '1';
      a.textContent = useGr ? card.dataset.grTitle : card.dataset.abbTitle;
      if (useGr && card.dataset.grAuthor) a.insertAdjacentHTML('beforeend', ` <span class="abb-by">· ${esc(card.dataset.grAuthor)}</span>`);
      a.title = useGr ? `ABB title: ${card.dataset.abbTitle}` : '';
    }

    /* --- Cards --- */
    const badge = (t, cls = '') => (t ? `<span class="abb-badge ${cls}">${esc(t)}</span>` : '');
    let cardSeq = 0;

    function makeCard(d) {
      const card = el('div', 'abb-card');
      Object.assign(card.dataset, {
        title: d.title.toLowerCase(), format: d.format,
        lang: d.language.toLowerCase(), cats: d.catKeys.join(' '),
        kbps: String(d.kbps),
        gr: 'pending',
        abbTitle: d.title,
        order: cardSeq++,
        mb: String(d.mb),
        ts: String(parsePosted(d.posted))
      });
      card.innerHTML = `
        <div class="abb-row">
          ${d.img ? `<img class="abb-cover" src="${esc(d.img)}" alt="" loading="lazy" decoding="async">` : ''}
          <div class="abb-main">
            <a class="abb-title" href="${esc(d.url)}">${esc(d.title)}</a>
            <div class="abb-badges">${d.categories.map(c => badge(c, 'abb-cat')).join('')}${badge(d.format.toUpperCase())}${badge(d.bitrate)}${badge(d.size)}${badge(d.language)}${badge(d.posted)}</div>
          </div>
          <div class="abb-actions">
            <a class="abb-btn abb-icon abb-gr" target="_blank" rel="noopener">g</a>
            <button type="button" class="abb-btn abb-icon abb-toggle" title="Show details" aria-expanded="false">▶</button>
          </div>
        </div>
        <div class="abb-panel"></div>`;
      card.querySelector('.abb-cover')?.addEventListener('error', e => e.target.remove());
      card.querySelector('.abb-toggle').addEventListener('click', e => {
        const open = card.classList.toggle('abb-open');
        e.currentTarget.setAttribute('aria-expanded', open);
        if (open && !card.dataset.loaded) {
          card.dataset.loaded = '1';
          loadDetails(card, d.url);
          goodreadsPublished(d.title).then(pub => pub &&
            card.querySelector('.abb-badges').insertAdjacentHTML('beforeend', badge('First published ' + pub, 'abb-gr-badge')));
        }
      });
      const grDone = () => card.dispatchEvent(new CustomEvent('abb:goodreads', { bubbles: true }));
      attachGoodreads(card.querySelector('.abb-gr'), d.title, {
        onInfo: info => {
          Object.assign(card.dataset, {
            gr: 'ok', grRating: info.rating, grCount: info.count,
            grTitle: info.title, grAuthor: info.author, grSure: grPlausible(d.title, info) ? '1' : '',
            title: `${d.title} ${info.title} ${info.author}`.toLowerCase(),   // text filter matches either title
          });
          renderTitle(card);
          card.querySelector('.abb-badges').insertAdjacentHTML('beforeend',
            badge(`★ ${info.rating.toFixed(2)} · ${fmtCount(info.count)}`, 'abb-gr-badge') +
            (info.series ? badge(info.series, 'abb-gr-badge') : ''));
          grDone();
        },
        onMiss: () => { card.dataset.gr = 'miss'; grDone(); },
      });
      return card;
    }

    // Abridged/Unabridged lives only in the full description, which list pages don't carry,
    // so it can be badged only once a card's book page has been fetched.
    function markAbridged(card, doc) {
      if (card.dataset.abridged !== undefined) return;
      const raw = doc.querySelector('.is_abridged')?.textContent.trim() || '';
      const val = raw ? raw[0].toUpperCase() + raw.slice(1).toLowerCase() : '';
      card.dataset.abridged = val;
      if (val) card.querySelector('.abb-badges').insertAdjacentHTML('beforeend', badge(val));
    }

    async function loadDetails(card, url) {
      const panel = card.querySelector('.abb-panel');
      panel.textContent = 'Loading details…';
      try {
        const { res, html, doc } = await fetchDoc(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        markAbridged(card, doc);
        const src = doc.querySelector('.desc[itemprop="description"]');
        const desc = src ? buildDescription(src, url) : el('div', 'abb-desc');
        if (!src) desc.innerHTML = '<em>No description found on the detail page.</em>';
        const more = el('a', 'abb-more', 'Full page ↗');
        more.href = url;
        const foot = el('div', 'abb-panel-foot');
        foot.append(linksRow(collectLinks(doc, html, url)), more);
        panel.replaceChildren(desc, foot);
      } catch (err) {
        console.warn('[ABB] details:', err);
        panel.textContent = 'Could not load details — close and reopen to retry.';
        delete card.dataset.loaded;
      }
    }

    const knownUrls = new Set();
    function addCardsFrom(doc) {
      let added = 0;
      findPosts(doc).forEach(post => {
        const d = parseCard(post);
        if (!d.title || !d.url || knownUrls.has(d.url)) return;
        knownUrls.add(d.url);
        grid.appendChild(makeCard(d));
        added++;
      });
      if (added && sortSel.value !== 'posted') applySort();
      return added;
    }

    /* --- Filtering --- */
    function applyFilters() {
      const q = qInput.value.trim().toLowerCase();
      const fmt = fmtSel.value === 'any' ? '' : fmtSel.value.slice(4);
      const bit = bitSel.value === 'any' ? null : BITRATE_TEST[bitSel.value.slice(4)];
      const gr = grSel.value === 'any' ? null : GR_TEST[grSel.value.slice(3)];
      const [dLo, dHi] = dateBounds();
      const cards = [...grid.children];
      let visible = 0;
      cards.forEach(c => {
        const ok = (!q || c.dataset.title.includes(q)) &&
          (!fmt || (fmt === 'other' ? !KNOWN_FORMATS.includes(c.dataset.format) : c.dataset.format === fmt)) &&
          (!bit || bit(Number(c.dataset.kbps))) &&
          (!dLo || !+c.dataset.ts || +c.dataset.ts >= dLo) &&      // undated posts always pass
          (!dHi || !+c.dataset.ts || +c.dataset.ts <= dHi) &&
          (!gr || gr(c.dataset)) &&
          (!hyb.lang || c.dataset.lang === hyb.lang) &&
          (!hyb.cats.length || (catAllChk.checked ? hyb.cats.every(s => hasCat(c, s)) : hyb.cats.some(s => hasCat(c, s)))) &&
          !hyb.exCats.some(s => hasCat(c, s));
        c.style.display = ok ? '' : 'none';
        if (ok) visible++;
      });

      if (wantsGoodreads()) kickPendingGoodreads();
      countEl.textContent = `${visible} shown / ${cards.length} total`;
      const pending = wantsGoodreads() ? pendingGoodreads() : 0;
      if (pending) countEl.textContent += ` · ${pending} awaiting Goodreads`;
    }

    /* --- Infinite scroll --- */
    // Next page: real pagination link if present, else increment /page/N/ (query string preserved).
    const pageNoOf = url => Number((new URL(url).pathname.match(/\/page\/(\d+)\/?$/) || [])[1] || 1);

    function nextLinkIn(doc, base) {
      const cur = pageNoOf(base);
      const a = doc.querySelector('a.next, .next.page-numbers, a[rel="next"]');
      if (a?.getAttribute('href')) {
        const href = abs(a.getAttribute('href'), base);
        if (pageNoOf(href) > cur) return href;          // never accept a link that goes backwards
      }
      const u = new URL(base);
      u.pathname = u.pathname.replace(/\/(page\/\d+\/?)?$/, '') + `/page/${cur + 1}/`;
      return u.href;
    }

    let nextPage = nextLinkIn(document, location.href);
    let loading = false, emptyPages = 0, lastError = false, curLabel = '', sentinelVisible = false;
    let checked = 0, lastPage = pageNoOf(location.href), burst = 0, burstPaused = false, retryAt = 0;
    let prefetch = null;                                   // { url, promise } — the next page, fetched early
    function prefetchNext() {
      if (!nextPage || loading || lastError || !infChk.checked || prefetch?.url === nextPage) return;
      const promise = fetchDoc(nextPage);
      promise.catch(() => {});                             // any failure surfaces when loadMore awaits it
      prefetch = { url: nextPage, promise };
    }

    async function loadMore() {
      loading = true;
      lastError = false;
      updateStatus();
      lastPage = pageNoOf(nextPage);
      checked++;
      let added = 0;
      const ds = parseDateSearch(new URL(nextPage).searchParams.get('s'));
      curLabel = ds ? `${MONTH_ABBR[ds.m][0].toUpperCase() + MONTH_ABBR[ds.m].slice(1)} ${ds.y}, ` : '';
      try {
        const pending = prefetch?.url === nextPage ? prefetch.promise : fetchDoc(nextPage);
        prefetch = null;
        const { res, doc } = await pending;
        // WordPress answers an out-of-range /page/N/ with a redirect (or 404): that's the real end.
        const redirected = res.redirected && new URL(res.url).pathname !== new URL(nextPage).pathname;
        if (!res.ok || redirected) {
          nextPage = null;
        } else {
          added = addCardsFrom(doc);
          applyFilters();
          emptyPages = added ? 0 : emptyPages + 1;
          nextPage = emptyPages >= MAX_EMPTY_PAGES ? null : nextLinkIn(doc, nextPage);
        }
        if (!nextPage && dateQueue.length) {                    // this month is exhausted — on to the next older one
          nextPage = dateSearchUrl(dateQueue.shift(), dateKw);
          emptyPages = 0;
        }
      } catch (err) {
        console.warn('[ABB] load more:', err);
        if (err.retryAfter) {                                  // 429/503: wait it out, then carry on by itself
          retryAt = Date.now() + err.retryAfter;
          setTimeout(() => { retryAt = 0; pump(); }, err.retryAfter);
        } else lastError = true;
      }
      loading = false;
      return added;
    }

    const visibleCount = () => [...grid.children].filter(c => c.style.display !== 'none').length;

    // Listings run newest-first, so once the oldest loaded post predates the range start, no later
    // page can match. Search results aren't date-ordered, so they're exempt and just keep paging.
    function pastDateRange() {
      const [lo] = dateBounds();
      if (!lo || isSearch) return false;
      const stamps = [...grid.children].map(c => +c.dataset.ts).filter(Boolean);
      return stamps.length > 0 && Math.min(...stamps) < lo;
    }

    // Is another page needed right now?
    function needMore() {
      if (!infChk.checked || !nextPage || lastError || burstPaused) return false;
      if (document.hidden || retryAt > Date.now()) return false;   // background tab / site asked us to slow down
      if (pastDateRange()) return false;
      if (wantsGoodreads() && pendingGoodreads() >= 18) return false;
      if (sentinelVisible) return true;                        // reader is at the bottom
      return hybridActive() && visibleCount() < FILL_TARGET;   // hidden-filter fill
    }

    // The only thing that calls loadMore(). Safe to call from anywhere, any number of times:
    // if a loop is already running it re-checks needMore() after every page, so it picks up
    // filter changes, sentinel changes and the toggle without a second loop ever starting.
    async function pump() {
      if (loading) return;
      while (needMore()) {
        burst++;
        await loadMore();
        if (hybridActive() && burst >= MAX_BURST_PAGES) { burstPaused = true; break; }
        // Filling for a hidden filter is our idea, not the reader's — pace it so we never hammer the site
        if (!sentinelVisible && needMore()) await sleep(PAGE_GAP);
      }
      if (sentinelVisible) prefetchNext();        // don't warm page N+1 for a reader who may never scroll
      updateStatus();
    }

    new IntersectionObserver(entries => {
      sentinelVisible = entries.some(e => e.isIntersecting);
      if (sentinelVisible) pump();
    }, { rootMargin: '900px 0px' }).observe(sentinel);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) pump(); });

    // Status line doubles as the retry / keep-searching control. nextPage is left alone,
    // so "keep searching" continues from where it paused.
    statusEl.addEventListener('click', () => {
      if (loading && hybridActive()) { burstPaused = true; return; }   // brake: stop after the page in flight
      if (!lastError && !burstPaused) return;
      lastError = false; burstPaused = false; burst = 0; retryAt = 0;
      pump();
    });

    function updateStatus() {
      const found = visibleCount();
      statusEl.classList.toggle('is-action', lastError || burstPaused || (loading && hybridActive()));
      statusEl.textContent =
        !infChk.checked  ? 'Infinite scroll is off'
        : retryAt > Date.now() ? `Site is busy — pausing ${Math.ceil((retryAt - Date.now()) / 1000)}s before retrying`
        : lastError      ? 'Load failed — click to retry'
        : burstPaused    ? `Checked ${checked} pages (up to page ${lastPage}), ${found} matching — click to check ${MAX_BURST_PAGES} more`
        : loading        ? (hybridActive() ? `Searching… ${curLabel}page ${lastPage}, ${found} matching so far — click to pause` : 'Loading…')
        : pastDateRange() ? '— No older posts in this date range —'
        : !nextPage      ? (dateSearch ? '— End of results for this date range —' : '— End of results —')
        : 'Scroll for more';
    }

    /* --- Initial render --- */
    addCardsFrom(document);
    applyFilters();
    pump();
  }

  /* =====================================================================
     10. Main-template pages (#content): book pages, login, donate, …
         Shared header on top, native #content moved underneath, sidebars gone.
     ===================================================================== */

  // Donate page: turn the 2-column crypto table into one card per wallet.
  function tidyDonatePage(card) {
    const table = card.querySelector('table.main_table');
    if (!table) return;
    const rows = [...table.querySelectorAll('tr')];
    const wallets = [];
    for (let i = 0; i + 2 < rows.length; i += 3) {           // name row, address row, QR row
      const names = rows[i].querySelectorAll('td'), addrs = rows[i + 1].querySelectorAll('td'), qrs = rows[i + 2].querySelectorAll('td');
      names.forEach((td, c) => {
        const name = strip(td.textContent), a = addrs[c]?.querySelector('a'), img = qrs[c]?.querySelector('img');
        if (name && a) wallets.push({ name, addr: strip(a.textContent), href: a.getAttribute('href'), qr: img?.getAttribute('src') || '' });
      });
    }
    if (!wallets.length) return;

    const grid = el('div', 'abb-wallets');
    wallets.forEach(w => {
      const box = el('div', 'abb-wallet');
      box.innerHTML = `
        ${w.qr ? `<img src="${esc(w.qr)}" alt="${esc(w.name)} QR code">` : ''}
        <h3>${esc(w.name)}</h3>
        <code>${esc(w.addr)}</code>
        <div class="abb-wallet-actions">
          <button type="button" class="abb-btn">Copy address</button>
          <a class="abb-btn" href="${esc(w.href)}">Open in wallet</a>
        </div>`;
      box.querySelector('button').addEventListener('click', async e => {
        try {
          await navigator.clipboard.writeText(w.addr);
          e.target.textContent = 'Copied ✓';
          setTimeout(() => { e.target.textContent = 'Copy address'; }, 1500);
        } catch { /* clipboard blocked: address is selectable */ }
      });
      grid.appendChild(box);
    });
    table.replaceWith(grid);
    // The tiny inline-styled h3 ("You could use crypto apps…") becomes a muted note
    card.querySelectorAll('.navbar h3').forEach(h => h.replaceWith(el('p', 'abb-note', h.textContent.trim())));
  }

  // Advanced search page: the site renders three bare boxes with javascript: toggle links, two
  // 59-item checkbox lists hidden by its own script, and a magnifier gif that submits the form.
  // Rebuild it as a search row, a "Search in" chip row and two collapsible category sections,
  // all self-contained so nothing depends on the site's JS. Field names are untouched, so the
  // query the site receives is exactly what its own form would send.
  function tidyAdvancedSearch(card) {
    const form = card.querySelector('#asearchform');
    if (!form) return;
    card.classList.add('abb-adv-search');

    // Title (small-caps serif h4) and grey inline-styled intro
    const title = card.querySelector('h4.archiveTitle');
    if (title) title.replaceWith(el('h1', '', strip(title.textContent)));
    card.querySelectorAll('p > span[style*="color"]').forEach(s => { s.removeAttribute('style'); s.parentElement.className = 'abb-note abb-adv-intro'; });

    // Search row: real submit button instead of the gif link
    const input = form.querySelector('input[name="s"]');
    if (input) {
      ['style', 'onsubmit'].forEach(a => input.removeAttribute(a));
      input.type = 'search'; input.autocomplete = 'off'; input.placeholder = 'Title, author, narrator, keywords…';
      const row = el('div', 'abb-adv-row'), go = el('button', 'abb-adv-go', 'Search');
      go.type = 'submit';
      input.parentElement.replaceWith(row);           // the <p> holding the input and the magnifier
      row.append(input, go);
      form.addEventListener('submit', e => { if (!input.value.trim()) { e.preventDefault(); input.focus(); } });
      input.focus();
    }

    // "Search in": the tt[] boxes plus Exact match as one chip row
    const sin = card.querySelector('#search_in_div');
    if (sin) {
      const row = el('div', 'abb-adv-options');
      row.appendChild(el('span', 'abb-adv-label', 'Search in'));
      const chip = cb => {
        const lab = sin.querySelector(`label[for="${cb.id}"]`);
        const c = el('label', 'abb-chip-check');
        c.append(cb, ' ' + strip(lab?.textContent || cb.value));
        lab?.remove();
        return c;
      };
      sin.querySelectorAll('#search_in_inner input[type="checkbox"]').forEach(cb => row.appendChild(chip(cb)));
      const exact = sin.querySelector('#exact_match');
      if (exact) { row.appendChild(el('span', 'abb-adv-sep')); row.appendChild(chip(exact)); }
      sin.replaceWith(row);
    }

    // Include / Exclude: <details> with an "All categories" master box and a live count
    const catSection = (id, label) => {
      const box = card.querySelector(`#${id}_div`), list = box?.querySelector('ul.columns'), all = box?.querySelector(`#${id}_checkall`);
      if (!list || !all) return;
      const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
      const det = el('details', 'abb-adv-section'), sum = el('summary'), count = el('span', 'abb-adv-count');
      sum.append(el('span', 'abb-caret', '▶'), ` ${label}`, count);
      const master = all.cloneNode(true);             // a clone carries none of the site's handlers
      const masterLab = el('label', 'abb-chip-check abb-adv-all');
      masterLab.append(master, ' All categories');
      const body = el('div', 'abb-adv-body');
      body.append(masterLab, list);
      det.append(sum, body);
      box.replaceWith(det);
      const sync = () => {
        const n = boxes.filter(b => b.checked).length;
        master.checked = n === boxes.length;
        master.indeterminate = n > 0 && n < boxes.length;
        count.textContent = n === boxes.length ? 'all' : n ? `${n} of ${boxes.length}` : 'none';
      };
      master.addEventListener('change', () => { boxes.forEach(b => { b.checked = master.checked; }); sync(); });
      list.addEventListener('change', sync);
      sync();
    };
    catSection('include', 'Include categories');
    catSection('exclude', 'Exclude categories');
  }

  // Book page: the torrent table opens with the announce URL and a dozen "Tracker:" rows.
  // Fold those into a collapsed <details>; the remaining rows (info hash, size, files…)
  // stay visible as their own table. Rows are moved, not copied, so collectLinks() still
  // finds them when it builds the magnet link.
  function collapseTrackers(table) {
    const isTracker = tr => {
      const first = strip(tr.cells[0]?.textContent || '');
      return /^(announce url|tracker):?$/i.test(first) || (tr.cells.length === 1 && /backup trackers/i.test(first));
    };
    const rows = [...table.querySelectorAll('tr')].filter(isTracker);
    if (rows.length < 2) return;                                 // one announce row isn't worth hiding

    const inner = el('table', 'abb-torrent abb-tracker-table');
    inner.appendChild(el('tbody')).append(...rows);
    const urls = new Set(rows.map(r => strip(r.cells[1]?.textContent || '')).filter(Boolean));

    const box = el('details', 'abb-trackers');
    const sum = el('summary');
    sum.innerHTML = `<span class="abb-caret">▶</span> Tracker information` +
                    `<span class="abb-tracker-count">${urls.size} tracker${urls.size === 1 ? '' : 's'}</span>`;
    box.append(sum, inner);
    table.before(box);
    if (!table.querySelector('tr')) table.remove();              // nothing but trackers? drop the empty shell
  }

  function initContentMode(content) {
    document.body.classList.add('abb-content');
    const root = el('div');
    root.id = 'abb-root';
    root.append(buildHeader(), content);
    document.body.appendChild(root);

    const post = content.querySelector('.post');
    const desc = post?.querySelector('.desc[itemprop="description"]');

    if (!(isBook && post && desc)) {
      // Generic page (login, donate, advanced search…): wrap everything in one card
      const card = el('div', 'abb-page-card');
      card.append(...content.childNodes);
      content.appendChild(card);
      // Image buttons (Login / Reset sprites) can't be themed — swap them for real buttons
      card.querySelectorAll('input[type="image"]').forEach(img => {
        const btn = el('input');
        btn.type = /reset/i.test(img.alt + img.title + img.src) ? 'reset' : 'submit';
        btn.name = img.name;
        btn.value = img.alt || img.title || (btn.type === 'reset' ? 'Reset' : 'Login');
        img.replaceWith(btn);
      });
      if (/^\/member\/donate/.test(location.pathname)) tidyDonatePage(card);
      if (/^\/member\/advanced_search/.test(location.pathname)) tidyAdvancedSearch(card);
      return;
    }

    /* --- book page extras --- */
    document.body.classList.add('abb-book');
    desc.replaceWith(buildDescription(desc, location.href, { newTab: false, full: true }));

    const table = post.querySelector('.postContent table');
    if (table) {
      table.classList.add('abb-torrent');
      const row = linksRow(collectLinks(post, post.innerHTML, location.href));
      const gr = el('a', 'abb-dl', '📖 Goodreads');
      gr.target = '_blank'; gr.rel = 'noopener';
      attachGoodreads(gr, post.querySelector('.postTitle h1')?.textContent || document.title);
      row.appendChild(gr);
      table.before(row);
      collapseTrackers(table);
    }
    post.querySelectorAll('span[id^="more-"]').forEach(s => s.closest('p')?.remove());
    post.querySelectorAll('a[href*="ddeaatr"], a[href^="/dl-14"], a[href^="/dodl"], img[src*="/images/trr"]')
      .forEach(n => (n.closest('tr, p, .postContent > div:not(.center):not(.abb-desc)') || n).remove());
    post.querySelector('.navigations')?.remove();
  }

  /* =====================================================================
     10b. Forum (SMF 1.1, "Headline" theme): our header on top, SMF's own
          markup kept underneath and recoloured; SMF's duplicate chrome removed.
     ===================================================================== */

  // Forum search as a drop-down under its button, mirroring the header search. SMF 1.1's quick
  // search POSTs one field ("search") to index.php?action=search2; the full Search page (boards,
  // author, date options) stays reachable as "Advanced →". The panel is a <span>, not a <div>,
  // so the forum's generic div reset rule leaves it alone.
  function buildForumSearch(searchUrl) {
    const u = new URL(searchUrl, location.href);
    const action = /index\.php/.test(u.pathname)
      ? `${u.pathname}?action=search2`
      : `${u.pathname.match(/^.*?\/forum\//)?.[0] || '/forum/'}index.php?action=search2`;   // pretty-URL fallback
    // The advanced form (boards, author, date range, order) is the same action with the "advanced" flag:
    // /forum/search/?advanced;search=   or   index.php?action=search;advanced;search=
    const advancedUrl = /index\.php/.test(u.pathname)
      ? `${u.pathname}?action=search;advanced;search=`
      : `${u.pathname.replace(/\/?$/, '/')}?advanced;search=`;

    const form = el('form', 'abb-forum-search');
    form.method = 'post';
    form.action = action;
    form.innerHTML = `
      <button type="button" class="abb-btn abb-forum-search-btn" aria-expanded="false">Search forums</button>
      <span class="abb-forum-search-pop">
        <input class="abb-input" type="search" name="search" maxlength="100" placeholder="Search the forums…" autocomplete="off">
        <input type="hidden" name="advanced" value="0">
        <button type="submit" class="abb-btn abb-forum-search-go">Go</button>
        <a class="abb-adv" href="${esc(advancedUrl)}" title="Advanced search: boards, author, date range, order">Advanced →</a>
      </span>`;

    const btn = form.querySelector('.abb-forum-search-btn'), input = form.querySelector('input[type="search"]');
    const isOpen = () => form.classList.contains('is-open');
    const setOpen = open => {
      form.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
    };
    btn.addEventListener('click', () => (isOpen() && input.value.trim()) ? form.requestSubmit() : setOpen(!isOpen()));
    form.addEventListener('submit', e => { if (!input.value.trim()) { e.preventDefault(); input.focus(); } });
    input.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    dismissOnOutside(form, () => setOpen(false));
    return form;
  }

  function initForumMode() {
    document.documentElement.classList.add('abb-forum-html');
    document.body.classList.add('abb-forum');

    const body = el('div', 'abb-forum-body');
    body.append(...document.body.childNodes);
    const root = el('div');
    root.id = 'abb-root';
    root.append(buildHeader(), body);
    document.body.appendChild(root);

    // Button row, top right: Forum Home plus the SMF menu items our header lacks. Forum
    // accounts are separate from /member/login, so guests get Login/Register here and
    // members get Profile / My Messages / Logout. Torrents & Forum Home in #nav duplicate ours.
    const tools = el('div', 'abb-forum-tools');
    const home = el('a', 'abb-btn', 'Forum Home');
    home.href = '/forum/';
    tools.appendChild(home);
    body.querySelectorAll('#nav a').forEach(a => {
      const label = strip(a.textContent);
      if (/^(torrents|forum home|home)$/i.test(label)) return;
      if (/^search$/i.test(label)) { tools.appendChild(buildForumSearch(a.href)); return; }   // becomes a drop-down
      a.className = 'abb-btn';
      tools.appendChild(a);
    });
    body.prepend(tools);

    // Duplicate chrome: banner/logo and the (now harvested) menu strip
    body.querySelectorAll('#header, #top_section, .forumtitle, #logo, #siteslogan, #logobox, #nav')
      .forEach(n => n.remove());

    // The "AudioBook Bay Forum" title link is now a button. On the index it stands alone, so it
    // goes (with its emptied heading); on boards it is the first breadcrumb and stays put.
    const crumbs = body.querySelectorAll('a.nav');
    if (crumbs.length === 1 && /\/forum\/?$/.test(crumbs[0].href)) {
      const heading = crumbs[0].parentElement;
      crumbs[0].remove();
      if (!heading.textContent.trim() && !heading.querySelector('img, input')) heading.remove();
    }

    // Topic pages: SMF prints "« previous  next »" (older / newer topic in this board) as its own
    // right-aligned line under the breadcrumb. Fold the links into the breadcrumb row instead.
    const prev = body.querySelector('a[href*="prev_next=prev"]'), next = body.querySelector('a[href*="prev_next=next"]');
    const trail = body.querySelector('a.nav')?.closest('h1, div, td, p');
    if (trail && (prev || next)) {
      const holder = (prev || next).closest('td, div, p');
      const topicNav = el('span', 'abb-topic-nav');
      if (prev) { prev.textContent = '‹ Previous topic'; prev.title = 'Older topic in this board'; topicNav.appendChild(prev); }
      if (next) { next.textContent = 'Next topic ›';     next.title = 'Newer topic in this board'; topicNav.appendChild(next); }
      const trailWrap = el('span', 'abb-crumb-trail');
      trailWrap.append(...trail.childNodes);
      trail.classList.add('abb-crumbs');
      trail.append(trailWrap, topicNav);
      // The line the links came from is now empty — remove it, and any row/table that empties with it
      let n = holder;
      while (n && n !== body && !n.textContent.trim() && !n.querySelector('img, input, a')) { const p = n.parentElement; n.remove(); n = p; }
    }

    // "Pages: [1] 2 3  Go Down" + Reply / Notify strips (top and bottom): tag them so CSS can pull them in
    [...body.querySelectorAll('td, div')]
      .filter(c => !c.querySelector('table') && /^Pages:/i.test(strip(c.textContent)))
      .forEach(c => c.closest('table, div')?.classList.add('abb-topic-bar'));


    // "Welcome Guest, please login or register." duplicates the Login/Register buttons.
    // A signed-in member's status block is left in place, just recoloured.
    const isWelcome = n => /^welcome guest,?\s*please login or register\.?$/i.test(strip(n.textContent));
    let w = [...body.querySelectorAll('*')].filter(isWelcome).pop();          // deepest match
    if (w) {
      while (w.parentElement !== body && isWelcome(w.parentElement)) w = w.parentElement;
      w.remove();
    }

    // Two-column pages (profile, personal messages). SMF builds them as a bare <table> with a
    // fixed nav cell and a main cell whose tables are centred and shrink-wrapped, leaving voids
    // either side. Boxes are class "bordercolor" or "tborder" depending on template, so find the
    // sidebar by its heading text and the sibling cell that holds the content.
    const sideTable = [...body.querySelectorAll('td > table')].find(t => {
      const head = t.querySelector('tr:first-child td, tr:first-child th');
      const row = t.parentElement.parentElement;
      return head && /^(profile info|messages)$/i.test(strip(head.textContent)) &&
             row.tagName === 'TR' &&
             [...row.children].some(c => c !== t.parentElement && c.querySelector('table'));
    });
    if (sideTable) {
      const side = sideTable.parentElement, row = side.parentElement, cells = [...row.children];
      const main = cells.filter(c => c !== side && c.querySelector('table')).pop();
      cells.forEach(c => { if (c !== side && c !== main && !c.textContent.trim() && !c.querySelector('img, input')) c.remove(); }); // spacer cells
      row.closest('table').classList.add('abb-two-col');
      side.classList.add('abb-side');
      main.classList.add('abb-main');

      // Legacy sizing hints (width="420", width="150", align="center") fight the grid — drop them
      [side, main].forEach(cell => {
        cell.removeAttribute('width');
        cell.querySelectorAll('table[width], table[align], td[width]').forEach(n => { n.removeAttribute('width'); n.removeAttribute('align'); });
        cell.querySelectorAll('table[cellspacing], table[cellpadding]').forEach(t => { t.removeAttribute('cellspacing'); t.removeAttribute('cellpadding'); });
      });

      // The summary's "Picture/Text" column is empty for members with no avatar or personal text — drop it
      const pic = [...main.querySelectorAll('td')].find(td => /^picture\s*\/\s*text$/i.test(strip(td.textContent)));
      if (pic) {
        const tbl = pic.closest('table'), idx = [...pic.parentElement.children].indexOf(pic);
        const rows = [...tbl.querySelectorAll(':scope > tbody > tr, :scope > tr')];
        const col = rows.map(r => r.children.length > idx ? r.children[idx] : null).filter(Boolean);
        if (col.every(c => c === pic || (!c.textContent.trim() && !c.querySelector('img')))) {
          col.forEach(c => c.remove());
          rows.forEach(r => [...r.children].forEach(c => { if (c.colSpan > 1) c.colSpan = 1; }));   // colspan="2" rows → single column
        }
      }
    }

    // Safety net: any cell the theme still paints with one of its header sprites goes dark,
    // whatever class it happens to use (SMF 1.1 mixes titlebg/catbg/catbg3 across templates).
    body.querySelectorAll('td, th, tr').forEach(n => {
      if (/Themes\//.test(getComputedStyle(n).backgroundImage)) {
        n.style.setProperty('background', 'var(--secondary)', 'important');
        n.style.setProperty('color', 'var(--foreground)', 'important');
      }
    });
  }

  /* =====================================================================
     11. Any other page: theme colours + clickable logo
     ===================================================================== */
  function initPageMode() {
    document.body.classList.add('abb-page');
    const logo = document.querySelector('.leftPicCustom, #header img, header img');
    if (logo && !logo.closest('a')) {
      const a = el('a');
      a.href = '/';
      logo.replaceWith(a);
      a.appendChild(logo);
    }
  }

  /* =====================================================================
     12. Dispatch
     ===================================================================== */
  function init() {
    try {
      const content = document.querySelector('#content');
      if (isForum)                                       initForumMode();
      else if (isBook && content)                        initContentMode(content);
      else if (isSearch || findPosts(document).length)   initListMode();
      else if (content)                                  initContentMode(content);
      else                                               initPageMode();
      if (blockedScripts.length)
        console.info('[ABB] blocked third-party scripts from:', [...new Set(blockedScripts)].join(', '));
    } catch (err) {
      console.error('[ABB] init failed — showing the original page', err);
      document.body.className = document.body.className.replace(/\babb-\S+/g, '');
      document.getElementById('abb-root')?.remove();
    } finally {
      document.documentElement.classList.remove('abb-boot');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  setTimeout(() => document.documentElement.classList.remove('abb-boot'), 4000); // never leave the page hidden
})();
