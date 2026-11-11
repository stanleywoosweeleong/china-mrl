/* Simplified Chinese interface text, keyed by the English wording used in index.html and the scripts.
   Standard terms follow GB 2763 (最大残留限量, 再残留限量, 临时限量, 残留物, 测定部位, 豁免). */
(function (root) {
  const ZH = {
    'China MRL': '中国农残限量',
    // Page head
    'China MRL — GB 2763-2026 Explorer': '中国农药残留限量查询 — GB 2763-2026',
    'Explore all 10,749 GB 2763-2026 residue limits, with a fresh fruit and vegetable view for exporters worldwide.':
      '查询 GB 2763-2026 全部 10,749 项农药残留限量，并为各国出口商提供新鲜水果、蔬菜专用查询。',

    // Sidebar and header
    'GLOBAL EXPORT REFERENCE': '全球出口参考',
    '{country} EXPORT REFERENCE': '{country}出口参考',
    'REFERENCE WORKSPACE': '查询功能',
    'Fresh produce': '新鲜果蔬',
    'Entire standard': '完整标准',
    'Saved references': '已保存条目',
    'Exempt pesticides': '豁免农药',
    'Sources & coverage': '来源与范围',
    'Market access': '市场准入',
    'Export essentials': '出口须知',
    'All origins → Mainland China': '所有产地 → 中国大陆',
    '{origin} → Mainland China': '{origin} → 中国大陆',
    'All origins': '所有产地',
    'Effective 1 March 2026': '2026年3月1日起实施',
    'Open complete standard ↗': '打开标准全文 ↗',
    Origin: '产地',
    Malaysia: '马来西亚',
    'China destination': '目的地：中国',
    'ONE STANDARD. A GLOBAL REFERENCE.': '同一标准 · 全球参考',
    'ONE STANDARD. EXPORTING FROM {country}.': '同一标准 · 从{country}出口',
    CHINA: 'CHINA',
    'All origins. Source-linked limits. Clear scope.': '所有产地。限量均附原文出处，适用范围清楚。',
    '{origin}. Source-linked limits. Clear scope.': '{origin}。限量均附原文出处，适用范围清楚。',

    // Tab titles
    'Know the limit. See the source.': '查清限量，核对原文。',
    'China’s pesticide residue standard, made easier to explore for fresh produce exporters.':
      '让新鲜果蔬出口商更容易查阅中国农药残留限量标准。',
    'The entire standard, within reach.': '完整标准，随手可查。',
    'All indexed MRL entries in GB 2763-2026, across all food categories.':
      'GB 2763-2026 全部食品类别的限量条目。',
    'Your reference shortlist.': '您保存的条目。',
    'Saved on this browser, with the original food scope and crop context.':
      '保存在本浏览器中，保留原始食品范围和所选作物。',
    'Know when an exemption applies.': '了解哪些农药豁免制定限量。',
    'All 44 entries from Annex B, with links to the original text.': '附录 B 全部 44 项，附原文链接。',
    'Every number has a source.': '每个数字都有出处。',
    'Coverage, interpretation rules and the original government-hosted document.':
      '数据范围、判读规则，以及政府网站上的标准原文。',
    'Understand both export gates.': '了解出口的两道关。',
    'A residue limit and permission to import are two separate requirements.':
      '符合残留限量与获准进口，是两项独立的要求。',
    'Check the other export gate.': '检查另一道关：市场准入。',
    'Country, commodity and product form determine which import protocol applies.':
      '产地国家、产品种类和产品形态，决定适用哪一份进口议定书。',

    // Explorer
    'STANDARD LIMIT ROWS': '标准限量条目',
    'All food categories, including MRLs & EMRLs': '全部食品类别，含最大残留限量和再残留限量',
    'FRESH PRODUCE ROWS': '新鲜果蔬条目',
    'Original fruit & vegetable source entries': '标准原文中的水果、蔬菜条目',
    'MAPPED FRESH CROPS': '可查询的新鲜作物',
    'Commodity & food-group lookup': '按作物名称和食品类别查询',
    'Find the limits for your crop': '查询您的作物适用的限量',
    'Search crops or all 10,749 source entries': '搜索作物，或搜索全部 10,749 项原文条目',
    'Your saved source references': '您保存的原文条目',
    'English & Chinese names': '支持中文和英文名称',
    'Fresh commodity': '新鲜作物',
    'All original fresh-produce entries': '全部新鲜果蔬原文条目',
    'Food category': '食品类别',
    'All food categories': '全部食品类别',
    'Search mode': '搜索方式',
    'Applicable crop limits': '作物适用的限量',
    'Exact source text': '仅搜索原文文字',
    'Pesticide / residue definition': '农药 / 残留物',
    'All pesticides': '全部农药',
    'Limit type': '限量类型',
    'All limits': '全部限量',
    'EMRL (environmental residues)': '再残留限量 EMRL（环境残留）',
    'Provisional limits *': '临时限量 *',
    'Search a pesticide, Chinese food entry or English crop name…': '搜索农药名称、食品名称或作物名称…',
    'QUICK LOOKUP': '快速查询',
    Durian: '榴莲',
    Jackfruit: '菠萝蜜',
    'Dragon fruit': '火龙果',
    Pineapple: '菠萝',
    Tomato: '番茄',
    Okra: '黄秋葵',
    'Reset filters ↺': '重置筛选 ↺',
    'Residue requirements and market access are separate.': '残留限量要求与市场准入是两回事。',
    'These limits do not establish import permission for a country of origin. Match the exact food, residue definition and sampling portion. A missing numeric entry is not a zero limit or an automatic exemption.':
      '这些限量并不表示某个产地已获准进口。请核对确切的食品名称、残留物定义和测定部位。查不到限量数值，不等于限量为零，也不等于自动豁免。',
    'matching limits': '项适用限量',
    'applicable entries': '项适用条目',
    'source row': '项原文条目',
    'source rows': '项原文条目',
    'saved references': '项已保存条目',
    'Print page': '打印本页',
    '↓ Export CSV': '↓ 导出 CSV',
    'COMMODITY / SCOPE': '食品 / 适用范围',
    PESTICIDE: '农药',
    LIMIT: '限量',
    BASIS: '依据',
    Actions: '操作',
    'No matching numeric limit found': '没有找到对应的限量数值',
    'Check your filters, the entire standard and Annex B. The app does not assign a default value when a limit is absent.':
      '请检查筛选条件，并查看完整标准和附录 B。查不到限量时，本应用不会套用任何默认值。',
    '* Provisional limit (临时限量), not an analytical detection limit. EMRL means an extraneous residue limit for environmental residues. Neither indicates permission to use the pesticide.':
      '* 表示临时限量，不是检测方法的定量限。EMRL 即再残留限量，针对来自环境的残留。两者都不表示允许使用该农药。',
    'Previous page': '上一页',
    'Next page': '下一页',
    'Showing {from}–{to} of {total}': '第 {from}–{to} 项，共 {total} 项',
    '0 matching numeric records': '没有符合条件的限量条目',
    'Via group: ': '按类别适用：',
    'Direct: ': '直接列名：',
    'Conflicting matches · review': '匹配结果有冲突 · 需核对',
    'Source numbering note': '原文编号说明',
    'Group rule': '按类别',
    'Table {table} · p. {page}': '表 {table} · 第 {page} 页',
    Save: '保存',
    Unsave: '取消保存',
    'Details ↗': '详情 ↗',
    'Saved with source and crop context': '已保存，并保留出处和所选作物',
    'Reference removed': '已取消保存',
    'Browser storage unavailable; saved for this session only': '浏览器无法存储数据，仅在本次使用期间保存',
    'Exported {n} rows with sources': '已导出 {n} 项，含原文出处',
    'The reference database could not load. Please reload the page; no regulatory conclusion can be drawn from this error.':
      '数据库未能载入，请刷新页面。不能根据这个错误得出任何合规结论。',

    // Entire-standard search note
    '{name}: {n} applicable entries after filters — {direct} direct + {group} group-based. Group entries follow Annex A and explicit exclusions; original food scopes are shown below.':
      '{name}：筛选后共 {n} 项适用条目，其中直接列名 {direct} 项，按食品类别适用 {group} 项。类别条目依据附录 A 及原文注明的“除外”项目判定；下方显示原文的食品范围。',
    'Fresh produce only; processed forms need separate classification.':
      '仅适用于新鲜产品；加工产品须另行归类。',
    'Annex A category: {category}. Other product forms need separate classification.':
      '附录 A 类别：{category}。其他产品形态须另行归类。',
    'Review: 1 source row names a food Annex A does not define ({foods}); not applied.':
      '请核对：有 1 项原文条目使用了附录 A 未定义的食品名称（{foods}），本应用未予套用。',
    'Review: {n} source rows name a food Annex A does not define ({foods}); not applied.':
      '请核对：有 {n} 项原文条目使用了附录 A 未定义的食品名称（{foods}），本应用未予套用。',
    'Several crops match “{query}”. Choose one to include its food-group limits:':
      '有多种作物符合“{query}”。请选择一种，以包含其所属食品类别的限量：',
    'Meanwhile, results below search the original source text.': '下方结果暂时只按原文文字搜索。',
    'Exact source text: searches original food and pesticide wording only. Food-group limits may apply even when the crop name does not appear in a row.':
      '仅搜索原文文字：只匹配标准原文中的食品名称和农药名称。即使某一行没有出现作物名称，食品类别的限量仍可能适用。',
    'Enter an English or Chinese crop name (plurals and partial names work) to include applicable food-group limits. Other queries search the original source text across all food categories.':
      '输入中文或英文作物名称（可只输入名称的一部分），即可包含该作物所属食品类别的限量。其他关键词将在全部食品类别的原文中搜索。',

    // Crop card
    'SELECTED CROP · FRESH FRUIT': '所选作物 · 新鲜水果',
    'SELECTED CROP · FRESH VEGETABLE': '所选作物 · 新鲜蔬菜',
    '{direct} direct entries · {group} group-based entries': '直接列名 {direct} 项 · 按类别适用 {group} 项',
    'Selected origin: {status}. MRLs alone do not establish permission.':
      '所选产地：{status}。仅符合残留限量并不表示获准进口。',
    'approved market access · conditions apply': '已获市场准入 · 须符合相关条件',
    'access documented · conditions apply': '有准入文件记录 · 须符合相关条件',
    'restriction documented': '有限制措施记录',
    'market access not verified': '市场准入未经核实',
    'PART TO BE TESTED · ANNEX A': '测定部位 · 附录 A',
    'Read Annex A, PDF p. {n} ↗': '查看附录 A（PDF 第 {n} 页）↗',
    'PDF p. {n}': 'PDF 第 {n} 页',
    'PDF page {n}': 'PDF 第 {n} 页',
    'Review: 1 source row names a food that Annex A does not define, so it is not applied here: {items}. Confirm with the source whether it applies to {crop}.':
      '请核对：有 1 项原文条目使用了附录 A 未定义的食品名称，因此未在此套用：{items}。请对照原文确认它是否适用于{crop}。',
    'Review: {n} source rows name a food that Annex A does not define, so they are not applied here: {items}. Confirm with the source whether they apply to {crop}.':
      '请核对：有 {n} 项原文条目使用了附录 A 未定义的食品名称，因此未在此套用：{items}。请对照原文确认它们是否适用于{crop}。',

    // Detail dialog
    'Close details': '关闭详情',
    'Read the source section.': '请查阅原文相应章节。',
    'English rendering for navigation; the Chinese definition controls.':
      '英文译文仅供参考，以中文定义为准。',
    'Food-group match under Annex A, after explicit exclusions.':
      '依据附录 A 按食品类别适用，并已排除原文注明“除外”的项目。',
    'The source table names this commodity.': '标准表格中直接列出了该食品。',
    'Original source-table row; select a fresh crop to see group applicability.':
      '标准表格中的原文条目；选择一种新鲜作物，可查看按食品类别适用的限量。',
    '* Provisional limit (临时限量). This is not an analytical detection-limit marker.':
      '* 该限量为临时限量，不是检测方法定量限的标记。',
    'More than one equally specific match has a different limit. Resolve applicability against the source before comparison.':
      '有多项同样具体的条目给出了不同的限量。请先对照原文确定适用哪一项，再进行比对。',
    'Original food scope': '原文食品范围',
    'Source category': '原文食品类别',
    Application: '适用方式',
    'Residue definition': '残留物',
    'Effective from': '实施日期',
    'Source location': '原文位置',
    'Table {table} · PDF page {page} · printed page {printed}':
      '表 {table} · PDF 第 {page} 页 · 标准印刷页码 {printed}',
    'Sampling portion': '测定部位',
    'Annex A · PDF p. {n} ↗': '附录 A · PDF 第 {n} 页 ↗',
    'Open the exact source page ↗': '打开原文所在页 ↗',
    'Source testing-method text (Chinese)': '检测方法原文',
    'Chinese source wording controls. Combined residue definitions may include metabolites or multiple active substances.':
      '一律以中文原文为准。合并计算的残留物定义可能包括代谢物或多种有效成分。',
    'Testing method': '检测方法',
    'Testing methods': '检测方法',
    'The standard designates no testing method for this section: all of its limits are provisional (临时限量). Agree the method with your laboratory, for example an applicable GB 23200 multi-residue method.':
      '标准没有为这种农药指定检测方法：其限量均为临时限量。请与检测实验室商定方法，例如适用的 GB 23200 多残留检测方法。',
    'method by reference (参照)': '参照该方法测定',
    'specified method (按照)': '按照该方法测定',
    ' · applies to this entry': ' · 适用于本条目',
    'None designated (provisional limits)': '未指定（临时限量）',
    ' (by reference)': '（参照）',
    'None designated for this food category': '标准未为该类食品指定',
    'The standard designates no testing method for this food category. The methods it gives for other categories are listed below; agree the method with your laboratory.':
      '标准没有为这一类食品指定检测方法。下面列出标准为其他类别指定的方法；请与检测实验室商定方法。',
    'Compare a laboratory result': '比对检测结果',
    'Report type': '报告类型',
    'Quantified result': '定量结果',
    'Non-detect / below reporting limit': '未检出 / 低于报告限',
    'Result in mg/kg (ppm by mass)': '检测结果（mg/kg）',
    'Laboratory reporting limit in mg/kg': '实验室报告限（mg/kg）',
    'e.g. 0.015': '例如 0.015',
    'Enter a result to compare.': '请输入检测结果进行比对。',
    'Arithmetic only. The analyte definition, sample preparation, uncertainty, product form and market access must be assessed separately.':
      '仅作数值比较。检测对象的定义、样品制备、测量不确定度、产品形态和市场准入，均须另行评估。',
    'Comparison blocked until the conflicting source matches are resolved.':
      '匹配结果存在冲突，核对清楚之前无法比对。',
    'No numeric limit is available.': '没有可用的限量数值。',
    'Enter the laboratory reporting limit for a non-detect. A non-detect is not zero.':
      '请输入实验室对“未检出”的报告限。未检出不等于零。',
    'The reporting limit is at or below the displayed MRL. Confirm the method, residue definition and reporting convention with your laboratory.':
      '报告限不高于所显示的限量。请向实验室确认检测方法、残留物定义和报告方式。',
    'The reporting limit exceeds the MRL; this non-detect cannot establish that residues are below the MRL.':
      '报告限高于限量；这一“未检出”结果不能证明残留低于限量。',
    'Enter a valid non-negative quantified result.': '请输入有效的非负数检测结果。',
    'Above the displayed limit by {amount} mg/kg.': '超出所显示的限量 {amount} mg/kg。',
    'Equal to the displayed limit. Measurement uncertainty and applicability still need review.':
      '与所显示的限量相等。仍须考虑测量不确定度和适用性。',
    'Below the displayed limit. This numerical comparison is not an import clearance decision.':
      '低于所显示的限量。这只是数值比较，不代表可以通关。',
    'Source numbering discrepancy: the continuation heading is printed Table 227, but these rows are within section 4.226 (emamectin benzoate). Check the original section and page.':
      '原文编号不一致：续表标题印为“表 227”，但这些条目属于第 4.226 节（甲氨基阿维菌素苯甲酸盐）。请核对原文的章节和页码。',
    'Source heading printed as 糖类; read as the sugar-crop category 糖料 (Annex A). Check the original page.':
      '原文类别标题印为“糖类”，本应用按附录 A 的“糖料”类别处理。请核对原文页面。',

    // CSV export
    Standard: '标准',
    'Effective date': '实施日期',
    'Research snapshot': '数据核对日期',
    'Selected crop': '所选作物',
    'Food scope English (navigation aid)': '食品范围（英文，仅供参考）',
    'Food scope Chinese': '食品范围（中文原文）',
    Category: '食品类别（英文）',
    'Original category scope': '原文食品类别',
    'Pesticide English': '农药英文名称',
    'Pesticide Chinese': '农药中文名称',
    'Residue definition Chinese': '残留物（中文原文）',
    'Residue definition English (navigation aid)': '残留物（英文，仅供参考）',
    'Limit mg/kg': '限量 mg/kg',
    Provisional: '临时限量',
    Qualifier: '限量附注',
    'Testing method (standards)': '检测方法（标准号）',
    'Match basis': '适用方式',
    Table: '表号',
    'PDF page': 'PDF 页码',
    Source: '原文出处',
    'Applicability note': '适用性说明',
    Yes: '是',
    No: '否',
    Direct: '直接列名',
    'Original source row': '原文条目',
    'Conflicting matches; review required': '匹配结果有冲突，需核对',
    'Confirm applicability, current rules and market access separately':
      '请另行确认适用性、现行规定和市场准入',

    // Exemptions
    'ANNEX B · ALL 44 ENTRIES': '附录 B · 全部 44 项',
    'Pesticides exempt from setting an MRL': '豁免制定食品中最大残留限量的农药',
    'These entries are listed in Annex B. An exemption from setting a food MRL is not pesticide-use approval, a market-access authorization, or a zero-residue requirement.':
      '这些农药列于附录 B。豁免制定限量，不等于批准使用该农药，不等于市场准入许可，也不等于要求零残留。',
    'Search the English or Chinese pesticide name': '搜索农药的中文或英文名称',
    'Read Annex B in the source ↗': '查看附录 B 原文 ↗',
    'Annex B ↗': '附录 B ↗',
    'No matching Annex B entry. This does not establish an exemption.':
      '附录 B 中没有符合的条目。这并不表示该农药获得豁免。',

    // Sources
    'PROVENANCE & COMPLETENESS': '数据来源与完整性',
    'The entire standard, with a visible audit trail.': '完整的标准，每一步都可追溯。',
    '10,749 numeric rows · 568 sections · 44 exemptions': '10,749 项限量 · 568 节 · 44 项豁免',
    'All numeric tables in the source PDF are indexed, across 22 food categories. Some sections combine multiple pesticide names; the published standard describes 585 pesticides. Annex A provides the food classifications and sampling portions. Annex B contains 44 exemptions.':
      '标准 PDF 中的全部限量表格均已收录，涵盖 22 个食品类别。部分章节合并了多种农药名称；标准共规定 585 种农药。附录 A 规定食品类别和测定部位，附录 B 列出 44 项豁免。',
    'English labels help navigation. The Chinese source text controls. Some full-standard food entries and technical residue definitions remain in Chinese to preserve their exact meaning.':
      '一律以标准中文原文为准。本应用中的英文名称和译文只是辅助，方便与英文检测报告和文件对照。',
    'CHINESE ISSUING AUTHORITY': '中国发布机关',
    'National announcement · GB 2763-2026': '国家公告 · GB 2763-2026',
    'Published 12 February 2026 and effective 1 March 2026. Replaces GB 2763-2021 and GB 2763.1-2022.':
      '2026年2月12日发布，2026年3月1日起实施，代替 GB 2763-2021 和 GB 2763.1-2022。',
    'Read the MARA announcement ↗': '查看农业农村部公告 ↗',
    'GOVERNMENT-HOSTED SOURCE DOCUMENT': '政府网站上的标准原文',
    'Complete Chinese standard · 442 PDF pages': '标准中文全文 · PDF 共 442 页',
    'The indexed document is the GB 2763-2026 attachment hosted by USDA FAS with report CH2026-0049. Its extracted text matches the earlier reference copy on all 442 pages. The extraction reconciles to the published 10,749-row total. This is traceable data extraction, not government certification of this app. Source numbering anomalies are retained in the PDF; affected entries on PDF page 185 carry a note explaining the section 4.226 / continuation-heading discrepancy.':
      '本应用收录的文件，是美国农业部海外农业局（USDA FAS）随 CH2026-0049 号报告发布的 GB 2763-2026 附件。全部 442 页提取的文字与此前的参考文本一致，提取结果与标准公布的 10,749 项限量总数相符。这是可追溯的数据提取，并不代表政府对本应用的认证。原文中的编号异常保留在 PDF 中；PDF 第 185 页受影响的条目附有说明，解释第 4.226 节与续表标题不一致的情况。',
    'Open the full standard ↗': '打开标准全文 ↗',
    'Download PDF': '下载 PDF',
    'Original USDA-hosted attachment ↗': 'USDA 网站上的原始附件 ↗',
    'Annex A · food groups and sampling portions': '附录 A · 食品类别及测定部位',
    'The fresh-produce lookup maps 184 named commodities to Annex A and applies explicit group exclusions. The Entire standard search also recognizes 109 Annex A commodities in dried fruit and vegetables, nuts, sugar crops, beverages (tea, coffee, cocoa, hops, flowers, juices), edible fungi, spices and medicinal plants. Grains, oilseeds, oils and animal products are searched as source text only. A more specific commodity entry takes precedence in the lookup. Any unresolved conflicting matches are flagged for review. Group-based results retain the original food-group wording.':
      '“新鲜果蔬”查询把 184 种作物对应到附录 A 的食品类别，并排除原文注明“除外”的项目。“完整标准”搜索还能识别附录 A 中另外 109 种食品，包括干制水果和蔬菜、坚果、糖料、饮料类（茶叶、咖啡豆、可可豆、啤酒花、花类、果蔬汁）、食用菌、调味料和药用植物。谷物、油料和油脂、动物源性食品只能按原文文字搜索。查询时，更具体的食品条目优先适用。无法判定的冲突条目会标出，请您核对。按类别适用的结果保留原文的类别名称。',
    'Read Annex A ↗': '查看附录 A ↗',
    'Read the extracted Chinese Annex A text': '查看提取出的附录 A 原文',
    'Update status and boundaries': '更新情况与使用限制',
    'Data reviewed: 9 Nov 2026. Regulatory sources are not monitored automatically. Before shipment, check subsequent official amendments, the current standard and the applicable country–commodity access protocol. Fresh-crop lookup does not translate fresh limits into frozen, dried or processed-product limits.':
      '数据核对日期：2026年11月9日。本应用不会自动监测法规变化。发货前，请查看其后的官方修改单、现行标准，以及适用的国别产品准入议定书。新鲜作物的限量不能直接套用于冷冻、干制或加工产品。',
    'The full-standard explorer preserves all source rows. Crop-group mappings and English navigation labels are app interpretations, not an official translation. Laboratory comparison is arithmetic only; it does not certify a shipment.':
      '“完整标准”保留全部原文条目。作物与食品类别的对应关系以及英文名称，是本应用的整理结果，不是官方解释或译文。检测结果比对只是数值比较，不能证明货物合格。',

    // Guide
    'FOR EXPORTERS FROM ANY COUNTRY': '适用于各国出口商',
    'Two gates before a shipment reaches China.': '货物进入中国之前，要过两道关。',
    '01 · MARKET ACCESS': '01 · 市场准入',
    'Can this product enter from this origin?': '这个产地的这种产品，能不能进入中国？',
    'Check the current country–commodity protocol, approved origins, orchard and packing-facility registration where required, phytosanitary certification, treatments, and entry conditions. The market-access checker contains selected documented protocols; it is not a complete worldwide access matrix.':
      '请查清现行的国别产品议定书、获准的产地、果园和包装厂注册登记（如有要求）、植物检疫证书、检疫处理和入境条件。本应用的“市场准入”只收录了部分有文件依据的议定书，并不是完整的全球准入清单。',
    'General Administration of Customs of China ↗': '中华人民共和国海关总署 ↗',
    '02 · RESIDUE REQUIREMENTS': '02 · 残留限量要求',
    'Does the shipment meet the applicable limits?': '货物是否符合适用的限量？',
    'Match the commodity, the residue definition, the sampling portion and the current limit. Have the laboratory assess analytes, metabolite sums, reporting limits and measurement uncertainty.':
      '请核对食品名称、残留物定义、测定部位和现行限量。请检测实验室评估检测对象、代谢物合并计算、报告限和测量不确定度。',
    'How to read a result': '如何看懂查询结果',
    'Direct entry:': '直接列名：',
    'the table names the commodity.': '标准表格中直接列出了该食品。',
    'Group entry:': '按类别适用：',
    'the table names a food group that includes the selected commodity, after exclusions. The details show the original Chinese wording and Annex A reference.':
      '标准表格列出的是包含所选作物的食品类别，并已排除注明“除外”的项目。详情中显示原文措辞和附录 A 的出处。',
    'Provisional (*):': '临时限量（*）：',
    'a provisional limit, not an LOQ marker.': '表示该限量为临时限量，不是定量限的标记。',
    'EMRL:': '再残留限量（EMRL）：',
    'an extraneous maximum residue limit, generally addressing environmental residues. Neither permits use of a prohibited pesticide.':
      '一般针对来自环境的残留。两者都不表示允许使用已禁用的农药。',
    'Missing limits and non-detects': '查不到限量，以及“未检出”',
    'No numeric match does not mean zero, unrestricted use, or a default 0.01 mg/kg. Check the entire standard and Annex B, and resolve applicability with your importer or competent authority. A non-detect must be interpreted with its laboratory reporting limit.':
      '查不到限量数值，不等于限量为零，不等于可以随意使用，也不等于默认 0.01 mg/kg。请查看完整标准和附录 B，并向进口商或主管部门确认适用性。“未检出”必须结合实验室的报告限来理解。',
    'Fresh does not mean processed': '新鲜产品不等于加工产品',
    'Frozen fruit, purées, juices and dried produce need the appropriate food classification and rules. Do not automatically apply a fresh-fruit lookup to another product form. Use the entire-standard view to inspect other source entries.':
      '冷冻水果、果泥、果汁和干制产品，须按相应的食品类别和规定处理。不要把新鲜水果的查询结果直接套用到其他产品形态。请在“完整标准”中查看其他原文条目。',

    // Market access
    'Check origin and commodity': '按产地和产品查询',
    'Destination: mainland China. Select the country where the crop was grown, not the shipping or transit country.':
      '目的地：中国大陆。请选择作物的种植国家，而不是发货国或转口国。',
    'Country / territory of origin': '产地国家 / 地区',
    Commodity: '产品',
    'Product form': '产品形态',
    Fresh: '新鲜',
    Frozen: '冷冻',
    Dried: '干制',
    'Other processed': '其他加工产品',
    fresh: '新鲜',
    frozen: '冷冻',
    dried: '干制',
    processed: '其他加工',
    'Loading protocol coverage…': '正在载入准入数据…',
    'Fresh produce by origin': '按产地查看新鲜果蔬',
    'Access evidence': '准入依据',
    'All crops': '全部作物',
    'Documented access · conditions apply': '有准入文件记录 · 须符合相关条件',
    'Approved market access · conditions apply': '已获市场准入 · 须符合相关条件',
    'Restrictions documented': '有限制措施记录',
    'Restriction documented': '有限制措施记录',
    'Not verified': '未经核实',
    'Produce type': '产品类别',
    'Fruit & vegetables': '水果和蔬菜',
    Fruit: '水果',
    Vegetables: '蔬菜',
    'Find a crop': '查找作物',
    'English or Chinese name': '中文或英文名称',
    'Documented access is conditional evidence, not shipment clearance. “Not verified” means this app has no reviewed matching record; it does not mean prohibited.':
      '“有准入文件记录”只说明存在附带条件的准入依据，不代表货物可以通关。“未经核实”表示本应用没有经过核对的对应记录，并不表示禁止进口。',
    'Global · select an origin': '全球 · 请选择产地',
    Global: '全球',
    'Coverage: {records} documented combinations across {origins} origins. All {crops} crops can be checked; other combinations return “Not verified”.':
      '收录范围：{origins} 个产地共 {records} 项有文件依据的“产地 + 产品”组合。全部 {crops} 种作物均可查询；其他组合显示“未经核实”。',
    'Selected official protocols and export-guide entries; not a complete or live worldwide access register.':
      '仅收录部分官方议定书和出口指南条目，不是完整的、实时更新的全球准入名单。',
    '{country} → China · {form} produce': '{country} → 中国 · {form}果蔬',
    '{country} → CHINA · {form}': '{country} → 中国 · {form}',
    '{documented} documented · {restricted} restrictions documented · {unverified} not verified. Partial evidence coverage; zero recorded restrictions does not establish their absence.':
      '有文件记录 {documented} 项 · 有限制记录 {restricted} 项 · 未经核实 {unverified} 项。收录的依据并不完整；没有限制记录，不代表不存在限制。',
    '{n} crops shown': '显示 {n} 种作物',
    '{evidence} · reviewed {date}': '{evidence} · 核对日期 {date}',
    'Official guide': '官方指南',
    'Official list': '官方名录',
    'GACC list via translation': '海关总署名录（据译本）',
    'On GACC’s permitted list, per a translation · conditions apply':
      '据译本，已列入海关总署准入名录 · 须符合相关条件',
    'Translation updated': '译本更新日期',
    'Official protocols and export-guide entries, plus fresh fruit from GACC’s permitted list as given in a trade-press translation; not a complete or live access register. Fresh vegetables are barely covered.':
      '收录官方议定书和出口指南条目，以及一份行业媒体译本所载的海关总署获准输华水果名录；不是完整的、实时更新的准入名单。新鲜蔬菜的记录很少。',
    Protocol: '议定书',
    'Review status': '查看情况',
    'Conditions & sources': '条件与出处',
    'MRL limits': '残留限量',
    'No crops match this view. Try “All crops” or another produce type. An empty list is not a prohibition or permission.':
      '没有符合条件的作物。请选择“全部作物”或其他产品类别。列表为空，既不表示禁止，也不表示允许。',
    'Select an origin to check market access': '请选择产地以查询市场准入',
    'Global is an overview without a selected country. China’s MRL reference remains available for all origins. Market-access permission must be checked for a specific country, commodity and product form.':
      '“全球”是不指定国家的总览。中国的残留限量对所有产地都适用，随时可查。市场准入则必须针对具体的国家、产品和产品形态逐一查询。',
    'No reviewed record for this exact combination is included here. This does not mean prohibited or permitted. Confirm with the authorities linked below before shipment.':
      '本应用没有收录这一组合的已核对记录。这既不表示禁止，也不表示允许。发货前请向下方链接中的主管部门确认。',
    'Access listed in official guide · conditions apply': '官方指南列明可出口 · 须符合相关条件',
    'Listed in an official access list · conditions apply': '已列入官方准入名录 · 须符合相关条件',
    'Protocol documented · conditions apply': '有议定书记录 · 须符合相关条件',
    'Shipment checks:': '发货前核对：',
    'Confirm the required facility registrations, certificates, treatments and route before dispatch. This app does not assess or clear an individual shipment.':
      '发货前，请确认所需的企业注册登记、证书、检疫处理和运输路线。本应用不评估具体货物，也不代表货物可以通关。',
    'Guide edition': '指南版本',
    'List edition': '名录版本',
    Announcement: '公告日期',
    'Document reviewed': '文件核对日期',
    'Review due (over 90 days)': '已超过 90 天，需重新核对',
    'Review due (review date unreadable)': '核对日期无法识别，需重新核对',
    'Key source conditions (summary)': '文件中的主要条件（摘要）',
    'GACC announcement, MOFCOM republication': '海关总署公告（商务部网站转载）',
    'View {crop} residue limits ↗': '查看{crop}的残留限量 ↗',
    'Fresh-product MRLs are not automatically applicable to this form.':
      '新鲜产品的残留限量不能直接套用于这种产品形态。',
    'Protocol coverage unavailable.': '准入数据暂时无法载入。',
    'The market-access data could not load. Reload to retry. No access conclusion can be drawn; use the official authorities below.':
      '市场准入数据未能载入，请刷新重试。目前不能得出任何准入结论，请查询下方的官方机构。',
    'Before arranging a shipment': '安排发货之前',
    'Confirm current country–commodity access and any suspension with GACC and the exporting country’s plant-health authority.':
      '向中国海关总署和出口国植物检疫主管部门确认：该产品目前是否获准输华，有没有被暂停。',
    'Verify the orchard, packing house and any treatment facility are on the applicable current registers.':
      '确认果园、包装厂和检疫处理设施都在现行有效的注册登记名单上。',
    'Check the full protocol, permits, phytosanitary certificate, treatment, packaging and entry-port requirements.':
      '查清议定书全文，以及许可证、植物检疫证书、检疫处理、包装和入境口岸的要求。',
    'Assess residue limits separately for the exact product and residue definition.':
      '针对确切的产品和残留物定义，另行评估残留限量。',
    'GACC official website ↗': '海关总署官方网站 ↗',
    'Find the origin’s plant-health authority (IPPC) ↗': '查找产地国的植物检疫主管部门（IPPC）↗',
    'Document summaries are navigation aids. The official Chinese text controls. This checker does not confirm operational clearance, current facility registration or absence of later suspensions.':
      '文件摘要仅供参考，一律以官方中文文本为准。本查询不能确认货物能否实际通关、企业注册是否仍然有效，也不能确认其后没有被暂停。',

    // Redesign: crop picker, sorting, navigation, detail and print sheet
    More: '更多',
    Language: '语言',
    'Limit sheet': '限量表',
    Print: '打印',
    Close: '关闭',
    'If printing is not available here, open this site in your browser to print, or take a screenshot.':
      '如果这里无法打印，请用浏览器打开本网站再打印，或者直接截图保存。',
    Produce: '果蔬',
    Access: '准入',
    Saved: '已保存',
    'Crops with a record': '有记录的作物',
    Sort: '排序',
    'Default order': '默认顺序',
    'Limit: low to high': '限量从低到高',
    'Limit: high to low': '限量从高到低',
    'Pesticide name': '按农药名称',
    'Food name': '按食品名称',
    'Print limit sheet': '打印限量表',
    'Residue limits': '残留限量',
    Sections: '栏目',
    'Type a crop name': '输入作物名称或拼音',
    'Show all fresh-produce entries': '显示全部新鲜果蔬条目',
    'Matching crops': '符合的作物',
    'Pesticide or food…': '搜索农药或食品名称…',
    'Check market access': '查询市场准入',
    'View conditions': '查看准入条件',
    '★ Saved': '★ 已保存',
    '☆ Save this limit': '☆ 保存这项限量',
    'Applicability and source': '适用范围与出处',
    'Pesticide residue limits for China · {standard} · effective {date}':
      '中国农药残留限量 · {standard} · {date}起实施',
    'Part to be tested: {part}': '测定部位：{part}',
    'Pesticide · testing method': '农药 · 检测方法',
    '{shown} of {total} limits in this view.': '本表列出 {total} 项限量中的 {shown} 项。',
    '* Provisional limit. Reference only: check the Chinese standard, the residue definition and market access before shipment. Data reviewed {date}.':
      '* 表示临时限量。本表仅供参考：发货前请核对标准中文原文、残留物定义和市场准入。数据核对日期：{date}。',
    'Access documented': '有准入记录',
    'No fresh crop matches. Try another name, or search the Entire standard.':
      '没有符合的新鲜作物。请换一个名称，或到“完整标准”中搜索。',

    // Banned in China
    'Banned in China': '中国禁用农药',
    'Know what not to use.': '知道哪些农药不能用。',
    'Pesticides China bans or restricts for use, linked to their limits in the standard.':
      '中国禁止或限制使用的农药，并可查看标准中对应的限量。',
    'USE BANNED IN CHINA': '中国禁止使用',
    'Pesticides China bans for use': '中国禁止使用的农药',
    "China's agriculture ministry bans these 60 pesticides from sale and use in China. If your crop is going to China, the safest course is not to use them. Most have very low limits in the residue standard, and some have no limit at all.":
      '中国农业农村部禁止在中国销售和使用这 60 种农药。产品如果要出口到中国，最稳妥的做法是不使用它们：其中多数在残留限量标准中的限量很低，有些根本没有限量。',
    "This is a rule on use inside China, not an import requirement in itself. Imports are checked against the residue limits in GB 2763. Follow your own country's pesticide rules as well.":
      '这是中国境内的用药规定，本身并不是进口要求。进口产品按 GB 2763 的残留限量检验。同时也请遵守您所在国家的农药规定。',
    'Search a banned or restricted pesticide': '搜索禁用或限用农药',
    'Banned outright': '全面禁用',
    'Banned outright · {n} pesticides': '全面禁用 · {n} 种',
    'Banned on certain crops': '在部分作物上禁用',
    "These remain legal in China for some uses but are banned on the crops shown. Taken from the ministry's 2019 list, less the entries since banned outright; it may have changed.":
      '这些农药在中国仍可用于部分用途，但禁止用于所列作物。内容取自农业农村部 2019 年版名录，并已去掉其后被全面禁用的品种；名录此后可能有变化。',
    'Banned for use in China': '中国禁止使用',
    'Banned for use in China on: {scope}': '中国禁止用于：{scope}',
    'Banned on: {scope}': '禁止用于：{scope}',
    '{status}. This is a rule on use inside China; the limit above still applies to imports.':
      '{status}。这是中国境内的用药规定；进口产品仍按上面的限量检验。',
    'See the banned list': '查看禁用名单',
    'See the full banned list': '查看完整禁用名单',
    'These pesticides are banned for use in China. Their limits still apply to imports.':
      '这些农药在中国禁止使用。它们的限量同样适用于进口产品。',
    'Limits for pesticides banned in China': '中国禁用农药的限量',
    'Banned in China · {n} limits': '中国禁用农药 · {n} 项限量',
    '{n} more in the Banned section below': '另有 {n} 项在下方“中国禁用农药”部分',
    'Showing the first {n}. Choose a crop or a pesticide to see the rest.':
      '只显示前 {n} 项。请选择作物或农药以查看其余条目。',
    'Pesticides banned for use in China · {n} limits': '中国禁止使用的农药 · {n} 项限量',
    'Their limits still apply to imports.': '这些限量同样适用于进口产品。',
    '{n} limits in the standard': '标准中有 {n} 项限量',
    'No limit in the standard': '标准中没有限量',
    'No match in this list. A pesticide that is not listed here is not thereby permitted.':
      '名单中没有符合的农药。没有列入名单，并不表示可以使用。',
    'Banned list': '禁用名单',
    'Crop-specific bans': '部分作物禁用',
    'Checked {date}. Names in English are aids; the Chinese names control. Confirm against the ministry’s current notices before relying on this list.':
      '核对日期：{date}。请以农业农村部现行公告为准。',

    // Offline / install
    'Preparing offline reference…': '正在准备离线数据…',
    'Install app': '安装应用',
    'Install on your device': '安装到您的设备',
    'Use your browser’s Install app option. On iPhone or iPad, open in Safari, tap Share, then Add to Home Screen. Open online once and wait for “Offline reference ready” before using offline. Browser storage may be cleared by your device.':
      '请使用浏览器的“安装应用”功能。在 iPhone 或 iPad 上，请用 Safari 打开，点“分享”，再点“添加到主屏幕”。请先联网打开一次，等出现“离线数据已就绪”后再离线使用。设备可能会清除浏览器存储的数据。',
    'Reference snapshot · updates automatically when online': '参考数据快照 · 联网时自动更新',
    'Offline · using downloaded reference data. Verify current requirements before shipment.':
      '当前离线 · 正在使用已下载的参考数据。发货前请核实现行要求。',
    'Offline storage is not supported in this browser.': '此浏览器不支持离线存储。',
    'Offline reference ready · app updates install automatically.': '离线数据已就绪 · 应用会自动更新。',
    'Offline storage unavailable. You can continue online; reload to retry.':
      '离线存储不可用。您可以继续联网使用；刷新页面可重试。'
  };
  if (typeof module !== 'undefined') module.exports = ZH;
  else root.I18N_ZH = ZH;
})(typeof window !== 'undefined' ? window : globalThis);
