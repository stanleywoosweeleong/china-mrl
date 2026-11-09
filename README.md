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
- All 44 Annex B exemptions; original 442-page Chinese PDF bundled with page-specific links.
- Residue definitions, available testing-method paragraphs, provisional flags, EMRL distinctions, food qualifiers, and source location preserved.
- Full-standard food categories, search, CSV export, saved references with crop context, and quantified/non-detect arithmetic comparison.

Snapshot researched 2026-11-09. No automated regulatory monitoring, worldwide market-access matrix, official certification or shipment-clearance determination. English labels aid navigation; source Chinese wording controls. Some food labels and technical definitions remain Chinese. A missing match is never treated as zero or assigned a default MRL. Fresh limits are not automatically applied to processed or frozen products.

## Source provenance

China MARA announcement: https://www.moa.gov.cn/govpublic/ncpzlaq/202602/t20260225_6481696.htm

USDA FAS report CH2026-0049 links to the Chinese standard attachment:
https://gain.fas.usda.gov/Download.aspx?p=3696&q=e0dbfbad-4854-4f2f-80a6-c5e095672d46

Attachment SHA-256: `cb7b3716ca4dd9fe0b081d8420c6967327cb72891df1dac34ff7fbce8eb1604f`.
All 442 pages of extracted text match the original third-party copy. Full-table extraction reconciles to the stated 10,749 limits. Independent pdfplumber numerical-column extraction reconciled all 10,749 values by table; a 30-row continuation-header discrepancy on PDF page 185 is documented in `research/grid-audit.json` and surfaced on affected records. This is extraction validation, not regulatory certification.

## Rebuilding the data

Place the source PDF at `research/usda-standard.pdf`. Run `python research/build_database.py`, then `python research/package_data.py`; copy the verified PDF to `dist/standard.pdf`. PyMuPDF is required for extraction. `research/catalog.py` contains the Annex A crop mappings. Review source changes, classification mappings, qualifiers, residue definitions and exceptions before publication. Preserve source numbering anomalies (sections 173 and 223) in the document while parsing their content correctly.

`research/verify_tables.py` independently checks numerical values by table using pdfplumber's ruled table geometry. Category/commodity interpretation is separately checked through regression cases. Do not represent automated matching as an official legal interpretation.

## Checks

Run `node --test tests/*.test.cjs` and `node --check dist/app.js`. Tests exercise data totals, direct and group application, explicit exclusions, nested qualifiers, alias specificity, missing limits, conflicts, EMRL/provisional distinctions, non-detect handling, application navigation, source links, saves, and CSV exports.

Browser QA was attempted through the managed preview and CUA services. The preview relay and browser runtime could not start; visual/live-browser verification remains uncompleted.

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

The **Market access** tab checks exact origin, commodity and product form combinations independently of MRLs. All 184 mapped crops and ISO 3166-1 countries/territories are selectable. Initial evidence coverage is deliberately limited to four fresh-product protocol records: Malaysia durian and coconut, South Africa avocado, and Laos chilli. Other combinations are **Not verified**, never inferred to be prohibited or permitted. Country names/codes are sourced from the system ISO codes dataset.

`dist/market-access.json` contains official announcement links, scope, announcement dates, document-review dates and brief conditions. “Protocol documented” means an opening protocol was reviewed, **not** that current operational clearance, registrations or absence of suspensions were verified. Records older than 90 days show a review-due label. There is no automatic regulatory feed. Frozen, dried and processed forms never inherit fresh permissions.

To maintain coverage, review official GACC notices and the origin authority, preserve geographic/species/form restrictions and treatment conditions, and add exact records with source and review date. Review current suspensions and establishment registers before shipment. Duplicate matches fail closed to Not verified. Run `node --test tests/*.test.cjs`, then `python scripts/prepare_pages.py` before publishing.

## Installable PWA and offline use

The app includes a web manifest, 192/512px icons, a separate maskable icon, Apple touch icon, favicon and scoped service workers. Use the in-app Install button where supported, or Safari → Share → Add to Home Screen on iOS. Installation controls depend on the browser.

After **Offline reference ready** appears, the app, both reference datasets and the source PDF are cached (approximately 7 MB). Offline mode displays a notice; regulatory snapshots do not become current by being cached. First use requires connectivity, and device/browser storage eviction can remove offline data. A new deployment installs a versioned cache atomically and offers **Update available · reload** when ready. Saved references remain in browser local storage.

Run `python scripts/prepare_pages.py` after changes: it also generates manifests and content-versioned service workers for both `/china-mrl/` and standalone `dist/` hosting. Commit the generated files together. HTTPS is required for installation/service workers in production; localhost works for development.

## Chrome DevTools audit

Run `node scripts/audit_chrome.cjs` with Playwright installed and Chromium available (`CHROMIUM_PATH` can override the executable). `AUDIT_URL` selects a local or deployed URL. The audit uses a regular temporary profile, collects Console/Log warnings and errors, DevTools Issues, failed/HTTP-error requests, manifest errors and Chrome installability errors, exercises navigation/details and checks mobile and offline reloads. It exits unsuccessfully on findings. Browser extensions, user profiles and future browser versions can produce additional diagnostics outside this reproducible check.

The manifest includes wide and narrow screenshots for richer installation, an explicit project-specific app ID, and separate regular/maskable icons. Fonts are bundled locally with their SIL Open Font License files for offline use.
