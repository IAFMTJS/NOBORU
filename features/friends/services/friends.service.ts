import { friendsRepository } from "@/features/friends/repositories/friends.repository";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import type { FriendsDashboardViewModel } from "@/features/friends/types/friends.types";

class FriendsService {
  async getDashboard(userId: string): Promise<FriendsDashboardViewModel> {
    const [followingIds, followerIds] = await Promise.all([
      friendsRepository.listFollowing(userId),
      friendsRepository.listFollowers(userId),
    ]);

    const allIds = [...new Set([...followingIds, ...followerIds])];
    const names = await profileServerRepository.findDisplayNamesByUserIds(allIds);

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
