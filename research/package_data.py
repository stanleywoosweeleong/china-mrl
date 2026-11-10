import json,re,fitz,hashlib,unicodedata
from pathlib import Path
from catalog import CATALOG
from english_names import PESTICIDES as EN_PESTICIDES,EXEMPTIONS as EN_EXEMPTIONS,RESIDUES as EN_RESIDUES,FOODS as EN_FOODS,PARTS_ZH
rows=json.load(open('research/all-rows.json'));ps=json.load(open('research/pesticides.json'));doc=fitz.open('research/usda-standard.pdf')
catEn={'谷物':'Grains','油料和油脂':'Oilseeds & oils','蔬菜':'Fresh vegetables','干制蔬菜':'Dried vegetables','水果':'Fresh fruit','干制水果':'Dried fruit','坚果':'Nuts','糖料':'Sugar crops','饮料类':'Beverage crops & products','食用菌':'Edible fungi','调味料':'Spices & herbs','药用植物':'Medicinal plants','哺乳动物肉类':'Mammalian meat','哺乳动物内脏':'Mammalian offal','哺乳动物脂肪':'Mammalian fat','禽肉类':'Poultry meat','禽类内脏':'Poultry offal','禽类脂肪':'Poultry fat','蛋类':'Eggs','生乳':'Raw milk','乳脂肪':'Milk fat','水产品':'Aquatic products'}
labels={x['zh']:x['en'] for x in CATALOG};labels.update(catEn);labels.update(EN_FOODS)
labels.update(dict(x.split(':',1) for x in '鳞茎类蔬菜:Bulb vegetables|芸薹属类蔬菜:Brassica vegetables|叶菜类蔬菜:Leafy vegetables|茄果类蔬菜:Fruiting vegetables (Solanaceae)|瓜类蔬菜:Cucurbit vegetables|豆类蔬菜:Legume vegetables|茎类蔬菜:Stem vegetables|根茎类和薯芋类蔬菜:Root and tuber vegetables|根茎类蔬菜:Root vegetables|其他薯芋类蔬菜:Other tuber vegetables|薯类蔬菜:Tuber vegetables|水生类蔬菜:Aquatic vegetables|芽菜类蔬菜:Sprout vegetables|其他类蔬菜:Other vegetables|柑橘类水果:Citrus fruit|仁果类水果:Pome fruit|核果类水果:Stone fruit|浆果和其他小型类水果:Berries and other small fruit|热带和亚热带类水果:Tropical and subtropical fruit|皮不可食的热带和亚热带类水果:Tropical and subtropical fruit with inedible peel|皮不可食热带和亚热带类水果:Tropical and subtropical fruit with inedible peel|瓜果类水果:Melon fruit|甜瓜类水果:Melons|藤蔓和灌木类水果:Vine and shrub berries|小型攀缘类水果:Small climbing fruit|荚可食类豆类蔬菜:Edible-pod legume vegetables|荚不可食豆类蔬菜:Non-edible-pod legume vegetables|荚不可食类豆类蔬菜:Non-edible-pod legume vegetables|普通白菜:Common Chinese cabbage|头状花序芸薹属类蔬菜:Flowering-head brassicas|头状花序芸薹属蔬菜:Flowering-head brassicas|稻谷:Paddy rice|糙米:Brown rice|小麦:Wheat|大麦:Barley|燕麦:Oats|黑麦:Rye|小黑麦:Triticale|玉米:Maize|鲜食玉米:Fresh maize|高粱:Sorghum|粟:Foxtail millet|杂粮类:Miscellaneous grains|麦类:Wheat and related grains|旱粮类:Coarse grains|成品粮:Processed grain|绿豆:Mung bean|大豆:Soybean|油菜籽:Rapeseed|棉籽:Cottonseed|花生仁:Peanut kernels|芝麻:Sesame|葵花籽:Sunflower seed|甘蔗:Sugar cane|甜菜:Sugar beet|茶叶:Tea|啤酒花:Hops|咖啡豆:Coffee beans|可可豆:Cocoa beans|葡萄干:Raisins|蘑菇类:Mushrooms|木耳类:Wood-ear fungi|杏仁:Almond|核桃:Walnut|山核桃:Pecan|板栗:Chestnut|腰果:Cashew nut|榛子:Hazelnut|开心果:Pistachio|澳洲坚果:Macadamia|猪肉:Pork|牛肉:Beef|山羊肉:Goat meat|绵羊肉:Mutton|猪肝:Pig liver|牛肝:Cattle liver|猪肾:Pig kidney|牛肾:Cattle kidney|山羊肝:Goat liver|绵羊肝:Sheep liver|山羊肾:Goat kidney|绵羊肾:Sheep kidney|牛奶:Cow milk|薄荷:Mint|留兰香:Spearmint|胡椒:Pepper|芫荽:Coriander|罗勒:Basil|欧芹:Parsley|迷迭香:Rosemary|香茅:Lemongrass|干辣椒:Dried chilli'.split('|')))
# Preserve Chinese source labels; translations are navigation aids only.
def parse_food(t):
 """Mirror of rules.js parseFood: the exclusion list is the bracket closing right after the last 除外."""
 m=t.rfind('除外')
 if m<0 or t[m+2:m+3] not in (')',']'):return None
 depth=0;open_=-1
 for i in range(m-1,-1,-1):
  ch=t[i]
  if ch in ')]':depth+=1
  elif ch in '([':
   if depth==0:open_=i;break
   depth-=1
 if open_<0:return None
 terms,word,depth=[],'',0
 for ch in t[open_+1:m]:
  if ch in '([':depth+=1
  if ch in ')]':depth-=1
  # 和 separates items (柚和金橘) except inside known names such as 浆果和其他小型类水果.
  if depth==0 and (ch=='、' or (ch=='和' and not any(k.startswith(word+'和') for k in labels))):
   if word:terms.append(word)
   word=''
  else:word+=ch
 if word:terms.append(word)
 return t[:open_],terms,t[m+3:]
def label(t):
 if t in labels:return labels[t]
 parsed=parse_food(t)
 if parsed:
  base,terms,suffix=parsed
  out=label(base)+' (except '+', '.join(label(v) for v in terms)+')'
  if suffix:out+=', '+label(suffix.lstrip(',，'))
  return out
 if ',' in t:
  head,tail=t.split(',',1);return label(head)+', '+label(tail)
 return t
for r in rows:
 r['foodEn']=label(r['food']);r['categoryEn']=catEn[r['category']]
 if r['table']==152 and r['categoryScope']=='糖类':r['sourceNote']='Source heading printed as 糖类; read as the sugar-crop category 糖料 (Annex A). Check the original page.'
 if r['table']==226 and r['page']==185:r['sourceNote']='Source numbering discrepancy: the continuation heading is printed Table 227, but these rows are within section 4.226 (emamectin benzoate). Check the original section and page.'
for p in ps:
 p['en']=p['en'][0].upper()+p['en'][1:]
 p['en']=p['en'].replace('andbeta-',' + beta-').replace('andlambda-',' + lambda-').replace('andS-',' + S-')
 p['enSource']=p['en'] if p['id'] in EN_PESTICIDES else None
 if p['id'] in EN_PESTICIDES:p['en']=EN_PESTICIDES[p['id']]
 if p['enSource'] is None:del p['enSource']
 p['residueEn']=EN_RESIDUES.get(p['id']) or (p['en'] if p['residue'].rstrip('.')==p['zh'] else '')
# Structured testing methods: "<categories>按照|参照<standards>规定的方法测定" clauses.
STD=re.compile(r'(GB/T|GB|NY/T|SN/T|SN|YC/T)?\s*(\d+(?:\.\d+)*)')
def std_id(prefix,num):
 # The source sometimes omits the GB prefix for 23200.121.
 if not prefix and num.startswith('23200.'):prefix='GB'
 return (prefix+' ' if prefix else '')+num
PLANT_CATS=['谷物','油料和油脂','蔬菜','干制蔬菜','水果','干制水果','坚果','糖料','饮料类','食用菌','调味料','药用植物']
def split_items(text):
 parts,word,depth=[],'',0
 for ch in text:
  if ch in '([':depth+=1
  if ch in ')]':depth-=1
  if depth==0 and (ch=='、' or (ch=='和' and not any(k.startswith(word+'和') for k in labels))):
   if word:parts.append(word)
   word=''
  else:word+=ch
 if word:parts.append(word)
 return parts
def covered(part):
 """Which of the standard's food categories a method clause names (bases, plant/animal origin, exclusions)."""
 parsed=parse_food(part);base,ex=(parsed[0],parsed[1]) if parsed else (part,[])
 if base=='植物源性食品':cats=list(PLANT_CATS)
 elif base=='动物源性食品':cats=[c for c in catEn if c not in PLANT_CATS]
 elif base in ('油脂和油料','油料和油酯','油脂','油料','油籽类'):cats=['油料和油脂']
 else:
  cats=[c for c in catEn if base==c or base.startswith(c)][:1]
  # A commodity or subgroup (茶叶, 小型油籽类) belongs to its Annex A category.
  if not cats:cats=sorted({x['category'] for x in CATALOG if base==x['zh'] or base in x['groups'] or base in x['aliases']},key=list(catEn).index)
 return [c for c in cats if c not in ex]
def method_clauses(text):
 out=[]
 for clause in re.split(r'(?<=测定)[;,；]|(?<=检测)[;,；]|;',text.rstrip('.')):
  m=re.fullmatch(r'(.*?)(按照|参照|按)(.+?)(?:(?:规定)?的方法(?:进行)?(?:测定|检测))?',clause.strip())
  if not m or not STD.search(m[3]):out.append(dict(raw=clause));continue
  parts=split_items(m[1])
  out.append(dict(categories=parts,categoriesEn=[label(c) for c in parts],appliesTo=sorted({c for x in parts for c in covered(x)},key=list(catEn).index),standards=[std_id(a,b) for a,b in STD.findall(m[3])],basis='reference' if m[2]=='参照' else 'specified'))
 return out
for p in ps:
 if p['method']:p['methods']=method_clauses(p['method'])
exempt=[]
for i in [416,417]:
 text=unicodedata.normalize('NFKC',doc[i].get_text().replace('Ｇ','-'));ls=[v.strip() for v in text.splitlines()]
 for j,v in enumerate(ls):
  if v.isdigit() and 1<=int(v)<=44 and j+2<len(ls) and re.search('[\u4e00-\u9fff]',ls[j+1]) and re.search('[A-Za-z]',ls[j+2]):
   exempt.append(dict(id=int(v),zh=ls[j+1],en=ls[j+2],page=i+1))
assert len(exempt)==44
for x in exempt:x['enSource']=x['en'];x['en']=EN_EXEMPTIONS[x['id']]
# Aliases used for standard-specific food subgroups, never marketing varieties.
for c in CATALOG:
 if c['zh'] in ['酿酒葡萄']:c['groups'].append('葡萄')
 if c['zh'] in ['波森莓','罗甘莓']:c['groups'].append('露莓(包括波森莓和罗甘莓)')
 if c['zh'] in ['哈密瓜','香瓜']:c['groups'].append('甜瓜')
# Chinese testing-part wording from Annex A; two groups word a shared English part differently.
for c in CATALOG:
 c['partZh']=PARTS_ZH[c['part']]
 if '瓜类蔬菜' in c['groups'] and c['partZh']=='全果（去柄）':c['partZh']='全瓜（去柄）'
 if '绿叶葱类' in c['groups']:c['partZh']='整株'
assert len({c['id'] for c in CATALOG})==len(CATALOG)
# Context for source rows whose food name Annex A does not define; shown beside the review note, never applied.
review_notes={
 '白菜':dict(en='GB 2763-2021 carried the same 6 mg/kg entry, which the USDA translation of that edition rendered as “Ordinary cabbage/Chinese cabbage”.',zh='GB 2763-2021 中已有相同的 6 mg/kg 条目；美国农业部对该版本的译文把它译作“普通白菜/大白菜”。'),
 '甘蓝':dict(en='This entry is new in the 2026 edition; the 2021 edition listed only rice for this pesticide.',zh='该条目是 2026 年版新增的；2021 年版中这种农药只列有稻谷和糙米。'),
}
data=dict(meta=dict(standard='GB 2763-2026',effective='2026-03-01',checked='2026-11-09',rows=len(rows),sections=len(ps),pesticidesInStandard=585,printedPageOffset=16,exemptions=44,source='https://gain.fas.usda.gov/Download.aspx?p=3696&q=e0dbfbad-4854-4f2f-80a6-c5e095672d46',sha256=hashlib.sha256(Path('research/usda-standard.pdf').read_bytes()).hexdigest()),rows=rows,pesticides=ps,crops=CATALOG,exemptions=exempt,categories=catEn,labels=labels,reviewNotes=review_notes,annex=[dict(page=i+1,text=doc[i].get_text()) for i in range(412,416)])
Path('dist/database.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('Packaged',len(rows),'rows,',len(CATALOG),'crops,',len(exempt),'exemptions')
