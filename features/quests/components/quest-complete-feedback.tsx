import { Badge } from "@/components/ui/badge";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import { YamaReaction } from "@/features/yama/components/yama-reaction";
import { yamaService } from "@/features/yama/services/yama.service";

type QuestCompleteFeedbackProps = {
  completions: QuestCompletionViewModel[];
};

export function QuestCompleteFeedback({ completions }: QuestCompleteFeedbackProps) {
  if (completions.length === 0) return null;

  return (
    <div className="motion-reward space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <YamaReaction presence={yamaService.resolveQuestReaction()} />
      <p className="text-body-sm font-medium">Quest complete</p>
      {completions.map((quest) => (
        <div
          key={quest.id}
          className="flex flex-wrap items-center justify-between gap-2"
        >
          <span className="text-body-sm">{quest.title}</span>
          <Badge variant="outline">+{quest.epAwarded} EP</Badge>
        </div>
      ))}
    </div>
  );
}
