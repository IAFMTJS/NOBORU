import { KanjiList } from "@/features/kanji/components/kanji-list";
import {
  getKanjiList,
  resolveJlptLevel,
} from "@/lib/orchestration/learn.orchestrator";

type KanjiListPageProps = {
  searchParams: Promise<{ jlpt?: string }>;
};

export default async function KanjiListPage({
  searchParams,
}: KanjiListPageProps) {
  const params = await searchParams;
  const jlptLevel = resolveJlptLevel(params.jlpt);
  const list = await getKanjiList(jlptLevel);
  return <KanjiList list={list} jlptLevel={jlptLevel} />;
}
