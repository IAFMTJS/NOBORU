import { cache } from "react";

import { progressRepository } from "@/features/learning/repositories/learning-path.repository";

export const getCachedProgressRows = cache((userId: string) =>
  progressRepository.listByUserId(userId),
);
