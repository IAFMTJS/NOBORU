import { notFound } from "next/navigation";

import { ListeningChallengePlayer } from "@/features/listening/components/listening-challenge-player";
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

  return <ListeningChallengePlayer challenge={challenge} />;
}
