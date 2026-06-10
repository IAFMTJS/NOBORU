import { VocabularyList } from "@/features/vocabulary/components/vocabulary-list";
import {
  getVocabularyList,
  resolveJlptLevel,
} from "@/lib/orchestration/learn.orchestrator";

type VocabularyListPageProps = {
  searchParams: Promise<{ jlpt?: string }>;
};

export default async function VocabularyListPage({
  searchParams,
}: VocabularyListPageProps) {
  const params = await searchParams;
  const jlptLevel = resolveJlptLevel(params.jlpt);
  const list = await getVocabularyList(jlptLevel);
  return <VocabularyList list={list} jlptLevel={jlptLevel} />;
}
