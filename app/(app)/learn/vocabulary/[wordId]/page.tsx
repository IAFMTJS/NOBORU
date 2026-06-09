import { notFound } from "next/navigation";

import { VocabularyDetail } from "@/features/vocabulary/components/vocabulary-detail";
import { getVocabularyDetail } from "@/lib/orchestration/learn.orchestrator";

type VocabularyDetailPageProps = {
  params: Promise<{ wordId: string }>;
};

export default async function VocabularyDetailPage({
  params,
}: VocabularyDetailPageProps) {
  const { wordId } = await params;
  const word = await getVocabularyDetail(wordId);

  if (!word) {
    notFound();
  }

  return <VocabularyDetail word={word} />;
}
