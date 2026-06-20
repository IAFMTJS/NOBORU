import { journeyService } from "@/features/journey/services/journey.service";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import {
  getJlptWorldDefinition,
  isRegisteredJlptWorld,
} from "@/features/worlds/constants/world-registry.constants";
import {
  canEnterWorld,
  filterJourneyPathForWorld,
  resolveCurrentWorldIdFromPath,
} from "@/features/worlds/utils/world-path-filter.utils";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import type { JlptLevel } from "@/lib/content/types";

class WorldService {
  async getWorldPath(userId: string, jlptLevel: JlptLevel): Promise<JlptWorldPathViewModel> {
    const world = getJlptWorldDefinition(jlptLevel);
    const [journey, passedTrialSlugs] = await Promise.all([
      journeyService.getJourneyPath(userId),
      learningPathService.getPassedTrialSlugs(userId),
    ]);

    if (!canEnterWorld(world, passedTrialSlugs)) {
      throw new WorldAccessDeniedError(jlptLevel, world.entryTrialSlug);
    }

    return filterJourneyPathForWorld(journey, world);
  }

  async resolveCurrentWorldId(userId: string): Promise<JlptLevel> {
    const journey = await journeyService.getJourneyPath(userId);
    return resolveCurrentWorldIdFromPath(journey);
  }

  async getPassedTrialSlugs(userId: string): Promise<ReadonlySet<string>> {
    return learningPathService.getPassedTrialSlugs(userId);
  }

  isValidWorldId(value: string): value is JlptLevel {
    return isRegisteredJlptWorld(value);
  }
}

export class WorldAccessDeniedError extends Error {
  readonly jlptLevel: JlptLevel;
  readonly requiredTrialSlug: string | null;

  constructor(jlptLevel: JlptLevel, requiredTrialSlug: string | null) {
    super(`World ${jlptLevel} is locked`);
    this.name = "WorldAccessDeniedError";
    this.jlptLevel = jlptLevel;
    this.requiredTrialSlug = requiredTrialSlug;
  }
}

export const worldService = new WorldService();
