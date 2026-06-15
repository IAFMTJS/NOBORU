import { RewardChip } from "@/components/visual/reward-chip";
import { RecognitionPost } from "@/components/visual/world/recognition-post";
import type { LeaderboardEntryViewModel } from "@/features/social/types/social.types";

type FriendsLeaderboardRowProps = {
  entry: LeaderboardEntryViewModel;
};

export function FriendsLeaderboardRow({ entry }: FriendsLeaderboardRowProps) {
  return (
    <RecognitionPost
      rank={entry.rank}
      displayName={entry.displayName}
      titleLabel={entry.titleLabel}
      regionLabel={entry.regionLabel}
      achievementCount={entry.achievementCount}
      highlight={entry.isCurrentUser}
      trailing={<RewardChip variant="xp">{entry.weeklyEp} EP</RewardChip>}
    />
  );
}
