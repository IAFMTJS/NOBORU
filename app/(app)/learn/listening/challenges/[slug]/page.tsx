import { notFound } from "next/navigation";

import { ListeningChallengePageShell } from "@/features/listening/components/listening-challenge-page-shell";
import { getListeningChallengeDetail } from "@/lib/orchestration/learn.orchestrator";

type ChallengePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ListeningChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  const challenge = await getListeningChallengeDetail(slug);

  if (!challenge) {
    notFound();
  }

  return <ListeningChallengePageShell challenge={challenge} />;
}
