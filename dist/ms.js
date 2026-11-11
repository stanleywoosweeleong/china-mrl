/* Bahasa Melayu interface text, keyed by the English wording used in index.html and the scripts.
   Terms: had maksimum residu (MRL), had sementara (provisional limit), racun perosak (pesticide),
   akses pasaran (market access), Lampiran A/B (Annex A/B). The Chinese text of the standard controls. */
(function (root) {
  const MS = {
    // Page head and brand
    'China MRL': 'MRL China',
    'China MRL — GB 2763-2026 Explorer': 'MRL China — Carian GB 2763-2026',
    'Explore all 10,749 GB 2763-2026 residue limits, with a fresh fruit and vegetable view for exporters worldwide.':
      'Semak kesemua 10,749 had residu GB 2763-2026, dengan paparan khas buah-buahan dan sayur-sayuran segar untuk pengeksport di seluruh dunia.',
    Language: 'Bahasa',

    // Sidebar, header, navigation
    'GLOBAL EXPORT REFERENCE': 'RUJUKAN EKSPORT GLOBAL',
    '{country} EXPORT REFERENCE': 'RUJUKAN EKSPORT {country}',
    'REFERENCE WORKSPACE': 'RUANG RUJUKAN',
    Sections: 'Bahagian',
    'Fresh produce': 'Hasil segar',
    'Entire standard': 'Piawaian penuh',
    'Saved references': 'Rujukan disimpan',
    'Exempt pesticides': 'Racun perosak dikecualikan',
    'Sources & coverage': 'Sumber & liputan',
    'Market access': 'Akses pasaran',
    'Export essentials': 'Asas eksport',
    Produce: 'Hasil',
    Access: 'Akses',
    Saved: 'Disimpan',
    More: 'Lagi',
    'All origins → Mainland China': 'Semua negara asal → Tanah Besar China',
    '{origin} → Mainland China': '{origin} → Tanah Besar China',
    'All origins': 'Semua negara asal',
    'Effective 1 March 2026': 'Berkuat kuasa 1 Mac 2026',
    'Open complete standard ↗': 'Buka piawaian penuh ↗',
    Origin: 'Asal',
    Malaysia: 'Malaysia',
    'China destination': 'Destinasi: China',
    'ONE STANDARD. A GLOBAL REFERENCE.': 'SATU PIAWAIAN. RUJUKAN GLOBAL.',
    'ONE STANDARD. EXPORTING FROM {country}.': 'SATU PIAWAIAN. EKSPORT DARI {country}.',
    CHINA: 'CHINA',
    'All origins. Source-linked limits. Clear scope.':
      'Semua negara asal. Had berpaut kepada sumber. Skop yang jelas.',
    '{origin}. Source-linked limits. Clear scope.': '{origin}. Had berpaut kepada sumber. Skop yang jelas.',

    // Tab titles
    'Know the limit. See the source.': 'Ketahui hadnya. Lihat sumbernya.',
    'China’s pesticide residue standard, made easier to explore for fresh produce exporters.':
      'Piawaian residu racun perosak China, dipermudah untuk pengeksport hasil segar.',
    'The entire standard, within reach.': 'Seluruh piawaian, mudah dicapai.',
    'All indexed MRL entries in GB 2763-2026, across all food categories.':
      'Semua entri MRL dalam GB 2763-2026, merentas semua kategori makanan.',
    'Your reference shortlist.': 'Senarai rujukan anda.',
    'Saved on this browser, with the original food scope and crop context.':
      'Disimpan dalam pelayar ini, bersama skop makanan asal dan tanaman yang dipilih.',
    'Know when an exemption applies.': 'Ketahui bila pengecualian terpakai.',
    'All 44 entries from Annex B, with links to the original text.':
      'Kesemua 44 entri Lampiran B, dengan pautan ke teks asal.',
    'Every number has a source.': 'Setiap angka ada sumbernya.',
    'Coverage, interpretation rules and the original government-hosted document.':
      'Liputan, peraturan tafsiran dan dokumen asal di laman kerajaan.',
    'Understand both export gates.': 'Fahami dua syarat eksport.',
    'A residue limit and permission to import are two separate requirements.':
      'Had residu dan kebenaran import ialah dua keperluan yang berasingan.',
    'Check the other export gate.': 'Semak syarat kedua: akses pasaran.',
    'Country, commodity and product form determine which import protocol applies.':
      'Negara, komoditi dan bentuk produk menentukan protokol import yang terpakai.',
    'Banned in China': 'Diharamkan di China',
    'Know what not to use.': 'Ketahui apa yang tidak boleh digunakan.',
    'Pesticides China bans or restricts for use, linked to their limits in the standard.':
      'Racun perosak yang diharamkan atau dihadkan penggunaannya di China, berpaut kepada hadnya dalam piawaian.',

    // Explorer
    'Find the limits for your crop': 'Cari had untuk tanaman anda',
    'Search crops or all 10,749 source entries': 'Cari tanaman atau kesemua 10,749 entri sumber',
    'Your saved source references': 'Rujukan sumber yang anda simpan',
    'English & Chinese names': 'Nama Inggeris & Cina',
    'Fresh commodity': 'Tanaman segar',
    'Type a crop name': 'Taip nama tanaman',
    'Show all fresh-produce entries': 'Papar semua entri hasil segar',
    'Matching crops': 'Tanaman yang sepadan',
    'All original fresh-produce entries': 'Semua entri asal hasil segar',
    'No fresh crop matches. Try another name, or search the Entire standard.':
      'Tiada tanaman segar yang sepadan. Cuba nama lain, atau cari dalam Piawaian penuh.',
    'Access documented': 'Akses direkodkan',
    'Food category': 'Kategori makanan',
    'All food categories': 'Semua kategori makanan',
    'Search mode': 'Mod carian',
    'Applicable crop limits': 'Had yang terpakai pada tanaman',
    'Exact source text': 'Teks sumber tepat',
    'Pesticide / residue definition': 'Racun perosak / definisi residu',
    'All pesticides': 'Semua racun perosak',
    'Limit type': 'Jenis had',
    'All limits': 'Semua had',
    'EMRL (environmental residues)': 'EMRL (residu persekitaran)',
    'Provisional limits *': 'Had sementara *',
    'Pesticide or food…': 'Racun atau makanan…',
    'QUICK LOOKUP': 'CARIAN PANTAS',
    Durian: 'Durian',
    Jackfruit: 'Nangka',
    'Dragon fruit': 'Buah naga',
    Pineapple: 'Nanas',
    Tomato: 'Tomato',
    Okra: 'Bendi',
    'Reset filters ↺': 'Set semula penapis ↺',
    'Residue requirements and market access are separate.':
      'Keperluan residu dan akses pasaran adalah berasingan.',
    'These limits do not establish import permission for a country of origin. Match the exact food, residue definition and sampling portion. A missing numeric entry is not a zero limit or an automatic exemption.':
      'Had ini tidak bermakna sesebuah negara asal dibenarkan mengimport. Padankan makanan, definisi residu dan bahagian sampel yang tepat. Ketiadaan nilai had bukan bermakna had sifar atau pengecualian automatik.',
    'matching limits': 'had yang sepadan',
    'applicable entries': 'entri yang terpakai',
    'source row': 'baris sumber',
    'source rows': 'baris sumber',
    'saved references': 'rujukan disimpan',
    Sort: 'Susun',
    'Default order': 'Susunan asal',
    'Limit: low to high': 'Had: rendah ke tinggi',
    'Limit: high to low': 'Had: tinggi ke rendah',
    'Pesticide name': 'Nama racun perosak',
    'Food name': 'Nama makanan',
    'Print limit sheet': 'Cetak senarai had',
    '↓ Export CSV': '↓ Eksport CSV',
    'Residue limits': 'Had residu',
    'COMMODITY / SCOPE': 'KOMODITI / SKOP',
    PESTICIDE: 'RACUN PEROSAK',
    LIMIT: 'HAD',
    BASIS: 'ASAS',
    Actions: 'Tindakan',
    'No matching numeric limit found': 'Tiada had berangka yang sepadan',
    'Check your filters, the entire standard and Annex B. The app does not assign a default value when a limit is absent.':
      'Semak penapis anda, piawaian penuh dan Lampiran B. Aplikasi ini tidak menetapkan nilai lalai apabila tiada had.',
    '* Provisional limit (临时限量), not an analytical detection limit. EMRL means an extraneous residue limit for environmental residues. Neither indicates permission to use the pesticide.':
      '* Had sementara (临时限量), bukan had pengesanan analisis. EMRL ialah had residu luaran bagi residu daripada persekitaran. Kedua-duanya tidak bermakna racun perosak itu dibenarkan digunakan.',
    'Previous page': 'Halaman sebelumnya',
    'Next page': 'Halaman seterusnya',
    'Showing {from}–{to} of {total}': 'Memaparkan {from}–{to} daripada {total}',
    '{n} more in the Banned section below': '{n} lagi dalam bahagian Diharamkan di bawah',
    '0 matching numeric records': 'Tiada rekod berangka yang sepadan',
    'Via group: ': 'Melalui kumpulan: ',
    'Direct: ': 'Disebut terus: ',
    'Conflicting matches · review': 'Padanan bercanggah · semak',
    'Source numbering note': 'Nota penomboran sumber',
    'Group rule': 'Peraturan kumpulan',
    'Table {table} · p. {page}': 'Jadual {table} · hlm. {page}',
    Save: 'Simpan',
    Unsave: 'Buang simpanan',
    'Details ↗': 'Butiran ↗',
    'Saved with source and crop context': 'Disimpan bersama sumber dan tanaman',
    'Reference removed': 'Rujukan dibuang',
    'Browser storage unavailable; saved for this session only':
      'Storan pelayar tidak tersedia; disimpan untuk sesi ini sahaja',
    'Exported {n} rows with sources': '{n} baris dieksport bersama sumber',
    'The reference database could not load. Please reload the page; no regulatory conclusion can be drawn from this error.':
      'Pangkalan data rujukan gagal dimuatkan. Sila muat semula halaman; tiada kesimpulan kawal selia boleh dibuat daripada ralat ini.',

    // Banned section under the results
    'These pesticides are banned for use in China. Their limits still apply to imports.':
      'Racun perosak ini diharamkan penggunaannya di China. Hadnya masih terpakai pada import.',
    'See the full banned list': 'Lihat senarai penuh yang diharamkan',
    'Limits for pesticides banned in China': 'Had bagi racun perosak yang diharamkan di China',
    'Banned in China · {n} limits': 'Diharamkan di China · {n} had',
    'Showing the first {n}. Choose a crop or a pesticide to see the rest.':
      'Memaparkan {n} yang pertama. Pilih tanaman atau racun perosak untuk melihat yang lain.',
    'Pesticides banned for use in China · {n} limits': 'Racun perosak diharamkan di China · {n} had',

    // Entire-standard search note
    '{name}: {n} applicable entries after filters — {direct} direct + {group} group-based. Group entries follow Annex A and explicit exclusions; original food scopes are shown below.':
      '{name}: {n} entri terpakai selepas penapis — {direct} disebut terus + {group} melalui kumpulan. Entri kumpulan mengikut Lampiran A dan pengecualian yang dinyatakan; skop makanan asal dipaparkan di bawah.',
    'Fresh produce only; processed forms need separate classification.':
      'Hasil segar sahaja; bentuk yang diproses perlu dikelaskan secara berasingan.',
    'Annex A category: {category}. Other product forms need separate classification.':
      'Kategori Lampiran A: {category}. Bentuk produk lain perlu dikelaskan secara berasingan.',
    'Review: 1 source row names a food Annex A does not define ({foods}); not applied.':
      'Semak: 1 baris sumber menamakan makanan yang tidak ditakrifkan dalam Lampiran A ({foods}); tidak digunakan.',
    'Review: {n} source rows name a food Annex A does not define ({foods}); not applied.':
      'Semak: {n} baris sumber menamakan makanan yang tidak ditakrifkan dalam Lampiran A ({foods}); tidak digunakan.',
    'Several crops match “{query}”. Choose one to include its food-group limits:':
      'Beberapa tanaman sepadan dengan “{query}”. Pilih satu untuk memasukkan had kumpulan makanannya:',
    'Meanwhile, results below search the original source text.':
      'Buat masa ini, hasil di bawah mencari teks sumber asal.',
    'Exact source text: searches original food and pesticide wording only. Food-group limits may apply even when the crop name does not appear in a row.':
      'Teks sumber tepat: hanya mencari perkataan asal makanan dan racun perosak. Had kumpulan makanan mungkin terpakai walaupun nama tanaman tidak muncul dalam baris.',
    'Enter an English or Chinese crop name (plurals and partial names work) to include applicable food-group limits. Other queries search the original source text across all food categories.':
      'Masukkan nama tanaman (sebahagian nama pun boleh) untuk memasukkan had kumpulan makanan yang terpakai. Carian lain mencari teks sumber asal merentas semua kategori makanan.',

    // Crop card
    'SELECTED CROP · FRESH FRUIT': 'TANAMAN DIPILIH · BUAH SEGAR',
    'SELECTED CROP · FRESH VEGETABLE': 'TANAMAN DIPILIH · SAYUR SEGAR',
    '{direct} direct entries · {group} group-based entries':
      '{direct} entri disebut terus · {group} entri melalui kumpulan',
    'Selected origin: {status}. MRLs alone do not establish permission.':
      'Negara asal dipilih: {status}. MRL sahaja tidak bermakna kebenaran import.',
    'approved market access · conditions apply': 'akses pasaran diluluskan · tertakluk kepada syarat',
    'access documented · conditions apply': 'akses direkodkan · tertakluk kepada syarat',
    'restriction documented': 'sekatan direkodkan',
    'market access not verified': 'akses pasaran belum disahkan',
    'Check market access': 'Semak akses pasaran',
    'View conditions': 'Lihat syarat',
    'PART TO BE TESTED · ANNEX A': 'BAHAGIAN YANG DIUJI · LAMPIRAN A',
    'Read Annex A, PDF p. {n} ↗': 'Baca Lampiran A, PDF hlm. {n} ↗',
    'PDF p. {n}': 'PDF hlm. {n}',
    'PDF page {n}': 'PDF halaman {n}',
    'Review: 1 source row names a food that Annex A does not define, so it is not applied here: {items}. Confirm with the source whether it applies to {crop}.':
      'Semak: 1 baris sumber menamakan makanan yang tidak ditakrifkan dalam Lampiran A, jadi ia tidak digunakan di sini: {items}. Sahkan dengan sumber sama ada ia terpakai pada {crop}.',
    'Review: {n} source rows name a food that Annex A does not define, so they are not applied here: {items}. Confirm with the source whether they apply to {crop}.':
      'Semak: {n} baris sumber menamakan makanan yang tidak ditakrifkan dalam Lampiran A, jadi ia tidak digunakan di sini: {items}. Sahkan dengan sumber sama ada ia terpakai pada {crop}.',

    // Detail view
    'Close details': 'Tutup butiran',
    'Read the source section.': 'Baca bahagian sumber.',
    'English rendering for navigation; the Chinese definition controls.':
      'Terjemahan Inggeris untuk rujukan; definisi bahasa Cina yang muktamad.',
    'Food-group match under Annex A, after explicit exclusions.':
      'Padanan kumpulan makanan di bawah Lampiran A, selepas pengecualian yang dinyatakan.',
    'The source table names this commodity.': 'Jadual sumber menamakan komoditi ini.',
    'Original source-table row; select a fresh crop to see group applicability.':
      'Baris asal jadual sumber; pilih tanaman segar untuk melihat had kumpulan yang terpakai.',
    '* Provisional limit (临时限量). This is not an analytical detection-limit marker.':
      '* Had sementara (临时限量). Ini bukan penanda had pengesanan analisis.',
    'More than one equally specific match has a different limit. Resolve applicability against the source before comparison.':
      'Lebih daripada satu padanan yang sama khusus mempunyai had berbeza. Tentukan yang terpakai berdasarkan sumber sebelum membuat perbandingan.',
    '☆ Save this limit': '☆ Simpan had ini',
    '★ Saved': '★ Disimpan',
    'Applicability and source': 'Penggunaan dan sumber',
    'Original food scope': 'Skop makanan asal',
    'Source category': 'Kategori sumber',
    Application: 'Penggunaan',
    'Residue definition': 'Definisi residu',
    'Effective from': 'Berkuat kuasa dari',
    'Source location': 'Lokasi sumber',
    'Table {table} · PDF page {page} · printed page {printed}':
      'Jadual {table} · PDF halaman {page} · halaman bercetak {printed}',
    'Sampling portion': 'Bahagian sampel',
    'Annex A · PDF p. {n} ↗': 'Lampiran A · PDF hlm. {n} ↗',
    'Open the exact source page ↗': 'Buka halaman sumber yang tepat ↗',
    'Source testing-method text (Chinese)': 'Teks kaedah ujian daripada sumber (bahasa Cina)',
    'Chinese source wording controls. Combined residue definitions may include metabolites or multiple active substances.':
      'Teks sumber bahasa Cina yang muktamad. Definisi residu gabungan mungkin merangkumi metabolit atau beberapa bahan aktif.',
    'Testing methods': 'Kaedah ujian',
    'The standard designates no testing method for this section: all of its limits are provisional (临时限量). Agree the method with your laboratory, for example an applicable GB 23200 multi-residue method.':
      'Piawaian tidak menetapkan kaedah ujian untuk bahagian ini: semua hadnya ialah had sementara (临时限量). Persetujui kaedah dengan makmal anda, contohnya kaedah multi-residu GB 23200 yang sesuai.',
    'The standard designates no testing method for this food category. The methods it gives for other categories are listed below; agree the method with your laboratory.':
      'Piawaian tidak menetapkan kaedah ujian untuk kategori makanan ini. Kaedah yang diberikan untuk kategori lain disenaraikan di bawah; persetujui kaedah dengan makmal anda.',
    'method by reference (参照)': 'kaedah sebagai rujukan (参照)',
    'specified method (按照)': 'kaedah yang ditetapkan (按照)',
    ' · applies to this entry': ' · terpakai pada entri ini',
    'None designated (provisional limits)': 'Tiada ditetapkan (had sementara)',
    'None designated for this food category': 'Tiada ditetapkan untuk kategori makanan ini',
    ' (by reference)': ' (sebagai rujukan)',
    '{status}. This is a rule on use inside China; the limit above still applies to imports.':
      '{status}. Ini peraturan penggunaan di dalam China; had di atas masih terpakai pada import.',
    'See the banned list': 'Lihat senarai yang diharamkan',
    'Compare a laboratory result': 'Bandingkan keputusan makmal',
    'Report type': 'Jenis laporan',
    'Quantified result': 'Keputusan berangka',
    'Non-detect / below reporting limit': 'Tidak dikesan / di bawah had pelaporan',
    'Result in mg/kg (ppm by mass)': 'Keputusan dalam mg/kg (ppm mengikut jisim)',
    'Laboratory reporting limit in mg/kg': 'Had pelaporan makmal dalam mg/kg',
    'e.g. 0.015': 'cth. 0.015',
    'Enter a result to compare.': 'Masukkan keputusan untuk dibandingkan.',
    'Arithmetic only. The analyte definition, sample preparation, uncertainty, product form and market access must be assessed separately.':
      'Perbandingan angka sahaja. Definisi analit, penyediaan sampel, ketidakpastian, bentuk produk dan akses pasaran perlu dinilai secara berasingan.',
    'Comparison blocked until the conflicting source matches are resolved.':
      'Perbandingan disekat sehingga padanan sumber yang bercanggah diselesaikan.',
    'No numeric limit is available.': 'Tiada had berangka tersedia.',
    'Enter the laboratory reporting limit for a non-detect. A non-detect is not zero.':
      'Masukkan had pelaporan makmal bagi keputusan tidak dikesan. Tidak dikesan bukan bermakna sifar.',
    'The reporting limit is at or below the displayed MRL. Confirm the method, residue definition and reporting convention with your laboratory.':
      'Had pelaporan sama dengan atau lebih rendah daripada MRL yang dipaparkan. Sahkan kaedah, definisi residu dan cara pelaporan dengan makmal anda.',
    'The reporting limit exceeds the MRL; this non-detect cannot establish that residues are below the MRL.':
      'Had pelaporan melebihi MRL; keputusan tidak dikesan ini tidak dapat membuktikan residu berada di bawah MRL.',
    'Enter a valid non-negative quantified result.':
      'Masukkan keputusan berangka yang sah dan tidak negatif.',
    'Above the displayed limit by {amount} mg/kg.': 'Melebihi had yang dipaparkan sebanyak {amount} mg/kg.',
    'Equal to the displayed limit. Measurement uncertainty and applicability still need review.':
      'Sama dengan had yang dipaparkan. Ketidakpastian pengukuran dan kesesuaian had masih perlu disemak.',
    'Below the displayed limit. This numerical comparison is not an import clearance decision.':
      'Di bawah had yang dipaparkan. Perbandingan angka ini bukan keputusan pelepasan import.',
    'Source numbering discrepancy: the continuation heading is printed Table 227, but these rows are within section 4.226 (emamectin benzoate). Check the original section and page.':
      'Percanggahan penomboran sumber: tajuk sambungan dicetak sebagai Jadual 227, tetapi baris ini berada dalam bahagian 4.226 (emamektin benzoat). Semak bahagian dan halaman asal.',
    'Source heading printed as 糖类; read as the sugar-crop category 糖料 (Annex A). Check the original page.':
      'Tajuk sumber dicetak sebagai 糖类; dibaca sebagai kategori tanaman gula 糖料 (Lampiran A). Semak halaman asal.',

    // CSV export and limit sheet
    Yes: 'Ya',
    No: 'Tidak',
    Direct: 'Disebut terus',
    'Original source row': 'Baris sumber asal',
    'Conflicting matches; review required': 'Padanan bercanggah; perlu disemak',
    'Confirm applicability, current rules and market access separately':
      'Sahkan kesesuaian had, peraturan semasa dan akses pasaran secara berasingan',
    'Limit sheet': 'Senarai had',
    Print: 'Cetak',
    Close: 'Tutup',
    'If printing is not available here, open this site in your browser to print, or take a screenshot.':
      'Jika cetakan tidak tersedia di sini, buka laman ini dalam pelayar anda untuk mencetak, atau ambil tangkapan skrin.',
    'Pesticide residue limits for China · {standard} · effective {date}':
      'Had residu racun perosak untuk China · {standard} · berkuat kuasa {date}',
    'Part to be tested: {part}': 'Bahagian yang diuji: {part}',
    'Pesticide · testing method': 'Racun perosak · kaedah ujian',
    'Limit mg/kg': 'Had mg/kg',
    '{shown} of {total} limits in this view.': '{shown} daripada {total} had dalam paparan ini.',
    '* Provisional limit. Reference only: check the Chinese standard, the residue definition and market access before shipment. Data reviewed {date}.':
      '* Had sementara. Untuk rujukan sahaja: semak piawaian bahasa Cina, definisi residu dan akses pasaran sebelum penghantaran. Data disemak pada {date}.',

    // Exemptions
    'ANNEX B · ALL 44 ENTRIES': 'LAMPIRAN B · KESEMUA 44 ENTRI',
    'Pesticides exempt from setting an MRL': 'Racun perosak yang dikecualikan daripada penetapan MRL',
    'These entries are listed in Annex B. An exemption from setting a food MRL is not pesticide-use approval, a market-access authorization, or a zero-residue requirement.':
      'Entri ini disenaraikan dalam Lampiran B. Pengecualian daripada penetapan MRL makanan bukan kelulusan penggunaan racun perosak, bukan kebenaran akses pasaran, dan bukan keperluan residu sifar.',
    'Search the English or Chinese pesticide name': 'Cari nama racun perosak dalam bahasa Inggeris atau Cina',
    'Read Annex B in the source ↗': 'Baca Lampiran B dalam sumber ↗',
    'Annex B ↗': 'Lampiran B ↗',
    'No matching Annex B entry. This does not establish an exemption.':
      'Tiada entri Lampiran B yang sepadan. Ini tidak bermakna ada pengecualian.',

    // Banned list
    'USE BANNED IN CHINA': 'PENGGUNAAN DIHARAMKAN DI CHINA',
    'Pesticides China bans for use': 'Racun perosak yang diharamkan penggunaannya di China',
    "China's agriculture ministry bans these 60 pesticides from sale and use in China. If your crop is going to China, the safest course is not to use them. Most have very low limits in the residue standard, and some have no limit at all.":
      'Kementerian pertanian China mengharamkan penjualan dan penggunaan 60 racun perosak ini di China. Jika hasil anda akan dieksport ke China, langkah paling selamat ialah tidak menggunakannya. Kebanyakannya mempunyai had yang sangat rendah dalam piawaian residu, dan sesetengahnya tiada had langsung.',
    "This is a rule on use inside China, not an import requirement in itself. Imports are checked against the residue limits in GB 2763. Follow your own country's pesticide rules as well.":
      'Ini peraturan penggunaan di dalam China, bukan keperluan import dengan sendirinya. Import disemak berdasarkan had residu dalam GB 2763. Patuhi juga peraturan racun perosak negara anda sendiri.',
    'Search a banned or restricted pesticide': 'Cari racun perosak yang diharamkan atau dihadkan',
    'Banned outright': 'Diharamkan sepenuhnya',
    'Banned outright · {n} pesticides': 'Diharamkan sepenuhnya · {n} racun perosak',
    'Banned on certain crops': 'Diharamkan pada tanaman tertentu',
    "These remain legal in China for some uses but are banned on the crops shown. Taken from the ministry's 2019 list, less the entries since banned outright; it may have changed.":
      'Racun perosak ini masih sah di China untuk sesetengah kegunaan tetapi diharamkan pada tanaman yang dinyatakan. Diambil daripada senarai kementerian tahun 2019, tanpa entri yang kemudiannya diharamkan sepenuhnya; senarai ini mungkin telah berubah.',
    'Banned for use in China': 'Diharamkan penggunaannya di China',
    'Banned for use in China on: {scope}': 'Diharamkan di China pada: {scope}',
    'Banned on: {scope}': 'Diharamkan pada: {scope}',
    '{n} limits in the standard': '{n} had dalam piawaian',
    'No limit in the standard': 'Tiada had dalam piawaian',
    'No match in this list. A pesticide that is not listed here is not thereby permitted.':
      'Tiada padanan dalam senarai ini. Racun perosak yang tidak disenaraikan di sini bukan bermakna dibenarkan.',
    'Banned list': 'Senarai yang diharamkan',
    'Crop-specific bans': 'Larangan mengikut tanaman',
    'Checked {date}. Names in English are aids; the Chinese names control. Confirm against the ministry’s current notices before relying on this list.':
      'Disemak pada {date}. Nama bahasa Cina yang muktamad. Sahkan dengan notis semasa kementerian sebelum bergantung pada senarai ini.',

    // Sources
    'PROVENANCE & COMPLETENESS': 'ASAL-USUL & KELENGKAPAN',
    'The entire standard, with a visible audit trail.': 'Seluruh piawaian, dengan jejak audit yang jelas.',
    '10,749 numeric rows · 568 sections · 44 exemptions':
      '10,749 baris berangka · 568 bahagian · 44 pengecualian',
    'All numeric tables in the source PDF are indexed, across 22 food categories. Some sections combine multiple pesticide names; the published standard describes 585 pesticides. Annex A provides the food classifications and sampling portions. Annex B contains 44 exemptions.':
      'Semua jadual berangka dalam PDF sumber telah diindeks, merentas 22 kategori makanan. Sesetengah bahagian menggabungkan beberapa nama racun perosak; piawaian yang diterbitkan merangkumi 585 racun perosak. Lampiran A menyediakan pengelasan makanan dan bahagian sampel. Lampiran B mengandungi 44 pengecualian.',
    'English labels help navigation. The Chinese source text controls. Some full-standard food entries and technical residue definitions remain in Chinese to preserve their exact meaning.':
      'Teks sumber bahasa Cina yang muktamad. Nama dan terjemahan dalam bahasa lain hanyalah bantuan rujukan. Sesetengah entri makanan dan definisi residu teknikal dikekalkan dalam bahasa Cina atau Inggeris untuk mengekalkan maksud tepatnya.',
    'CHINESE ISSUING AUTHORITY': 'PIHAK BERKUASA CHINA YANG MENGELUARKAN',
    'National announcement · GB 2763-2026': 'Pengumuman kebangsaan · GB 2763-2026',
    'Published 12 February 2026 and effective 1 March 2026. Replaces GB 2763-2021 and GB 2763.1-2022.':
      'Diterbitkan pada 12 Februari 2026 dan berkuat kuasa 1 Mac 2026. Menggantikan GB 2763-2021 dan GB 2763.1-2022.',
    'Read the MARA announcement ↗': 'Baca pengumuman kementerian pertanian China (MARA) ↗',
    'GOVERNMENT-HOSTED SOURCE DOCUMENT': 'DOKUMEN SUMBER DI LAMAN KERAJAAN',
    'Complete Chinese standard · 442 PDF pages': 'Piawaian penuh bahasa Cina · 442 halaman PDF',
    'The indexed document is the GB 2763-2026 attachment hosted by USDA FAS with report CH2026-0049. Its extracted text matches the earlier reference copy on all 442 pages. The extraction reconciles to the published 10,749-row total. This is traceable data extraction, not government certification of this app. Source numbering anomalies are retained in the PDF; affected entries on PDF page 185 carry a note explaining the section 4.226 / continuation-heading discrepancy.':
      'Dokumen yang diindeks ialah lampiran GB 2763-2026 yang dihoskan oleh USDA FAS bersama laporan CH2026-0049. Teks yang diekstrak sepadan dengan salinan rujukan terdahulu pada kesemua 442 halaman. Hasil pengekstrakan sepadan dengan jumlah 10,749 baris yang diterbitkan. Ini pengekstrakan data yang boleh dijejak, bukan pengesahan kerajaan terhadap aplikasi ini. Kejanggalan penomboran sumber dikekalkan dalam PDF; entri yang terjejas pada halaman PDF 185 disertakan nota yang menerangkan percanggahan antara bahagian 4.226 dan tajuk sambungan.',
    'Open the full standard ↗': 'Buka piawaian penuh ↗',
    'Download PDF': 'Muat turun PDF',
    'Original USDA-hosted attachment ↗': 'Lampiran asal di laman USDA ↗',
    'Annex A · food groups and sampling portions': 'Lampiran A · kumpulan makanan dan bahagian sampel',
    'The fresh-produce lookup maps 184 named commodities to Annex A and applies explicit group exclusions. The Entire standard search also recognizes 109 Annex A commodities in dried fruit and vegetables, nuts, sugar crops, beverages (tea, coffee, cocoa, hops, flowers, juices), edible fungi, spices and medicinal plants. Grains, oilseeds, oils and animal products are searched as source text only. A more specific commodity entry takes precedence in the lookup. Any unresolved conflicting matches are flagged for review. Group-based results retain the original food-group wording.':
      'Carian hasil segar memadankan 184 komoditi dengan Lampiran A dan mengambil kira pengecualian kumpulan yang dinyatakan. Carian Piawaian penuh juga mengenali 109 komoditi Lampiran A dalam buah dan sayur kering, kekacang, tanaman gula, minuman (teh, kopi, koko, hop, bunga, jus), kulat boleh dimakan, rempah dan tumbuhan ubatan. Bijirin, biji minyak, minyak dan produk haiwan hanya dicari sebagai teks sumber. Entri komoditi yang lebih khusus diutamakan. Padanan bercanggah yang tidak dapat diselesaikan ditandakan untuk semakan. Hasil melalui kumpulan mengekalkan perkataan asal kumpulan makanan.',
    'Read Annex A ↗': 'Baca Lampiran A ↗',
    'Read the extracted Chinese Annex A text': 'Baca teks Lampiran A bahasa Cina yang diekstrak',
    'Update status and boundaries': 'Status kemas kini dan batasan',
    'Data reviewed: 9 Nov 2026. Regulatory sources are not monitored automatically. Before shipment, check subsequent official amendments, the current standard and the applicable country–commodity access protocol. Fresh-crop lookup does not translate fresh limits into frozen, dried or processed-product limits.':
      'Data disemak: 9 Nov 2026. Sumber kawal selia tidak dipantau secara automatik. Sebelum penghantaran, semak pindaan rasmi terkemudian, piawaian semasa dan protokol akses negara–komoditi yang terpakai. Had hasil segar tidak boleh digunakan terus untuk produk sejuk beku, kering atau diproses.',
    'The full-standard explorer preserves all source rows. Crop-group mappings and English navigation labels are app interpretations, not an official translation. Laboratory comparison is arithmetic only; it does not certify a shipment.':
      'Paparan piawaian penuh mengekalkan semua baris sumber. Padanan tanaman dengan kumpulan dan nama dalam bahasa lain ialah tafsiran aplikasi, bukan terjemahan rasmi. Perbandingan keputusan makmal hanyalah perbandingan angka; ia tidak mengesahkan sesuatu penghantaran.',

    // Guide
    'FOR EXPORTERS FROM ANY COUNTRY': 'UNTUK PENGEKSPORT DARI MANA-MANA NEGARA',
    'Two gates before a shipment reaches China.': 'Dua syarat sebelum penghantaran sampai ke China.',
    '01 · MARKET ACCESS': '01 · AKSES PASARAN',
    'Can this product enter from this origin?': 'Bolehkah produk ini masuk dari negara asal ini?',
    'Check the current country–commodity protocol, approved origins, orchard and packing-facility registration where required, phytosanitary certification, treatments, and entry conditions. The market-access checker contains selected documented protocols; it is not a complete worldwide access matrix.':
      'Semak protokol negara–komoditi semasa, negara asal yang diluluskan, pendaftaran kebun dan pusat pembungkusan jika diperlukan, sijil fitosanitasi, rawatan dan syarat kemasukan. Semakan akses pasaran dalam aplikasi ini mengandungi protokol terpilih yang direkodkan; ia bukan senarai akses lengkap seluruh dunia.',
    'General Administration of Customs of China ↗': 'Pentadbiran Am Kastam China (GACC) ↗',
    '02 · RESIDUE REQUIREMENTS': '02 · KEPERLUAN RESIDU',
    'Does the shipment meet the applicable limits?': 'Adakah penghantaran mematuhi had yang terpakai?',
    'Match the commodity, the residue definition, the sampling portion and the current limit. Have the laboratory assess analytes, metabolite sums, reporting limits and measurement uncertainty.':
      'Padankan komoditi, definisi residu, bahagian sampel dan had semasa. Minta makmal menilai analit, jumlah metabolit, had pelaporan dan ketidakpastian pengukuran.',
    'How to read a result': 'Cara membaca keputusan',
    'Direct entry:': 'Entri disebut terus:',
    'the table names the commodity.': 'jadual menamakan komoditi itu.',
    'Group entry:': 'Entri kumpulan:',
    'the table names a food group that includes the selected commodity, after exclusions. The details show the original Chinese wording and Annex A reference.':
      'jadual menamakan kumpulan makanan yang merangkumi komoditi dipilih, selepas pengecualian. Butiran memaparkan perkataan asal bahasa Cina dan rujukan Lampiran A.',
    'Provisional (*):': 'Sementara (*):',
    'a provisional limit, not an LOQ marker.': 'had sementara, bukan penanda LOQ.',
    'EMRL:': 'EMRL:',
    'an extraneous maximum residue limit, generally addressing environmental residues. Neither permits use of a prohibited pesticide.':
      'had maksimum residu luaran, biasanya bagi residu daripada persekitaran. Kedua-duanya tidak membenarkan penggunaan racun perosak yang dilarang.',
    'Missing limits and non-detects': 'Had yang tiada dan keputusan tidak dikesan',
    'No numeric match does not mean zero, unrestricted use, or a default 0.01 mg/kg. Check the entire standard and Annex B, and resolve applicability with your importer or competent authority. A non-detect must be interpreted with its laboratory reporting limit.':
      'Ketiadaan padanan berangka bukan bermakna sifar, penggunaan tanpa had, atau nilai lalai 0.01 mg/kg. Semak piawaian penuh dan Lampiran B, dan tentukan had yang terpakai bersama pengimport atau pihak berkuasa anda. Keputusan tidak dikesan mesti ditafsir bersama had pelaporan makmalnya.',
    'Fresh does not mean processed': 'Segar bukan bermakna diproses',
    'Frozen fruit, purées, juices and dried produce need the appropriate food classification and rules. Do not automatically apply a fresh-fruit lookup to another product form. Use the entire-standard view to inspect other source entries.':
      'Buah sejuk beku, puri, jus dan hasil kering memerlukan pengelasan makanan dan peraturan yang sesuai. Jangan gunakan carian buah segar secara automatik untuk bentuk produk lain. Gunakan paparan piawaian penuh untuk menyemak entri sumber lain.',

    // Market access
    'Check origin and commodity': 'Semak negara asal dan komoditi',
    'Destination: mainland China. Select the country where the crop was grown, not the shipping or transit country.':
      'Destinasi: tanah besar China. Pilih negara tempat tanaman ditanam, bukan negara penghantaran atau transit.',
    'Country / territory of origin': 'Negara / wilayah asal',
    Commodity: 'Komoditi',
    'Product form': 'Bentuk produk',
    Fresh: 'Segar',
    Frozen: 'Sejuk beku',
    Dried: 'Kering',
    'Other processed': 'Diproses (lain-lain)',
    fresh: 'segar',
    frozen: 'sejuk beku',
    dried: 'kering',
    processed: 'diproses',
    'Loading protocol coverage…': 'Memuatkan liputan protokol…',
    'Fresh produce by origin': 'Hasil segar mengikut negara asal',
    'Access evidence': 'Bukti akses',
    'Crops with a record': 'Tanaman yang ada rekod',
    'All crops': 'Semua tanaman',
    'Documented access · conditions apply': 'Akses direkodkan · tertakluk kepada syarat',
    'Approved market access · conditions apply': 'Akses pasaran diluluskan · tertakluk kepada syarat',
    'Restrictions documented': 'Sekatan direkodkan',
    'Restriction documented': 'Sekatan direkodkan',
    'Not verified': 'Belum disahkan',
    'Produce type': 'Jenis hasil',
    'Fruit & vegetables': 'Buah & sayur',
    Fruit: 'Buah',
    Vegetables: 'Sayur',
    'Find a crop': 'Cari tanaman',
    'English or Chinese name': 'Nama tanaman',
    'Documented access is conditional evidence, not shipment clearance. “Not verified” means this app has no reviewed matching record; it does not mean prohibited.':
      'Akses yang direkodkan ialah bukti bersyarat, bukan pelepasan penghantaran. “Belum disahkan” bermakna aplikasi ini tiada rekod sepadan yang telah disemak; ia bukan bermakna dilarang.',
    'Global · select an origin': 'Global · pilih negara asal',
    Global: 'Global',
    'Coverage: {records} documented combinations across {origins} origins. All {crops} crops can be checked; other combinations return “Not verified”.':
      'Liputan: {records} gabungan yang direkodkan merentas {origins} negara asal. Kesemua {crops} tanaman boleh disemak; gabungan lain memaparkan “Belum disahkan”.',
    'Official protocols and export-guide entries, plus fresh fruit from GACC’s permitted list as given in a trade-press translation; not a complete or live access register. Fresh vegetables are barely covered.':
      'Protokol rasmi dan entri panduan eksport, serta buah segar daripada senarai kebenaran GACC seperti dalam terjemahan sebuah media perdagangan; bukan daftar akses yang lengkap atau terkini. Sayur segar hampir tiada liputan.',
    '{country} → China · {form} produce': '{country} → China · hasil {form}',
    '{country} → CHINA · {form}': '{country} → CHINA · {form}',
    '{documented} documented · {restricted} restrictions documented · {unverified} not verified. Partial evidence coverage; zero recorded restrictions does not establish their absence.':
      '{documented} direkodkan · {restricted} sekatan direkodkan · {unverified} belum disahkan. Liputan bukti tidak lengkap; tiada sekatan direkodkan bukan bermakna tiada sekatan.',
    '{n} crops shown': '{n} tanaman dipaparkan',
    '{evidence} · reviewed {date}': '{evidence} · disemak {date}',
    'Official guide': 'Panduan rasmi',
    'Official list': 'Senarai rasmi',
    Protocol: 'Protokol',
    'GACC list via translation': 'Senarai GACC (melalui terjemahan)',
    'Review status': 'Lihat status',
    'Conditions & sources': 'Syarat & sumber',
    'MRL limits': 'Had MRL',
    'No crops match this view. Try “All crops” or another produce type. An empty list is not a prohibition or permission.':
      'Tiada tanaman sepadan dengan paparan ini. Cuba “Semua tanaman” atau jenis hasil lain. Senarai kosong bukan bermakna dilarang atau dibenarkan.',
    'Select an origin to check market access': 'Pilih negara asal untuk menyemak akses pasaran',
    'Global is an overview without a selected country. China’s MRL reference remains available for all origins. Market-access permission must be checked for a specific country, commodity and product form.':
      'Global ialah gambaran umum tanpa negara dipilih. Rujukan MRL China tetap tersedia untuk semua negara asal. Kebenaran akses pasaran mesti disemak bagi negara, komoditi dan bentuk produk yang khusus.',
    'No reviewed record for this exact combination is included here. This does not mean prohibited or permitted. Confirm with the authorities linked below before shipment.':
      'Tiada rekod yang telah disemak bagi gabungan ini. Ini bukan bermakna dilarang atau dibenarkan. Sahkan dengan pihak berkuasa dalam pautan di bawah sebelum penghantaran.',
    'Access listed in official guide · conditions apply':
      'Akses disenaraikan dalam panduan rasmi · tertakluk kepada syarat',
    'Listed in an official access list · conditions apply':
      'Disenaraikan dalam senarai akses rasmi · tertakluk kepada syarat',
    'On GACC’s permitted list, per a translation · conditions apply':
      'Dalam senarai kebenaran GACC, menurut terjemahan · tertakluk kepada syarat',
    'Protocol documented · conditions apply': 'Protokol direkodkan · tertakluk kepada syarat',
    'Shipment checks:': 'Semakan sebelum penghantaran:',
    'Confirm the required facility registrations, certificates, treatments and route before dispatch. This app does not assess or clear an individual shipment.':
      'Sahkan pendaftaran premis, sijil, rawatan dan laluan yang diperlukan sebelum menghantar. Aplikasi ini tidak menilai atau meluluskan mana-mana penghantaran.',
    'Guide edition': 'Edisi panduan',
    'List edition': 'Edisi senarai',
    'Translation updated': 'Terjemahan dikemas kini',
    Announcement: 'Pengumuman',
    'Document reviewed': 'Dokumen disemak',
    'Review due (over 90 days)': 'Perlu disemak semula (melebihi 90 hari)',
    'Review due (review date unreadable)': 'Perlu disemak semula (tarikh semakan tidak dapat dibaca)',
    'Key source conditions (summary)': 'Syarat utama daripada sumber (ringkasan)',
    'GACC announcement, MOFCOM republication': 'Pengumuman GACC, diterbitkan semula oleh MOFCOM',
    'View {crop} residue limits ↗': 'Lihat had residu {crop} ↗',
    'Fresh-product MRLs are not automatically applicable to this form.':
      'MRL produk segar tidak terpakai secara automatik pada bentuk ini.',
    'Protocol coverage unavailable.': 'Liputan protokol tidak tersedia.',
    'The market-access data could not load. Reload to retry. No access conclusion can be drawn; use the official authorities below.':
      'Data akses pasaran gagal dimuatkan. Muat semula untuk mencuba lagi. Tiada kesimpulan akses boleh dibuat; rujuk pihak berkuasa rasmi di bawah.',
    'Before arranging a shipment': 'Sebelum mengatur penghantaran',
    'Confirm current country–commodity access and any suspension with GACC and the exporting country’s plant-health authority.':
      'Sahkan akses negara–komoditi semasa dan sebarang penggantungan dengan GACC dan pihak berkuasa kesihatan tumbuhan negara pengeksport.',
    'Verify the orchard, packing house and any treatment facility are on the applicable current registers.':
      'Pastikan kebun, pusat pembungkusan dan mana-mana kemudahan rawatan berada dalam daftar semasa yang berkenaan.',
    'Check the full protocol, permits, phytosanitary certificate, treatment, packaging and entry-port requirements.':
      'Semak protokol penuh, permit, sijil fitosanitasi, rawatan, pembungkusan dan keperluan pelabuhan masuk.',
    'Assess residue limits separately for the exact product and residue definition.':
      'Nilai had residu secara berasingan bagi produk dan definisi residu yang tepat.',
    'GACC official website ↗': 'Laman rasmi GACC ↗',
    'Find the origin’s plant-health authority (IPPC) ↗':
      'Cari pihak berkuasa kesihatan tumbuhan negara asal (IPPC) ↗',
    'Document summaries are navigation aids. The official Chinese text controls. This checker does not confirm operational clearance, current facility registration or absence of later suspensions.':
      'Ringkasan dokumen hanyalah bantuan rujukan. Teks rasmi bahasa Cina yang muktamad. Semakan ini tidak mengesahkan pelepasan sebenar, pendaftaran premis semasa atau ketiadaan penggantungan terkemudian.',

    // Offline / install
    'Preparing offline reference…': 'Menyediakan rujukan luar talian…',
    'Install app': 'Pasang aplikasi',
    'Install on your device': 'Pasang pada peranti anda',
    'Use your browser’s Install app option. On iPhone or iPad, open in Safari, tap Share, then Add to Home Screen. Open online once and wait for “Offline reference ready” before using offline. Browser storage may be cleared by your device.':
      'Gunakan pilihan Pasang aplikasi dalam pelayar anda. Pada iPhone atau iPad, buka dalam Safari, ketik Kongsi, kemudian Tambah ke Skrin Utama. Buka dalam talian sekali dan tunggu “Rujukan luar talian sedia” sebelum menggunakannya di luar talian. Storan pelayar mungkin dikosongkan oleh peranti anda.',
    'Reference snapshot · updates automatically when online':
      'Salinan rujukan · dikemas kini secara automatik apabila dalam talian',
    'Offline · using downloaded reference data. Verify current requirements before shipment.':
      'Luar talian · menggunakan data rujukan yang dimuat turun. Sahkan keperluan semasa sebelum penghantaran.',
    'Offline storage is not supported in this browser.':
      'Storan luar talian tidak disokong dalam pelayar ini.',
    'Offline reference ready · app updates install automatically.':
      'Rujukan luar talian sedia · kemas kini aplikasi dipasang secara automatik.',
    'Offline storage unavailable. You can continue online; reload to retry.':
      'Storan luar talian tidak tersedia. Anda boleh terus menggunakan dalam talian; muat semula untuk mencuba lagi.',
    'Choose your language': 'Pilih bahasa anda',
    'You can change it later with this button at the top right:':
      'Anda boleh menukarnya kemudian dengan butang ini di penjuru kanan atas:',
    'Pesticide residue limits for fresh produce exported to China.':
      'Had sisa racun perosak bagi hasil segar yang dieksport ke China.',
    Continue: 'Teruskan'
  };
  if (typeof module !== 'undefined') module.exports = MS;
  else root.I18N_MS = MS;
})(typeof window !== 'undefined' ? window : globalThis);
