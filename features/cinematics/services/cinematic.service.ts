import { createClient } from "@/lib/supabase/server";

import type { CinematicSlug } from "@/features/cinematics/constants/cinematic.constants";

class CinematicRepository {
  async hasViewed(userId: string, slug: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_cinematic_views")
      .select("id")
      .eq("user_id", userId)
      .eq("cinematic_slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return Boolean(data);
  }

  async markViewed(userId: string, slug: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("user_cinematic_views").upsert(
      { user_id: userId, cinematic_slug: slug },
      { onConflict: "user_id,cinematic_slug" },
    );

    if (error) throw new Error(error.message);
  }
}

class CinematicService {
  private readonly repo = new CinematicRepository();

  async shouldPlay(userId: string, slug: CinematicSlug): Promise<boolean> {
    const viewed = await this.repo.hasViewed(userId, slug);
    return !viewed;
  }

  async markPlayed(userId: string, slug: CinematicSlug): Promise<void> {
    await this.repo.markViewed(userId, slug);
  }
}

export const cinematicService = new CinematicService();
