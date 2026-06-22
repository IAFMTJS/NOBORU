export type KatakanaVariantType = "base" | "dakuten" | "handakuten" | "combo";

export type KatakanaRow = {
  character: string;
  romaji: string;
  rowName: string;
  rowLabel: string;
  orderIndex: number;
  variantType: KatakanaVariantType;
};

export const KATAKANA_ROWS: Record<string, string> = {
  a: "A row (ア行)",
  ka: "Ka row (カ行)",
  sa: "Sa row (サ行)",
  ta: "Ta row (タ行)",
  na: "Na row (ナ行)",
  ha: "Ha row (ハ行)",
  ma: "Ma row (マ行)",
  ya: "Ya row (ヤ行)",
  ra: "Ra row (ラ行)",
  wa: "Wa row (ワ行)",
  n: "N (ン)",
  voiced: "Voiced (濁音)",
  semiVoiced: "Semi-voiced (半濁音)",
  combo: "Combinations (拗音)",
};

function row(
  characters: Array<[string, string]>,
  rowName: string,
  variantType: KatakanaVariantType,
  startIndex: number,
): KatakanaRow[] {
  return characters.map(([character, romaji], index) => ({
    character,
    romaji,
    rowName,
    rowLabel: KATAKANA_ROWS[rowName] ?? rowName,
    orderIndex: startIndex + index,
    variantType,
  }));
}

export const KATAKANA_CATALOG: KatakanaRow[] = [
  ...row(
    [
      ["ア", "a"],
      ["イ", "i"],
      ["ウ", "u"],
      ["エ", "e"],
      ["オ", "o"],
    ],
    "a",
    "base",
    0,
  ),
  ...row(
    [
      ["カ", "ka"],
      ["キ", "ki"],
      ["ク", "ku"],
      ["ケ", "ke"],
      ["コ", "ko"],
    ],
    "ka",
    "base",
    5,
  ),
  ...row(
    [
      ["サ", "sa"],
      ["シ", "shi"],
      ["ス", "su"],
      ["セ", "se"],
      ["ソ", "so"],
    ],
    "sa",
    "base",
    10,
  ),
  ...row(
    [
      ["タ", "ta"],
      ["チ", "chi"],
      ["ツ", "tsu"],
      ["テ", "te"],
      ["ト", "to"],
    ],
    "ta",
    "base",
    15,
  ),
  ...row(
    [
      ["ナ", "na"],
      ["ニ", "ni"],
      ["ヌ", "nu"],
      ["ネ", "ne"],
      ["ノ", "no"],
    ],
    "na",
    "base",
    20,
  ),
  ...row(
    [
      ["ハ", "ha"],
      ["ヒ", "hi"],
      ["フ", "fu"],
      ["ヘ", "he"],
      ["ホ", "ho"],
    ],
    "ha",
    "base",
    25,
  ),
  ...row(
    [
      ["マ", "ma"],
      ["ミ", "mi"],
      ["ム", "mu"],
      ["メ", "me"],
      ["モ", "mo"],
    ],
    "ma",
    "base",
    30,
  ),
  ...row(
    [
      ["ヤ", "ya"],
      ["ユ", "yu"],
      ["ヨ", "yo"],
    ],
    "ya",
    "base",
    35,
  ),
  ...row(
    [
      ["ラ", "ra"],
      ["リ", "ri"],
      ["ル", "ru"],
      ["レ", "re"],
      ["ロ", "ro"],
    ],
    "ra",
    "base",
    38,
  ),
  ...row(
    [
      ["ワ", "wa"],
      ["ヲ", "wo"],
    ],
    "wa",
    "base",
    43,
  ),
  ...row([["ン", "n"]], "n", "base", 45),
  ...row(
    [
      ["ガ", "ga"],
      ["ギ", "gi"],
      ["グ", "gu"],
      ["ゲ", "ge"],
      ["ゴ", "go"],
      ["ザ", "za"],
      ["ジ", "ji"],
      ["ズ", "zu"],
      ["ゼ", "ze"],
      ["ゾ", "zo"],
      ["ダ", "da"],
      ["ヂ", "ji"],
      ["ヅ", "zu"],
      ["デ", "de"],
      ["ド", "do"],
      ["バ", "ba"],
      ["ビ", "bi"],
      ["ブ", "bu"],
      ["ベ", "be"],
      ["ボ", "bo"],
    ],
    "voiced",
    "dakuten",
    46,
  ),
  ...row(
    [
      ["パ", "pa"],
      ["ピ", "pi"],
      ["プ", "pu"],
      ["ペ", "pe"],
      ["ポ", "po"],
    ],
    "semiVoiced",
    "handakuten",
    66,
  ),
  ...row(
    [
      ["キャ", "kya"],
      ["キュ", "kyu"],
      ["キョ", "kyo"],
      ["シャ", "sha"],
      ["シュ", "shu"],
      ["ショ", "sho"],
      ["チャ", "cha"],
      ["チュ", "chu"],
      ["チョ", "cho"],
      ["ニャ", "nya"],
      ["ニュ", "nyu"],
      ["ニョ", "nyo"],
      ["ヒャ", "hya"],
      ["ヒュ", "hyu"],
      ["ヒョ", "hyo"],
      ["ミャ", "mya"],
      ["ミュ", "myu"],
      ["ミョ", "myo"],
      ["リャ", "rya"],
      ["リュ", "ryu"],
      ["リョ", "ryo"],
      ["ギャ", "gya"],
      ["ギュ", "gyu"],
      ["ギョ", "gyo"],
      ["ジャ", "ja"],
      ["ジュ", "ju"],
      ["ジョ", "jo"],
      ["ビャ", "bya"],
      ["ビュ", "byu"],
      ["ビョ", "byo"],
      ["ピャ", "pya"],
      ["ピュ", "pyu"],
      ["ピョ", "pyo"],
    ],
    "combo",
    "combo",
    71,
  ),
];

export const N5_KATAKANA_TRAIL = {
  slug: "n5",
  name: "Realm of First Light",
  trail: "Kana Bridge",
} as const;

/** @deprecated Use N5_KATAKANA_TRAIL */
export const FOREST_TRAIL_REGION = N5_KATAKANA_TRAIL;
