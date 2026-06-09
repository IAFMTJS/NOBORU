import { notFound } from "next/navigation";

import { DialoguePlayer } from "@/features/reading/components/dialogue-player";
import { getDialogueDetail } from "@/lib/orchestration/learn.orchestrator";

type DialoguePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DialoguePage({ params }: DialoguePageProps) {
  const { slug } = await params;
  const dialogue = await getDialogueDetail(slug);

  if (!dialogue) {
    notFound();
  }

  return <DialoguePlayer dialogue={dialogue} />;
}
