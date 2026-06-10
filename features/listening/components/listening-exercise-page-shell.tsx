"use client";

import dynamic from "next/dynamic";

import type { ListeningExerciseDetailViewModel } from "@/features/listening/types/listening.types";

function PlayerSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg bg-muted" aria-hidden />;
}

const ListeningExercisePlayer = dynamic(
  () =>
    import("@/features/listening/components/listening-exercise-player").then(
      (module) => module.ListeningExercisePlayer,
    ),
  { loading: () => <PlayerSkeleton /> },
);

type ListeningExercisePageShellProps = {
  exercise: ListeningExerciseDetailViewModel;
};

export function ListeningExercisePageShell({
  exercise,
}: ListeningExercisePageShellProps) {
  return <ListeningExercisePlayer exercise={exercise} />;
}
