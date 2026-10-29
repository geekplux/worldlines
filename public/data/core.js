/* Worldlines core content: chapters, regions, places, themes and the learning notes.
   Places' polities live in data/places.js and events in data/events.js.
   Edit any of them, then run `node scripts/check-data.mjs`. Every piece of text is { en, zh }. */
window.WORLDLINES = window.WORLDLINES || {};
Object.assign(window.WORLDLINES, {
  chapters: [
    { id: "origins", start: -13000, end: -3000,
      short: { en: "Origins", zh: "起源" },
      title: { en: "Origins & Settlements", zh: "起源与定居" },
      range: { en: "c. 13,000–3,000 BCE", zh: "约公元前13000–前3000年" },
      description: { en: "Humans reshape landscapes, domesticate plants and animals, and build enduring communities, by many routes rather than one agricultural revolution.", zh: "人类改造地貌、驯化动植物、建立持久的社群。农业并非一次“革命”，而是由许多条道路分别走出来的。" } },
    { id: "cities", start: -3500, end: -500,
      short: { en: "First Cities", zh: "最早的城市" },
      title: { en: "Cities, States & Writing", zh: "城市、国家与文字" },
      range: { en: "c. 3,500–500 BCE", zh: "约公元前3500–前500年" },
      description: { en: "Dense settlements, record-keeping, organised religion, taxation, armies and long-distance exchange transform power.", zh: "密集的聚落、文书记录、制度化的宗教、赋税、军队和远程交换，彻底改变了权力的形态。" } },
    { id: "classical", start: -600, end: 600,
      short: { en: "Classical", zh: "古典" },
      title: { en: "Classical Worlds", zh: "古典世界" },
      range: { en: "c. 600 BCE–600 CE", zh: "约公元前600–公元600年" },
      description: { en: "Large empires and durable schools of thought take shape across Eurasia, Africa and the Americas.", zh: "大型帝国与延续久远的思想流派在欧亚大陆、非洲和美洲形成。" } },
    { id: "networks", start: 500, end: 1500,
      short: { en: "Networks", zh: "互联" },
      title: { en: "Connected Worlds", zh: "互联世界" },
      range: { en: "500–1500 CE", zh: "公元500–1500年" },
      description: { en: "Trade, pilgrimage, scholarship, conquest and migration bind distant societies, while disease and war travel too.", zh: "贸易、朝圣、学术、征服与迁徙把遥远的社会连在一起，疾病与战争也沿着同样的道路传播。" } },
    { id: "oceans", start: 1450, end: 1750,
      short: { en: "Oceans", zh: "海洋" },
      title: { en: "Oceans & Gunpowder", zh: "海洋与火药时代" },
      range: { en: "1450–1750", zh: "1450–1750年" },
      description: { en: "Ocean routes and expanding states create global circuits of silver, crops, coerced labour, texts and weapons.", zh: "远洋航路与扩张中的国家，织出了白银、作物、强迫劳动、书籍与武器的全球循环。" } },
    { id: "revolutions", start: 1750, end: 1914,
      short: { en: "Revolutions", zh: "革命" },
      title: { en: "Industry & Revolutions", zh: "工业与革命" },
      range: { en: "1750–1914", zh: "1750–1914年" },
      description: { en: "Fossil-fuelled industry, political revolution, nationalism, abolition, capitalism and imperialism reorder the planet.", zh: "化石能源驱动的工业、政治革命、民族主义、废奴、资本主义与帝国主义，重新排列了整个星球。" } },
    { id: "wars", start: 1914, end: 1945,
      short: { en: "World Wars", zh: "世界大战" },
      title: { en: "Crisis & World Wars", zh: "危机与世界大战" },
      range: { en: "1914–1945", zh: "1914–1945年" },
      description: { en: "Total war, mass politics, depression, fascism, genocide, anticolonial struggle and revolution break the old orders.", zh: "总体战、大众政治、大萧条、法西斯主义、种族灭绝、反殖民斗争与革命，击碎了旧秩序。" } },
    { id: "contemporary", start: 1945, end: 2026,
      short: { en: "Since 1945", zh: "1945年以来" },
      title: { en: "A Decolonising World", zh: "去殖民化的世界" },
      range: { en: "1945–today", zh: "1945年至今" },
      description: { en: "New nations, Cold War rivalry, rights movements, digital networks and ecological limits define an unfinished present.", zh: "新国家、冷战对抗、权利运动、数字网络与生态极限，共同塑造了一个尚未完成的当下。" } }
  ],

  /* Region colours: a De Stijl palette stretched to eight. Primaries go to the four largest
     lanes; the rest are muted secondaries that still read well against black rules. */
  regions: [
    { id: "east-asia", code: "EA", color: "#d52b1e", name: { en: "East Asia", zh: "东亚" } },
    { id: "south-asia", code: "SA", color: "#e07b1a", name: { en: "South & Southeast Asia", zh: "南亚与东南亚" } },
    { id: "mena", code: "ME", color: "#f3c623", name: { en: "Middle East & North Africa", zh: "中东与北非" } },
    { id: "europe", code: "EU", color: "#1d4ed8", name: { en: "Europe", zh: "欧洲" } },
    { id: "africa", code: "AF", color: "#2f7d4a", name: { en: "Sub-Saharan Africa", zh: "撒哈拉以南非洲" } },
    { id: "americas", code: "AM", color: "#7a4e8c", name: { en: "The Americas", zh: "美洲" } },
    { id: "central-asia", code: "CA", color: "#9a3b5a", name: { en: "Central Asia & Steppe", zh: "中亚与草原" } },
    { id: "oceania", code: "OC", color: "#1f8a8a", name: { en: "Oceania", zh: "大洋洲" } }
  ],

  /* Places are today's countries or historic heartlands, the unit for country-level comparison. */
  places: [
    { id: "china", region: "east-asia", name: { en: "China", zh: "中国" } },
    { id: "japan", region: "east-asia", name: { en: "Japan", zh: "日本" } },
    { id: "korea", region: "east-asia", name: { en: "Korea", zh: "朝鲜半岛" } },
    { id: "india", region: "south-asia", name: { en: "India", zh: "印度" } },
    { id: "cambodia", region: "south-asia", name: { en: "Cambodia", zh: "柬埔寨" } },
    { id: "indonesia", region: "south-asia", name: { en: "Indonesia", zh: "印度尼西亚" } },
    { id: "iraq", region: "mena", name: { en: "Iraq · Mesopotamia", zh: "伊拉克 · 美索不达米亚" } },
    { id: "egypt", region: "mena", name: { en: "Egypt", zh: "埃及" } },
    { id: "iran", region: "mena", name: { en: "Iran · Persia", zh: "伊朗 · 波斯" } },
    { id: "turkey", region: "mena", name: { en: "Turkey · Anatolia", zh: "土耳其 · 安纳托利亚" } },
    { id: "greece", region: "europe", name: { en: "Greece", zh: "希腊" } },
    { id: "italy", region: "europe", name: { en: "Italy", zh: "意大利" } },
    { id: "france", region: "europe", name: { en: "France", zh: "法国" } },
    { id: "spain", region: "europe", name: { en: "Spain", zh: "西班牙" } },
    { id: "britain", region: "europe", name: { en: "Britain", zh: "英国" } },
    { id: "germany", region: "europe", name: { en: "Germany", zh: "德国" } },
    { id: "russia", region: "europe", name: { en: "Russia", zh: "俄罗斯" } },
    { id: "ethiopia", region: "africa", name: { en: "Ethiopia", zh: "埃塞俄比亚" } },
    { id: "mali", region: "africa", name: { en: "Mali · West Africa", zh: "马里 · 西非" } },
    { id: "zimbabwe", region: "africa", name: { en: "Zimbabwe", zh: "津巴布韦" } },
    { id: "mexico", region: "americas", name: { en: "Mexico", zh: "墨西哥" } },
    { id: "peru", region: "americas", name: { en: "Peru · Andes", zh: "秘鲁 · 安第斯" } },
    { id: "usa", region: "americas", name: { en: "United States", zh: "美国" } },
    { id: "mongolia", region: "central-asia", name: { en: "Mongolia · Steppe", zh: "蒙古 · 草原" } },
    { id: "australia", region: "oceania", name: { en: "Australia", zh: "澳大利亚" } },
    { id: "newzealand", region: "oceania", name: { en: "Aotearoa New Zealand", zh: "新西兰（奥特亚罗瓦）" } }
  ],

  themes: [
    { id: "state", color: "#d52b1e", name: { en: "States & power", zh: "国家与权力" } },
    { id: "belief", color: "#7a4e8c", name: { en: "Belief & ideas", zh: "信仰与思想" } },
    { id: "technology", color: "#1d4ed8", name: { en: "Technology", zh: "技术" } },
    { id: "trade", color: "#e07b1a", name: { en: "Trade & movement", zh: "贸易与迁移" } },
    { id: "conflict", color: "#141414", name: { en: "Conflict", zh: "冲突" } },
    { id: "society", color: "#2f7d4a", name: { en: "Society & rights", zh: "社会与权利" } },
    { id: "environment", color: "#1f8a8a", name: { en: "Land & climate", zh: "土地与气候" } }
  ],

  /* Polity kinds, drawn differently on the long view */
  kinds: [
    { id: "s", name: { en: "State or dynasty", zh: "国家或王朝" } },
    { id: "d", name: { en: "Divided: several rival states", zh: "分裂：多国并立" } },
    { id: "f", name: { en: "Ruled from outside: conquest or colony", zh: "外来统治：征服或殖民" } },
    { id: "c", name: { en: "Culture or era, before or beside states", zh: "文化或时期（国家之前或之外）" } }
  ],

  learning: [
    { t: { en: "Learn the hinges", zh: "先记住转折点" }, d: { en: "Begin with the events that changed institutions, movement, belief or material life.", zh: "从改变了制度、人口流动、信仰或物质生活的事件开始。" } },
    { t: { en: "Ask “meanwhile?”", zh: "追问“与此同时”" }, d: { en: "For every familiar event, look at two other places in the same generation.", zh: "每遇到一个熟悉的事件，就去看看同一代人里另外两个地方在发生什么。" } },
    { t: { en: "Follow a thread", zh: "沿着一条线索" }, d: { en: "Pick trade, technology, belief, conflict, society or the land, and cross the chapters with it.", zh: "选择贸易、技术、信仰、冲突、社会或土地中的一条，带着它穿越各个章节。" } },
    { t: { en: "Slice a year", zh: "切一个年份" }, d: { en: "Freeze the clock at one year and ask who ruled where. The answer is rarely what the textbook map suggests.", zh: "把时钟停在某一年，问一问：此刻谁统治着哪里？答案往往和课本地图给人的印象不同。" } },
    { t: { en: "Notice the frame", zh: "留意框架本身" }, d: { en: "Dates and labels are tools, not neutral truths. Every survey leaves voices outside its edges.", zh: "年代与标签是工具，而非中立的真相。任何一部通史都会把一些声音留在边界之外。" } }
  ]
});
