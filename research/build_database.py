"""Extract the complete standard's numeric tables and metadata with traceable page references."""
import fitz,re,unicodedata,json,hashlib
from pathlib import Path
PDF='research/usda-standard.pdf'
def norm(t):return unicodedata.normalize('NFKC',t.replace('Ｇ','-')).replace('\U001001b0','.').replace('Ｇ','-')
doc=fitz.open(PDF);pages=[]
for page in doc:
 pages.append(norm(''.join(b[4] for b in page.get_text('blocks') if not (b[1]>790 or ('GB' in b[4] and b[1]<75)))))
s='\n\f\n'.join(pages)
# Include the source's unusual 4.223.1.1 numbering as written.
heads=list(re.finditer(r'^4\.(\d+)\s+(.+?)(?=\n4\.\1\.(?:1\.)?1\s)',s,re.M|re.S))
heads=[m for m in heads if s[:m.start()].count('\f')>=21]
assert len(heads)==568,len(heads)
rows=[];pesticides=[];issues=[]
for idx,h in enumerate(heads):
 n=int(h[1]);end=heads[idx+1].start() if idx+1<len(heads) else s.index('附 录 A',h.end());block=s[h.start():end];label=''.join(h[2].splitlines());m=re.search(r'[(\[]([A-Za-z0-9].*)[)\]]$',label)
 en=m[1] if m else '';zh=label[:m.start()] if m else label
 # PDF uses fullwidth G for hyphens, normalized to G. Do not alter real capital G in acronyms.
 en=en.replace('G','-') if en not in ['HCH','DDT'] else en
 residue=re.search(r'残留物[:：](.*?)(?=4\.'+str(n)+r'\.(?:1\.)?[34]\s+(?:最大|再)残留(?:限)?量)',block,re.S)
 method=re.search(r'检测方法:(.*)',block,re.S)
 if n==173:residue=re.search(r'残留物:(.*?)(?=4\.173\.3 最大)',block,re.S)
 meta=dict(id=n,en=en,zh=zh,residue=re.sub(r'\s+','',residue[1]).rstrip('.') if residue else '',method=re.sub(r'\s+','',method[1]).rstrip('.') if method else '',page=s[:h.start()].count('\f')+1)
 pesticides.append(meta)
 table=re.search(r'^表'+str(n)+r'\s*$',block,re.M)
 if not table:issues.append([n,'table missing']);continue
 body=block[table.end():];body=re.split(r'4\.'+str(n)+r'\.(?:1\.)?5\s',body)[0]
 offset=h.start()+table.end();pending=[];category='';categoryScope='';last=None
 categories=['谷物','油料和油脂','蔬菜','干制蔬菜','水果','干制水果','坚果','糖料','饮料类','食用菌','调味料','药用植物','哺乳动物肉类','哺乳动物内脏','哺乳动物脂肪','禽肉类','禽类内脏','禽类脂肪','蛋类','生乳','乳脂肪','水产品']
 def cat(t):
  # Section 4.152 (PDF p.136) prints the sugar-crop heading as 糖类 instead of 糖料.
  if t=='糖类':return '糖料'
  return next((c for c in categories if t==c or t.startswith(c+'(') or t.startswith(c+',') or t.startswith(c+'及')),None)
 for line in body.splitlines(True):
  t=line.strip();page=s[:offset].count('\f')+1;offset+=len(line)
  if not t or t.startswith('表') or '食品类别/名称' in t or '残留限量,mg/kg' in t:continue
  if t.startswith('∗') or t.startswith('*'):
   if last and t in ['∗','*']:last['provisional']=True
   if '临时' in t:pending=[]
   continue
  match=re.fullmatch(r'(\d+(?:\.\d+)?)(.*)',t)
  if match:
   if pending:
    name=''.join(pending);pending=[]
    row=dict(id=f'{n}:{len(rows)}',pesticideId=n,food=name,category=category,categoryScope=categoryScope,mrl=float(match[1]),qualifier=match[2],provisional='∗' in match[2],kind='EMRL' if n>=559 else 'MRL',page=page,table=n)
    rows.append(row);last=row
   else:issues.append([n,'unpaired numeric',t,page])
  elif cat(t):
   category=cat(t);categoryScope=t;pending=[t];last=None
  else:
   # A category heading with unclosed brackets wraps onto this line; keep both halves.
   head=''.join(pending)
   if pending and cat(pending[0]) and len(re.findall(r'[([]',head))>len(re.findall(r'[)\]]',head)):categoryScope+=t
   elif pending and cat(pending[-1]):pending=[]
   pending.append(t)
Path('research/all-rows.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));Path('research/pesticides.json').write_text(json.dumps(pesticides,ensure_ascii=False,indent=2));Path('research/extraction-issues.json').write_text(json.dumps(issues,ensure_ascii=False,indent=2))
print('Pesticide sections',len(pesticides),'numeric rows',len(rows),'issues',len(issues));print(issues[:20]);print('Fruit/veg',len([r for r in rows if r['category'] in ['蔬菜','水果']]))
print('Durian',[r for r in rows if '榴莲' in r['food']])
