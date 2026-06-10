import { createClient } from "@/lib/supabase/server";

import type {
  TrialStepRow,
  TrialTemplateRow,
} from "@/features/trials/types/trial.types";

class TrialTemplateRepository {
  async listPublished(): Promise<TrialTemplateRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trial_templates")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as TrialTemplateRow[];
  }

  async findBySlug(slug: string): Promise<TrialTemplateRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trial_templates")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as TrialTemplateRow | null;
  }

  async listStepsByTemplateId(templateId: string): Promise<TrialStepRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trial_steps")
      .select("*")
      .eq("trial_template_id", templateId)
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as TrialStepRow[];
  }

  async countStepsByTemplateIds(
    templateIds: string[],
  ): Promise<Map<string, number>> {
    if (templateIds.length === 0) return new Map();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trial_steps")
      .select("trial_template_id")
      .in("trial_template_id", templateIds);

    if (error) throw new Error(error.message);

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const templateId = row.trial_template_id as string;
      counts.set(templateId, (counts.get(templateId) ?? 0) + 1);
    }
    return counts;
  }
}

export const trialTemplateRepository = new TrialTemplateRepository();
