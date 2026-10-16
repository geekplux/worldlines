#!/usr/bin/env node
// Validates public/data/core.js, polities.js and events.js (ids, links, bilingual text, years)
// and the ?v= cache stamps in public/index.html.
// Usage: node scripts/check-data.mjs   (no dependencies)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { staleStamps } from "./stamp-assets.mjs";

const sandbox = { window: {} };
for (const f of ["core", "polities", "events"]) {
  const file = fileURLToPath(new URL(`../public/data/${f}.js`, import.meta.url));
  vm.runInNewContext(readFileSync(file, "utf8"), sandbox, { filename: file });
}
const D = sandbox.window.WORLDLINES;
const NOW = 2026;
const errors = [], warnings = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const bi = (where, o, field) => {
  if (!o || typeof o.en !== "string" || typeof o.zh !== "string" || !o.en.trim() || !o.zh.trim()) fail(where, `${field} needs non-empty "en" and "zh"`);
};
const ids = (list, what) => {
  const s = new Set();
  for (const x of list) { if (s.has(x.id)) fail(what, `duplicate id "${x.id}"`); s.add(x.id); }
  return s;
};

if (!D || !D.chapters || !D.polities || !D.events) { console.error("window.WORLDLINES is incomplete"); process.exit(1); }
const chapters = new Map(D.chapters.map((c) => [c.id, c]));
ids(D.chapters, "chapters");
const regions = ids(D.regions, "regions");
const places = ids(D.places, "places");
const themes = ids(D.themes, "themes");
const kinds = ids(D.kinds, "kinds");

for (const c of D.chapters) {
  for (const f of ["short", "title", "range", "description"]) bi(`chapter "${c.id}"`, c[f], f);
  if (!(c.start < c.end)) fail(`chapter "${c.id}"`, "start must be before end");
}
for (const r of D.regions) { bi(`region "${r.id}"`, r.name, "name"); if (!/^#[0-9a-f]{6}$/i.test(r.color)) fail(`region "${r.id}"`, "color must be #rrggbb"); }
for (const t of D.themes) bi(`theme "${t.id}"`, t.name, "name");
for (const p of D.places) { bi(`place "${p.id}"`, p.name, "name"); if (!regions.has(p.region)) fail(`place "${p.id}"`, `unknown region "${p.region}"`); }
const placeRegion = Object.fromEntries(D.places.map((p) => [p.id, p.region]));

/* Polities */
let polCount = 0;
for (const pid of Object.keys(D.polities)) if (!places.has(pid)) fail("polities", `unknown place "${pid}"`);
for (const pid of places) {
  const list = D.polities[pid];
  if (!list || !list.length) { fail(`polities "${pid}"`, "no polities"); continue; }
  polCount += list.length;
  list.forEach((q, i) => {
    const at = `polity ${pid}[${i}]`;
    if (!Number.isInteger(q.s) || !Number.isInteger(q.e) || !(q.s < q.e)) fail(at, "needs integer s < e");
    if (!kinds.has(q.k)) fail(at, `unknown kind "${q.k}"`);
    bi(at, q.n, "n");
    if (i && q.s < list[i - 1].e) fail(at, `overlaps the previous polity (${q.s} < ${list[i - 1].e})`);
    if (i && q.s > list[i - 1].e) warn(at, `gap of ${q.s - list[i - 1].e} years before "${q.n.en}"`);
  });
  if (list[list.length - 1].e !== NOW) fail(`polities "${pid}"`, `last polity should end in ${NOW}`);
}

/* Events */
const evIds = ids(D.events, "events");
for (const e of D.events) {
  const at = `event "${e.id}"`;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(e.id)) fail(at, "id must be lowercase letters, digits and dashes");
  const c = chapters.get(e.chapter);
  if (!c) fail(at, `unknown chapter "${e.chapter}"`);
  else if (!(e.year >= c.start && e.year <= c.end)) fail(at, `year ${e.year} is outside chapter ${c.id} (${c.start}..${c.end})`);
  if (!Number.isInteger(e.year)) fail(at, "year must be an integer");
  if (e.end != null && !(Number.isInteger(e.end) && e.end > e.year)) fail(at, "end must be an integer after year");
  if (!regions.has(e.region)) fail(at, `unknown region "${e.region}"`);
  if (e.place != null && !places.has(e.place)) fail(at, `unknown place "${e.place}"`);
  if (e.place && placeRegion[e.place] !== e.region) warn(at, `place "${e.place}" is in ${placeRegion[e.place]}, event is in ${e.region}`);
  for (const a of e.also || []) if (!places.has(a)) fail(at, `unknown "also" place "${a}"`);
  if (!themes.has(e.theme)) fail(at, `unknown theme "${e.theme}"`);
  for (const f of ["date", "title", "summary", "why"]) bi(at, e[f], f);
  if (typeof e.tags !== "string") fail(at, "tags must be a string");
  if (e.wiki != null && (typeof e.wiki !== "string" || !e.wiki.trim())) fail(at, "wiki must be an article title");
}
for (const c of D.chapters) for (const r of D.regions)
  if (!D.events.some((e) => e.chapter === c.id && e.region === r.id)) warn(`chapter "${c.id}"`, `no event in region ${r.id}`);

/* The page's description, social card text and JSON-LD quote these counts; keep them true */
const PAGE = readFileSync(fileURLToPath(new URL("../public/index.html", import.meta.url)), "utf8");
const APP = readFileSync(fileURLToPath(new URL("../public/assets/app.js", import.meta.url)), "utf8");
for (const [n, en, zh] of [[places.size, "countries", "个国家"], [D.regions.length, "regions", "个地区"], [evIds.size, "turning points", "个转折点"], [polCount, "states", "个政权"]]) {
  for (const m of PAGE.matchAll(new RegExp(`(\\d+) ${en}\\b`, "g"))) if (+m[1] !== n) fail("public/index.html", `says "${m[0]}", data has ${n}`);
  for (const m of APP.matchAll(new RegExp(`(\\d+)${zh}`, "g"))) if (+m[1] !== n) fail("public/assets/app.js", `says "${m[0]}", data has ${n}`);
}

for (const s of staleStamps()) fail("public/index.html", `${s} has a stale ?v= stamp: run node scripts/stamp-assets.mjs`);

if (process.argv.includes("--warnings")) for (const w of warnings) console.warn("· " + w);
if (errors.length) {
  console.error(errors.map((e) => "✗ " + e).join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`✓ ${D.chapters.length} chapters, ${places.size} places, ${polCount} polities, ${evIds.size} events. All checks passed${warnings.length ? ` (${warnings.length} warnings; run with --warnings)` : ""}.`);
