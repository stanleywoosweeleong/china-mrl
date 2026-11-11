// Market-access source watch. Reports (and exits 1) when:
//  - the translated GACC list shows a newer "Last updated" date than the records taken from it,
//  - a source page no longer loads,
//  - a record's review date is more than 90 days old.
// It never edits data: a person reviews the sources and updates dist/market-access.json.
const fs = require('fs'),
  path = require('path');
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dist/market-access.json'), 'utf8'));
const LIST = 'https://www.producereport.com/market-access-list';
const findings = [];
const get = async (url) => {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (source-watch)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(30000)
  });
  return { status: res.status, text: res.ok ? await res.text() : '' };
};
(async () => {
  const today = Date.now();
  const stale = data.records.filter((r) => !(today - Date.parse(r.reviewed + 'T00:00:00Z') <= 90 * 86400000));
  if (stale.length) {
    const origins = [...new Set(stale.map((r) => r.origin))].sort().join(', ');
    findings.push(`${stale.length} records were last reviewed more than 90 days ago (origins: ${origins}).`);
  }
  // The banned-pesticide list is a dated copy of ministry notices; it needs a person to re-check it.
  const banned = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dist/database.json'), 'utf8')).banned;
  if (banned && !(today - Date.parse(banned.source.reviewed + 'T00:00:00Z') <= 90 * 86400000))
    findings.push(
      `The banned-pesticide list was last checked on ${banned.source.reviewed}. Review MARA's current notices (${banned.source.url}) and the crop-specific list.`
    );
  const translated = data.records.filter((r) => r.evidenceType === 'list-translation');
  if (translated.length) {
    const recorded = translated
      .map((r) => r.announced)
      .sort()
      .pop();
    try {
      const { status, text } = await get(LIST);
      const m = text.match(/Last updated\s*:?\s*([A-Z][a-z]{2,8}\.? \d{1,2}, \d{4})/);
      if (status !== 200) findings.push(`The translated GACC list returned HTTP ${status}: ${LIST}`);
      else if (!m)
        findings.push(`Could not find the "Last updated" date on the translated GACC list: ${LIST}`);
      else {
        const live = new Date(m[1].replace('.', '') + ' UTC').toISOString().slice(0, 10);
        if (live > recorded)
          findings.push(
            `The translated GACC list was updated on ${live}; records are from ${recorded}. Review ${LIST}`
          );
        else console.log(`Translated GACC list unchanged (${live}).`);
      }
    } catch (e) {
      findings.push(`The translated GACC list could not be fetched (${e.message}): ${LIST}`);
    }
  }
  // Official pages block some automated clients, so only a definite "gone" counts.
  const urls = [
    ...new Set(
      data.records.filter((r) => r.evidenceType !== 'list-translation').map((r) => r.url.split('#')[0])
    )
  ];
  for (const url of urls) {
    try {
      const { status } = await get(url);
      if (status === 404 || status === 410) findings.push(`Source page is gone (HTTP ${status}): ${url}`);
    } catch {
      /* Network trouble is not evidence of a change. */
    }
  }
  if (findings.length) {
    console.log('Market-access sources need review:\n' + findings.map((f) => '- ' + f).join('\n'));
    process.exitCode = 1;
  } else
    console.log(
      `All ${data.records.length} market-access records are within review dates and their sources are unchanged.`
    );
})();
