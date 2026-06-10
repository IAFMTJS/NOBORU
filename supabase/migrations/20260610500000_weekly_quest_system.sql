-- Phase 18 completion: weekly quests and quest template periods

create type public.quest_period as enum ('daily', 'weekly');

alter table public.quest_templates
  add column if not exists period public.quest_period not null default 'daily';

create table public.user_weekly_quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quest_template_id uuid not null references public.quest_templates (id) on delete cascade,
  week_start date not null,
  progress integer not null default 0 check (progress >= 0),
  target_value integer not null check (target_value > 0),
  completed boolean not null default false,
  completed_at timestamptz,
  ep_awarded integer check (ep_awarded is null or ep_awarded > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, quest_template_id, week_start)
);

create index user_weekly_quests_user_week_idx
  on public.user_weekly_quests (user_id, week_start desc);

create trigger user_weekly_quests_set_updated_at
  before update on public.user_weekly_quests
  for each row execute function public.set_updated_at();

alter table public.user_weekly_quests enable row level security;

create policy "Users read own weekly quests"
  on public.user_weekly_quests for select
  using (auth.uid() = user_id);

create policy "Users insert own weekly quests"
  on public.user_weekly_quests for insert
  with check (auth.uid() = user_id);

create policy "Users update own weekly quests"
  on public.user_weekly_quests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

update public.quest_templates
set period = 'daily'
where period is null
  or slug in ('learn-vocabulary', 'complete-lessons', 'review-items', 'earn-ep');

insert into public.quest_templates (
  slug,
  title,
  description,
  metric,
  target_value,
  ep_reward,
  sort_order,
  period,
  status
)
select *
from (
  values
    (
      'weekly-complete-lessons',
      'Weekly Climber',
      'Complete 5 lessons this week.',
      'complete_lessons'::public.quest_metric,
      5,
      150,
      1,
      'weekly'::public.quest_period,
      'published'::public.content_status
    ),
    (
      'weekly-review-items',
      'Weekly Reviewer',
      'Complete 100 review ratings this week.',
      'review_items'::public.quest_metric,
      100,
      150,
      2,
      'weekly'::public.quest_period,
      'published'::public.content_status
    )
) as seed (slug, title, description, metric, target_value, ep_reward, sort_order, period, status)
where not exists (
  select 1 from public.quest_templates existing where existing.slug = seed.slug
);
