/* Worldlines — rendering, comparison, i18n and routing. Plain browser JavaScript, no build step. */
(function () {
  "use strict";

  const D = window.WORLDLINES;
  const NOW = 2026;
  const MIN_YEAR = -13000;
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const CH = D.chapters, RG = D.regions, PL = D.places, TH = D.themes, KD = D.kinds;
  const EV = D.events.slice().sort((a, b) => a.year - b.year);
  const POL = D.polities || {};
  const CHB = byId(CH), RGB = byId(RG), PLB = byId(PL), THB = byId(TH), KDB = byId(KD), EVB = byId(EV);
  const POL_COUNT = Object.values(POL).reduce((n, l) => n + l.length, 0);

  const UI = {
    en: {
      brand: "Worldlines", navAtlas: "Atlas", navLong: "Long view", navSlice: "Year slice", navLearn: "How to learn", search: "Search",
      kicker: "A horizontal atlas of world history",
      dek: "History is not one road. It is <strong>many places living at once</strong>. Move across time; look down to compare worlds.",
      h1a: "WORLD", h1b: "LINES", brandMini: "WORLD<b>//</b>LINES",
      stats: (e, p) => `${CH.length} chapters · ${PL.length} countries · ${e} hinge points · ${p} states`,
      cue: "Begin with Origins", heroCap: "Same year. Different worlds. Shared consequences.",
      m1t: "Read → across", m1: "Follow one place or region through a chapter, left to right.",
      m2t: "Compare ↓ down", m2: "Events on the same vertical line happened at about the same time.",
      m3t: "Slice ■ a year", m3: "Stop the clock and see who ruled where, in every place you are comparing.",
      lanesBy: "Lanes", modeRegions: "Regions", modePlaces: "Countries", compare: "Compare", addPlace: "+ Add a country…", preset: "Presets…",
      trace: "Trace a thread", all: "All threads",
      axisCorner: (m) => m === "regions" ? "Regions ↓<br>Time →" : "Countries ↓<br>Time →",
      emptyLane: "No hinge point here<br>in this chapter",
      remove: "Remove",
      longNo: "Long view", longTitle: "Fifteen thousand years, one block per state",
      longLede: "Each row is a place and each block is the state that held it. The places you compare open up; the rest stay as thin strips. Blocks in full colour are the states ruling in the year you have frozen.",
      longRange: (n, q) => `13,000 BCE → today · ${n} places · ${q} states`,
      lvCompact: "Compact", lvOpen: "Open every row", lvHelp: "Hover to read a year · select to freeze it · select a name to compare it", lvCorner: "Scale changes by chapter",
      clickFreeze: "Select to freeze this year",
      sliceNo: "Year slice", sliceTitle: "The world in one year",
      sliceLede: "Stop the clock. Each place shows the state that held it, where that year falls in the state’s life, what came before and after, and what happened nearby in time.",
      sliceRange: (n) => `Drag the line, pick a date or step with ‹ › · ${n} places`, sliceCmp: "My comparison", sliceAll: "All places",
      step: (n) => `${n} yr${n > 1 ? "s" : ""}`,
      sum: (y, n) => `<span class="lead">In ${y}, across ${n} places:</span>`,
      kindShort: { s: "home-grown states", d: "divided", f: "ruled from outside", c: "cultures or eras", none: "no state recorded" },
      meanwhile: (w) => `Meanwhile, ±${w} years`, nothingNear: "Nothing listed this close.", nearest: "Nearest",
      noState: "No state recorded", noStateBody: "No single polity is listed for this place in this year.",
      yearOf: (a, b) => b ? `Year ${a} of ${b}` : `Year ${a}, still standing`, before: "Before", after: "Next",
      learnTitle: "How to learn the whole world without flattening it.",
      learnNote: "This atlas is a learning scaffold: a deliberately selective set of turning points and states, not a claim to contain every people or experience. Dates marked “c.” are approximate, and broad processes resist single-year labels.",
      fDatesT: "About the dates and borders",
      fDates: "Dates are conventional. States rarely began or ended in a single year, and modern country names are used only as stable places to stand: “China in 500 BCE” means the lands that later became China, not a nation that existed then.",
      fImgT: "About the images",
      fImg: "Event pictures are the lead images of English Wikipedia articles, shown only when the file is on Wikimedia Commons. Every panel links to its source; check the file page before reusing an image.",
      fProjT: "The project",
      fProj: "A static site with no build step: HTML, CSS and plain JavaScript, with all content in bilingual data files. A sibling of <a href=\"https://artisms.geekplux.org/\">Art-isms</a>. Corrections are welcome on <a href=\"https://github.com/geekplux/worldlines\">GitHub</a>.",
      consentText: "This site uses Google Analytics to count visits. Allow it to set analytics cookies?", consentYes: "Accept", consentNo: "Decline", cookieSettings: "Cookie settings",
      detailTop: "Event · connections", why: "Why it matters", frame: "Historical frame", meanwhileH: "Meanwhile, elsewhere…", ruledH: (y) => `Who ruled where in ${y}`,
      readWiki: "Read on Wikipedia ↗", freeze: (y) => `Freeze ${y} ■`, source: "Image", plate: "No free image for this event",
      searchHelp: "Try “printing”, “empire”, “silver”, a dynasty or a country. Press Esc to close.", searchPh: "Search history…",
      kEvent: "Event", kPlace: "Country", kState: "State",
      noResults: (q) => `Nothing matches “${q}”. Try a broader place, theme or idea.`,
      bce: "BCE", ce: "CE", now: "today", close: "Close", zoom: "Zoom"
    },
    zh: {
      brand: "世界线", navAtlas: "图谱", navLong: "长时段", navSlice: "年份切片", navLearn: "学习方法", search: "搜索",
      kicker: "一部横向展开的世界史图谱",
      dek: "历史不是一条路，而是<strong>许多地方同时在生活</strong>。横向穿越时间，纵向比较世界。",
      h1a: "世界", h1b: "线", brandMini: "世界<b>//</b>线",
      stats: (e, p) => `${CH.length} 个章节 · ${PL.length} 个国家与地区 · ${e} 个转折点 · ${p} 个政权`,
      cue: "从“起源”开始", heroCap: "同一年，不同的世界，共同的后果。",
      m1t: "横向 → 阅读", m1: "从左到右，跟随一个地方或地区走过整个章节。",
      m2t: "纵向 ↓ 比较", m2: "落在同一条竖线上的事件，大致发生在同一时间。",
      m3t: "切片 ■ 一年", m3: "把时钟停下，看看你比较的每个地方此刻由谁统治。",
      lanesBy: "泳道", modeRegions: "地区", modePlaces: "国家", compare: "比较", addPlace: "+ 添加国家…", preset: "预设组合…",
      trace: "追踪线索", all: "全部线索",
      axisCorner: (m) => m === "regions" ? "地区 ↓<br>时间 →" : "国家 ↓<br>时间 →",
      emptyLane: "本章节中<br>此处暂无转折点",
      remove: "移除",
      longNo: "长时段", longTitle: "一万五千年，一个政权一块色",
      longLede: "每一行是一个地方，每一块是统治它的政权。你比较的地方会展开，其余的收成细条。满色的色块，是你定格的那一年正在统治的政权。",
      longRange: (n, q) => `公元前13000年 → 今天 · ${n}个地方 · ${q}个政权`,
      lvCompact: "紧凑", lvOpen: "展开全部", lvHelp: "悬停读出年份 · 点击定格 · 点击地名加入比较", lvCorner: "各章节比例尺不同",
      clickFreeze: "点击定格这一年",
      sliceNo: "年份切片", sliceTitle: "同一年的世界",
      sliceLede: "把时钟停下。每个地方都会显示当时统治它的政权、这一年处在该政权生命中的哪个位置、前后由谁承接，以及时间上相近的事件。",
      sliceRange: (n) => `拖动竖线、点选年份，或用 ‹ › 步进 · ${n}个地方`, sliceCmp: "我的比较", sliceAll: "全部地方",
      step: (n) => `${n}年`,
      sum: (y, n) => `<span class="lead">${y}，${n}个地方中：</span>`,
      kindShort: { s: "本土政权", d: "分裂", f: "外来统治", c: "文化或时期", none: "无政权记录" },
      meanwhile: (w) => `与此同时，前后${w}年`, nothingNear: "这么近的时间内没有收录事件。", nearest: "最近的事件",
      noState: "暂无政权记录", noStateBody: "本图谱未收录此地这一年的单一政权。",
      yearOf: (a, b) => b ? `立国第${a}年，共${b}年` : `立国第${a}年，延续至今`, before: "此前", after: "此后",
      learnTitle: "如何学习整个世界，而不把它压扁。",
      learnNote: "本图谱是一个学习支架：有意挑选的一组转折点与政权，并不声称涵盖所有民族与经验。标有“约”的年代为近似值，宏大的历史进程也很难被归入某一个年份。",
      fDatesT: "关于年代与疆界",
      fDates: "年代均为约定俗成。政权很少在某一年突然开始或结束；使用现代国名只是为了提供稳定的立足点：“公元前500年的中国”指后来成为中国的那片土地，而不是当时已经存在的民族国家。",
      fImgT: "关于图片",
      fImg: "事件配图取自英文维基百科条目的首图，且仅在文件位于维基共享资源时显示。每张图都链接到来源页；转载前请先查看文件页的许可信息。",
      fProjT: "关于项目",
      fProj: "一个无需构建的静态网站：HTML、CSS 与原生 JavaScript，全部内容存放在中英双语数据文件中。它是 <a href=\"https://artisms.geekplux.org/\">艺术流派志</a> 的姊妹项目。欢迎在 <a href=\"https://github.com/geekplux/worldlines\">GitHub</a> 上提出修订。",
      consentText: "本站使用 Google Analytics 统计访问量。是否允许设置统计 Cookie？", consentYes: "接受", consentNo: "拒绝", cookieSettings: "Cookie 设置",
      detailTop: "事件 · 关联", why: "为何重要", frame: "历史框架", meanwhileH: "与此同时，在别处……", ruledH: (y) => `${y}，谁统治着哪里`,
      readWiki: "在维基百科阅读 ↗", freeze: (y) => `定格在${y} ■`, source: "图片", plate: "此事件暂无自由版权图片",
      searchHelp: "试试“印刷”“帝国”“白银”“独立”、一个王朝或一个国家。按 Esc 关闭。", searchPh: "搜索历史……",
      kEvent: "事件", kPlace: "国家", kState: "政权",
      noResults: (q) => `没有与“${q}”匹配的内容。换一个更宽泛的地点、主题或概念试试。`,
      bce: "公元前", ce: "公元", now: "今天", close: "关闭", zoom: "缩放"
    }
  };

  const PRESETS = [
    { id: "empires", name: { en: "Great empires", zh: "大帝国" }, places: ["china", "india", "iran", "italy", "turkey", "mexico", "peru"] },
    { id: "eastwest", name: { en: "East Asia vs Western Europe", zh: "东亚与西欧" }, places: ["china", "japan", "korea", "britain", "france", "germany"] },
    { id: "med", name: { en: "Around the Mediterranean", zh: "环地中海" }, places: ["egypt", "greece", "italy", "turkey", "spain", "iraq"] },
    { id: "cradles", name: { en: "Cradles of civilisation", zh: "文明的摇篮" }, places: ["iraq", "egypt", "india", "china", "mexico", "peru"] },
    { id: "revolutions", name: { en: "Age of revolutions", zh: "革命的年代" }, places: ["france", "usa", "russia", "china", "mexico", "iran"] },
    { id: "africa", name: { en: "Africa", zh: "非洲" }, places: ["egypt", "ethiopia", "mali", "zimbabwe"] },
    { id: "oceans", name: { en: "Ocean worlds", zh: "海洋世界" }, places: ["indonesia", "cambodia", "japan", "spain", "britain", "australia", "newzealand"] },
    { id: "steppe", name: { en: "Steppe and its neighbours", zh: "草原与邻居" }, places: ["mongolia", "china", "russia", "iran", "turkey"] }
  ];
  const DEFAULT_CMP = ["china", "india", "iran", "italy", "britain", "mexico"];
  const ZOOMS = [0.75, 1, 1.5, 2, 3];
  const YEAR_PRESETS = [-10000, -2500, -500, 1, 800, 1250, 1492, 1648, 1789, 1914, 1945, 1989, 2026];
  const MAX_CMP = 10;

  /* ── State ─────────────────────────────────── */
  const store = {
    get(k) { try { return localStorage.getItem("worldlines-" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("worldlines-" + k, v); } catch (e) { /* storage blocked */ } }
  };
  /* Language: ?lang=en|zh (shareable, and what search engines index) wins, then the saved choice, then the browser */
  const LANGS = ["en", "zh"];
  const browserZh = (navigator.language || "").toLowerCase().startsWith("zh");
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = LANGS.includes(urlLang) ? urlLang : store.get("lang") || (browserZh ? "zh" : "en");
  if (!LANGS.includes(lang)) lang = "en";
  /* Update one query parameter without reloading or touching the hash */
  function setParam(key, value) {
    try {
      const u = new URL(location.href);
      if (value == null) u.searchParams.delete(key); else u.searchParams.set(key, value);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) { /* sandboxed */ }
  }
  /* Analytics events; a no-op off the production domain, where gtag is never defined */
  const track = (name, params) => { if (typeof window.gtag === "function") window.gtag("event", name, params); };
  let yearTimer = 0;
  let mode = store.get("mode") === "places" ? "places" : "regions";
  let cmp = (store.get("cmp") || "").split(",").filter((id) => PLB[id]);
  if (!cmp.length) cmp = DEFAULT_CMP.slice();
  let zoomIdx = Math.max(0, ZOOMS.indexOf(+store.get("zoom")));
  if (ZOOMS.indexOf(+store.get("zoom")) < 0) zoomIdx = 1;
  let longMode = store.get("long") === "open" ? "open" : "compact";
  let sliceMode = store.get("slice") === "all" ? "all" : "cmp";
  let chIdx = 0;
  let theme = "all";
  let year = 1492;
  let selected = null;
  let lastFocus = null;

  const t = (k) => (UI[lang][k] ?? UI.en[k] ?? k);
  const p = (o) => (o ? (o[lang] ?? o.en) : "");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad2 = (i) => String(i).padStart(2, "0");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  /* ── Colour helpers ────────────────────────── */
  function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(h, w) { const [r, g, b] = hex(h); const m = (c) => Math.round(c + (255 - c) * w).toString(16).padStart(2, "0"); return `#${m(r)}${m(g)}${m(b)}`; }
  function onColor(h) { const [r, g, b] = hex(h).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.28 ? "#141414" : "#fffdf7"; }
  const regionVars = (r) => `--c:${r.color};--tint:${mix(r.color, 0.62)};--on:${onColor(r.color)}`;
  const placeRegion = (pid) => RGB[PLB[pid].region];

  /* ── Years ─────────────────────────────────── */
  function fmtYear(y) {
    if (y >= NOW) return t("now");
    if (y < 0) { const n = Math.abs(y).toLocaleString("en-US"); return lang === "zh" ? `公元前${n}年` : `${n} BCE`; }
    return lang === "zh" ? `${y}年` : (y < 1000 ? `${y} CE` : String(y));
  }
  function fmtAxis(y) {
    if (y >= NOW) return t("now");
    if (y < 0) { const n = Math.abs(y).toLocaleString("en-US"); return lang === "zh" ? `前${n}` : `${n} BCE`; }
    return y < 1000 && lang === "en" ? `${y} CE` : String(y);
  }
  /* "960–1279", "1600–1046 BCE", "27 BCE–476 CE", "1949–today" */
  function span(s, e) {
    const num = (y) => Math.abs(y).toLocaleString("en-US");
    const end = e >= NOW ? t("now") : null;
    if (lang === "zh") {
      const z = (y) => (y < 0 ? `前${num(y)}` : String(y));
      return `${s < 0 ? "公元" : ""}${z(s)}–${end || z(e)}${end ? "" : "年"}`;
    }
    if (s < 0 && e < 0) return `${num(s)}–${num(e)} BCE`;
    if (s < 0) return `${num(s)} BCE–${end || e + " CE"}`;
    return `${s}–${end || e}`;
  }
  const length = (s, e) => e - s - (s < 0 && e > 0 ? 1 : 0);
  function polityAt(pid, y) {
    const list = POL[pid] || [];
    for (let i = list.length - 1; i >= 0; i--) {
      const q = list[i];
      if (q.s <= y && (y < q.e || (q.e >= NOW && y <= NOW))) return { q, i, list };
    }
    return { q: null, i: -1, list };
  }
  /* Window used for "meanwhile": wider in deep time, narrower near the present */
  function windowFor(y) { return y < -3500 ? 1000 : y < -600 ? 250 : y < 500 ? 100 : y < 1450 ? 50 : y < 1750 ? 25 : y < 1914 ? 15 : y < 1945 ? 5 : 8; }
  const chapterOf = (y) => { let c = CH[0]; CH.forEach((ch) => { if (y >= ch.start) c = ch; }); return c; };

  /* ── Long-view scale: piecewise, compressed in deep time ── */
  const SEG = [[-13000, -3500, 0.10], [-3500, -600, 0.13], [-600, 500, 0.13], [500, 1450, 0.15], [1450, 1750, 0.12], [1750, 1914, 0.12], [1914, 1945, 0.08], [1945, NOW, 0.17]];
  function lx(y) {
    let acc = 0;
    for (const [a, b, share] of SEG) {
      if (y <= b) return clamp(acc + share * Math.max(0, (y - a) / (b - a)), 0, 1);
      acc += share;
    }
    return 1;
  }
  function lxInv(f) {
    let acc = 0;
    for (const [a, b, share] of SEG) {
      if (f <= acc + share) return a + (b - a) * ((f - acc) / share);
      acc += share;
    }
    return NOW;
  }
  function niceYear(y) {
    const step = y < -3500 ? 100 : y < -600 ? 10 : y < 1450 ? 5 : 1;
    let r = Math.round(y / step) * step;
    if (r === 0) r = 1;
    return clamp(r, MIN_YEAR, NOW);
  }

  /* ── Wikipedia lead images (Commons files only) ── */
  const wikiUrl = (title) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const readUrl = (e) => lang === "zh"
    ? `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(e.title.zh)}&go=Go`
    : (e.wiki ? wikiUrl(e.wiki) : `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(e.title.en)}`);
  const imgCache = new Map();
  function leadImage(title) {
    if (imgCache.has(title)) return imgCache.get(title);
    const key = "worldlines-wiki:" + title;
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { /* ignore */ }
    const job = cached ? Promise.resolve(cached) : fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((j) => {
        const o = j.originalimage, th = j.thumbnail;
        let src = null;
        if (th) src = th.source.replace(/\/\d+px-/, "/960px-");
        if (o && o.width <= 960) src = o.source;
        const res = { src: src && /\/wikipedia\/commons\//.test(src) ? src : null, page: j.content_urls?.desktop?.page || wikiUrl(title), file: o ? o.source : null };
        try { sessionStorage.setItem(key, JSON.stringify(res)); } catch (e) { /* ignore */ }
        return res;
      });
    imgCache.set(title, job);
    return job;
  }
  function filePage(url) {
    const m = (url || "").match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/);
    return m ? `https://commons.wikimedia.org/wiki/File:${m[1]}` : null;
  }

  /* Mondrian plate, seeded so each event keeps its own composition */
  function rng(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  function plateSvg(seed, accent) {
    const r = rng(seed), cells = [], L = 2.4;
    (function split(x, y, w, h, d) {
      if (d >= 3 || (w < 24 && h < 24) || (d >= 2 && r() < 0.3)) { cells.push([x, y, w, h]); return; }
      const v = w / h > 1.2 ? true : h / w > 1.2 ? false : r() < 0.5, f = 0.3 + r() * 0.4;
      if (v) { split(x, y, w * f, h, d + 1); split(x + w * f, y, w * (1 - f), h, d + 1); }
      else { split(x, y, w, h * f, d + 1); split(x, y + h * f, w, h * (1 - f), d + 1); }
    })(0, 0, 200, 100, 0);
    const colors = ["#fffdf7", "#fffdf7", "#fffdf7", "#e9e4d8", accent, "#d52b1e", "#1d4ed8", "#f3c623"];
    return `<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><rect width="200" height="100" fill="#141414"/>${cells.map((c) =>
      `<rect x="${(c[0] + L / 2).toFixed(1)}" y="${(c[1] + L / 2).toFixed(1)}" width="${(c[2] - L).toFixed(1)}" height="${(c[3] - L).toFixed(1)}" fill="${colors[Math.floor(r() * colors.length)]}"/>`).join("")}</svg>`;
  }

  /* ── Static copy ───────────────────────────── */
  function applyStatic() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "世界线 · Worldlines" : "Worldlines";
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $("#stats").textContent = UI[lang].stats(EV.length, POL_COUNT);
    $("#search-input").placeholder = t("searchPh");
    $$(".zoom button").forEach((b) => b.setAttribute("aria-label", `${t("zoom")} ${b.dataset.zoom > 0 ? "+" : "−"}`));
  }

  /* ── Atlas ─────────────────────────────────── */
  function renderNav() {
    $("#chapter-nav").innerHTML = CH.map((c, i) => `<button type="button" class="ch-tab" data-ch="${i}" aria-current="${i === chIdx}"><span class="n">${pad2(i + 1)}</span>${esc(p(c.short))}</button>`).join("");
  }
  function renderIntro() {
    const c = CH[chIdx];
    $("#chapter-no").textContent = `${pad2(chIdx + 1)} / ${pad2(CH.length)}`;
    $("#chapter-title").textContent = p(c.title);
    $("#chapter-range").textContent = p(c.range);
    $("#chapter-desc").textContent = p(c.description);
  }
  function renderControls() {
    $$("#mode-seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    $("#cmp-ctl").classList.toggle("off", mode !== "places");
    $("#cmp-chips").innerHTML = cmp.map((pid) => `<span class="cmp-chip" style="${regionVars(placeRegion(pid))}"><span class="sw"></span>${esc(p(PLB[pid].name))}<button type="button" class="rm" data-rm="${pid}" aria-label="${esc(t("remove"))} ${esc(p(PLB[pid].name))}">×</button></span>`).join("");
    const free = (r) => PL.filter((x) => x.region === r.id && !cmp.includes(x.id));
    $("#cmp-add").innerHTML = `<option value="">${esc(t("addPlace"))}</option>` + RG.filter((r) => free(r).length).map((r) =>
      `<optgroup label="${esc(p(r.name))}">${free(r).map((x) => `<option value="${x.id}">${esc(p(x.name))}</option>`).join("")}</optgroup>`).join("");
    $("#cmp-add").disabled = cmp.length >= MAX_CMP;
    $("#cmp-preset").innerHTML = `<option value="">${esc(t("preset"))}</option>` + PRESETS.map((s) => `<option value="${s.id}">${esc(p(s.name))}</option>`).join("");
  }
  function renderThemes() {
    $("#theme-bar").innerHTML = `<span class="micro">${esc(t("trace"))}</span><button type="button" class="chip" data-theme="all" aria-pressed="${theme === "all"}">${esc(t("all"))}</button>` +
      TH.map((x) => `<button type="button" class="chip" data-theme="${x.id}" aria-pressed="${theme === x.id}" style="--c:${x.color}"><span class="sw"></span>${esc(p(x.name))}</button>`).join("");
  }

  function lanes() {
    if (mode === "regions") return RG.map((r) => ({ id: r.id, kind: "region", name: r.name, r }));
    return cmp.map((pid) => ({ id: pid, kind: "place", name: PLB[pid].name, r: placeRegion(pid) }));
  }
  const inLane = (e, lane) => lane.kind === "region" ? e.region === lane.id : (e.place === lane.id || (e.also || []).includes(lane.id));
  function niceTicks(a, b, target) {
    const raw = (b - a) / target;
    const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
    const step = steps.find((s) => s >= raw) || 5000;
    const out = [];
    for (let y = Math.ceil(a / step) * step; y <= b; y += step) out.push(y);
    return out;
  }

  const CARD = 176, GAP = 14, ROWH = 100;
  function renderAtlas() {
    const c = CH[chIdx], zoom = ZOOMS[zoomIdx];
    const CW = Math.round(1540 * zoom);
    const X = (y) => clamp((y - c.start) / (c.end - c.start), 0, 1) * CW;
    const stage = $("#stage");
    stage.style.setProperty("--cw", CW + "px");
    $("#zoom-val").textContent = zoom + "×";
    $$(".zoom button").forEach((b) => { b.disabled = b.dataset.zoom < 0 ? zoomIdx === 0 : zoomIdx === ZOOMS.length - 1; });

    const ticks = niceTicks(c.start, c.end, 9 * zoom);
    let h = `<div class="axis-row"><div class="axis-corner">${t("axisCorner")(mode)}</div><div class="axis-track">`;
    ticks.forEach((y, i) => {
      const edge = X(y) < 30 ? "first" : X(y) > CW - 40 ? "last" : "";
      h += `<div class="a-tick" style="left:${X(y)}px"></div><span class="a-lbl ${edge}" style="left:${X(y)}px">${esc(fmtAxis(y === 0 ? 1 : y))}</span>`;
    });
    h += `</div></div>`;

    lanes().forEach((lane) => {
      const evs = EV.filter((e) => e.chapter === c.id && inLane(e, lane));
      const top = lane.kind === "place" ? 40 : 18;
      const rows = [];
      const placed = evs.map((e) => {
        const x = X(e.year), xe = e.end ? X(Math.min(e.end, c.end)) : x;
        const left = clamp(x - 18, 2, CW - CARD - 2);
        const a = Math.min(left, x), b = Math.max(left + CARD, xe) + GAP;
        let r = rows.findIndex((edge) => edge <= a);
        if (r < 0) { r = rows.length; rows.push(0); }
        rows[r] = b;
        return { e, x, xe, left, r };
      });
      const height = Math.max(lane.kind === "place" ? 124 : 104, top + Math.max(1, rows.length) * ROWH + 10);
      let strip = "";
      if (lane.kind === "place") {
        strip = `<div class="pstrip" style="${regionVars(lane.r)}">` + (POL[lane.id] || []).map((q, i) => {
          if (q.e <= c.start || q.s >= c.end) return "";
          const l = X(Math.max(q.s, c.start)), w = X(Math.min(q.e, c.end)) - l;
          return `<span class="pblk k-${q.k}${i % 2 ? " alt" : ""}" style="left:${l}px;width:${w}px" title="${esc(p(q.n))} · ${esc(span(q.s, q.e))}">${w > 34 ? esc(p(q.n)) : ""}</span>`;
        }).join("") + `</div>`;
      }
      const cards = placed.map(({ e, x, xe, left, r }) => {
        const y0 = top + r * ROWH;
        const tc = THB[e.theme].color;
        const where = mode === "regions" ? (e.place ? p(PLB[e.place].name) : "") : (e.place && e.place !== lane.id ? "↗ " + p(PLB[e.place].name) : "");
        const dim = theme !== "all" && e.theme !== theme ? " dim" : "";
        return (e.end && xe - x > 3 ? `<span class="span${dim}" style="left:${x}px;width:${xe - x}px;top:${y0 + 1}px;--tc:${tc}"></span>` : "") +
          `<button type="button" class="ev${dim}${selected === e.id ? " sel" : ""}" data-ev="${e.id}" data-theme="${e.theme}" style="left:${left}px;top:${y0 + 12}px;--tc:${tc}" aria-label="${esc(p(e.title))}, ${esc(p(e.date))}">
            <span class="pin" style="left:${x - left - 1}px"></span>
            <span class="yr">${esc(p(e.date))}</span>
            <span class="tt">${esc(p(e.title))}</span>
            ${where ? `<span class="pl">${esc(where)}</span>` : ""}
          </button>`;
      }).join("");
      const label = lane.kind === "region"
        ? `<span class="code">${lane.r.code}</span><h3>${esc(p(lane.name))}</h3>`
        : `<span class="code">${esc(p(lane.r.name))}</span><h3>${esc(p(lane.name))}</h3><button type="button" class="rm" data-rm="${lane.id}" aria-label="${esc(t("remove"))} ${esc(p(lane.name))}">×</button>`;
      h += `<div class="lane" style="${regionVars(lane.r)}">
        <div class="lane-label">${label}</div>
        <div class="track" style="height:${height}px">${strip}${cards || `<span class="empty-lane">${t("emptyLane")}</span>`}</div>
      </div>`;
    });
    stage.innerHTML = h;
  }

  function selectChapter(i, opts = {}) {
    const before = chIdx;
    chIdx = clamp(i, 0, CH.length - 1);
    if (chIdx !== before) track("select_content", { content_type: "chapter", item_id: CH[chIdx].id });
    renderNav();
    renderIntro();
    renderAtlas();
    if (!opts.keepScroll) $("#tl-scroll").scrollLeft = 0;
    if (opts.scroll) $(".chapter-intro").scrollIntoView({ behavior: smooth(), block: "start" });
    writeHash();
  }

  /* ── Long view ─────────────────────────────── */
  const LV_TICKS = [-13000, -6000, -3500, -600, 1, 500, 1000, 1450, 1600, 1750, 1850, 1914, 1945, 1990, NOW];
  const pct = (y) => (lx(y) * 100).toFixed(3) + "%";
  const segIndex = (y) => Math.max(0, SEG.findIndex((s) => y >= s[0] && y < s[1]) === -1 ? SEG.length - 1 : SEG.findIndex((s) => y >= s[0] && y < s[1]));
  /* Chapter band: each cell is one stretch of the scale, the chapter of the frozen year is yellow */
  const bandHtml = (cls) => SEG.map((s, i) => `<button type="button" class="${cls}${i === segIndex(year) ? " on" : ""}" data-ch="${i}" data-scroll="1" style="left:${pct(s[0])};width:calc(${pct(s[1])} - ${pct(s[0])})" title="${esc(p(CH[i].title))} · ${esc(p(CH[i].range))}"><span>${esc(p(CH[i].short))}</span></button>`).join("");
  function renderLong() {
    let h = `<div class="lv-row lv-axis"><div class="lv-name">${esc(t("lvCorner"))}</div><div class="lv-track">${bandHtml("lv-ch")}`;
    LV_TICKS.forEach((y, i) => { h += `<span class="lv-tick${i === 0 ? " l" : i === LV_TICKS.length - 1 ? " r" : ""}" style="left:${pct(y)}">${esc(fmtAxis(y))}</span>`; });
    h += `</div></div>`;
    const row = (pl) => {
      const r = RGB[pl.region], list = POL[pl.id] || [], isIn = cmp.includes(pl.id), open = isIn || longMode === "open";
      const blocks = list.map((q, i) => `<span class="lv-blk k-${q.k}" data-pi="${i}" style="left:${pct(q.s)};width:calc(${pct(q.e)} - ${pct(q.s)})">${open ? `<span>${esc(p(q.n))}</span>` : ""}</span>`).join("");
      const dots = open ? EV.filter((e) => e.place === pl.id).map((e) =>
        `<button type="button" class="lv-dot${theme !== "all" && e.theme !== theme ? " dim" : ""}" data-ev="${e.id}" style="left:${pct(e.year)}" aria-label="${esc(p(e.title))}, ${esc(p(e.date))}"></button>`).join("") : "";
      return `<div class="lv-row${open ? " open" : ""}${isIn ? " in" : ""}" data-place="${pl.id}" style="${regionVars(r)}">
        <button type="button" class="lv-name" data-toggle="${pl.id}" aria-pressed="${isIn}"><span class="sw"></span><span class="nm">${esc(p(pl.name))}</span><span class="pin" aria-hidden="true">${isIn ? "−" : "+"}</span></button>
        <div class="lv-track">${blocks}${dots}</div></div>`;
    };
    RG.forEach((r) => {
      const pls = PL.filter((x) => x.region === r.id);
      if (!pls.length) return;
      h += `<div class="lv-row lv-reg" style="--c:${r.color}"><div class="lv-name"><span class="sw"></span>${esc(p(r.name))}</div></div>` + pls.map(row).join("");
    });
    h += `<div class="lv-cursor fixed" id="lv-fixed"><b></b></div><div class="lv-cursor" id="lv-cursor" hidden><b></b></div>`;
    $("#lv").innerHTML = h;
    $$("#long-seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.long === longMode)));
    $("#kind-legend").innerHTML = KD.map((k) => `<span><i class="k-${k.id}"></i>${esc(p(k.name))}</span>`).join("");
    $("#long-range").textContent = t("longRange")(PL.length, POL_COUNT);
    markNow();
    fitLong();
    /* On narrow screens, open with the frozen year in view rather than at 13,000 BCE */
    if (!renderLong.done) {
      renderLong.done = true;
      const sc = $(".lv-scroll"), lw = $(".lv-name").offsetWidth;
      if (sc.scrollWidth > sc.clientWidth) sc.scrollLeft = lw + (sc.scrollWidth - lw) * lx(year) - lw - (sc.clientWidth - lw) / 2;
    }
  }
  /* Light up the state ruling each place in the frozen year */
  function markNow() {
    $$("#lv .lv-row[data-place]").forEach((rowEl) => {
      const { i } = polityAt(rowEl.dataset.place, year);
      $$(".lv-blk", rowEl).forEach((b) => b.classList.toggle("now", +b.dataset.pi === i));
    });
    const fx = $("#lv-fixed");
    if (fx) { fx.style.left = `calc(var(--lw) + (100% - var(--lw)) * ${lx(year)})`; $("b", fx).textContent = fmtAxis(year); }
    const si = segIndex(year);
    $$(".lv-ch, .sb-ch").forEach((b) => b.classList.toggle("on", +b.dataset.ch === si));
  }
  /* Show a label only where it fits whole, never as "K…"; hide ticks that would collide */
  function fitLong() {
    $$("#lv .lv-blk > span").forEach((s) => { s.style.visibility = s.scrollWidth > s.parentElement.clientWidth - 6 ? "hidden" : ""; });
    declutter($$(".lv-tick"));
  }
  function declutter(els) {
    let edge = -Infinity;
    const last = els[els.length - 1]?.getBoundingClientRect();
    els.forEach((el, i) => {
      el.style.visibility = "";
      const r = el.getBoundingClientRect();
      const clash = r.left < edge + 10 || (i > 0 && i < els.length - 1 && last && r.right > last.left - 10);
      el.style.visibility = clash ? "hidden" : "";
      if (!clash) edge = r.right;
    });
  }
  function lvFrac(ev) {
    const track = $(".lv-axis .lv-track");
    if (!track) return null;
    const r = track.getBoundingClientRect();
    if (ev.clientX < r.left || ev.clientX > r.right) return null;
    return (ev.clientX - r.left) / r.width;
  }
  function onLvMove(ev) {
    const f = lvFrac(ev), cur = $("#lv-cursor"), tip = $("#lv-tip");
    if (f == null) { cur.hidden = true; tip.hidden = true; return; }
    const y = niceYear(lxInv(f));
    cur.hidden = false;
    cur.style.left = `calc(var(--lw) + (100% - var(--lw)) * ${f})`;
    cur.querySelector("b").textContent = fmtAxis(y);
    const rowEl = ev.target.closest(".lv-row[data-place]");
    if (!rowEl || ev.target.closest(".lv-dot")) { tip.hidden = !ev.target.closest(".lv-dot"); if (!tip.hidden) showTipEvent(ev); return; }
    const pid = rowEl.dataset.place, { q } = polityAt(pid, y), r = placeRegion(pid);
    tip.style.setProperty("--c", r.color);
    tip.innerHTML = q
      ? `<span>${esc(p(PLB[pid].name))} · ${esc(fmtAxis(y))}</span><b>${esc(p(q.n))}</b><span>${esc(span(q.s, q.e))} · ${esc(p(KDB[q.k].name))}</span><br><span>${esc(t("clickFreeze"))}</span>`
      : `<span>${esc(p(PLB[pid].name))} · ${esc(fmtAxis(y))}</span><b>${esc(t("noState"))}</b>`;
    placeTip(ev);
  }
  function showTipEvent(ev) {
    const e = EVB[ev.target.closest(".lv-dot").dataset.ev], tip = $("#lv-tip");
    tip.style.setProperty("--c", THB[e.theme].color);
    tip.innerHTML = `<span>${esc(p(e.date))}</span><b>${esc(p(e.title))}</b>`;
    placeTip(ev);
  }
  function placeTip(ev) {
    const tip = $("#lv-tip");
    tip.hidden = false;
    const w = tip.offsetWidth, hgt = tip.offsetHeight;
    let x = ev.clientX + 16, y = ev.clientY + 18;
    if (x + w > innerWidth - 8) x = ev.clientX - w - 16;
    if (y + hgt > innerHeight - 8) y = ev.clientY - hgt - 14;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }

  /* ── Year slice ────────────────────────────── */
  const stepFor = (y) => (y < -3500 ? 500 : y < -600 ? 100 : y < 500 ? 25 : y < 1450 ? 10 : y < 1750 ? 5 : y < 1914 ? 2 : 1);
  const thumbPos = (f) => `calc(9px + (100% - 18px) * ${f})`;
  function renderSliceStatic() {
    $("#scrub-band").innerHTML = SEG.map((s, i) => `<span class="sb-ch" data-ch="${i}" style="left:${thumbPos(lx(s[0]))};width:calc((100% - 18px) * ${lx(s[1]) - lx(s[0])})"><span>${esc(p(CH[i].short))}</span></span>`).join("");
    $("#year-presets").innerHTML = YEAR_PRESETS.map((y) => `<button type="button" data-year="${y}" style="left:${thumbPos(lx(y))}">${esc(fmtAxis(y))}</button>`).join("");
    $$("#slice-seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.slice === sliceMode)));
    requestAnimationFrame(() => { declutter($$("#year-presets button")); $$("#scrub-band .sb-ch > span").forEach((s) => { s.style.visibility = s.scrollWidth > s.parentElement.clientWidth - 4 ? "hidden" : ""; }); });
  }
  /* Before | now | after, in proportion, with the frozen year marked */
  function seqHtml(prev, cur, next, gap) {
    const mid = cur || gap;
    const len = Math.max(1, Math.min(mid.e, NOW) - mid.s);
    const a = prev ? Math.max(prev.s, mid.s - len * 0.8) : mid.s;
    const b = next ? Math.min(Math.min(next.e, NOW), Math.min(mid.e, NOW) + len * 0.8) : Math.min(mid.e, NOW);
    const X = (y) => clamp((y - a) / Math.max(1, b - a), 0, 1) * 100;
    const blk = (q, cls) => q ? `<span class="${cls}" style="left:${X(q.s)}%;width:${X(Math.min(q.e, NOW)) - X(q.s)}%"></span>` : "";
    return `<div class="seq" aria-hidden="true"><div class="seq-bar">${blk(prev, `sq k-${prev?.k}`)}${cur ? blk(cur, `sq now k-${cur.k}`) : blk(gap, "sq gap")}${blk(next, `sq k-${next?.k}`)}<i style="left:${X(year)}%"></i></div>
      <div class="seq-lbl"><span>${prev ? "← " + esc(p(prev.n)) : ""}</span><span>${next ? esc(p(next.n)) + " " + esc(fmtAxis(next.s)) + " →" : ""}</span></div></div>`;
  }
  function renderSlice() {
    const w = windowFor(year), c = chapterOf(year);
    const big = year >= NOW ? (lang === "zh" ? "今天" : "Today") : year < 0 ? Math.abs(year).toLocaleString("en-US") : String(year);
    const era = year >= NOW ? "" : year < 0 ? t("bce") : t("ce");
    $("#year-big").innerHTML = `<span class="n">${esc(big)}</span><small>${esc(era)}${era ? " · " : ""}${esc(p(c.title))}</small>`;
    $("#year-range").value = Math.round(lx(year) * 1000);
    $("#step-lbl").textContent = t("step")(stepFor(year));
    markNow();

    const pls = sliceMode === "cmp" ? cmp.map((id) => PLB[id]) : RG.flatMap((r) => PL.filter((x) => x.region === r.id));
    $("#slice-range").textContent = t("sliceRange")(pls.length);
    const tally = { s: 0, d: 0, f: 0, c: 0, none: 0 };
    $("#slice-grid").innerHTML = pls.map((pl) => {
      const r = RGB[pl.region], { q, i, list } = polityAt(pl.id, year);
      tally[q ? q.k : "none"]++;
      const prev = q ? list[i - 1] : list.filter((x) => x.e <= year).pop();
      const next = q ? list[i + 1] : list.find((x) => x.s > year);
      let main;
      if (q) {
        const len = length(q.s, Math.min(q.e, NOW)), into = Math.max(1, length(q.s, year) + 1);
        main = `<p class="kind">${esc(p(KDB[q.k].name))}</p><p class="pn">${esc(p(q.n))}</p><p class="yrs">${esc(span(q.s, q.e))} · ${esc(t("yearOf")(into, q.e >= NOW ? 0 : len))}</p>`;
      } else main = `<p class="kind">—</p><p class="pn none">${esc(t("noState"))}</p><p class="yrs">${esc(t("noStateBody"))}</p>`;
      const gap = !q && (prev || next) ? { s: prev ? prev.e : year - 1, e: next ? next.s : year + 1 } : null;
      const evs = EV.filter((e) => (e.place === pl.id || (e.also || []).includes(pl.id)) && (Math.abs(e.year - year) <= w || (e.end && e.year <= year && e.end >= year)))
        .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year)).slice(0, 2);
      let evHtml;
      if (evs.length) evHtml = evs.map((e) => `<li><button type="button" data-ev="${e.id}"><span>${esc(p(e.date))}</span><b>${esc(p(e.title))}</b></button></li>`).join("");
      else {
        const n = EV.filter((e) => e.place === pl.id).sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year))[0];
        evHtml = n ? `<li class="far"><button type="button" data-ev="${n.id}"><span>${esc(t("nearest"))} · ${esc(p(n.date))}</span><b>${esc(p(n.title))}</b></button></li>` : "";
      }
      return `<article class="sc" style="${regionVars(r)}">
        <header class="sc-head" title="${esc(p(r.name))}"><span class="sw"></span><h3>${esc(p(pl.name))}</h3></header>
        <div class="sc-main">${main}${(q || gap) ? seqHtml(prev, q, next, gap) : ""}</div>
        <ul class="sc-ev">${evHtml}</ul>
      </article>`;
    }).join("");
    $("#slice-sum").innerHTML = t("sum")(fmtYear(year), pls.length) + ["s", "d", "f", "c", "none"].filter((k) => tally[k]).map((k) =>
      `<span><i class="k-${k}"></i><b>${tally[k]}</b> ${esc(t("kindShort")[k])}</span>`).join("");

    const near = EV.filter((e) => Math.abs(e.year - year) <= w || (e.end && e.year <= year && e.end >= year))
      .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year)).slice(0, 10);
    $("#mw-lbl").textContent = t("meanwhile")(w);
    $("#slice-world").innerHTML = near.length ? near.map((e) =>
      `<button type="button" class="mw" data-ev="${e.id}" style="--c:${RGB[e.region].color}"><small>${esc(p(e.date))} · ${esc(e.place ? p(PLB[e.place].name) : p(RGB[e.region].name))}</small><b>${esc(p(e.title))}</b></button>`).join("") : `<p class="mw-none">${esc(t("nothingNear"))}</p>`;
  }
  function setYear(y, opts = {}) {
    year = niceYear(y);
    clearTimeout(yearTimer);
    yearTimer = setTimeout(() => track("select_content", { content_type: "year", item_id: String(year) }), 1500);
    renderSlice();
    writeHash();
    if (opts.scroll) $("#slice").scrollIntoView({ behavior: smooth(), block: "start" });
  }

  /* ── Learning ──────────────────────────────── */
  function renderLearning() {
    $("#learning").innerHTML = D.learning.map((s, i) => `<li><span class="n">${pad2(i + 1)} / ${pad2(D.learning.length)}</span><b>${esc(p(s.t))}</b><p>${esc(p(s.d))}</p></li>`).join("");
  }

  /* ── Detail panel ──────────────────────────── */
  const detail = $("#detail");
  function openDetail(id, opts = {}) {
    const e = EVB[id];
    if (!e) return;
    if (!detail.classList.contains("open")) lastFocus = document.activeElement;
    if (selected !== id) track("select_content", { content_type: "event", item_id: id });
    selected = id;
    const ci = CH.findIndex((c) => c.id === e.chapter);
    if (ci !== chIdx) selectChapter(ci, { keepScroll: true });
    else $$(".ev.sel").forEach((b) => b.classList.remove("sel"));
    const card = $(`.ev[data-ev="${id}"]`);
    if (card) {
      card.classList.add("sel");
      if (opts.reveal) reveal(card);
    }
    const c = CH[ci], r = RGB[e.region], w = Math.max(18, (c.end - c.start) * 0.065);
    let par = EV.filter((x) => x.chapter === e.chapter && x.id !== e.id && x.region !== e.region && Math.abs(x.year - e.year) <= w);
    if (par.length < 3) par = EV.filter((x) => x.chapter === e.chapter && x.id !== e.id && x.region !== e.region);
    const seen = new Set();
    par = par.sort((a, b) => Math.abs(a.year - e.year) - Math.abs(b.year - e.year)).filter((x) => (seen.has(x.region) ? false : seen.add(x.region))).slice(0, 5);
    const ruled = cmp.map((pid) => ({ pid, ...polityAt(pid, e.year) }));
    const places = [e.place, ...(e.also || [])].filter(Boolean);

    $("#detail-body").innerHTML = `
      <p class="d-date">${esc(p(e.date))} · ${esc(p(r.name))}${e.place ? " · " + esc(p(PLB[e.place].name)) : ""}</p>
      <h2 id="d-title">${esc(p(e.title))}</h2>
      <figure class="d-fig" id="d-fig">${plateSvg(e.id, r.color)}<img alt=""><figcaption>${esc(t("plate"))}</figcaption></figure>
      <p class="d-sum">${esc(p(e.summary))}</p>
      <div class="fact"><span class="micro">${esc(t("why"))}</span><p>${esc(p(e.why))}</p></div>
      <div class="fact"><span class="micro">${esc(t("frame"))}</span><p>${esc(p(c.title))} · ${esc(p(c.range))}</p></div>
      <div class="stamps">
        <button type="button" class="stamp" data-theme="${e.theme}" style="--c:${THB[e.theme].color}">${esc(p(THB[e.theme].name))}</button>
        ${places.map((pid) => `<button type="button" class="stamp" data-add="${pid}" style="--c:${placeRegion(pid).color}">${cmp.includes(pid) ? "■" : "+"} ${esc(p(PLB[pid].name))}</button>`).join("")}
      </div>
      <div class="d-links">
        <a href="${esc(readUrl(e))}" target="_blank" rel="noopener">${esc(t("readWiki"))}</a>
        <button type="button" data-freeze="${e.year}">${esc(t("freeze")(fmtAxis(e.year)))}</button>
      </div>
      ${par.length ? `<div class="d-sec"><h3>${esc(t("meanwhileH"))}</h3>${par.map((x) => `<button type="button" class="par" data-ev="${x.id}"><span>${esc(p(x.date))}<br>${esc(x.place ? p(PLB[x.place].name) : p(RGB[x.region].name))}</span><strong>${esc(p(x.title))}</strong></button>`).join("")}</div>` : ""}
      ${ruled.length ? `<div class="d-sec"><h3>${esc(t("ruledH")(fmtAxis(e.year)))}</h3>${ruled.map(({ pid, q }) => `<div class="rule-row" style="--c:${placeRegion(pid).color}"><span class="sw"></span><span style="text-align:left;font:inherit;color:inherit"><b>${esc(p(PLB[pid].name))}</b> · ${q ? esc(p(q.n)) : esc(t("noState"))}</span><span>${q ? esc(span(q.s, q.e)) : ""}</span></div>`).join("")}</div>` : ""}`;

    if (e.wiki) {
      const fig = $("#d-fig");
      leadImage(e.wiki).then((res) => {
        if (selected !== id || !res.src) return;
        const img = $("img", fig);
        img.onload = () => {
          img.classList.add("ok");
          const fp = filePage(res.file || res.src);
          $("figcaption", fig).innerHTML = fp ? `<a href="${esc(fp)}" target="_blank" rel="noopener">${esc(t("source"))}: Wikimedia Commons ↗</a>` : "Wikimedia Commons";
        };
        img.alt = p(e.title);
        img.src = res.src;
      }).catch(() => { /* keep the plate */ });
    }
    detail.classList.add("open");
    detail.setAttribute("aria-hidden", "false");
    detail.scrollTop = 0;
    $("#detail-close").focus({ preventScroll: true });
    writeHash();
  }
  /* Bring a card into view: centred sideways in the space the panel leaves, and clear of the sticky bars */
  function reveal(card) {
    const sc = $("#tl-scroll"), r = card.getBoundingClientRect(), s = sc.getBoundingClientRect();
    const panel = innerWidth > 900 ? Math.min(620, innerWidth * 0.94) : 0;
    const lw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--label-w")) || 0;
    const centre = s.left + lw + (Math.min(s.right, innerWidth - panel) - s.left - lw) / 2;
    sc.scrollBy({ left: r.left + r.width / 2 - centre, behavior: smooth() });
    const bars = $(".topbar").offsetHeight + $(".toolbar").offsetHeight;
    if (r.top < bars + 60 || r.bottom > innerHeight - 20) scrollBy({ top: r.top - bars - 120, behavior: smooth() });
  }
  function closeDetail() {
    detail.classList.remove("open");
    detail.setAttribute("aria-hidden", "true");
    selected = null;
    $$(".ev.sel").forEach((b) => b.classList.remove("sel"));
    writeHash();
    if (lastFocus && typeof lastFocus.focus === "function" && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  /* ── Search ────────────────────────────────── */
  const search = $("#search");
  const INDEX = [
    ...EV.map((e) => ({ kind: "event", e, text: [e.title.en, e.title.zh, e.summary.en, e.summary.zh, e.tags, e.date.en, e.date.zh, RGB[e.region].name.en, RGB[e.region].name.zh, e.place ? PLB[e.place].name.en + " " + PLB[e.place].name.zh : ""].join(" ").toLowerCase() })),
    ...PL.map((pl) => ({ kind: "place", pl, text: [pl.id, pl.name.en, pl.name.zh, RGB[pl.region].name.en, RGB[pl.region].name.zh].join(" ").toLowerCase() })),
    ...Object.entries(POL).flatMap(([pid, list]) => list.map((q) => ({ kind: "state", pid, q, text: [q.n.en, q.n.zh, q.wiki || "", PLB[pid] ? PLB[pid].name.en + " " + PLB[pid].name.zh : ""].join(" ").toLowerCase() })))
  ];
  function openSearch() {
    lastFocus = document.activeElement;
    search.classList.add("open");
    search.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("locked");
    $("#search-input").value = "";
    renderSearch("");
    setTimeout(() => $("#search-input").focus(), 30);
  }
  function closeSearch() {
    const q = $("#search-input").value.trim();
    if (q) track("search", { search_term: q });
    search.classList.remove("open");
    search.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("locked");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  /* Rank whole-word hits in a name above hits buried in a summary ("ming" → Ming before "farming") */
  const nameOf = (x) => (x.kind === "event" ? [x.e.title.en, x.e.title.zh] : x.kind === "place" ? [x.pl.name.en, x.pl.name.zh] : [x.q.n.en, x.q.n.zh]).join(" ").toLowerCase();
  function score(x, words) {
    const name = nameOf(x);
    let s = x.kind === "place" ? 2 : x.kind === "state" ? 1 : 0;
    for (const w of words) {
      const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      if (re.test(name)) s += 10; else if (name.includes(w)) s += 6; else if (re.test(x.text)) s += 2;
    }
    return s;
  }
  function renderSearch(q) {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hits = words.length
      ? INDEX.filter((x) => words.every((w) => x.text.includes(w))).map((x) => ({ x, score: score(x, words) })).sort((a, b) => b.score - a.score).map((h) => h.x).slice(0, 40)
      : EV.filter((e) => e.chapter === CH[chIdx].id).slice(0, 12).map((e) => ({ kind: "event", e }));
    $("#search-results").innerHTML = hits.length ? hits.map((x) => {
      if (x.kind === "event") {
        const e = x.e;
        return `<button type="button" class="sr" data-sr-ev="${e.id}" style="--c:${RGB[e.region].color}"><small>${esc(t("kEvent"))} · ${esc(p(e.date))} · ${esc(e.place ? p(PLB[e.place].name) : p(RGB[e.region].name))} · ${esc(p(CHB[e.chapter].short))}</small><strong>${esc(p(e.title))}</strong><span>${esc(p(e.summary))}</span></button>`;
      }
      if (x.kind === "place") return `<button type="button" class="sr" data-sr-place="${x.pl.id}" style="--c:${RGB[x.pl.region].color}"><small>${esc(t("kPlace"))} · ${esc(p(RGB[x.pl.region].name))}</small><strong>${esc(p(x.pl.name))}</strong></button>`;
      return `<button type="button" class="sr" data-sr-state="${x.pid}:${x.q.s}" style="--c:${placeRegion(x.pid).color}"><small>${esc(t("kState"))} · ${esc(p(PLB[x.pid].name))} · ${esc(span(x.q.s, x.q.e))}</small><strong>${esc(p(x.q.n))}</strong></button>`;
    }).join("") : `<div class="no-results">${esc(t("noResults")(q))}</div>`;
  }

  /* ── Compare set ───────────────────────────── */
  function setCmp(list, opts = {}) {
    cmp = list.filter((id, i) => PLB[id] && list.indexOf(id) === i).slice(0, MAX_CMP);
    track("select_content", { content_type: "compare", item_id: cmp.join(",") });
    store.set("cmp", cmp.join(","));
    if (opts.places && mode !== "places") { mode = "places"; store.set("mode", mode); }
    renderControls();
    renderAtlas();
    renderLong();
    renderSlice();
    writeHash();
  }
  const addPlace = (pid) => { if (!cmp.includes(pid)) setCmp([...cmp, pid], { places: true }); };
  const removePlace = (pid) => { if (cmp.length > 1) setCmp(cmp.filter((x) => x !== pid)); };

  /* ── Hash routing: #c=oceans&e=columbus&y=1492&cmp=china,india ── */
  let hashLock = false;
  function writeHash() {
    if (hashLock) return;
    const q = new URLSearchParams();
    q.set("c", CH[chIdx].id);
    if (selected) q.set("e", selected);
    q.set("y", String(year));
    if (mode === "places") q.set("cmp", cmp.join(","));
    try { history.replaceState(null, "", "#" + q.toString().replace(/%2C/g, ",")); } catch (e) { /* sandboxed */ }
  }
  function readHash() {
    const raw = (location.hash || "").slice(1);
    if (!raw.includes("=")) return false;
    const q = new URLSearchParams(raw);
    hashLock = true;
    const c = CH.findIndex((x) => x.id === q.get("c"));
    if (c >= 0) chIdx = c;
    const y = parseInt(q.get("y"), 10);
    if (!isNaN(y)) year = niceYear(y);
    const list = (q.get("cmp") || "").split(",").filter((id) => PLB[id]);
    if (list.length) { cmp = list.slice(0, MAX_CMP); mode = "places"; }
    hashLock = false;
    return q.get("e");
  }

  /* ── Events ────────────────────────────────── */
  document.addEventListener("click", (ev) => {
    const g = (s) => ev.target.closest(s);
    let el;
    if ((el = g("[data-sr-ev]"))) { const id = el.dataset.srEv; closeSearch(); $("#atlas").scrollIntoView({ behavior: smooth() }); setTimeout(() => openDetail(id, { reveal: true }), 350); return; }
    if ((el = g("[data-sr-place]"))) { closeSearch(); addPlace(el.dataset.srPlace); $("#atlas").scrollIntoView({ behavior: smooth() }); return; }
    if ((el = g("[data-sr-state]"))) {
      const [pid, s] = el.dataset.srState.split(":");
      closeSearch();
      if (sliceMode === "cmp" && !cmp.includes(pid)) setCmp([...cmp, pid]);
      setYear(+s + (POL[pid].find((q) => q.s === +s).e - +s > 2 ? 1 : 0), { scroll: true });
      return;
    }
    if ((el = g("[data-ev]"))) { openDetail(el.dataset.ev, { reveal: !el.classList.contains("ev") }); return; }
    if ((el = g("[data-ch]"))) { selectChapter(+el.dataset.ch, { scroll: !!el.dataset.scroll || ev.target.closest(".lv") }); return; }
    if ((el = g("[data-theme]"))) {
      theme = el.dataset.theme === theme && el.classList.contains("stamp") ? "all" : el.dataset.theme;
      renderThemes(); renderAtlas(); renderLong();
      return;
    }
    if ((el = g("[data-mode]"))) { mode = el.dataset.mode; store.set("mode", mode); renderControls(); renderAtlas(); writeHash(); return; }
    if ((el = g("[data-rm]"))) { removePlace(el.dataset.rm); return; }
    if ((el = g("[data-add]"))) { if (cmp.includes(el.dataset.add)) { mode = "places"; store.set("mode", mode); renderControls(); renderAtlas(); } else addPlace(el.dataset.add); openDetail(selected); return; }
    if ((el = g("[data-toggle]"))) { const pid = el.dataset.toggle; cmp.includes(pid) ? removePlace(pid) : addPlace(pid); return; }
    if ((el = g("[data-long]"))) { longMode = el.dataset.long; store.set("long", longMode); renderLong(); return; }
    if ((el = g("[data-slice]"))) { sliceMode = el.dataset.slice; store.set("slice", sliceMode); renderSliceStatic(); renderSlice(); return; }
    if ((el = g("[data-dir]"))) { const d = +el.dataset.dir, st = stepFor(d < 0 ? year - 1 : year); let y = d < 0 ? Math.ceil(year / st) * st - st : Math.floor(year / st) * st + st; if (y === 0) y = d; setYear(clamp(y, MIN_YEAR, NOW)); return; }
    if ((el = g("[data-year]"))) { setYear(+el.dataset.year); return; }
    if ((el = g("[data-freeze]"))) { const y = +el.dataset.freeze; closeDetail(); setYear(y, { scroll: true }); return; }
    if ((el = g("[data-zoom]"))) { zoomIdx = clamp(zoomIdx + +el.dataset.zoom, 0, ZOOMS.length - 1); store.set("zoom", ZOOMS[zoomIdx]); const sc = $("#tl-scroll"), f = sc.scrollLeft / Math.max(1, sc.scrollWidth); renderAtlas(); sc.scrollLeft = f * sc.scrollWidth; return; }
    if ((el = g(".lang button"))) { if (el.dataset.lang !== lang) { lang = el.dataset.lang; store.set("lang", lang); setParam("lang", lang); track("select_content", { content_type: "language", item_id: lang }); renderAll(); } return; }
    if ((el = g("[data-consent]"))) { setConsent(el.dataset.consent); return; }
    if (g("#consent-open")) { $("#consent").hidden = false; $("#consent [data-consent]").focus(); return; }
    if (ev.target.closest(".lv") && !ev.target.closest("button")) { const f = lvFrac(ev); if (f != null) setYear(lxInv(f)); }
  });
  $("#detail-close").addEventListener("click", closeDetail);
  $("#search-open").addEventListener("click", openSearch);
  $("#search-close").addEventListener("click", closeSearch);
  $("#search-input").addEventListener("input", (e) => renderSearch(e.target.value));
  $("#cmp-add").addEventListener("change", (e) => { if (e.target.value) addPlace(e.target.value); });
  $("#cmp-preset").addEventListener("change", (e) => { const s = PRESETS.find((x) => x.id === e.target.value); if (s) setCmp(s.places, { places: true }); });
  $("#year-range").addEventListener("input", (e) => setYear(lxInv(e.target.value / 1000)));
  const lv = $("#lv");
  lv.addEventListener("mousemove", onLvMove);
  lv.addEventListener("mouseleave", () => { $("#lv-cursor").hidden = true; $("#lv-tip").hidden = true; });
  let resizeT = 0;
  addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { fitLong(); renderSliceStatic(); }, 150); });

  /* Drag the atlas sideways with a mouse */
  const sc = $("#tl-scroll");
  let drag = null;
  sc.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.button !== 0 || e.target.closest("button")) return; drag = { x: e.clientX, left: sc.scrollLeft, moved: false }; });
  addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 3) { drag.moved = true; sc.classList.add("drag"); } sc.scrollLeft = drag.left - dx; });
  addEventListener("pointerup", () => { drag = null; sc.classList.remove("drag"); });

  document.addEventListener("keydown", (e) => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (e.key === "Escape") {
      if (search.classList.contains("open")) closeSearch();
      else if (detail.classList.contains("open")) closeDetail();
      return;
    }
    if (search.classList.contains("open")) return;
    if (e.key === "/" && !typing) { e.preventDefault(); openSearch(); return; }
    if (e.altKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); selectChapter(chIdx + (e.key === "ArrowRight" ? 1 : -1)); }
  });
  addEventListener("hashchange", () => { const id = readHash(); renderAll(); if (id && EVB[id]) openDetail(id, { reveal: true }); });

  /* Analytics consent (GA itself is set up in index.html, on the production domain only) */
  function setConsent(value) {
    store.set("consent", value);
    if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: value });
    /* Withdrawing consent also removes cookies GA set earlier (on this host and on the parent domain) */
    if (value === "denied") {
      const parent = "." + location.hostname.split(".").slice(-2).join(".");
      document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^_ga/.test(n)).forEach((n) => {
        for (const domain of ["", `; domain=${location.hostname}`, `; domain=${parent}`]) document.cookie = `${n}=; Max-Age=0; path=/${domain}`;
      });
    }
    $("#consent").hidden = true;
  }
  if (typeof window.gtag === "function") {
    $("#consent-open").hidden = false;
    if (!store.get("consent")) $("#consent").hidden = false;
  }

  function renderAll() {
    applyStatic();
    renderNav();
    renderIntro();
    renderControls();
    renderThemes();
    renderAtlas();
    renderLong();
    renderSliceStatic();
    renderSlice();
    renderLearning();
    if (selected) openDetail(selected);
  }

  const startEv = readHash();
  renderAll();
  if (startEv && EVB[startEv]) requestAnimationFrame(() => { $("#atlas").scrollIntoView(); openDetail(startEv, { reveal: true }); });
})();
