import { HiraganaChart } from "@/features/hiragana/components/hiragana-chart";
import { getHiraganaChart } from "@/lib/orchestration/learn.orchestrator";

export default async function HiraganaChartPage() {
  const chart = await getHiraganaChart();
  return <HiraganaChart chart={chart} />;
}
