-- Phase 18 (Daily Quest System): quest templates, daily progress, MVP seeds

create type public.quest_metric as enum (
  'learn_vocabulary',
  'complete_lessons',
  'review_items',
  'earn_ep'
);

create table public.quest_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  metric public.quest_metric not null,
  target_value integer not null check (target_value > 0),
  ep_reward integer not null check (ep_reward > 0),
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_daily_quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quest_template_id uuid not null references public.quest_templates (id) on delete cascade,
  quest_date date not null,
  progress integer not null default 0 check (progress >= 0),
  target_value integer not null check (target_value > 0),
  completed boolean not null default false,
  completed_at timestamptz,
  ep_awarded integer check (ep_awarded is null or ep_awarded > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, quest_template_id, quest_date)
);

create index user_daily_quests_user_date_idx
  on public.user_daily_quests (user_id, quest_date desc);

create trigger quest_templates_set_updated_at
  before update on public.quest_templates
  for each row execute function public.set_updated_at();

create trigger user_daily_quests_set_updated_at
  before update on public.user_daily_quests
  for each row execute function public.set_updated_at();

alter table public.quest_templates enable row level security;
alter table public.user_daily_quests enable row level security;

create policy "Authenticated users read published quest templates"
  on public.quest_templates for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage quest templates"
  on public.quest_templates for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own daily quests"
  on public.user_daily_quests for select
  using (auth.uid() = user_id);

create policy "Users insert own daily quests"
  on public.user_daily_quests for insert
  with check (auth.uid() = user_id);

create policy "Users update own daily quests"
  on public.user_daily_quests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into public.quest_templates (
  slug,
  title,
  description,
  metric,
  target_value,
  ep_reward,
  sort_order,
  status
)
select *
from (
  values
    (
      'learn-vocabulary',
      'Learn 10 Words',
      'Learn 10 new vocabulary items today.',
      'learn_vocabulary'::public.quest_metric,
      10,
      50,
      1,
      'published'::public.content_status
    ),
    (
      'complete-lessons',
      'Complete 2 Lessons',
      'Finish 2 full lessons today.',
      'complete_lessons'::public.quest_metric,
      2,
      75,
      2,
      'published'::public.content_status
    ),
    (
      'review-items',
      'Review 20 Items',
      'Complete 20 SRS review ratings today.',
      'review_items'::public.quest_metric,
      20,
      75,
      3,
      'published'::public.content_status
    ),
    (
      'earn-ep',
      'Earn 100 EP',
      'Gain 100 elevation points from learning today.',
      'earn_ep'::public.quest_metric,
      100,
      100,
      4,
      'published'::public.content_status
    )
) as seed (slug, title, description, metric, target_value, ep_reward, sort_order, status)
where not exists (
  select 1 from public.quest_templates existing where existing.slug = seed.slug
);
