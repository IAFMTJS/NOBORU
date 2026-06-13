import { createClient } from "@/lib/supabase/server";

import type { FriendActivityRow } from "@/features/friends/types/friends.types";

class FriendsRepository {
  async follow(followerId: string, followingId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("friends").insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error && !error.message.includes("duplicate")) {
      throw new Error(error.message);
    }
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) throw new Error(error.message);
  }

  async listFollowing(userId: string): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("friends")
      .select("following_id")
      .eq("follower_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => (row as { following_id: string }).following_id);
  }

  async listFollowers(userId: string): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("friends")
      .select("follower_id")
      .eq("following_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => (row as { follower_id: string }).follower_id);
  }

  async insertActivity(input: {
    userId: string;
    activityType: string;
    activityLabel: string;
  }): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("friend_activity").insert({
      user_id: input.userId,
      activity_type: input.activityType,
      activity_label: input.activityLabel,
    });

    if (error) throw new Error(error.message);
  }

  async listActivityForUsers(
    userIds: string[],
    limit = 20,
  ): Promise<FriendActivityRow[]> {
    if (userIds.length === 0) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("friend_activity")
      .select("*")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data as FriendActivityRow[]) ?? [];
  }
}

export const friendsRepository = new FriendsRepository();
