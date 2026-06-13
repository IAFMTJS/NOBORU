import type { CompanionViewModel } from "@/features/companion/types/companion.types";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

type CompanionBadgeProps = {
  companion: CompanionViewModel;
};

export function CompanionBadge({ companion }: CompanionBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">Bond Lv.{companion.bondLevel}</Badge>
      <span className="text-caption text-muted-foreground">
        {companion.evolutionName}
      </span>
      <ProgressBar
        value={companion.progressPercent}
        showValue={false}
        className="h-1.5 w-16"
      />
    </div>
  );
}
