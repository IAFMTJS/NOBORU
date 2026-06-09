import { VocabularyList } from "@/features/vocabulary/components/vocabulary-list";
import { getN5VocabularyList } from "@/lib/orchestration/learn.orchestrator";

export default async function VocabularyListPage() {
  const list = await getN5VocabularyList();
  return <VocabularyList list={list} />;
}
