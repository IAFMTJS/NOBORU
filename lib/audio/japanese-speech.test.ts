import { describe, expect, it } from "vitest";

import { selectJapaneseVoice } from "@/lib/audio/japanese-speech";

function voice(
  name: string,
  lang: string,
): Pick<SpeechSynthesisVoice, "name" | "lang"> {
  return { name, lang };
}

describe("selectJapaneseVoice", () => {
  it("prefers native ja-JP voices such as Kyoko on iOS", () => {
    const selected = selectJapaneseVoice([
      voice("Samantha", "en-US"),
      voice("Kyoko", "ja-JP"),
      voice("Google 日本語", "ja-JP"),
    ] as SpeechSynthesisVoice[]);

    expect(selected?.name).toBe("Kyoko");
  });

  it("falls back to any ja-JP voice when no named Japanese voice exists", () => {
    const selected = selectJapaneseVoice([
      voice("Samantha", "en-US"),
      voice("Google 日本語", "ja-JP"),
    ] as SpeechSynthesisVoice[]);

    expect(selected?.lang).toBe("ja-JP");
  });

  it("falls back to ja language prefix", () => {
    const selected = selectJapaneseVoice([
      voice("Samantha", "en-US"),
      voice("Japanese", "ja"),
    ] as SpeechSynthesisVoice[]);

    expect(selected?.lang.startsWith("ja")).toBe(true);
  });
});
