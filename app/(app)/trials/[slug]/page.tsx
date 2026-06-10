import { notFound } from "next/navigation";

import { TrialPlayer } from "@/features/trials/components/trial-player";
import { getTrialSession } from "@/lib/orchestration/trials.orchestrator";

type TrialPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TrialPage({ params }: TrialPageProps) {
  const { slug } = await params;

  try {
    const session = await getTrialSession(slug);
    if (!session) notFound();
    return <TrialPlayer session={session} />;
  } catch {
    notFound();
  }
}
