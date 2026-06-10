import { notFound } from "next/navigation";

import { DialoguePageShell } from "@/features/reading/components/dialogue-page-shell";
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

  return <DialoguePageShell dialogue={dialogue} />;
}
