import {
  getWorldHref,
  getNextWorld,
} from "@/features/worlds/constants/world-registry.constants";
import {
  canEnterWorld,
  isWorldCurriculumComplete,
} from "@/features/worlds/utils/world-path-filter.utils";
import type { JlptWorldPathViewModel, WorldPortalState } from "@/features/worlds/types/world.types";

export function resolveWorldPortalState(
  worldPath: JlptWorldPathViewModel,
  passedTrialSlugs: ReadonlySet<string>,
): WorldPortalState {
  const { world } = worldPath;
  const curriculumComplete = isWorldCurriculumComplete(worldPath);
  const exitTrialPassed =
    !world.exitTrialSlug || passedTrialSlugs.has(world.exitTrialSlug);

  const visible = curriculumComplete || exitTrialPassed;
  const nextWorld = world.nextWorldId ? getNextWorld(world.id) : null;
  const nextWorldUnlocked =
    nextWorld != null && canEnterWorld(nextWorld, passedTrialSlugs);

  return {
    visible,
    unlocked: visible && exitTrialPassed && (nextWorld == null || nextWorldUnlocked),
    nextWorldId: world.nextWorldId,
    nextWorldHref: world.nextWorldId ? getWorldHref(world.nextWorldId) : null,
    label: world.portalLabel,
    description: world.portalDescription,
  };
}
