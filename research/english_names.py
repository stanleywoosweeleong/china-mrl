"""English navigation names for entries whose source English lost its spaces or has typos.

The PDF prints these names without word spaces (no glyph gaps exist), so they cannot be
recovered from the text layer. Chinese names in the source control; these are aids only.
"""
PESTICIDES = {
 1: '2,4-DB and 2,4-DB sodium salt',
 3: '2,4-D dimethylamine salt',
 5: '2,4-D triethanolamine salt',
 9: 'MCPA dimethylamine salt',
 10: 'MCPA isopropylamine salt',
 15: 'Picloram tris(2-hydroxypropyl)ammonium',
 19: 'Diethyl aminoethyl hexanoate',
 26: 'Fenbutatin oxide',
 39: 'Phthalanillic acid',
 49: 'Fluazifop + fluazifop-P-butyl',
 87: 'Semiamitraz + semiamitraz chloride',
 127: '4-chlorophenoxyacetic acid sodium salt',
 145: 'Sodium dichloroisocyanurate',
 163: 'Haloxyfop-methyl + haloxyfop-P-methyl',
 202: 'Sodium nitrophenolate',
 204: '2,4-dichlorophenyl benzenesulfonate',
 226: 'Emamectin benzoate',
 233: 'Iodosulfuron-methyl-sodium',
 245: 'Mepiquat chloride',
 247: 'Metalaxyl + metalaxyl-M',
 267: 'Quizalofop-ethyl + quizalofop-P-ethyl',
 281: 'Aluminium phosphide',
 282: 'Magnesium phosphide',
 283: 'Hydrogen phosphide (phosphine)',
 287: 'Streptomycin sesquisulfate',
 288: 'Sulfuryl fluoride',
 305: 'Fluroxypyr + fluroxypyr-meptyl',
 317: 'Chloroisobromine cyanuric acid',
 323: 'Prochloraz + prochloraz-manganese chloride complex',
 348: '1-naphthylacetic acid + sodium 1-naphthylacetate',
 362: 'Fenvalerate + esfenvalerate',
 384: 'Zinc thiazole',
 385: 'Fentin hydroxide',
 386: 'Fentin acetate',
 416: 'Phenazine-1-carboxylic acid',
 423: 'Iminoctadine tris(albesilate)',
 430: 'Propamocarb + propamocarb hydrochloride',
 479: 'Xinjunan acetate',
 481: 'Ioxynil octanoate',
 482: 'Bromoxynil octanoate',
 484: 'Methyl bromide',
 496: 'Moroxydine hydrochloride',
 532: 'Allyl isothiocyanate',
 535: 'Imazalil sulfate',
 546: 'Piperonyl butoxide',
}
EXEMPTIONS = {
 1: 'Bacillus thuringiensis', 2: 'Pseudomonas fluorescens', 3: 'Bacillus subtilis', 4: 'Bacillus cereus',
 5: 'Bacillus licheniformis', 6: 'Empedobacter brevis', 7: 'Paenibacillus polymyxa', 8: 'Agrobacterium radiobacter',
 9: 'Trichoderma spp.', 10: 'Beauveria spp.', 11: 'Paecilomyces lilacinus', 12: 'Verticillium chlamydosporium',
 13: 'Conidiobolus thromboides', 14: 'Metarhizium anisopliae', 15: 'Pythium oligandrum',
 16: 'Pieris rapae granulovirus (PrGV)', 17: 'Ectropis obliqua nucleopolyhedrovirus (EcobNPV)',
 18: 'Dendrolimus punctatus cypovirus (DpCPV)', 19: 'Spodoptera exigua multiple nucleopolyhedrovirus (SeMNPV)',
 20: 'Pseudaletia unipuncta granulovirus (PuGV)', 21: 'Plutella xylostella granulovirus (PxGV)',
 22: 'Spodoptera litura nucleopolyhedrovirus (SpltNPV)', 23: 'Helicoverpa armigera nucleopolyhedrovirus (HearNPV)',
 24: 'Autographa californica multiple nucleopolyhedrovirus (AcMNPV)', 25: 'Triacontanol', 26: 'Trimedlure',
 27: 'Polygalacturonase', 28: 'Harpin protein', 29: 'S-abscisic acid', 30: 'Lentinan', 31: 'Chitosan',
 32: 'Glucosan', 33: 'Oligosaccharins', 34: 'Bacillus amyloliquefaciens', 35: 'Bacillus methylotrophicus',
 36: 'Mamestra brassicae multiple nucleopolyhedrovirus (MbMNPV)', 37: 'Plant activator protein',
 38: 'Nosema locustae', 39: 'Oligosaccharide', 40: 'Coniothyrium minitans', 41: 'Z-8-dodecen-1-yl acetate',
 42: 'E-8-dodecen-1-yl acetate', 43: 'Z-8-dodecen-1-ol', 44: 'Mixed fatty acids',
}
PESTICIDES[4] = '2,4-D + 2,4-D sodium salt'
PESTICIDES[7] = 'MCPA (sodium)'

# English renderings of residue definitions that are more than the pesticide name itself.
# Navigation aids only: the Chinese definition in the standard controls.
PLANT, ANIMAL = 'plant-origin foods', 'animal-origin foods'
RESIDUES = {
 1: 'Sum of 2,4-DB and its free and conjugated forms, expressed as 2,4-DB',
 3: '2,4-D', 4: '2,4-D', 5: '2,4-D',
 6: 'Sum of 2,4-D-ethylhexyl and 2,4-D, expressed as 2,4-D',
 7: 'MCPA',
 8: 'Sum of MCPB, MCPA and their free and conjugated forms, expressed as MCPA',
 9: 'MCPA', 10: 'MCPA',
 12: 'Abamectin B1a',
 13: 'Chlormequat cation, expressed as chlormequat chloride',
 15: 'Picloram',
 21: 'Paraquat cation, expressed as paraquat dichloride',
 22: f'{PLANT}: chlorothalonil; {ANIMAL}: 4-hydroxy-2,5,6-trichloroisophthalonitrile',
 24: 'Sum of fenthion and its oxygen analogue (sulfoxide and sulfone), expressed as fenthion',
 29: 'Sum of benomyl and carbendazim, expressed as carbendazim',
 33: f'{PLANT}: difenoconazole; {ANIMAL}: sum of difenoconazole and 1-[2-chloro-4-(4-chlorophenoxy)phenyl]-2-(1,2,4-triazol-1-yl)ethanol, expressed as difenoconazole',
 41: 'Sum of fenamiphos and its oxygen analogue (sulfoxide and sulfone), expressed as fenamiphos',
 48: f'{PLANT}: imidacloprid; {ANIMAL}: sum of imidacloprid and its metabolites containing the 6-chloropyridinyl moiety, expressed as imidacloprid',
 49: 'Sum of fluazifop-butyl and fluazifop (acid), expressed as fluazifop',
 52: f'{PLANT}: penthiopyrad; {ANIMAL}: sum of penthiopyrad and metabolite 1-methyl-3-(trifluoromethyl)-1H-pyrazole-4-carboxamide, expressed as penthiopyrad',
 56: 'Isopyrazam (sum of isomers)',
 61: 'Prothioconazole-desthio',
 66: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 70: f'{PLANT} (except soybean): glufosinate; soybean: sum of glufosinate, N-acetyl-glufosinate and 3-(methylphosphinico)propionic acid, expressed as glufosinate; {ANIMAL}: sum of glufosinate parent and metabolites N-acetyl-glufosinate and 3-(methylphosphinico)propionic acid',
 72: f'{PLANT} (except maize and fresh maize): glyphosate; maize and fresh maize: sum of glyphosate and N-acetyl-glyphosate, expressed as glyphosate',
 78: 'Sum of pyrethrin I and pyrethrin II',
 83: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 84: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 85: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 86: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 87: 'Semiamitraz',
 97: '2,6-dichlorobenzamide',
 98: 'Diquat cation, expressed as diquat dibromide',
 103: 'Total of dinocap isomers and dinocap phenols, expressed as dinocap',
 114: 'Sum of daminozide and 1,1-dimethylhydrazine, expressed as daminozide',
 122: 'Chlorfenvinphos (sum of E and Z isomers)',
 127: '4-chlorophenoxyacetic acid',
 130: 'Polyoxin B',
 131: 'Sum of spinosyn A and spinosyn D',
 133: 'Sum of propaquizafop and quizalofop acid, expressed as quizalofop acid',
 145: 'Sodium dichloroisocyanurate, expressed as cyanuric acid',
 152: f'{PLANT}: dinotefuran; {ANIMAL}: sum of dinotefuran and 1-methyl-3-(tetrahydro-3-furylmethyl)urea, expressed as dinotefuran',
 160: 'Sum of bicyclopyrone and its metabolites 2-(2-methoxyethoxymethyl)-6-(trifluoromethyl)pyridine-3-carboxylic acid and 2-(2-hydroxyethoxymethyl)-6-(trifluoromethyl)pyridine-3-carboxylic acid, expressed as bicyclopyrone',
 163: 'Sum of haloxyfop-methyl, haloxyfop and their conjugates, expressed as haloxyfop-methyl',
 167: 'Sum of fipronil, MB 46136 (fipronil desulfinyl), fipronil sulfone and fipronil sulfide, expressed as fipronil',
 179: 'Sum of triflumizole and its metabolite 4-chloro-α,α,α-trifluoro-N-(1-amino-2-propoxyethylidene)-o-toluidine, expressed as triflumizole',
 183: 'Cyfluthrin (sum of isomers)',
 186: 'Sum of fluoxastrobin and its Z-isomer',
 188: 'Sum of flufenacet and its metabolites containing the N-fluorophenyl-N-isopropyl moiety, expressed as flufenacet',
 192: 'Sum of fluensulfone and its metabolite 3,4,4-trifluorobut-3-ene-1-sulfonic acid (BSA), expressed as fluensulfone',
 199: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 200: 'Dithiocarbamates, expressed as carbon disulfide (CS2)',
 202: 'Sum of sodium 5-nitroguaiacolate, sodium o-nitrophenolate and sodium p-nitrophenolate',
 223: 'Sum of the two dimethacarb components (灭除威 and 灭杀威)',
 224: 'Sum of acibenzolar-S-methyl and its acid metabolite (acibenzolar), expressed as acibenzolar-S-methyl',
 226: 'Emamectin B1a benzoate',
 228: 'Sum of phorate and its oxygen analogue (sulfoxide and sulfone), expressed as phorate',
 233: 'Iodosulfuron-methyl',
 239: 'Sum of thiophanate-methyl and carbendazim, expressed as carbendazim',
 242: 'Sum of methiocarb, methiocarb sulfone and methiocarb sulfoxide, expressed as methiocarb',
 245: 'Mepiquat cation, expressed as mepiquat',
 247: 'Metalaxyl',
 256: 'Fenoxaprop',
 257: 'Sum of dimethenamid-P and its enantiomer',
 258: 'Validamycin A',
 261: 'Trinexapac (acid)',
 263: 'Sum of carbofuran and 3-hydroxycarbofuran, expressed as carbofuran',
 266: 'Sum of quizalofop-P-tefuryl and quizalofop acid, expressed as quizalofop acid',
 267: 'Sum of quizalofop-ethyl and quizalofop acid, expressed as quizalofop acid',
 274: 'Sum of linuron and its metabolites convertible to 3,4-dichloroaniline, expressed as linuron',
 276: f'{PLANT}: bifenazate; {ANIMAL}: sum of bifenazate and bifenazate-diazene (diazenecarboxylic acid, 2-(4-methoxy-[1,1′-biphenyl]-3-yl) 1-methylethyl ester), expressed as bifenazate',
 277: 'Bifenthrin (sum of isomers)',
 279: 'Sum of 2-phenylphenol and sodium 2-phenylphenate, expressed as 2-phenylphenol',
 281: 'Hydrogen phosphide (phosphine)',
 282: 'Hydrogen phosphide (phosphine)',
 284: 'Sum of α-endosulfan, β-endosulfan and endosulfan sulfate',
 287: 'Sum of streptomycin and dihydrostreptomycin, expressed as streptomycin',
 290: 'Sum of spirotetramat and its metabolite cis-3-(2,5-dimethylphenyl)-4-hydroxy-8-methoxy-1-azaspiro[4.5]dec-3-en-2-one (enol), expressed as spirotetramat',
 291: 'Sum of spiromesifen and metabolite 4-hydroxy-3-mesityl-1-oxaspiro[4.4]non-3-en-2-one, expressed as spiromesifen',
 295: 'Aminopyralid and its hydrolysable conjugates, expressed as aminopyralid',
 304: 'Sum of florpyrauxifen-benzyl and its acid metabolite, expressed as florpyrauxifen-benzyl',
 305: 'Fluroxypyr',
 307: 'Cyhalothrin (sum of isomers)',
 310: 'Permethrin (sum of isomers)',
 312: 'Cypermethrin (sum of isomers)',
 317: 'Chloroisobromine cyanuric acid, expressed as cyanuric acid',
 321: f'{PLANT}: dicamba; {ANIMAL}: sum of dicamba and 3,6-dichlorosalicylic acid, expressed as dicamba',
 322: '2,2-dichloropropionic acid and its salts, expressed as dalapon',
 323: 'Sum of prochloraz and its metabolites containing the 2,4,6-trichlorophenol moiety, expressed as prochloraz',
 331: f'{PLANT}: kresoxim-methyl; {ANIMAL}: (E)-methyl-2-methoxyimino-2-[2-(o-tolyloxy)phenyl]acetate (acid metabolite), expressed as kresoxim-methyl',
 337: f'{PLANT}: pyrimethanil; {ANIMAL}: raw milk — sum of pyrimethanil and 2-anilino-4,6-dimethylpyrimidin-5-ol, expressed as pyrimethanil; mammalian meat and offal — sum of pyrimethanil and 2-(4-hydroxyanilino)-4,6-dimethylpyrimidine, expressed as pyrimethanil',
 338: 'Sum of dazomet and its metabolite methyl isothiocyanate, expressed as methyl isothiocyanate',
 340: f'{PLANT}: sum of bentazone, 6-hydroxybentazone and 8-hydroxybentazone, expressed as bentazone; {ANIMAL}: bentazone',
 343: 'Sum of acequinocyl and its metabolite hydroxy-acequinocyl, expressed as acequinocyl',
 348: '1-naphthylacetic acid',
 354: 'Sum of triforine and chloral (trichloroacetaldehyde), expressed as triforine',
 359: 'Sum of cyhalofop-butyl and cyhalofop acid',
 360: 'Metaflumizone, sum of E- and Z-isomers',
 362: 'Fenvalerate (sum of isomers)',
 365: 'Sum of clodinafop-propargyl and clodinafop acid',
 369: 'Cycloxydim and its metabolites and degradation products oxidisable to 3-(3-sulfonyl-tetrahydrothiopyranyl)-glutaric acid S-dioxide and 3-hydroxy-3-(3-sulfonyl-tetrahydrothiopyranyl)-glutaric acid S-dioxide, expressed as cycloxydim',
 376: f'{PLANT}: thiabendazole; {ANIMAL}: sum of thiabendazole and 5-hydroxythiabendazole',
 377: '2-amino-5-mercapto-1,3,4-thiadiazole, expressed as thiediazole-copper',
 378: f'{PLANT}: hexythiazox; {ANIMAL}: sum of hexythiazox and its trans-5-(4-chlorophenyl)-4-methyl-2-oxothiazolidine metabolites (hydroxycyclohexyl, cyclohexanone and dihydroxycyclohexyl derivatives listed in the source), expressed as hexythiazox',
 381: '2-amino-5-mercapto-1,3,4-thiadiazole, expressed as saisentong',
 384: '2-amino-5-mercapto-1,3,4-thiadiazole, expressed as zinc thiazole',
 395: "Dicofol (sum of o,p′- and p,p′-isomers)",
 397: 'Sum of ethyl phosphonic acid (fosetyl), phosphonic acid and their salts, expressed as fosetyl',
 401: 'Sum of triadimefon and triadimenol',
 402: 'Cyhexatin',
 404: 'Nereistoxin', 407: 'Nereistoxin',
 410: 'Niclosamide',
 414: 'Sum of oxamyl and oxamyl oxime, expressed as oxamyl',
 423: 'Iminoctadine',
 425: "Sum of amitraz and N-(2,4-dimethylphenyl)-N′-methylformamidine, expressed as amitraz",
 430: 'Propamocarb',
 438: f'{PLANT}: clofentezine; {ANIMAL}: clofentezine and all metabolites containing the 2-chlorophenyl moiety, expressed as clofentezine',
 440: 'Mevinphos (sum of Z and E isomers)',
 444: 'Sum of terbufos and its oxygen analogue (sulfoxide and sulfone), expressed as terbufos',
 445: 'Sum of dinoterb and its salts and esters, expressed as dinoterb',
 446: 'Sum of aldicarb and its oxygen analogue (sulfoxide and sulfone), expressed as aldicarb',
 449: 'Prohexadione, expressed as prohexadione-calcium',
 454: f'{PLANT}: quintozene; {ANIMAL}: sum of quintozene, pentachloroaniline and methyl pentachlorophenyl sulfide',
 461: 'Sum of clethodim and its sulfoxide and sulfone metabolites, expressed as clethodim',
 479: 'Xinjunan',
 488: 'Deltamethrin (sum of isomers)',
 493: 'Sum of oxydemeton-methyl, demeton-S-methyl and demeton-S-methylsulfone, expressed as oxydemeton-methyl',
 496: 'Moroxydine',
 500: 'Metconazole (sum of isomers)',
 502: 'Sum of disulfoton, demeton-S and their sulfoxides and sulfones, expressed as disulfoton',
 513: 'Sum of vinclozolin and all metabolites containing the 3,5-dichloroaniline moiety, expressed as vinclozolin',
 523: 'Metolachlor',
 530: 'Sum of isoxaflutole and its diketonitrile metabolite, expressed as isoxaflutole',
 535: 'Imazalil',
 560: "Sum of p,p′-DDT, o,p′-DDT, p,p′-DDE and p,p′-DDD",
 564: 'Sum of α-, β-, γ- and δ-HCH',
 565: f'{PLANT}: sum of cis- and trans-chlordane; {ANIMAL}: sum of cis-chlordane, trans-chlordane and oxychlordane',
 567: 'Sum of heptachlor and heptachlor epoxide',
 568: 'Sum of endrin, endrin aldehyde and endrin ketone',
}
RESIDUES[167] = 'Sum of fipronil, fipronil-desulfinyl, fipronil sulfone and fipronil sulfide, expressed as fipronil'
RESIDUES[223] = 'Sum of XMC (灭除威) and xylylcarb (灭杀威)'
RESIDUES[256] = 'Fenoxaprop (唑禾草灵)'
RESIDUES[454] = f'{PLANT}: quintozene; {ANIMAL}: sum of quintozene, pentachloroaniline and methyl pentachlorophenyl sulfide (五氯苯醚)'

# Food names used in limit rows that neither Annex A commodities nor category labels translate.
FOODS = dict(x.split(':',1) for x in '''海洋哺乳动物:Marine mammals
小型油籽类:Small oilseeds
中型油籽类:Medium oilseeds
大型油籽类:Large oilseeds
油籽类:Oilseeds
油脂:Oils and fats
稻类:Rice
大米:Milled rice
根茎类调味料:Root and rhizome spices
果类调味料:Fruit spices
种子类调味料:Seed spices
叶类调味料:Leaf herbs
蘑菇类(鲜):Mushrooms (fresh)
双孢蘑菇(鲜):Button mushroom (fresh)
平菇(鲜):Oyster mushroom (fresh)
金银花:Honeysuckle flower
棉籽油:Cottonseed oil
棉籽毛油:Crude cottonseed oil
食用棉籽油:Edible cottonseed oil
小麦粉:Wheat flour
麦胚:Wheat germ
全麦粉:Whole-wheat flour
小麦全粉:Whole wheat meal
黑麦粉:Rye flour
黑麦全粉:Whole rye flour
玉米粉:Maize flour
玉米糁:Maize grits
小扁豆:Lentil
赤豆:Adzuki bean
鹰嘴豆:Chickpea
羽扇豆:Lupin
木豆:Pigeon pea
蚕豆(干):Dry broad bean
蚕豆(鲜):Fresh broad bean
荞麦:Buckwheat
稷:Proso millet
栗:栗 (as printed under grains; possibly 粟, foxtail millet)
亚麻籽:Linseed
芥菜籽:Mustard seed
油茶籽:Camellia oilseed
油橄榄:Olives for oil
大豆油:Soybean oil
大豆毛油:Crude soybean oil
菜籽油:Rapeseed oil
菜籽毛油:Crude rapeseed oil
食用菜籽油:Edible rapeseed oil
花生油:Peanut oil
花生毛油:Crude peanut oil
玉米油:Maize oil
玉米毛油:Crude maize oil
葵花籽毛油:Crude sunflower seed oil
初榨橄榄油:Virgin olive oil
精炼橄榄油:Refined olive oil
植物油:Vegetable oils
植物毛油:Crude vegetable oils
牛内脏:Cattle offal
猪内脏:Pig offal
绵羊内脏:Sheep offal
山羊内脏:Goat offal
马内脏:Horse offal
鸡内脏:Chicken offal
羊肾:Sheep/goat kidney
猪脂肪:Pig fat
牛脂肪:Cattle fat
山羊脂肪:Goat fat
绵羊脂肪:Sheep fat
马脂肪:Horse fat
马肉:Horse meat
羊肉:Sheep/goat meat
鸡肉:Chicken meat
鸡蛋:Chicken egg
牛乳:Cow milk
山羊奶:Goat milk
绵羊奶:Sheep milk
脂肪含量10%以下:Fat content below 10%
脂肪含量10%及以上:Fat content 10% or more
单列的:items listed separately
甘蓝:Cabbage (甘蓝; not defined in Annex A)
白菜:Chinese cabbage (白菜; not defined in Annex A)
以脂肪中的残留量计:residue in fat'''.split('\n'))
FOODS.update({'动物源性食品':'Animal-origin foods','植物源性食品':'Plant-origin foods','以脂肪计':'fat basis','油脂和油料':'Oils and oilseeds','油料和油酯':'Oilseeds and oils','哺乳动物肉类脂肪':'Mammalian meat fat','哺乳动物类脂肪':'Mammalian fat','禽肉类以脂肪计':'Poultry meat (fat basis)','海洋脯乳动物':'Marine mammals'})

# Annex A testing parts (测定部位) in Chinese, keyed by the English wording used in catalog.py.
PARTS_ZH = {
 'Whole fruit, stalk removed.': '全果（去柄）',
 'Whole fruit, stalk removed; hawthorn and loquat follow the stone-fruit provision. Consult Annex A.': '全果（去柄），枇杷、山楂参照核果',
 'Remove stalk and stone for testing; include stone weight in residue calculation.': '全果（去柄和果核），残留量计算应计入果核的重量',
 'Whole fruit, stalk removed; bayberry and olive: test flesh, including stone weight in the calculation.': '全果（去柄），杨梅、橄榄检测果肉部分，残留量计算应计入果核的重量',
 'Whole fruit with stalk and stone removed; include stone weight in residue calculation.': '全果（去柄和果核），残留量计算应计入果核的重量',
 'Whole fruit; mango and avocado: remove stone. Mangosteen: test flesh. Include stone weight in calculation where specified by Annex A.': '全果，鳄梨和杧果去除核，山竹测定果肉，残留量计算应计入果核的重量',
 'Whole banana.': '香蕉测定全蕉',
 'All parts except seeds; include seed weight in residue calculation.': '番木瓜测定去除果核的所有部分，残留量计算应计入果核的重量',
 'Coconut water and flesh.': '椰子测定椰汁和椰肉',
 'Remove the leafy crown; consult the original Annex A wording.': '菠萝、火龙果去除叶冠部分',
 'Test flesh; include seed weight in residue calculation. Do not substitute a whole-fruit or shell-weight basis.': '菠萝蜜、榴莲测定果肉，残留量计算应计入果核的重量',
 'Whole melon.': '全瓜',
 'Edible portion.': '可食部分',
 'Whole plant.': '整棵',
 'Bulb.': '鳞茎头',
 'Whole head.': '整棵',
 'Whole head, leaves removed.': '整棵，去除叶',
 'Whole plant, roots removed.': '整棵，去除根',
 'Whole bean, including pod.': '全豆（带荚）',
 'Whole bean, pod removed.': '全豆（去荚）',
 'Remove top leaves and petioles.': '整棵，去除顶部叶及叶柄',
 'Whole tuber.': '全薯',
 'Whole plant; remove outer skin of water bamboo.': '整棵，茭白去除外皮',
 'Whole fruit, shell removed.': '全果（去壳）',
 'All parts.': '全部',
 'Whole product.': '全部',
 'Whole fruit; test the flesh and include stone weight in the residue calculation.': '全果（测定果肉，残留量计算应计入果核的重量）',
 'Whole nut, shell removed.': '全果（去壳）',
 'Whole cane, top leaves and petioles removed.': '整根甘蔗，去除顶部叶及叶柄',
 'Whole beet, top leaves and petioles removed.': '整根甜菜，去除顶部叶及叶柄',
 'Not specified in Annex A.': '附录 A 未规定',
 'Whole mushroom.': '整棵',
 'Whole fungus.': '整棵',
 'Whole fruit.': '全果',
 'Whole seed.': '果实整粒',
 'Root and stem parts.': '根、茎部分',
 'Stem and leaf parts.': '茎、叶部分',
 'Flower and fruit parts.': '花、果实部分',
}
