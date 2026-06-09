import { GrammarList } from "@/features/grammar/components/grammar-list";
import { getN5GrammarList } from "@/lib/orchestration/learn.orchestrator";

export default async function GrammarListPage() {
  const list = await getN5GrammarList();
  return <GrammarList list={list} />;
}
