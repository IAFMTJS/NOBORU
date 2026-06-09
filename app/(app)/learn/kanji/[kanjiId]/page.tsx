import { notFound } from "next/navigation";

import { KanjiDetail } from "@/features/kanji/components/kanji-detail";
import { getKanjiDetail } from "@/lib/orchestration/learn.orchestrator";

type KanjiDetailPageProps = {
  params: Promise<{ kanjiId: string }>;
};

export default async function KanjiDetailPage({ params }: KanjiDetailPageProps) {
  const { kanjiId } = await params;
  const kanji = await getKanjiDetail(kanjiId);

  if (!kanji) {
    notFound();
  }

  return <KanjiDetail kanji={kanji} />;
}
