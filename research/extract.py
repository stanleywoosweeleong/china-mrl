import re,json,unicodedata
from pathlib import Path
s=unicodedata.normalize('NFKC',Path('research/standard.txt').read_text()).replace('\U001001b0','.')
fruit='苹果:Apple,梨:Pear,桃:Peach,油桃:Nectarine,杏:Apricot,樱桃:Cherry,葡萄:Grape,猕猴桃:Kiwifruit,草莓:Strawberry,蓝莓:Blueberry,黑莓:Blackberry,覆盆子:Raspberry,杨梅:Chinese bayberry,荔枝:Lychee,龙眼:Longan,杧果:Mango,鳄梨:Avocado,香蕉:Banana,番木瓜:Papaya,菠萝:Pineapple,火龙果:Dragon fruit,甜瓜:Melon,西瓜:Watermelon,橙:Orange,柑:Mandarin,橘:Tangerine,柠檬:Lemon,柚:Pomelo,山楂:Hawthorn,枣(鲜):Fresh jujube'
veg='番茄:Tomato,樱桃番茄:Cherry tomato,茄子:Eggplant,甜椒:Sweet pepper,辣椒:Chilli pepper,黄秋葵:Okra,黄瓜:Cucumber,西葫芦:Zucchini,苦瓜:Bitter melon,丝瓜:Loofah,节瓜:Hairy melon,大蒜:Garlic,洋葱:Onion,韭菜:Chinese chives,葱:Spring onion,青蒜:Green garlic,蒜薹:Garlic scapes,结球甘蓝:Head cabbage,花椰菜:Cauliflower,青花菜:Broccoli,芥蓝:Chinese broccoli,菜薹:Flowering brassica,菠菜:Spinach,小白菜:Pak choi,大白菜:Chinese cabbage,小油菜:Rape greens,青菜:Qing cai,苋菜:Amaranth,蕹菜:Water spinach,茼蒿:Garland chrysanthemum,叶用莴苣:Leaf lettuce,结球莴苣:Head lettuce,油麦菜:You mai cai,叶芥菜:Mustard greens,芹菜:Celery,茴香:Fennel,豇豆:Yardlong bean,菜豆:Common bean,食荚豌豆:Edible-pod pea,菜用大豆:Edamame,萝卜:Radish,姜:Ginger,芜菁:Turnip,马铃薯:Potato,甘薯:Sweet potato,山药:Yam,茭白:Water bamboo'
commodities={}
for cat,terms in [('Fruit',fruit),('Vegetable',veg)]:
 for term in terms.split(','):
  cn,en=term.split(':');commodities[cn]={'en':en,'category':cat}
pesticides={12:('Abamectin','阿维菌素','Abamectin B1a'),48:('Imidacloprid','吡虫啉','Imidacloprid (plant-origin foods)'),116:('Acetamiprid','啶虫脒','Acetamiprid'),129:('Carbendazim','多菌灵','Carbendazim'),336:('Azoxystrobin','嘧菌酯','Azoxystrobin')}
rows=[]
for table,(en,cn,residue) in pesticides.items():
 start=re.search(r'^\s*表 '+str(table)+r'\s*$',s,re.M).start()
 end=s.index('检测方法:',start)
 block=s[start:end];offset=start
 for line in block.splitlines(True):
  m=re.match(r'^\s*(\S.*?)\s{2,}(\d+(?:\.\d+)?)(\s*[∗*])?\s*$',line)
  if m and m[1] in commodities:
   name=m[1];value=m[2];flag=bool(m[3]);rest=s[offset+len(line):]
   frac=re.match(r'^\s*\.(\d+)\s*([∗*])?',rest)
   if frac:value+='.'+frac[1];flag=flag or bool(frac[2])
   rows.append(dict(id=f'{table}-{len(rows)}',commodity=commodities[name]['en'],commodityZh=name,category=commodities[name]['category'],pesticide=en,pesticideZh=cn,mrl=float(value),loq=flag,table=table,page=s[:offset].count('\f')+1,residue=residue))
  offset+=len(line)
Path('dist/data.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('records',len(rows),'commodities',len(set(r['commodity'] for r in rows)))
for r in rows:
 if r['commodity'] in ['Apple','Tomato','Banana']:print(r)
