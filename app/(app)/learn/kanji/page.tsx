import { KanjiList } from "@/features/kanji/components/kanji-list";
import { getN5KanjiList } from "@/lib/orchestration/learn.orchestrator";

export default async function KanjiListPage() {
  const list = await getN5KanjiList();
  return <KanjiList list={list} />;
}
