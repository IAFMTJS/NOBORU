"use client";

import dynamic from "next/dynamic";

import type { ListeningChallengeDetailViewModel } from "@/features/listening/types/listening.types";

function PlayerSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg bg-muted" aria-hidden />;
}

const ListeningChallengePlayer = dynamic(
  () =>
    import("@/features/listening/components/listening-challenge-player").then(
      (module) => module.ListeningChallengePlayer,
    ),
  { loading: () => <PlayerSkeleton /> },
);

type ListeningChallengePageShellProps = {
  challenge: ListeningChallengeDetailViewModel;
};

export function ListeningChallengePageShell({
  challenge,
}: ListeningChallengePageShellProps) {
  return <ListeningChallengePlayer challenge={challenge} />;
}
