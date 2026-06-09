import { KatakanaChart } from "@/features/katakana/components/katakana-chart";
import { getKatakanaChart } from "@/lib/orchestration/learn.orchestrator";

export default async function KatakanaChartPage() {
  const chart = await getKatakanaChart();
  return <KatakanaChart chart={chart} />;
}
