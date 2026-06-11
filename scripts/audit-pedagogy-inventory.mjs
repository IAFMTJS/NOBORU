import fs from "fs";
import path from "path";

const root = process.cwd();
const migrationsDir = path.join(root, "supabase/migrations");
const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

function readSql(name) {
  return fs.readFileSync(path.join(migrationsDir, name), "utf8");
}

function countN5Rows(sql, tablePattern) {
  const section = sql.includes(tablePattern) ? sql : "";
  return (section.match(/'n5'::public\.jlpt_level/g) || []).length;
}

function extractLessonSelects(sql) {
  const lessons = [];
  const re =
    /select unit_id,\s*'([^']+)',\s*'([^']+)',\s*'([^']*)',\s*(\d+),\s*(\d+),\s*(\d+),\s*'published'/gi;
  for (const m of sql.matchAll(re)) {
    lessons.push({
      type: m[1],
      title: m[2],
      description: m[3],
      difficulty: Number(m[4]),
      xpReward: Number(m[5]),
      estimatedDuration: Number(m[6]),
    });
  }
  return lessons;
}

function extractWordLists(sql) {
  const lists = [];
  const re = /word_kana_list\s*:=\s*array\[([^\]]+)\]/gi;
  for (const m of sql.matchAll(re)) {
    const words = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    lists.push(words);
  }
  return lists;
}

function extractGrammarLists(sql) {
  const lists = [];
  const re = /point_title_list\s*:=\s*array\[([^\]]+)\]/gi;
  for (const m of sql.matchAll(re)) {
    const points = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    lists.push(points);
  }
  return lists;
}

function extractKanjiLists(sql) {
  const lists = [];
  const re = /kanji_char_list\s*:=\s*array\[([^\]]+)\]/gi;
  for (const m of sql.matchAll(re)) {
    const chars = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    lists.push(chars);
  }
  return lists;
}

function extractLessonTitleArrays(sql) {
  const re = /lesson_titles text\[\]\s*:=\s*array\[([\s\S]*?)\];/i;
  const m = sql.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

function extractVocabValues(sql) {
  const vocab = [];
  const valuesBlock = sql.match(
    /insert into public\.vocabulary[\s\S]*?from \(\s*values\s*([\s\S]*?)\) as v\(/i,
  );
  if (!valuesBlock) return vocab;
  const rowRe =
    /\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'::public\.jlpt_level/g;
  for (const m of valuesBlock[1].matchAll(rowRe)) {
    vocab.push({ kana: m[1], kanji: m[2], meaning: m[3], pos: m[4], jlpt: m[5] });
  }
  return vocab;
}

function extractKanjiValues(sql) {
  const kanji = [];
  const valuesBlock = sql.match(
    /insert into public\.kanji[\s\S]*?from \(\s*values\s*([\s\S]*?)\) as v\(/i,
  );
  if (!valuesBlock) return kanji;
  const rowRe = /\('([^']+)',\s*'([^']*)',\s*'([^']*)'::public\.jlpt_level/g;
  for (const m of valuesBlock[1].matchAll(rowRe)) {
    kanji.push({ character: m[1], meaning: m[2], jlpt: m[3] });
  }
  return kanji;
}

function extractGrammarValues(sql) {
  const grammar = [];
  const valuesBlock = sql.match(
    /insert into public\.grammar_points[\s\S]*?from \(\s*values\s*([\s\S]*?)\) as v\(/i,
  );
  if (!valuesBlock) return grammar;
  const rowRe =
    /\('([^']+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'::public\.jlpt_level/g;
  for (const m of valuesBlock[1].matchAll(rowRe)) {
    grammar.push({ title: m[1], meaning: m[2], jlpt: m[4] });
  }
  return grammar;
}

const regionFiles = {
  foothills: "20260608180000_hiragana_region.sql",
  "forest-trail": "20260608200000_katakana_region.sql",
  "mount-n5-vocab": "20260608220000_n5_vocabulary_region.sql",
  "mount-n5-grammar": "20260608240000_n5_grammar_region.sql",
  "mount-n5-kanji": "20260608260000_n5_kanji_academy.sql",
  reading: "20260608300000_reading_system.sql",
  listening: "20260608320000_listening_system.sql",
  trials: "20260610600000_n5_trial_system.sql",
};

const hiraganaSql = readSql(regionFiles.foothills);
const katakanaSql = readSql(regionFiles["forest-trail"]);
const vocabSql = readSql(regionFiles["mount-n5-vocab"]);
const grammarSql = readSql(regionFiles["mount-n5-grammar"]);
const kanjiSql = readSql(regionFiles["mount-n5-kanji"]);
const readingSql = readSql(regionFiles.reading);
const listeningSql = readSql(regionFiles.listening);

const hiraganaLessons = [
  ...extractLessonTitleArrays(hiraganaSql).map((title) => ({
    region: "foothills",
    type: "hiragana",
    title,
    estimatedDuration: title.includes("Combination") || title.includes("Voiced") ? 6 : 5,
    xpReward: title.includes("Combination") || title.includes("Voiced") ? 12 : 10,
  })),
  ...extractLessonSelects(hiraganaSql)
    .filter((l) => l.type === "practice")
    .map((l) => ({ region: "foothills", ...l })),
];

const katakanaLessons = [
  ...extractLessonTitleArrays(katakanaSql).map((title) => ({
    region: "forest-trail",
    type: "katakana",
    title,
    estimatedDuration: title.includes("Combination") || title.includes("Voiced") ? 6 : 5,
    xpReward: title.includes("Combination") || title.includes("Voiced") ? 12 : 10,
  })),
  ...extractLessonSelects(katakanaSql)
    .filter((l) => l.type === "practice")
    .map((l) => ({ region: "forest-trail", ...l })),
];

const mountN5Lessons = [
  ...extractLessonSelects(vocabSql).map((l) => ({ region: "mount-n5", unit: "vocabulary", ...l })),
  ...extractLessonSelects(grammarSql).map((l) => ({ region: "mount-n5", unit: "grammar", ...l })),
  ...extractLessonSelects(kanjiSql).map((l) => ({ region: "mount-n5", unit: "kanji", ...l })),
  ...extractLessonSelects(readingSql).map((l) => ({ region: "mount-n5", unit: "reading", ...l })),
  ...extractLessonSelects(listeningSql).map((l) => ({ region: "mount-n5", unit: "listening", ...l })),
];

const vocabN5 = extractVocabValues(vocabSql);
const grammarN5 = extractGrammarValues(grammarSql);
const kanjiN5 = extractKanjiValues(kanjiSql);

const vocabLessonWords = extractWordLists(vocabSql);
const grammarLessonPoints = extractGrammarLists(grammarSql);
const kanjiLessonChars = extractKanjiLists(kanjiSql);

// Hiragana/katakana catalog counts from TS
const hiraganaCatalog = fs.readFileSync(
  path.join(root, "features/hiragana/constants/hiragana-catalog.ts"),
  "utf8",
);
const katakanaCatalog = fs.readFileSync(
  path.join(root, "features/katakana/constants/katakana-catalog.ts"),
  "utf8",
);
const hiraganaCount = (hiraganaCatalog.match(/character:/g) || []).length;
const katakanaCount = (katakanaCatalog.match(/character:/g) || []).length;

// Reading/listening content counts from migrations
const storyCount = (readingSql.match(/insert into public\.reading_stories/gi) || []).length;
const dialogueCount = (readingSql.match(/insert into public\.reading_dialogues/gi) || []).length;
const listeningExerciseCount = (listeningSql.match(/insert into public\.listening_exercises/gi) || []).length;
const listeningChallengeCount = (listeningSql.match(/insert into public\.listening_challenges/gi) || []).length;

// Trials
const trialsSql = readSql(regionFiles.trials);
const trialCount = (trialsSql.match(/insert into public\.trial_templates/gi) || []).length;

function scoreLesson(lesson, itemCount, drillNotes) {
  const type = lesson.type;
  let exposure = 3,
    recall = 3,
    production = 3,
    recognition = 3,
    balance = 3,
    assessment = 3,
    retention = 3;

  if (type === "practice") {
    exposure = 1;
    recall = 5;
    production = type.includes("kanji") || type.includes("vocabulary") ? 4 : 3;
    balance = 4;
    assessment = 4;
    retention = 4;
  } else if (type === "hiragana" || type === "katakana") {
    exposure = 5;
    recall = 5;
    production = 5;
    recognition = 4;
    balance = 5;
    assessment = itemCount >= 3 ? 4 : 3;
    retention = 5;
  } else if (type === "vocabulary" || type === "kanji") {
    exposure = 5;
    recall = 5;
    production = 5;
    recognition = itemCount >= 3 ? 4 : 3;
    balance = 5;
    assessment = 3;
    retention = 5;
  } else if (type === "grammar") {
    exposure = 5;
    recall = 4;
    production = 2;
    recognition = 5;
    balance = 4;
    assessment = 3;
    retention = 5;
  } else if (type === "reading" || type === "story" || type === "dialogue") {
    exposure = 5;
    recall = 4;
    production = 1;
    recognition = 5;
    balance = 4;
    assessment = 5;
    retention = 2;
  } else if (type === "listening" || type === "listening_challenge") {
    exposure = 5;
    recall = 4;
    production = 1;
    recognition = 5;
    balance = 4;
    assessment = 5;
    retention = 2;
  }

  if (drillNotes) {
    for (const [k, v] of Object.entries(drillNotes)) {
      if (k in { exposure, recall, production, recognition, balance, assessment, retention }) {
        eval(`${k} = Math.min(5, Math.max(1, ${k} + ${v}))`);
      }
    }
  }

  const avg =
    (exposure + recall + production + recognition + balance + assessment + retention) / 7;
  return {
    exposure,
    recall,
    production,
    recognition,
    balance,
    assessment,
    retention,
    average: Math.round(avg * 10) / 10,
  };
}

function attachItems(lessons, lists, kind) {
  let i = 0;
  return lessons.map((lesson) => {
    if (lesson.type === "practice") {
      return { ...lesson, itemCount: "mixed", itemsPerLesson: "all prior" };
    }
    const items = lists[i] ?? [];
    if (lesson.type !== "practice" && lists[i]) i += 1;
    return { ...lesson, itemCount: items.length, items };
  });
}

const allLessons = [
  ...attachItems(
    hiraganaLessons.filter((l) => l.type === "hiragana"),
    hiraganaSql.match(/row_group_keys text\[\][\s\S]*?];/i)?.[0]
      ? extractLessonTitleArrays(hiraganaSql).map((_, idx) => {
          const keys = hiraganaSql.match(/row_group_keys text\[\]\s*:=\s*array\[([\s\S]*?)\];/i)?.[1];
          if (!keys) return [];
          const groups = [...keys.matchAll(/'([^']+)'/g)].map((x) => x[1]);
          const group = groups[idx];
          if (!group) return [];
          const rowNames = group.split(",");
          const catalogRows = [...hiraganaCatalog.matchAll(/rowName:\s*"([^"]+)"/g)].map((x) => x[1]);
          // approximate: count per row from catalog
          const rowCounts = {};
          for (const rn of catalogRows) rowCounts[rn] = (rowCounts[rn] || 0) + 1;
          return rowNames.flatMap((rn) => Array(rowCounts[rn] || 3).fill(rn));
        })
      : [],
    "hiragana",
  ),
  ...hiraganaLessons.filter((l) => l.type === "practice").map((l) => ({ ...l, itemCount: "mixed" })),
  ...attachItems(
    katakanaLessons.filter((l) => l.type === "katakana"),
    extractLessonTitleArrays(katakanaSql).map(() => []),
    "katakana",
  ),
  ...katakanaLessons.filter((l) => l.type === "practice").map((l) => ({ ...l, itemCount: "mixed" })),
  ...extractLessonSelects(vocabSql)
    .map((l, idx) => ({
      region: "mount-n5",
      ...l,
      itemCount: vocabLessonWords[idx]?.length ?? 0,
      items: vocabLessonWords[idx] ?? [],
    })),
  ...extractLessonSelects(grammarSql).map((l, idx) => ({
    region: "mount-n5",
    ...l,
    itemCount: grammarLessonPoints[idx]?.length ?? 0,
    items: grammarLessonPoints[idx] ?? [],
  })),
  ...extractLessonSelects(kanjiSql).map((l, idx) => ({
    region: "mount-n5",
    ...l,
    itemCount: kanjiLessonChars[idx]?.length ?? 0,
    items: kanjiLessonChars[idx] ?? [],
  })),
  ...extractLessonSelects(readingSql).map((l) => ({ region: "mount-n5", ...l, itemCount: 1 })),
  ...extractLessonSelects(listeningSql).map((l) => ({ region: "mount-n5", ...l, itemCount: 1 })),
];

// Fix hiragana/katakana item counts from row groups properly
function hiraganaItemsPerLesson(sql, catalogText) {
  const titles = extractLessonTitleArrays(sql);
  const keysMatch = sql.match(/row_group_keys text\[\]\s*:=\s*array\[([\s\S]*?)\];/i);
  if (!keysMatch) return titles.map(() => 0);
  const groups = [...keysMatch[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  const rowNameCounts = {};
  for (const m of catalogText.matchAll(/rowName:\s*"([^"]+)"/g)) {
    rowNameCounts[m[1]] = (rowNameCounts[m[1]] || 0) + 1;
  }
  return groups.map((group) => {
    const rows = group.split(",");
    return rows.reduce((sum, rn) => sum + (rowNameCounts[rn.trim()] || 0), 0);
  });
}

const hiraCounts = hiraganaItemsPerLesson(hiraganaSql, hiraganaCatalog);
const kataCounts = hiraganaItemsPerLesson(katakanaSql, katakanaCatalog);

const lessonsScored = [];
let hIdx = 0,
  kIdx = 0;
for (const lesson of allLessons) {
  let itemCount = lesson.itemCount;
  if (lesson.type === "hiragana") {
    itemCount = hiraCounts[hIdx++] ?? itemCount;
  }
  if (lesson.type === "katakana") {
    itemCount = kataCounts[kIdx++] ?? itemCount;
  }
  const scores = scoreLesson(lesson, typeof itemCount === "number" ? itemCount : 8, null);
  lessonsScored.push({ ...lesson, itemCount, scores });
}

const JLPT_N5_REFERENCE = {
  vocabulary: { typical: 800, conservative: 600, note: "Official JLPT does not publish a fixed list; ~600–800 common estimates" },
  kanji: { typical: 103, note: "JLPT N5 kanji list commonly cited ~100–103 characters" },
  grammar: { typical: 80, note: "Full N5 grammar ~70–90 patterns; particles + basic conjugation" },
  hiragana: { typical: 71, note: "46 base + dakuten + handakuten + common combos" },
  katakana: { typical: 71, note: "Mirror of hiragana inventory" },
};

const regionSummary = {
  foothills: {
    lessons: lessonsScored.filter((l) => l.region === "foothills").length,
    avgPedagogy: 0,
  },
  "forest-trail": {
    lessons: lessonsScored.filter((l) => l.region === "forest-trail").length,
    avgPedagogy: 0,
  },
  "mount-n5": {
    lessons: lessonsScored.filter((l) => l.region === "mount-n5").length,
    avgPedagogy: 0,
  },
};

for (const key of Object.keys(regionSummary)) {
  const ls = lessonsScored.filter((l) => l.region === key);
  regionSummary[key].avgPedagogy =
    Math.round((ls.reduce((s, l) => s + l.scores.average, 0) / ls.length) * 10) / 10;
}

const contentBalance = {
  vocabularyItems: vocabN5.length,
  kanjiItems: kanjiN5.length,
  grammarItems: grammarN5.length,
  hiraganaCatalog,
  katakanaCatalog: katakanaCount,
  readingStories: storyCount,
  readingDialogues: dialogueCount,
  listeningExercises: listeningExerciseCount,
  listeningChallenges: listeningChallengeCount,
  trials: trialCount,
};

const report = {
  generatedAt: new Date().toISOString(),
  jlptN5Reference: JLPT_N5_REFERENCE,
  contentPublished: {
    hiraganaCharacters: hiraganaCount,
    katakanaCharacters: katakanaCount,
    vocabularyN5: vocabN5.length,
    kanjiN5: kanjiN5.length,
    grammarN5: grammarN5.length,
    readingStories: storyCount,
    readingDialogues: dialogueCount,
    listeningExercises: listeningExerciseCount,
    listeningChallenges: listeningChallengeCount,
    trials: trialCount,
  },
  coverageVsJlptN5: {
    hiragana: { published: hiraganaCount, target: 71, percent: Math.round((hiraganaCount / 71) * 100) },
    katakana: { published: katakanaCount, target: 71, percent: Math.round((katakanaCount / 71) * 100) },
    vocabulary: { published: vocabN5.length, target: 800, percent: Math.round((vocabN5.length / 800) * 100) },
    kanji: { published: kanjiN5.length, target: 103, percent: Math.round((kanjiN5.length / 103) * 100) },
    grammar: { published: grammarN5.length, target: 80, percent: Math.round((grammarN5.length / 80) * 100) },
  },
  lessonInventory: {
    totalN5PathLessons: lessonsScored.length,
    byRegion: {
      foothills: lessonsScored.filter((l) => l.region === "foothills").length,
      forestTrail: lessonsScored.filter((l) => l.region === "forest-trail").length,
      mountN5: lessonsScored.filter((l) => l.region === "mount-n5").length,
    },
    byType: lessonsScored.reduce((acc, l) => {
      acc[l.type] = (acc[l.type] || 0) + 1;
      return acc;
    }, {}),
    estimatedTrailMinutes: lessonsScored.reduce(
      (s, l) => s + (l.estimatedDuration || 6),
      0,
    ),
  },
  regionPedagogyScores: regionSummary,
  lessons: lessonsScored,
  vocabularyWords: vocabN5,
  grammarPoints: grammarN5,
  kanjiCharacters: kanjiN5.map((k) => k.character),
};

fs.writeFileSync(
  path.join(root, "scripts/audit-pedagogy-inventory.json"),
  JSON.stringify(report, null, 2),
);

console.log(JSON.stringify({
  contentPublished: report.contentPublished,
  coverageVsJlptN5: report.coverageVsJlptN5,
  lessonInventory: report.lessonInventory,
  regionPedagogyScores: report.regionPedagogyScores,
  lessonTitles: lessonsScored.map((l) => `${l.region} | ${l.type} | ${l.title} | items:${l.itemCount} | score:${l.scores.average}`),
}, null, 2));
