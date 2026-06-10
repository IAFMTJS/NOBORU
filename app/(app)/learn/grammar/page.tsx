import { GrammarList } from "@/features/grammar/components/grammar-list";
import {
  getGrammarList,
  resolveJlptLevel,
} from "@/lib/orchestration/learn.orchestrator";

type GrammarListPageProps = {
  searchParams: Promise<{ jlpt?: string }>;
};

export default async function GrammarListPage({
  searchParams,
}: GrammarListPageProps) {
  const params = await searchParams;
  const jlptLevel = resolveJlptLevel(params.jlpt);
  const list = await getGrammarList(jlptLevel);
  return <GrammarList list={list} jlptLevel={jlptLevel} />;
}
