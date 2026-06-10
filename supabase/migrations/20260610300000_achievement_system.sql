-- Phase 16: Achievement system (unlock tracking, streaks, MVP seeds)

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table public.user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_study_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_achievements_user_unlocked_idx
  on public.user_achievements (user_id, unlocked_at desc);

create index user_achievements_achievement_id_idx
  on public.user_achievements (achievement_id);

create trigger user_streaks_set_updated_at
  before update on public.user_streaks
  for each row execute function public.set_updated_at();

alter table public.user_achievements enable row level security;
alter table public.user_streaks enable row level security;

create policy "Users read own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users insert own achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

create policy "Users read own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users insert own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users update own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into public.achievements (
  name,
  slug,
  description,
  rarity,
  reward_type,
  reward_value,
  status
)
select *
from (
  values
    (
      'First Step',
      'first-step',
      'Complete onboarding and begin your climb.',
      'common'::public.achievement_rarity,
      'ep',
      25,
      'published'::public.content_status
    ),
    (
      'First Lesson',
      'first-lesson',
      'Complete your first lesson.',
      'common'::public.achievement_rarity,
      'ep',
      25,
      'published'::public.content_status
    ),
    (
      'Trail Walker',
      'ten-lessons',
      'Complete 10 lessons on the path.',
      'uncommon'::public.achievement_rarity,
      'ep',
      50,
      'published'::public.content_status
    ),
    (
      'Word Collector',
      'hundred-words',
      'Learn 100 vocabulary items.',
      'rare'::public.achievement_rarity,
      'ep',
      100,
      'published'::public.content_status
    ),
    (
      'Kanji Scholar',
      'fifty-kanji',
      'Master 50 kanji characters.',
      'rare'::public.achievement_rarity,
      'ep',
      100,
      'published'::public.content_status
    ),
    (
      'Steady Climber',
      'seven-day-streak',
      'Study for 7 consecutive days.',
      'epic'::public.achievement_rarity,
      'ep',
      200,
      'published'::public.content_status
    ),
    (
      'N5 Summit',
      'n5-completed',
      'Complete all lessons in Mount N5.',
      'legendary'::public.achievement_rarity,
      'ep',
      350,
      'published'::public.content_status
    )
) as seed (name, slug, description, rarity, reward_type, reward_value, status)
where not exists (
  select 1 from public.achievements existing where existing.slug = seed.slug
);
