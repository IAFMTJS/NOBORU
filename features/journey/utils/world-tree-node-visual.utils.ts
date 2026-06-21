import type { JourneyNodeState } from "@/features/journey/types/journey.types";

/** Visual weight for nodes on the World Tree canvas. */
export function resolveWorldTreeNodeOpacity(
  state: JourneyNodeState,
  isCurrent: boolean,
): number {
  if (isCurrent) return 1;
  if (state === "completed") return 0.55;
  if (state === "locked") return 0.38;
  return 0.92;
}

export function resolveWorldTreeNodeAriaLabel(input: {
  label: string;
  state: JourneyNodeState;
  isCurrent: boolean;
}): string {
  if (input.isCurrent) return `Next lesson: ${input.label}`;
  if (input.state === "completed") return `Completed: ${input.label}`;
  if (input.state === "locked") return `Locked: ${input.label}`;
  return input.label;
}
