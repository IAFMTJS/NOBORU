import type {
  OfflineSyncConflictResolution,
  OfflineSyncMutationType,
} from "@/lib/offline/types";

/**
 * Educational progress is authoritative. Gamification follows server replay.
 */
export function resolveSyncConflict(input: {
  type: OfflineSyncMutationType;
  alreadyApplied: boolean;
  serverCompleted?: boolean;
}): OfflineSyncConflictResolution {
  if (input.alreadyApplied) {
    return "already_applied";
  }

  if (
    input.type === "lesson_complete" &&
    input.serverCompleted
  ) {
    return "server_wins";
  }

  return "applied";
}

export function conflictMessage(resolution: OfflineSyncConflictResolution): string {
  switch (resolution) {
    case "already_applied":
      return "This offline action was already synced.";
    case "server_wins":
      return "Server progress was kept because the lesson was already completed.";
    case "merged":
      return "Offline progress was merged with server state.";
    case "applied":
    default:
      return "Offline action applied successfully.";
  }
}
