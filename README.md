# China MRL — GB 2763-2026

Static reference app for fresh fruit and vegetable exporters from any origin to mainland China, plus an explorer of the entire numeric standard. Serve `dist/` over HTTP. No backend or build dependencies.

## Run locally

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Run checks with `node --test tests/*.test.cjs`. This repository includes source reference materials; no separate license grant is made for third-party documents.

## Data and scope

- All 10,749 numeric source rows across 568 pesticide sections (the standard describes 585 pesticides, including combined sections).
- 6,077 original fresh-fruit/vegetable rows; 184 fresh commodities mapped to Annex A for direct and group lookups.
- 109 further Annex A commodities (dried fruit/vegetables, nuts, sugar crops, beverages, edible fungi including fresh mushrooms, spices, medicinal plants) resolved in the Entire standard search. Grains, oilseeds/oils and animal products are not mapped: grains reuse vegetable names such as 豌豆 for dry pulses. The source's misprinted 糖类 heading in section 4.152 is read as 糖料 and flagged on the row.
- All 44 Annex B exemptions; original 442-page Chinese PDF bundled with page-specific links.
- Residue definitions with English renderings (navigation aids; the Chinese controls), testing methods parsed into per-category clauses with standard numbers, provisional flags, EMRL distinctions, food qualifiers, and source location preserved. The 97 sections without a testing-method clause are exactly those whose limits are all provisional.
- English food labels for every source row except the two unmapped cabbage names and one grain row printed as 栗 (possibly 粟, foxtail millet). Pesticide and Annex B names whose English lost its spaces in the PDF are restored in `research/english_names.py`.
- Full-standard food categories, search, CSV export, saved references with crop context, and quantified/non-detect arithmetic comparison.

Snapshot researched 2026-11-09. No automated regulatory monitoring, worldwide market-access matrix, official certification or shipment-clearance determination. English labels aid navigation; source Chinese wording controls. Some food labels and technical definitions remain Chinese. A missing match is never treated as zero or assigned a default MRL. Two fresh-vegetable rows name foods that Annex A does not define (`甘蓝`, section 4.219, and `白菜`, section 4.360); they are not applied to any crop but are listed for review, with what the 2021 edition shows about each, on the crops whose names contain them (the head cabbages, and the Chinese cabbages and 普通白菜 group), and a test fails if another such row appears. Fresh limits are not automatically applied to processed or frozen products.

## Source provenance

China MARA announcement: https://www.moa.gov.cn/govpublic/ncpzlaq/202602/t20260225_6481696.htm

USDA FAS report CH2026-0049 links to the Chinese standard attachment:
https://gain.fas.usda.gov/Download.aspx?p=3696&q=e0dbfbad-4854-4f2f-80a6-c5e095672d46

Attachment SHA-256: `cb7b3716ca4dd9fe0b081d8420c6967327cb72891df1dac34ff7fbce8eb1604f`.
All 442 pages of extracted text match the original third-party copy. Full-table extraction reconciles to the stated 10,749 limits. Independent pdfplumber numerical-column extraction reconciled all 10,749 values by table; a 30-row continuation-header discrepancy on PDF page 185 is documented in `research/grid-audit.json` and surfaced on affected records. This is extraction validation, not regulatory certification.

## Rebuilding the data

Place the source PDF at `research/usda-standard.pdf`. Run `python research/build_database.py`, then `python research/package_data.py`; copy the verified PDF to `dist/standard.pdf`. PyMuPDF is required for extraction, and pypinyin and opencc-python-reimplemented for packaging. `research/catalog.py` contains the Annex A crop mappings. Review source changes, classification mappings, qualifiers, residue definitions and exceptions before publication. Preserve source numbering anomalies (sections 173 and 223) in the document while parsing their content correctly.

`research/verify_tables.py` keeps the reviewed notes already in `research/grid-audit.json` (raw count, source numbering corrections) and independently checks numerical values by table using pdfplumber's ruled table geometry. Category/commodity interpretation is separately checked through regression cases. Do not represent automated matching as an official legal interpretation.

## Checks

Run `node --test tests/*.test.cjs` and `node --check dist/app.js`. Tests exercise data totals, direct and group application, explicit exclusions, nested qualifiers, alias specificity, missing limits, conflicts, EMRL/provisional distinctions, non-detect handling, application navigation, source links, saves, and CSV exports.

Browser checks run in headless Chromium with Playwright (set `CHROMIUM_PATH` if Chromium is not at `/usr/bin/chromium`): `node scripts/test_pwa.cjs` serves the repository itself and covers both `/china-mrl/` and `/dist/` scopes, offline reload, market access, the PDF and recovery after the offline cache is cleared; `node scripts/test_standard_search.cjs` expects the repository served at `http://localhost:8089/china-mrl/` (or `AUDIT_URL`). Visual review is still manual.

## Maintenance

New standard revisions must be reviewed and loaded explicitly; this app is a dated reference. Refer to the relevant origin-country authority and GACC for current country–commodity access protocols and establishment requirements. Keep source dates and limitations visible in the app.

## GitHub Pages

Live app: https://stanleywoosweeleong.github.io/china-mrl/

Pages publishes `main` / (root). The root `index.html` is generated from `dist/index.html` with a base URL pointing at `dist/`, so all styling, scripts, data and PDF links load from the application directory. `.nojekyll` prevents README/theme processing from taking over the app entry page.

After changing `dist/index.html`, regenerate the root entry before committing:

```sh
python3 scripts/prepare_pages.py
```

Push the updated `main` branch to deploy. The optional `scripts/deploy_pages.py` publishes a standalone `gh-pages` branch, but that branch is not the active Pages source.

## Country-of-origin market access

Selecting an origin keeps you on the current tab and updates the crop card's access banner; the **Market access** tab has a country-specific crop catalogue that opens on crops with a record (all crops one choice away), sorted with documented access first, and filters for evidence status, fruit/vegetable category and crop name. Conditions/source buttons retain the selected country and form; fresh-crop MRL buttons carry the crop into the reference lookup. The Fresh produce selector labels the same origin-specific evidence status and the selected crop card repeats it. MRL limits remain independent of market-access permission. The **Market access** tab checks exact origin, commodity and product form combinations. All 184 mapped crops and ISO 3166-1 countries/territories are selectable. Evidence coverage is 311 fresh-product combinations across 60 origins, in three tiers that are labelled wherever they appear:

- **Protocols and official guides (21):** GACC announcements read on MOFCOM or provincial commerce-department republications, and five Malaysian entries from the dated 2025 FAMA export guide. Conditions for the eleven added on 10 November 2026 are paraphrased summaries.
- **GACC list via translation (290):** fresh fruit from GACC's permitted list as given in Produce Report's edited English translation (updated 6 October 2026). GACC's own site refused automated access, so the official list was not read directly; each record says so.
- Fresh vegetables are barely covered (Laos, Vietnam and Tanzania chilli; Vietnam sweet potato). No Malaysian vegetable combination is verified.

Mapping choices, exclusions (including entries the list marks as suspended) and crops outside the catalogue are recorded in `research/market-access-2026-11-10.md`. Other combinations are **Not verified**, never inferred to be prohibited or permitted. Country names/codes are sourced from the system ISO codes dataset.

`dist/market-access.json` contains official announcement/guide links, scope, announcement dates or guide editions, document-review dates and brief conditions. Supplemental route information is attributed separately. “Protocol documented” means an opening protocol was reviewed, **not** that current operational clearance, registrations or absence of suspensions were verified. Records older than 90 days show a review-due label. There is no automatic regulatory feed; `scripts/check_sources.cjs` (run weekly by the Source watch workflow) reports when the translated list is updated, a source page disappears or a record passes 90 days, and opens a GitHub issue for a person to review. Frozen, dried and processed forms never inherit fresh permissions.

To maintain coverage, review official GACC notices and the origin authority, preserve geographic/species/form restrictions and treatment conditions, and add exact records with source and review date. Review current suspensions and establishment registers before shipment. Duplicate matches fail closed to Not verified. Run `node --test tests/*.test.cjs`, then `python scripts/prepare_pages.py` before publishing.

## Interface

- **Crop picker:** type a crop in Simplified or Traditional Chinese (榴槤), an everyday or regional name (凤梨, 牛油果, 土豆; see `research/search_names.py`, used for search only and never for matching limits), English, pinyin (`liulian`) or initials (`ll`); matches show whether the selected origin has a market-access record. It drives a hidden `#crop` select, which remains the source of truth.
- **Phones (up to 760px):** search first, compact result cards that open details on tap, a bottom tab bar (Fresh produce, Market access, Saved, More), and touch targets of at least 44px. Nothing scrolls sideways.
- **Wide screens (1400px and up):** details open as a side panel beside the table; narrower screens use a dialog. Column headings sort the table; phones get a sort menu.
- **Detail view:** the limit, Save and the laboratory comparison come first; applicability, source and testing methods are collapsible.
- **Print limit sheet:** prints every limit in the current view (up to 600) with testing methods, in the interface language. On phones and in the installed app it opens on screen first, with a Print button, because printing is not always available there.
- **Accessibility:** `scripts/test_accessibility.cjs` runs axe-core (WCAG 2.1 A and AA, including colour contrast) on every tab, the crop picker and the detail view in both languages. It cannot measure icon-only glyphs, and it is not a substitute for testing with a screen reader.

## Banned in China

The **Banned in China** view lists pesticides China bans for use, so growers elsewhere can avoid them:

- **Banned outright (60):** MARA Announcement No. 1039 (13 July 2026), read on the Heilongjiang agriculture department's republication and cross-checked against two trade reproductions. 41 of the 60 have a section in GB 2763-2026; each links to its limits (1,159 rows in all).
- **Banned on certain crops (9):** from MARA's 2019 list of banned and restricted pesticides, less the eleven entries since banned outright. This part may be out of date.

In limit results, pesticides banned outright are kept out of the main list: it shows only the other pesticides, and the banned ones appear in a collapsed **Banned in China** section under the results (still counted in the total, exported and printed, because their limits apply to imports). The full list has no tab of its own; it opens from that section's link or from a detail view. These are rules on use inside China, not import requirements: imports are checked against GB 2763 limits, and the app says so. The data lives in `research/banned_pesticides.py`; English names are aids. The weekly source watch flags the list for re-checking after 90 days.

## Languages

The interface is available in English, Simplified Chinese and Bahasa Melayu. The header switch shows the active language (EN, 中文 or BM) and lists the others; the choice is remembered. Browsers set to Chinese or Malay start in that language, and `?lang=zh`, `?lang=ms` or `?lang=en` in a link forces one.

- **Chinese:** crop, pesticide, food and category names show Chinese first, lists sort by pinyin, and market-access records use their Chinese text (`scopeZh`, `conditionsZh`, `titleZh`). Taiwan is shown as 台湾.
- **Malay:** the interface, the 184 fresh crop names, food categories and Annex A testing parts are in Malay (`research/malay_names.py`). Pesticide names, non-fresh commodities, source food names, residue definitions and market-access record text stay in English, with the Chinese beside them where the app shows it.

`dist/zh.js` and `dist/ms.js` hold the translations keyed by the English text; `dist/i18n.js` applies them. Switching is done in place without a reload: `i18n.js` swaps the static text and each script redraws what it rendered through `I18n.onChange` (`relabel()` in `app.js`), keeping filters, page and any open detail. `scripts/test_language_switch.cjs` checks that every view after a switch reads exactly like a fresh load in that language. To add or change interface text, write the English in the page or wrap it in `t('…')` in a script, then add the Chinese to `dist/zh.js` and the Malay to `dist/ms.js` — `npm test` fails if any string lacks either translation or drops a placeholder, and the browser layout check flags untranslated visible text. The Chinese and Malay translations were written without review by a native-speaking regulatory specialist.

## Automated checks

`npm test` runs the unit tests; `npm run check` verifies generated files and formatting; `npm run test:browser` runs all browser checks (search, crop picker and sorting, market access, layout and touch targets in both languages, accessibility, offline/PWA, auto-update). `.github/workflows/test.yml` runs all three on every push and pull request and uploads screenshots. Run `npm install` first; set `CHROMIUM_PATH` to use an existing Chromium.

## Installable PWA and offline use

The app includes a web manifest, 192/512px icons, a separate maskable icon, Apple touch icon, favicon and scoped service workers. Use the in-app Install button where supported, or Safari → Share → Add to Home Screen on iOS. Installation controls depend on the browser.

After **Offline reference ready** appears, the app, both reference datasets and the source PDF are cached (approximately 7 MB). Offline mode displays a notice; regulatory snapshots do not become current by being cached. First use requires connectivity, and device/browser storage eviction can remove offline data. Updates download a complete snapshot before automatically activating and reloading open app windows. The app checks when opened, resumed, reconnected and every five minutes while visible. Changes to index.html are also detected even when the service-worker file is unchanged. Failed downloads retain the previous complete snapshot. Saved references and the origin preference remain in browser local storage. Unsaved form inputs may reset on an automatic reload. Automatic app delivery does not imply automatic regulatory research.

Run `python scripts/prepare_pages.py` after changes: it also generates manifests and content-versioned service workers for both `/china-mrl/` and standalone `dist/` hosting. Commit the generated files together. HTTPS is required for installation/service workers in production; localhost works for development.

## Chrome DevTools audit

Run `node scripts/audit_chrome.cjs` with Playwright installed and Chromium available (`CHROMIUM_PATH` can override the executable). `AUDIT_URL` selects a local or deployed URL. The audit uses a regular temporary profile, collects Console/Log warnings and errors, DevTools Issues, failed/HTTP-error requests, manifest errors and Chrome installability errors, exercises navigation/details and checks mobile and offline reloads. It exits unsuccessfully on findings. Browser extensions, user profiles and future browser versions can produce additional diagnostics outside this reproducible check.

The manifest includes wide and narrow screenshots for richer installation, an explicit project-specific app ID, and separate regular/maskable icons. Fonts are bundled locally with their SIL Open Font License files for offline use.

Run `AUDIT_URL=http://localhost:8089/china-mrl/ node scripts/test_access_catalogue.cjs` against a local server to verify country lists, status/category/search filters, MRL handoff, origin persistence and form isolation.

New users default to Malaysia; an explicitly saved country or Global choice is retained. Malaysian fresh durian is labelled approved market access under GACC 2024 No. 72, separately from shipment-specific compliance checks.

`node scripts/test_auto_update.cjs` exercises HTML-only updates, worker replacement, incomplete-download recovery, state retention and offline use with a local mutable server. `scripts/service-worker.js` is the worker template; `prepare_pages.py` includes its contents in each generated worker version.

## Readability

Screen typography uses charcoal primary text and dark slate supporting text, 16px body copy and form controls, 14px supporting copy, and a 13px minimum for compact metadata. Navigation and controls use stronger weights; buttons have a minimum 44px height. Green remains an accent. `scripts/audit_typography.cjs` checks text contrast, minimum font size and document overflow across eight views at 320px, 390px and 1440px widths. The recorded audit in `research/typography-audit.json` found a minimum sampled contrast of 7.73:1; this is a focused typography check, not a complete accessibility certification.

## Entire-standard search

The default **Applicable crop limits** mode recognizes an English/Chinese crop name or alias, including plurals (cherries, tomatoes) and whole words of a crop name (jujube → Fresh jujube, chilli → Chilli pepper). When several crops match (lettuce, 莴苣), it offers them as choices instead of guessing. Names Annex A does not list (for example grapefruit or dates) are not mapped. It uses the same Annex A resolver as Fresh produce, preserving commodity precedence, group exclusions, conflict flags and original source scopes. Durian/榴莲 resolves to 89 entries (1 direct and 88 group-based) before other filters. The displayed breakdown follows active filters. Non-crop queries continue to search original food/pesticide wording; ambiguous crop names are offered as choices, never expanded automatically. **Exact source text** remains available for original-row searches and explains that it does not expand food groups. Saved/exported crop matches retain their crop context. `scripts/test_standard_search.cjs` checks these paths in a mobile browser.
