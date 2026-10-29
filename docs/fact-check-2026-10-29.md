# Fact-check, 29 October 2026

A web-assisted pass over all 252 units of the atlas (218 events, the polity sequence for each of the 26 places, and the chapter descriptions), 1,213 claims in all. Each claim was checked against live sources: museum, academic and official publications first, then major encyclopedias. Claims the first pass flagged (95 of them) were checked again by a stronger reviewer with a wider search. After that second review, 1,158 were confirmed, 34 were flagged as corrections, 20 as contested and 1 as an English/Chinese mismatch. Every proposed change was then reviewed by the owner before it was applied.

The changes landed in four pull requests: #5 (clear factual slips), #6 (sensitive events), #7 (polity dates) and #9 (follow-ups: Sokoto, overlapping polity boundaries, consistency). This file records what changed in the data and what was left alone, and why.

## Corrected: events

| Item | Was | Now | Reason / source |
| --- | --- | --- | --- |
| `hammurabi.summary` | "nearly 300 laws" | "282 laws" (EN + ZH) | Standard count of the laws on the stele |
| `st-petersburg.summary` | "later makes it his capital" | "in 1712 makes it his capital" | The court moved to St Petersburg in 1712 |
| `global-silver.date` / year | 1571–1815 | 1565–1815 | Urdaneta found the return route across the Pacific in 1565 |
| `global-silver.why` | "joined the Americas, Asia, Europe and Africa" | The trans-Pacific circuit joined the Americas, Asia and Europe | Africa was not part of the galleon circuit itself |
| `global-silver.summary` | Opened "After Spain founds Manila in 1571…" | Starts in 1565 with the return route and names Manila as the Spanish base founded in 1571 | Consistency with the corrected date |
| `dingo.date` / year / end | c. 2,000–1,500 BCE | c. 1,400–1,100 BCE | Balme et al. 2018, *Sci. Rep.*, direct dates |
| `dingo.summary` | Oldest remains "about 3,450 years old" | Madura Cave direct date, c. 3,350–3,100 years ago | Balme et al. 2018 (3348–3081 cal BP); matches the corrected range |
| `bmac.summary` | Oases of Turkmenistan, Uzbekistan and Afghanistan | Adds northeastern Iran and Tajikistan | Extent of the Oxus civilization sites |
| `sasanian.why` | "For four centuries … patronised Zoroastrianism as a state religion" | Zoroastrianism became the state religion under later rulers | The state-religion role developed after the founding |
| `suez.summary` | "dug largely by Egyptian corvée labor" | Corvée labour only in 1859–63; foreign workers and steam machinery after that | Corvée was replaced by foreign labourers and mechanisation from 1863–64 (CNRS) |
| `rapa-nui.summary` | Voyagers "settle Rapa Nui … and begin carving moai" | Moai carving began soon after settlement | Settlement c. 1200 CE; carving followed |
| `chapter:classical.description` (ZH only) | 同时 … 延续千年 | Wording matches the English, which already names the Americas | EN/ZH mismatch |
| `israel.summary` ⚠︎ sensitive | "hundreds of thousands" (数十万) | "around 700,000" Palestinians displaced or expelled (约70万) | Morris / Cambridge; Britannica; UN 1949–50 figures |
| `india-rebellion.summary` ⚠︎ sensitive | "across northern India" | "across northern and central India" (印度北部和中部) | The rising also spread through central India |
| `tonga.summary` ⚠︎ sensitive | "extend influence to" Samoa, Fiji and nearby islands | "maintain cultural and diplomatic ties with" them | Softer wording the sources support |
| `atlantic-slavery.date` / end ⚠︎ sensitive | c. 1550–1800 | c. 1550–1808 | The British and US bans on the trade took effect in 1807–08. The audit marked this contested; the owner approved it |
| `sokoto.place` ⚠︎ sensitive | `mali` (its dot sat on the Bambara & Toucouleur row) | `null` (the event sits in the Africa lane, like Nok and Bantu) | The caliphate was in what is now northern Nigeria, which the summary already says. See "Checked and kept" for why there is no `nigeria` place |

## Corrected: polity dates

Polity rows for a place must not overlap, so when a corrected date moves a boundary, the neighbouring row moves with it. Where moving a boundary would erase a state the audit confirmed, the row was renamed instead.

| Place | Was | Now | Reason |
| --- | --- | --- | --- |
| Ethiopia | Kingdom of Aksum from 150 BCE; Proto-Aksumite −400 → −150 | Aksum from c. 100 CE; Proto-Aksumite −400 → 100 | Usual date for the kingdom; matches the `aksum` event |
| Ethiopia | "Solomonic dynasty" 1270–1769 | "Early Solomonic & Gondar" 1270–1769 | The dynasty reigned until 1974, through the later rows, so the row was renamed rather than extended |
| Germany | "Napoleonic Rhineland" 1806–1815 | Confederation of the Rhine 1806–1813 | Formal name; dissolved November 1813. Leaves a two-year gap before the German Confederation (1815) |
| Mexico | Olmec from 1600 BCE; Archaic farmers to −1600 | Olmec 1200–400 BCE; Archaic farmers to −1200 | Classic Olmec span; matches the `olmec` event |
| Mexico | Late Formative to 250 CE; Teotihuacan & Maya from 250 | Late Formative to 200 CE; Teotihuacan & Maya from 200 | 200 CE is the other common Classic boundary, and puts the `teotihuacan` event (c. 200 CE) on the right row. `maya-classic` (250) stays on the same row |
| United States | Woodland −1000 → 800; Mississippian from 800 | Woodland to 1000 CE; Mississippian from 1000 | Usual boundary (Cahokia event c. 1050) |
| Indonesia | Srivijaya 650 → 1025; Kediri & Singhasari from 1025 | Kediri & Singhasari from 1042; Srivijaya row ends 1042 | Airlangga's partition of his kingdom, 1042 |
| Mongolia | Xianbei 91–330; Tang protectorate from 630 | Xianbei 93–234; Tang protectorate from 647 | Leaves gaps of 2, 96 and 17 years; no rows were invented to fill them |
| Mali | "Jenne-Jeno" −250 → 300 | "Early Middle Niger towns" −250 → 300 (Ghana unchanged) | Jenné-Jeno lasted to c. 1400 CE, but ending the row there would delete Ghana, Sosso and the Mali Empire. The row now names the era, not the town |
| Iran | Elam to −646; Median kingdom −646 → −550 (state) | Elam to −678; "Media & late Elam" −678 → −550 (divided) | Medes from c. 678 BCE; late Elam in Susiana lasted to c. 539 BCE, so the shared row is divided |
| India | Mehrgarh −7000 → −3300; Indus from −3300 | "Mehrgarh & early Indus villages" −7000 → −2600; Indus from −2600 | Mehrgarh was abandoned c. 2600–2500 BCE; 2600 BCE is the usual start of the Mature Harappan phase (matches `indus-cities`) |
| India | Indus to −1300; Vedic from −1300 | Indus to −1500; Vedic −1500 → −600 | Usual start of the Vedic period; the `vedic` event already started there |
| Korea | Mumun to −400; Gojoseon from −400 | Mumun to −300; Gojoseon −300 → −108 | Late Mumun ends c. 300 BCE; Gojoseon is firmly attested as a state from c. 300 BCE |
| Iraq | Ubaid to −4000; Uruk from −4000 | Ubaid to −3800; Uruk −3800 → −3100 | Terminal Ubaid runs to c. 3800 BCE |
| Italy | Villanovan to −753; Etruscans & early Rome from −753 | Villanovan to −720; Etruscans & early Rome −720 → −509 | The Orientalizing Etruscan period starts c. 720 BCE. The `rome-founded` event (753, traditional) now sits on the Villanovan row, which fits: 8th-century Rome was an Iron Age village |

In total: 17 event corrections and 15 polity corrections (32 rows above).

## Checked and kept

- **Sokoto: no `nigeria` place.** The audit proposed moving `sokoto` from `mali` to `nigeria`, but the data has no `nigeria` place. Every place needs a full polity timeline to 2026, and the place count (26) appears in the meta tags, the noscript copy and the OG image. A Nigeria row would mean writing about ten new states with no audit behind them, so the event's place was set to `null` instead (above). The null is intentional.
- **China: Erlitou / Shang left at 1600 BCE.** The audit proposed ending Erlitou at c. 1500 BCE. Moving Shang off 1600 BCE would break the convention the atlas uses in both languages (the Xia–Shang–Zhou Chronology Project date). Erlitou's last phase does overlap early Shang (Erligang); that overlap is the disagreement itself.
- **Contested date conventions.** Each of these matches a mainstream convention that authoritative sources support, so it was kept: Mehrgarh 7000 BCE, Chavín end, Kofun / Himiko 238, Ptolemaic Egypt from 332 (vs 305), Frankish realm from 500 (vs 481), Mali Empire end 1468, Rozvi end, Muromachi 1333 (vs 1336/38), Jōmon start, the timing of the Sahul separation, Ubaid "cities", Botai horse riding and the steppe networks.
- **Bantu ironworking** (`bantu.why`): the "why" line still says migration carried ironworking. Unchanged.
- The dingo summary's figure and the galleon's "Manila 1571" opening, left alone in #5, were updated in #9 for consistency (listed above).

## Skipped (owner decision)

- **Polynesian voyaging (c. 500 CE) → c. 750 BCE.** The proposal conflates the rise of ancestral Polynesian society with the voyaging era. Rejected.
- **Australia, First Nations start c. 13,000 → c. 50,000 BCE.** The fact is right, but 13,000 BCE is the chart's axis clamp (the origins chapter begins at −13,000). A chart design question, not a data error.
- **Liangzhu (`liangzhu.meta`) and Trans-Siberian Railway (`chapter_span`).** The event's end falls past its chapter's end. These are internal design calls, not factual errors.
- **Japan: "Edo" → "Tokugawa shogunate".** Naming style only; the dates (1603–1868) were confirmed.

## Checks

`node scripts/check-data.mjs` passes: 8 chapters, 26 places, 348 polities, 218 events (warnings only, including the new Germany and Mongolia gaps noted above).
