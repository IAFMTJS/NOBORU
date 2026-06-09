import { notFound } from "next/navigation";

import { GrammarDetail } from "@/features/grammar/components/grammar-detail";
import { getGrammarDetail } from "@/lib/orchestration/learn.orchestrator";

type GrammarDetailPageProps = {
  params: Promise<{ grammarId: string }>;
};

export default async function GrammarDetailPage({
  params,
}: GrammarDetailPageProps) {
  const { grammarId } = await params;
  const grammar = await getGrammarDetail(grammarId);

  if (!grammar) {
    notFound();
  }

  return <GrammarDetail grammar={grammar} />;
}
