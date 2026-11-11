"""Pesticides China bans or restricts for use, from the Ministry of Agriculture and Rural Affairs (MARA).

BANNED: MARA Announcement No. 1039 (13 July 2026), "国家禁用农药品种", 60 names, read on the Heilongjiang
provincial agriculture department's republication and cross-checked against two trade reproductions.
RESTRICTED: MARA's 禁限用农药名录 (2019 edition, moa.gov.cn), "在部分范围禁止使用的农药", minus the eleven
entries that Announcement 1039 has since banned outright. That list may have changed since 2019.

These are rules on USE inside China. Imports are judged against GB 2763 residue limits; this list does not
by itself set an import requirement. English names are navigation aids; the Chinese names control.
"""
SOURCE = dict(
 title='MARA Announcement No. 1039 · National banned pesticide varieties',
 titleZh='农业农村部公告第1039号 · 国家禁用农药品种',
 date='2026-07-13', reviewed='2026-11-11',
 url='https://nynct.hlj.gov.cn/nynct/c115394/202607/c00_31959758.shtml',
 publisher='Heilongjiang Department of Agriculture and Rural Affairs (republishing MARA)',
 publisherZh='黑龙江省农业农村厅（转载农业农村部公告）',
)
RESTRICTED_SOURCE = dict(
 title='MARA list of banned and restricted pesticides, 2019 edition',
 titleZh='农业农村部《禁限用农药名录》（2019年版）',
 date='2019-11-29', reviewed='2026-11-11',
 url='https://www.moa.gov.cn/xw/bmdt/201911/t20191129_6332604.htm',
)
BANNED = [x.split(':') for x in '''六六六:HCH (BHC)
滴滴涕:DDT
毒杀芬:Camphechlor (toxaphene)
二溴氯丙烷:Dibromochloropropane (DBCP)
杀虫脒:Chlordimeform
二溴乙烷:Ethylene dibromide (EDB)
除草醚:Nitrofen
艾氏剂:Aldrin
狄氏剂:Dieldrin
汞制剂:Mercury compounds
砷类:Arsenic compounds
铅类:Lead compounds
敌枯双:Bis-ADTA (敌枯双)
氟乙酰胺:Fluoroacetamide
甘氟:Gliftor
毒鼠强:Tetramine (tetramethylenedisulfotetramine)
氟乙酸钠:Sodium fluoroacetate
毒鼠硅:Silatrane
内吸磷:Demeton
硫环磷:Phosfolan
氯唑磷:Isazofos
甲胺磷:Methamidophos
对硫磷:Parathion
甲基对硫磷:Parathion-methyl
久效磷:Monocrotophos
磷胺:Phosphamidon
氯丹:Chlordane
灭蚁灵:Mirex
六氯苯:Hexachlorobenzene
苯线磷:Fenamiphos
地虫硫磷:Fonofos
甲基硫环磷:Phosfolan-methyl
磷化钙:Calcium phosphide
磷化镁:Magnesium phosphide
磷化锌:Zinc phosphide
硫线磷:Cadusafos
蝇毒磷:Coumaphos
治螟磷:Sulfotep
特丁硫磷:Terbufos
氯磺隆:Chlorsulfuron
胺苯磺隆:Ethametsulfuron
甲磺隆:Metsulfuron-methyl
福美胂:Asomate
福美甲胂:Urbacide
杀扑磷:Methidathion
2,4-滴丁酯:2,4-D butyl ester
百草枯:Paraquat
三氯杀螨醇:Dicofol
硫丹:Endosulfan
林丹:Lindane
氟虫胺:Sulfluramid
五氯酚钠:Sodium pentachlorophenate
甲拌磷:Phorate
甲基异柳磷:Isofenphos-methyl
水胺硫磷:Isocarbophos
灭线磷:Ethoprophos
氧乐果:Omethoate
克百威:Carbofuran
灭多威:Methomyl
涕灭威:Aldicarb'''.split('\n')]
assert len(BANNED) == 60
VEG_FRUIT = ('Vegetables, fruit (including melons), tea, edible fungi and Chinese medicinal herbs', '蔬菜、瓜果、茶叶、菌类和中草药材')
RESTRICTED = [
 ('乙酰甲胺磷', 'Acephate', *VEG_FRUIT),
 ('丁硫克百威', 'Carbosulfan', *VEG_FRUIT),
 ('乐果', 'Dimethoate', *VEG_FRUIT),
 ('毒死蜱', 'Chlorpyrifos', 'Vegetables', '蔬菜'),
 ('三唑磷', 'Triazophos', 'Vegetables', '蔬菜'),
 ('丁酰肼', 'Daminozide', 'Peanuts', '花生'),
 ('氰戊菊酯', 'Fenvalerate', 'Tea', '茶叶'),
 ('氟虫腈', 'Fipronil', 'All crops, except seed coating for some dryland crops such as maize', '所有农作物（玉米等部分旱田种子包衣除外）'),
 ('氟苯虫酰胺', 'Flubendiamide', 'Rice', '水稻'),
]
