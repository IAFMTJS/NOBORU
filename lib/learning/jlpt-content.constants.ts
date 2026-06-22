import type { JlptLevel } from "@/lib/content/types";

export type JlptContentHub = {
  jlptLevel: JlptLevel;
  regionSlug: string;
  regionName: string;
  vocabularyTitle: string;
  vocabularySubtitle: string;
  grammarTitle: string;
  grammarSubtitle: string;
  kanjiTitle: string;
  kanjiSubtitle: string;
  readingTitle: string;
  readingSubtitle: string;
  listeningTitle: string;
  listeningSubtitle: string;
};

export const JLPT_CONTENT_HUBS: Record<"n5" | "n4", JlptContentHub> = {
  n5: {
    jlptLevel: "n5",
    regionSlug: "n5",
    regionName: "Realm of First Light",
    vocabularyTitle: "N5 Vocabulary",
    vocabularySubtitle: "Track every word on your N5 climb.",
    grammarTitle: "N5 Grammar",
    grammarSubtitle: "Master sentence patterns in the First Light realm.",
    kanjiTitle: "N5 Kanji Academy",
    kanjiSubtitle: "Track every kanji on your N5 climb.",
    readingTitle: "N5 Reading",
    readingSubtitle: "Stories and dialogs for N5 comprehension.",
    listeningTitle: "N5 Listening",
    listeningSubtitle: "Audio lessons and listening challenges for N5.",
  },
  n4: {
    jlptLevel: "n4",
    regionSlug: "n4",
    regionName: "Realm of the Green Ascent",
    vocabularyTitle: "N4 Vocabulary",
    vocabularySubtitle: "Track every word on your Mount N4 ascent.",
    grammarTitle: "N4 Grammar",
    grammarSubtitle: "Master sentence patterns on Mount N4.",
    kanjiTitle: "N4 Kanji Academy",
    kanjiSubtitle: "Track every kanji on your Mount N4 ascent.",
    readingTitle: "N4 Reading",
    readingSubtitle: "Stories and dialogs for N4 comprehension.",
    listeningTitle: "N4 Listening",
    listeningSubtitle: "Audio lessons and listening challenges for N4.",
  },
};

export function getJlptContentHub(jlptLevel: JlptLevel): JlptContentHub {
  if (jlptLevel === "n4") {
    return JLPT_CONTENT_HUBS.n4;
  }

  return JLPT_CONTENT_HUBS.n5;
}

export function getJlptQueryString(jlptLevel: JlptLevel): string {
  return jlptLevel === "n5" ? "" : `?jlpt=${jlptLevel}`;
}
