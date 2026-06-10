"use client";

import dynamic from "next/dynamic";

import type { StoryDetailViewModel } from "@/features/reading/types/reading.types";

function PlayerSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg bg-muted" aria-hidden />;
}

const StoryReader = dynamic(
  () =>
    import("@/features/reading/components/story-reader").then(
      (module) => module.StoryReader,
    ),
  { loading: () => <PlayerSkeleton /> },
);

type StoryPageShellProps = {
  story: StoryDetailViewModel;
};

export function StoryPageShell({ story }: StoryPageShellProps) {
  return <StoryReader story={story} />;
}
