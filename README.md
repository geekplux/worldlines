# Worldlines · 世界线

A bilingual (English / 中文) atlas of world history in the style of Mondrian. It lets you compare regions and countries side by side: chapter by chapter, across 15,000 years at once, or one year at a time.

- **Atlas.** Eight chapters, from the first settlements to today. Each lane is a **region** or a **country you choose**, so events on the same vertical line happened at about the same time. Country lanes also carry a strip showing which state held the place. You can filter by theme ("trace a thread"), zoom, and drag sideways.
- **Long view.** 26 places × 15,000 years, one coloured block per state, dynasty, empire or colonial power. The scale is compressed in deep time, and thick rules mark where it changes. Hover to read a year; select to freeze it.
- **Year slice.** Pick any year. Every place you are comparing shows who ruled it, how far into that state's life the year falls, what came before and after, and what happened nearby in time.
- **Event panel.** Shows why an event mattered, "meanwhile, elsewhere…", who ruled each compared place that year, and the Wikipedia lead image (Commons files only).
- **Search** (<kbd>/</kbd>) covers events, countries and states. <kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> changes chapter, and <kbd>Esc</kbd> closes panels.
- **Shareable state.** The URL hash records the chapter, the open event, the year and the comparison set, e.g. `#c=oceans&e=tokugawa&y=1603&cmp=china,japan,britain`.
- **No build step.** Plain HTML, CSS and JavaScript, with the content in three data files. A sibling of [Art-isms](https://github.com/geekplux/art-isms).

## Run it locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

Opening `index.html` directly also works. Event images load from Wikipedia, so they need a connection; without one, each panel shows a Mondrian plate instead.

## Project structure

```
index.html            page skeleton and static copy
assets/styles.css     all styles (paper, ink and De Stijl)
assets/app.js         rendering, comparison, year slice, i18n, routing
data/core.js          chapters, regions, places, themes, polity kinds, learning notes
data/polities.js      who held each place, from first states to today
data/events.js        every hinge point on the atlas
scripts/check-data.mjs  validates all three data files (no dependencies)
```

## Content model

Every piece of text is a `{ "en": "…", "zh": "…" }` pair. Years are integers, and negative years are BCE.

An **event** (`data/events.js`):

```js
{
  "id": "tokugawa", "chapter": "oceans", "year": 1603,      // year must fall inside the chapter
  "end": 1868,                                               // optional, for processes
  "date": { "en": "1603", "zh": "1603年" },
  "region": "east-asia", "place": "japan", "also": [],       // place may be null
  "theme": "state",                                          // state belief technology trade conflict society environment
  "title": { … }, "summary": { … }, "why": { … },
  "tags": "japan edo shogun 江户 幕府",
  "wiki": "Tokugawa shogunate"                               // English Wikipedia title, used for the image and "read more"
}
```

A **polity** (`data/polities.js`, keyed by place id):

```js
{ "s": 1603, "e": 1868, "n": { "en": "Edo shogunate", "zh": "江户幕府" }, "k": "s", "wiki": "Tokugawa shogunate" }
```

`k` is the kind of polity:

| `k` | Meaning |
| --- | --- |
| `s` | a home-grown state or dynasty |
| `d` | divided among rival states |
| `f` | ruled from outside: conquest, colony or mandate |
| `c` | an archaeological culture or era before or beside states |

Each place's polities are sorted and must not overlap. Gaps are allowed, and the last polity ends in 2026.

## Adding or correcting content

1. Edit the data file.
2. Run `node scripts/check-data.mjs`; add `--warnings` to list gaps and region mismatches.
3. Open the page in both languages.

CI runs the same check on every push and pull request.

## Caveats

Dates are conventional. States rarely begin or end in a single year. Modern country names are stable places to stand, not claims that those nations existed in the past. The selection is deliberately small: a learning scaffold, not a complete record.

## License

- Code (`index.html`, `assets/`, `scripts/`): [MIT](LICENSE)
- Written content in `data/`: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Images are not part of this repository. Each one is loaded from Wikimedia Commons under its own licence.
