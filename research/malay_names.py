"""Bahasa Melayu names for crops, food categories and Annex A testing parts.

Navigation aids only: the Chinese names in the standard control. Where Malay has no everyday name the
English or botanical trade name is kept, as Malaysian trade usage does. Crops without an entry fall back
to their English name.
"""
CROPS = dict(x.split('=') for x in '''柑=Limau mandarin; 橘=Limau tangerin; 橙=Oren; 柠檬=Lemon; 柚=Limau bali; 佛手柑=Limau bergamot; 金橘=Limau kumquat; 苹果=Epal; 梨=Pear; 山楂=Hawthorn; 枇杷=Loquat; 榅桲=Kuins; 桃=Pic; 油桃=Nektarin; 杏=Aprikot; 枣(鲜)=Jujub segar; 李子=Plum; 樱桃=Ceri; 青梅=Plum hijau; 枸杞(鲜)=Beri goji segar; 黑莓=Beri hitam; 蓝莓=Beri biru; 覆盆子=Raspberi; 越橘=Beri Vaccinium; 加仑子=Kismis kurant; 悬钩子=Beri Rubus; 醋栗=Gusberi; 桑葚=Mulberi; 唐棣=Juneberi; 露莓(包括波森莓和罗甘莓)=Dewberi; 波森莓=Boysenberi; 罗甘莓=Loganberi; 葡萄=Anggur; 酿酒葡萄=Anggur wain; 树番茄=Pokok tomato (tamarillo); 五味子=Beri Schisandra; 猕猴桃=Buah kiwi; 西番莲=Markisa; 草莓=Strawberi; 柿子=Pisang kaki; 杨梅=Bayberi Cina; 橄榄=Zaitun; 无花果=Buah tin; 杨桃=Belimbing; 莲雾=Jambu air; 腰果梨=Jambu gajus; 荔枝=Laici; 龙眼=Longan (mata kucing); 红毛丹=Rambutan; 杧果=Mangga; 石榴=Delima; 鳄梨=Avokado; 番荔枝=Buah nona; 番石榴=Jambu batu; 黄皮=Wampi; 山竹=Manggis; 香蕉=Pisang; 番木瓜=Betik; 椰子=Kelapa; 菠萝=Nanas; 火龙果=Buah naga; 菠萝蜜=Nangka; 榴莲=Durian; 西瓜=Tembikai; 甜瓜=Tembikai susu; 哈密瓜=Tembikai Hami; 香瓜=Tembikai wangi; 香瓜茄=Pepino; 大蒜=Bawang putih; 洋葱=Bawang besar; 薤=Bawang rakkyo; 韭菜=Kucai; 葱=Daun bawang; 青蒜=Daun bawang putih; 蒜薹=Batang bunga bawang putih; 韭葱=Bawang perai (leek); 百合(鲜)=Umbi lili segar; 结球甘蓝=Kubis bulat; 球茎甘蓝=Kohlrabi; 抱子甘蓝=Kubis Brussels; 赤球甘蓝=Kubis merah; 羽衣甘蓝=Kale; 皱叶甘蓝=Kubis Savoy; 花椰菜=Kubis bunga; 青花菜=Brokoli; 芥蓝=Kailan; 菜薹=Sawi bunga (choy sum); 茎芥菜=Sawi batang; 菠菜=Bayam Sepanyol (spinach); 苋菜=Bayam; 蕹菜=Kangkung; 茼蒿=Tong ho (daun kekwa); 大叶茼蒿=Tong ho daun besar; 叶用莴苣=Salad daun; 结球莴苣=Salad bulat; 苦苣=Endif; 野苣=Salad jagung; 落葵=Remayung; 油麦菜=Yau mak; 叶芥菜=Sawi pahit; 萝卜叶=Daun lobak putih; 芜菁叶=Daun turnip; 菊苣=Cikori; 芋头叶=Daun keladi; 茎用莴苣叶=Daun celtuce; 甘薯叶=Pucuk keledek; 小白菜=Pak coi; 小油菜=Sawi hijau kecil; 青菜=Sawi Shanghai; 芹菜=Saderi; 茴香=Adas; 球茎茴香=Adas umbi; 大白菜=Kubis Cina; 番茄=Tomato; 樱桃番茄=Tomato ceri; 茄子=Terung; 辣椒=Cili; 甜椒=Lada benggala; 黄秋葵=Bendi; 酸浆=Letup-letup; 黄瓜=Timun; 腌制用小黄瓜=Timun jeruk (gherkin); 西葫芦=Zukini; 节瓜=Labu berbulu; 苦瓜=Peria; 丝瓜=Petola; 线瓜=Petola segi; 瓠瓜=Labu air; 菜瓜=Timun jeruk oriental; 冬瓜=Kundur; 南瓜=Labu; 笋瓜=Labu musim sejuk; 豇豆=Kacang panjang; 菜豆=Kacang buncis; 菜豆籽粒=Biji kacang buncis; 食荚豌豆=Kacang pis lenggai; 四棱豆=Kacang botol; 扁豆=Kacang kara; 刀豆=Kacang parang; 菜用大豆=Edamame; 蚕豆=Kacang fava (broad bean); 豌豆=Kacang pis; 利马豆=Kacang lima; 芦笋=Asparagus; 朝鲜蓟=Artichoke; 大黄=Rubarb; 茎用莴苣=Celtuce; 萝卜=Lobak putih; 胡萝卜=Lobak merah; 根甜菜=Ubi bit; 根芹菜=Saderi umbi; 根芥菜=Sawi umbi; 姜=Halia; 辣根=Horseradish (lobak pedas); 芜菁=Turnip; 桔梗=Akar bunga loceng; 马铃薯=Ubi kentang; 甘薯=Ubi keledek; 山药=Ubi yam Cina (huai san); 牛蒡=Burdock; 木薯=Ubi kayu; 芋=Keladi; 葛=Kudzu; 魔芋=Konjac; 水芹=Saderi air; 豆瓣菜=Selada air; 茭白=Rebung air; 蒲菜=Pucuk banat; 菱角=Buah tanduk (ling kok); 芡实=Biji teratai berduri; 莲子(鲜)=Biji teratai segar; 莲藕=Akar teratai; 荸荠=Sengkuang Cina (ma tai); 慈姑=Ngaku (arrowhead); 绿豆芽=Taugeh; 黄豆芽=Taugeh soya; 萝卜芽=Tunas lobak; 苜蓿芽=Tunas alfalfa; 花椒芽=Pucuk lada Sichuan; 香椿芽=Pucuk toon Cina; 黄花菜(鲜)=Kuntum lili kuning segar; 竹笋=Rebung; 仙人掌=Kaktus; 玉米笋=Jagung muda'''.replace('\n', ' ').split('; '))
CATEGORIES = {
 '谷物': 'Bijirin', '油料和油脂': 'Biji minyak & minyak', '蔬菜': 'Sayur-sayuran segar', '干制蔬菜': 'Sayur kering',
 '水果': 'Buah-buahan segar', '干制水果': 'Buah kering', '坚果': 'Kekacang', '糖料': 'Tanaman gula',
 '饮料类': 'Tanaman & produk minuman', '食用菌': 'Kulat boleh dimakan', '调味料': 'Rempah & herba',
 '药用植物': 'Tumbuhan ubatan', '哺乳动物肉类': 'Daging mamalia', '哺乳动物内脏': 'Organ dalaman mamalia',
 '哺乳动物脂肪': 'Lemak mamalia', '禽肉类': 'Daging ayam itik', '禽类内脏': 'Organ dalaman ayam itik',
 '禽类脂肪': 'Lemak ayam itik', '蛋类': 'Telur', '生乳': 'Susu mentah', '乳脂肪': 'Lemak susu', '水产品': 'Hasil akuatik',
}
PARTS = {
 'Whole fruit, stalk removed.': 'Buah keseluruhan, tangkai dibuang.',
 'Whole fruit, stalk removed; hawthorn and loquat follow the stone-fruit provision. Consult Annex A.': 'Buah keseluruhan, tangkai dibuang; hawthorn dan loquat mengikut peruntukan buah berbiji keras. Rujuk Lampiran A.',
 'Remove stalk and stone for testing; include stone weight in residue calculation.': 'Buang tangkai dan biji untuk ujian; berat biji dikira dalam pengiraan residu.',
 'Whole fruit, stalk removed; bayberry and olive: test flesh, including stone weight in the calculation.': 'Buah keseluruhan, tangkai dibuang; bayberi dan zaitun: uji isi, berat biji dikira dalam pengiraan.',
 'Whole fruit with stalk and stone removed; include stone weight in residue calculation.': 'Buah keseluruhan tanpa tangkai dan biji; berat biji dikira dalam pengiraan residu.',
 'Whole fruit; mango and avocado: remove stone. Mangosteen: test flesh. Include stone weight in calculation where specified by Annex A.': 'Buah keseluruhan; mangga dan avokado: buang biji. Manggis: uji isi. Berat biji dikira jika dinyatakan dalam Lampiran A.',
 'Whole banana.': 'Pisang keseluruhan.',
 'All parts except seeds; include seed weight in residue calculation.': 'Semua bahagian kecuali biji; berat biji dikira dalam pengiraan residu.',
 'Coconut water and flesh.': 'Air dan isi kelapa.',
 'Remove the leafy crown; consult the original Annex A wording.': 'Buang jambul daun; rujuk teks asal Lampiran A.',
 'Test flesh; include seed weight in residue calculation. Do not substitute a whole-fruit or shell-weight basis.': 'Uji isi; berat biji dikira dalam pengiraan residu. Jangan guna asas buah keseluruhan atau berat kulit.',
 'Whole melon.': 'Buah keseluruhan.',
 'Edible portion.': 'Bahagian yang boleh dimakan.',
 'Whole plant.': 'Pokok keseluruhan.',
 'Bulb.': 'Umbi.',
 'Whole head.': 'Kepala keseluruhan.',
 'Whole head, leaves removed.': 'Kepala keseluruhan, daun dibuang.',
 'Whole plant, roots removed.': 'Pokok keseluruhan, akar dibuang.',
 'Whole bean, including pod.': 'Kacang keseluruhan, termasuk lenggai.',
 'Whole bean, pod removed.': 'Kacang keseluruhan, lenggai dibuang.',
 'Remove top leaves and petioles.': 'Buang daun atas dan tangkai daun.',
 'Whole tuber.': 'Ubi keseluruhan.',
 'Whole plant; remove outer skin of water bamboo.': 'Pokok keseluruhan; buang kulit luar rebung air.',
 'Whole fruit, shell removed.': 'Buah keseluruhan, kulit keras dibuang.',
 'All parts.': 'Semua bahagian.',
 'Whole product.': 'Produk keseluruhan.',
 'Whole fruit; test the flesh and include stone weight in the residue calculation.': 'Buah keseluruhan; uji isi dan kira berat biji dalam pengiraan residu.',
 'Whole nut, shell removed.': 'Kekacang keseluruhan, kulit dibuang.',
 'Whole cane, top leaves and petioles removed.': 'Batang tebu keseluruhan, daun atas dan tangkai daun dibuang.',
 'Whole beet, top leaves and petioles removed.': 'Ubi bit keseluruhan, daun atas dan tangkai daun dibuang.',
 'Not specified in Annex A.': 'Tidak dinyatakan dalam Lampiran A.',
 'Whole mushroom.': 'Cendawan keseluruhan.',
 'Whole fungus.': 'Kulat keseluruhan.',
 'Whole fruit.': 'Buah keseluruhan.',
 'Whole seed.': 'Biji keseluruhan.',
 'Root and stem parts.': 'Bahagian akar dan batang.',
 'Stem and leaf parts.': 'Bahagian batang dan daun.',
 'Flower and fruit parts.': 'Bahagian bunga dan buah.',
}
