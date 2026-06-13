import { friendsRepository } from "@/features/friends/repositories/friends.repository";
import type { FriendsDashboardViewModel } from "@/features/friends/types/friends.types";

async function displayNamesForUsers(
  userIds: string[],
): Promise<Map<string, string>> {
  if (userIds.length === 0) return new Map();

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createClient(),
  );
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    const profile = row as { id: string; display_name: string | null };
    map.set(profile.id, profile.display_name ?? "Climber");
  }
  return map;
}

class FriendsService {
  async getDashboard(userId: string): Promise<FriendsDashboardViewModel> {
    const [followingIds, followerIds] = await Promise.all([
      friendsRepository.listFollowing(userId),
      friendsRepository.listFollowers(userId),
    ]);

    const allIds = [...new Set([...followingIds, ...followerIds])];
    const names = await displayNamesForUsers(allIds);

    const activityRows = await friendsRepository.listActivityForUsers(
      followingIds.length > 0 ? followingIds : [userId],
    );

    return {
      following: followingIds.map((id) => ({
        userId: id,
        displayName: names.get(id) ?? "Climber",
        isFollowing: true,
      })),
      followers: followerIds.map((id) => ({
        userId: id,
        displayName: names.get(id) ?? "Climber",
        isFollowing: followingIds.includes(id),
      })),
      activityFeed: activityRows.map((row) => ({
        userId: row.user_id,
        displayName: names.get(row.user_id) ?? "Climber",
        activityType: row.activity_type,
        activityLabel: row.activity_label,
        createdAt: row.created_at,
      })),
    };
  }

  async follow(userId: string, targetUserId: string): Promise<void> {
    await friendsRepository.follow(userId, targetUserId);
  }

  async unfollow(userId: string, targetUserId: string): Promise<void> {
    await friendsRepository.unfollow(userId, targetUserId);
  }

  async recordActivity(
    userId: string,
    activityType: string,
    activityLabel: string,
  ): Promise<void> {
    await friendsRepository.insertActivity({
      userId,
      activityType,
      activityLabel,
    });
  }
}

export const friendsService = new FriendsService();
