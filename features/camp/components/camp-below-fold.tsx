import { CampBelowFoldClient } from "@/features/camp/components/camp-below-fold-client";
import type { CampBelowFoldViewModel } from "@/features/camp/types/camp.types";

type CampBelowFoldProps = {
  belowFold: CampBelowFoldViewModel;
};

export function CampBelowFold({ belowFold }: CampBelowFoldProps) {
  return <CampBelowFoldClient belowFold={belowFold} />;
}
