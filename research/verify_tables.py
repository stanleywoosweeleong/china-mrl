"""Independent grid-based extraction audit against the published numeric table cells."""
import pdfplumber,json,unicodedata,re,collections
rows=json.load(open('research/all-rows.json'));expected=collections.Counter((r['table'],r['mrl']) for r in rows)
def norm(x):return re.sub(r'\s+','',unicodedata.normalize('NFKC',x or '').replace('\U001001b0','.'))
actual=collections.Counter();issues=[];table=0
with pdfplumber.open('research/usda-standard.pdf') as pdf:
 for idx in range(22,412):
  p=pdf.pages[idx]
  # Tables retain ruled-cell geometry, independent of the original line-sequence parser.
  ts=p.find_tables()
  for t in ts:
   above=p.crop((0,max(0,t.bbox[1]-45),p.width,t.bbox[1])).extract_text() or ''
   ms=re.findall(r'表\s*([０-９0-9]+)',above)
   if ms:table=int(unicodedata.normalize('NFKC',ms[-1]))
   # Source typo: p.185 first continuation says 227 but remains in section 4.226.
   if idx==184 and t.bbox[1]<200:table=226
   # Rows share large ruled cells. Read the complete right-hand numeric column,
   # rather than splitting by the coarse horizontal cell borders.
   left,top,right,bottom=t.bbox
   text=p.crop(((left+right)/2+1,top,right,bottom)).extract_text() or ''
   for line in text.splitlines():
    clean=norm(line)
    val=re.fullmatch(r'[)]?(\d+(?:\.\d+)?)(?:[∗*])?(?:\((?:以(?:脂肪|原样)计)?\))?',clean)
    if val:actual[(table,float(val[1]))]+=1
  if idx%50==0:print('Audited PDF page',idx+1,flush=True)
missing=expected-actual;extra=actual-expected
result={'matched':sum((expected&actual).values()),'expected':sum(expected.values()),'grid_rows':sum(actual.values()),'unmatched_expected':list(missing.elements()),'unmatched_grid':list(extra.elements())}
# Keep reviewed notes (raw count, source numbering corrections) that this audit does not recompute.
try:previous=json.load(open('research/grid-audit.json'))
except FileNotFoundError:previous={}
result={**result,**{k:v for k,v in previous.items() if k not in result}}
open('research/grid-audit.json','w').write(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items() if not k.startswith('unmatched')}));print('Unmatched expected',len(list(missing.elements())))
