export type HiraganaVariantType = "base" | "dakuten" | "handakuten" | "combo";

export type HiraganaRow = {
  character: string;
  romaji: string;
  rowName: string;
  rowLabel: string;
  orderIndex: number;
  variantType: HiraganaVariantType;
};

export type HiraganaCatalogEntry = HiraganaRow & {
  id?: string;
};

export const HIRAGANA_ROWS: Record<string, string> = {
  a: "A row (あ行)",
  ka: "Ka row (か行)",
  sa: "Sa row (さ行)",
  ta: "Ta row (た行)",
  na: "Na row (な行)",
  ha: "Ha row (は行)",
  ma: "Ma row (ま行)",
  ya: "Ya row (や行)",
  ra: "Ra row (ら行)",
  wa: "Wa row (わ行)",
  n: "N (ん)",
  voiced: "Voiced (濁音)",
  semiVoiced: "Semi-voiced (半濁音)",
  combo: "Combinations (拗音)",
};

function row(
  characters: Array<[string, string]>,
  rowName: string,
  variantType: HiraganaVariantType,
  startIndex: number,
): HiraganaRow[] {
  return characters.map(([character, romaji], index) => ({
    character,
    romaji,
    rowName,
    rowLabel: HIRAGANA_ROWS[rowName] ?? rowName,
    orderIndex: startIndex + index,
    variantType,
  }));
}

export const HIRAGANA_CATALOG: HiraganaRow[] = [
  ...row(
    [
      ["あ", "a"],
      ["い", "i"],
      ["う", "u"],
      ["え", "e"],
      ["お", "o"],
    ],
    "a",
    "base",
    0,
  ),
  ...row(
    [
      ["か", "ka"],
      ["き", "ki"],
      ["く", "ku"],
      ["け", "ke"],
      ["こ", "ko"],
    ],
    "ka",
    "base",
    5,
  ),
  ...row(
    [
      ["さ", "sa"],
      ["し", "shi"],
      ["す", "su"],
      ["せ", "se"],
      ["そ", "so"],
    ],
    "sa",
    "base",
    10,
  ),
  ...row(
    [
      ["た", "ta"],
      ["ち", "chi"],
      ["つ", "tsu"],
      ["て", "te"],
      ["と", "to"],
    ],
    "ta",
    "base",
    15,
  ),
  ...row(
    [
      ["な", "na"],
      ["に", "ni"],
      ["ぬ", "nu"],
      ["ね", "ne"],
      ["の", "no"],
    ],
    "na",
    "base",
    20,
  ),
  ...row(
    [
      ["は", "ha"],
      ["ひ", "hi"],
      ["ふ", "fu"],
      ["へ", "he"],
      ["ほ", "ho"],
    ],
    "ha",
    "base",
    25,
  ),
  ...row(
    [
      ["ま", "ma"],
      ["み", "mi"],
      ["む", "mu"],
      ["め", "me"],
      ["も", "mo"],
    ],
    "ma",
    "base",
    30,
  ),
  ...row(
    [
      ["や", "ya"],
      ["ゆ", "yu"],
      ["よ", "yo"],
    ],
    "ya",
    "base",
    35,
  ),
  ...row(
    [
      ["ら", "ra"],
      ["り", "ri"],
      ["る", "ru"],
      ["れ", "re"],
      ["ろ", "ro"],
    ],
    "ra",
    "base",
    38,
  ),
  ...row(
    [
      ["わ", "wa"],
      ["を", "wo"],
    ],
    "wa",
    "base",
    43,
  ),
  ...row([["ん", "n"]], "n", "base", 45),
  ...row(
    [
      ["が", "ga"],
      ["ぎ", "gi"],
      ["ぐ", "gu"],
      ["げ", "ge"],
      ["ご", "go"],
      ["ざ", "za"],
      ["じ", "ji"],
      ["ず", "zu"],
      ["ぜ", "ze"],
      ["ぞ", "zo"],
      ["だ", "da"],
      ["ぢ", "ji"],
      ["づ", "zu"],
      ["で", "de"],
      ["ど", "do"],
      ["ば", "ba"],
      ["び", "bi"],
      ["ぶ", "bu"],
      ["べ", "be"],
      ["ぼ", "bo"],
    ],
    "voiced",
    "dakuten",
    46,
  ),
  ...row(
    [
      ["ぱ", "pa"],
      ["ぴ", "pi"],
      ["ぷ", "pu"],
      ["ぺ", "pe"],
      ["ぽ", "po"],
    ],
    "semiVoiced",
    "handakuten",
    66,
  ),
  ...row(
    [
      ["きゃ", "kya"],
      ["きゅ", "kyu"],
      ["きょ", "kyo"],
      ["しゃ", "sha"],
      ["しゅ", "shu"],
      ["しょ", "sho"],
      ["ちゃ", "cha"],
      ["ちゅ", "chu"],
      ["ちょ", "cho"],
      ["にゃ", "nya"],
      ["にゅ", "nyu"],
      ["にょ", "nyo"],
      ["ひゃ", "hya"],
      ["ひゅ", "hyu"],
      ["ひょ", "hyo"],
      ["みゃ", "mya"],
      ["みゅ", "myu"],
      ["みょ", "myo"],
      ["りゃ", "rya"],
      ["りゅ", "ryu"],
      ["りょ", "ryo"],
      ["ぎゃ", "gya"],
      ["ぎゅ", "gyu"],
      ["ぎょ", "gyo"],
      ["じゃ", "ja"],
      ["じゅ", "ju"],
      ["じょ", "jo"],
      ["びゃ", "bya"],
      ["びゅ", "byu"],
      ["びょ", "byo"],
      ["ぴゃ", "pya"],
      ["ぴゅ", "pyu"],
      ["ぴょ", "pyo"],
    ],
    "combo",
    "combo",
    71,
  ),
];

export const HIRAGANA_LESSON_GROUPS = [
  { slug: "a-row", title: "A Row + ん", rowNames: ["a", "n"] },
  { slug: "ka-row", title: "Ka Row", rowNames: ["ka"] },
  { slug: "sa-row", title: "Sa Row", rowNames: ["sa"] },
  { slug: "ta-row", title: "Ta Row", rowNames: ["ta"] },
  { slug: "na-row", title: "Na Row", rowNames: ["na"] },
  { slug: "ha-row", title: "Ha Row", rowNames: ["ha"] },
  { slug: "ma-row", title: "Ma Row", rowNames: ["ma"] },
  { slug: "ya-row", title: "Ya Row", rowNames: ["ya"] },
  { slug: "ra-row", title: "Ra Row", rowNames: ["ra"] },
  { slug: "wa-row", title: "Wa Row", rowNames: ["wa"] },
  { slug: "dakuten", title: "Voiced Hiragana", rowNames: ["voiced"] },
  { slug: "handakuten", title: "Semi-voiced Hiragana", rowNames: ["semiVoiced"] },
  { slug: "combo", title: "Combination Hiragana", rowNames: ["combo"] },
] as const;

export function getHiraganaByRowNames(rowNames: readonly string[]): HiraganaRow[] {
  return HIRAGANA_CATALOG.filter((entry) => rowNames.includes(entry.rowName));
}

export function getPracticeHiraganaSample(): HiraganaRow[] {
  const picks = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa"];
  return picks.flatMap((rowName) =>
    HIRAGANA_CATALOG.filter(
      (entry) => entry.rowName === rowName && entry.variantType === "base",
    ).slice(0, 1),
  );
}
