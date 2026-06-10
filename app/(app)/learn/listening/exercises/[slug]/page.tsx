import { notFound } from "next/navigation";

import { ListeningExercisePageShell } from "@/features/listening/components/listening-exercise-page-shell";
import { getListeningExerciseDetail } from "@/lib/orchestration/learn.orchestrator";

type ExercisePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ListeningExercisePage({ params }: ExercisePageProps) {
  const { slug } = await params;
  const exercise = await getListeningExerciseDetail(slug);

  if (!exercise) {
    notFound();
  }

  return <ListeningExercisePageShell exercise={exercise} />;
}
