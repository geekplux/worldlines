# Worldlines: working conventions

A static, bilingual (EN/中文) atlas of world history: 8 chapters, 26 places, their polities and about 220 events.
Repository: github.com/geekplux/worldlines. Live: https://worldlines.geekplux.com/ (primary; `worldlines.geekplux.org` is a secondary domain, so
canonical, sitemap and links always use `.com`). Sister projects: Art-isms, Dialectica.
Read README.md for the data model and file layout. These are the rules that are easy to break.

## No build step

- The site is plain HTML, CSS and JavaScript in `public/`, deployed as-is. Do not add a bundler, framework,
  package.json or build command unless the owner agrees first.
- Everything deployable lives in `public/`; nothing else is uploaded. Scripts in `scripts/` are dev-time
  tools (Node 22, no dependencies).
- Serve locally with `python3 -m http.server 8000 --directory public` (or `npx wrangler dev`).

## Content

- Content is in `public/data/` (`window.WORLDLINES`): `core.js`, `polities.js`, `events.js`. Every piece of text is
  `{ "en": "…", "zh": "…" }`, both non-empty. Add new text in both languages in the same change.
- English is the default language and `/` is always the English page; Chinese is `/?lang=zh`. Do not switch
  language from the browser's locale: the search-engine tags (canonical, hreflang) depend on it.
- One language at a time: the English view shows no Chinese at all (the 中文 language button is the one exception),
  and the Chinese view shows no English subtitles. Never render the other language as a secondary line.
- Events are real and well attested; dates are conventional. Contested claims are stated as contested.
  If a fact can't be verified, list it for the owner; don't silently "fix" it.
- Polities per place are sorted and never overlap; the last one ends in 2026. Kinds: s, d, f, c (see README).
- The counts quoted in `index.html` and `app.js` (countries, regions, turning points, states) must match the data;
  `check-data` fails otherwise, so update the copy when you add events or polities.

## Design

- Mondrian carries meaning: colour = region, a block = a state, full colour = the state ruling in the frozen year.
  Everything else stays paper and ink. Prefer removing emphasis to adding it.
- Hairlines inside sections; heavy rules only between sections and on timeline grids.
- The footer opens with the sister-atlas strip: Art-isms, Worldlines, Dialectica, in that order, with the site you are on in solid ink. The same markup, styles and words live in all three repos; change them together.
- Check every change at desktop width and at 390px, in both languages: no horizontal page scroll, no console errors.

## Analytics and privacy

- GA4 (`G-10HB9ZHEKC`) loads on `worldlines.geekplux.com` and `.org` only, with Consent Mode v2 defaulting to denied.
  Keep the hostname guard, keep ads storage denied, and never send personal data in event parameters.
- GA cookies are host-only (`cookie_domain: "none"`), so they are not shared with Art-isms or other
  `*.geekplux.com` sites.
- Page views are sent by `pageView()` in `app.js` after render (load and language switch), not by `gtag("config")`
  (`send_page_view: false`), and without the hash. Keep the GA4 stream setting "Page changes based on browser history
  events" (Enhanced measurement → Page views → advanced) off, or the `?lang` replaceState logs extra page views.
- Events go through `track()` in `app.js`; it is a no-op wherever `gtag` is not defined.

## Before every commit

1. `node scripts/stamp-assets.mjs` if `public/assets/app.js` or `styles.css` changed.
2. `node scripts/check-data.mjs` (CI runs it too; it fails on stale stamps and on counts that drift from the data).
3. Open the page at desktop width and at 390px, in both languages.

## Caching and deployment

- Cloudflare Workers Static Assets, configured in `wrangler.jsonc`; Workers Builds deploys `master` on push.
  The Worker name `worldlines` must match the Worker in the Cloudflare dashboard.
- `public/_headers` caches `assets/` for a year. That is only safe because every reference has a `?v=<content hash>`:
  never reference those files without one.
- One commit per logical change, with a message that says why.
