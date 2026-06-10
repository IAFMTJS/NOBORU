"use client";

import dynamic from "next/dynamic";

import type { DialogueDetailViewModel } from "@/features/reading/types/reading.types";

function PlayerSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg bg-muted" aria-hidden />;
}

const DialoguePlayer = dynamic(
  () =>
    import("@/features/reading/components/dialogue-player").then(
      (module) => module.DialoguePlayer,
    ),
  { loading: () => <PlayerSkeleton /> },
);

type DialoguePageShellProps = {
  dialogue: DialogueDetailViewModel;
};

export function DialoguePageShell({ dialogue }: DialoguePageShellProps) {
  return <DialoguePlayer dialogue={dialogue} />;
}
