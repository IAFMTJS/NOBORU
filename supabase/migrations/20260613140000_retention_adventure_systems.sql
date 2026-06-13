-- Retention adventure systems: companion, chests, collectibles, leagues, friends, shrine protection

-- ---------------------------------------------------------------------------
-- Companion system
-- ---------------------------------------------------------------------------

create table public.companion_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  min_bond_level integer not null default 1 check (min_bond_level >= 1 and min_bond_level <= 50),
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companion_outfits (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  companion_definition_id uuid not null references public.companion_definitions (id) on delete cascade,
  name text not null,
  description text,
  min_bond_level integer not null default 1 check (min_bond_level >= 1 and min_bond_level <= 50),
  asset_key text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_companion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  bond_level integer not null default 1 check (bond_level >= 1 and bond_level <= 50),
  bond_xp integer not null default 0 check (bond_xp >= 0),
  evolution_slug text not null default 'young_fox',
  equipped_outfit_id uuid references public.companion_outfits (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_companion_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  unlock_type text not null check (unlock_type in ('evolution', 'outfit', 'animation', 'effect')),
  unlock_slug text not null,
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, unlock_type, unlock_slug)
);

-- ---------------------------------------------------------------------------
-- Collectibles
-- ---------------------------------------------------------------------------

create table public.collectible_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  region_slug text not null,
  name text not null,
  description text,
  category text not null check (category in ('lantern', 'spirit', 'relic', 'scroll', 'token', 'artifact')),
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_collectibles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  collectible_id uuid not null references public.collectible_definitions (id) on delete cascade,
  earned_at timestamptz not null default now(),
  source_type text not null check (source_type in ('trial', 'chest', 'lesson', 'event', 'achievement')),
  source_id text,
  created_at timestamptz not null default now(),
  unique (user_id, collectible_id)
);

-- ---------------------------------------------------------------------------
-- Chests (deterministic rewards)
-- ---------------------------------------------------------------------------

create type public.chest_kind as enum (
  'daily',
  'weekly',
  'boss',
  'streak'
);

create table public.chest_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind public.chest_kind not null,
  title text not null,
  description text,
  ep_reward integer not null default 0 check (ep_reward >= 0),
  bond_xp_reward integer not null default 0 check (bond_xp_reward >= 0),
  collectible_slug text,
  shrine_protection_grant integer not null default 0 check (shrine_protection_grant >= 0),
  streak_milestone_days integer,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_chest_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  chest_template_id uuid not null references public.chest_templates (id) on delete cascade,
  claim_period_key text not null,
  claimed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, chest_template_id, claim_period_key)
);

-- ---------------------------------------------------------------------------
-- Shrine protection (calm streak insurance)
-- ---------------------------------------------------------------------------

create table public.user_shrine_protection (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  tokens_available integer not null default 0 check (tokens_available >= 0),
  tokens_used integer not null default 0 check (tokens_used >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leagues
-- ---------------------------------------------------------------------------

create type public.league_tier as enum (
  'bronze_trail',
  'silver_trail',
  'gold_trail',
  'platinum_trail',
  'diamond_summit',
  'master_summit',
  'legend_summit'
);

create table public.league_seasons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('upcoming', 'active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.league_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  season_id uuid not null references public.league_seasons (id) on delete cascade,
  tier public.league_tier not null default 'bronze_trail',
  weekly_ep integer not null default 0 check (weekly_ep >= 0),
  opted_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, season_id)
);

-- ---------------------------------------------------------------------------
-- Friends
-- ---------------------------------------------------------------------------

create table public.friends (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users (id) on delete cascade,
  following_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);

create table public.friend_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_type text not null check (activity_type in ('lesson_complete', 'trial_pass', 'level_up', 'achievement')),
  activity_label text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Random events & cinematics tracking
-- ---------------------------------------------------------------------------

create table public.user_event_encounters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_slug text not null,
  encountered_at timestamptz not null default now(),
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.user_cinematic_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cinematic_slug text not null,
  viewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, cinematic_slug)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index user_companion_user_idx on public.user_companion (user_id);
create index user_collectibles_user_idx on public.user_collectibles (user_id);
create index user_chest_claims_user_idx on public.user_chest_claims (user_id, claimed_at desc);
create index league_memberships_season_idx on public.league_memberships (season_id, weekly_ep desc);
create index friends_follower_idx on public.friends (follower_id);
create index friends_following_idx on public.friends (following_id);
create index friend_activity_user_idx on public.friend_activity (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create trigger companion_definitions_set_updated_at
  before update on public.companion_definitions
  for each row execute function public.set_updated_at();

create trigger companion_outfits_set_updated_at
  before update on public.companion_outfits
  for each row execute function public.set_updated_at();

create trigger user_companion_set_updated_at
  before update on public.user_companion
  for each row execute function public.set_updated_at();

create trigger collectible_definitions_set_updated_at
  before update on public.collectible_definitions
  for each row execute function public.set_updated_at();

create trigger chest_templates_set_updated_at
  before update on public.chest_templates
  for each row execute function public.set_updated_at();

create trigger user_shrine_protection_set_updated_at
  before update on public.user_shrine_protection
  for each row execute function public.set_updated_at();

create trigger league_seasons_set_updated_at
  before update on public.league_seasons
  for each row execute function public.set_updated_at();

create trigger league_memberships_set_updated_at
  before update on public.league_memberships
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.companion_definitions enable row level security;
alter table public.companion_outfits enable row level security;
alter table public.user_companion enable row level security;
alter table public.user_companion_unlocks enable row level security;
alter table public.collectible_definitions enable row level security;
alter table public.user_collectibles enable row level security;
alter table public.chest_templates enable row level security;
alter table public.user_chest_claims enable row level security;
alter table public.user_shrine_protection enable row level security;
alter table public.league_seasons enable row level security;
alter table public.league_memberships enable row level security;
alter table public.friends enable row level security;
alter table public.friend_activity enable row level security;
alter table public.user_event_encounters enable row level security;
alter table public.user_cinematic_views enable row level security;

create policy "Authenticated read companion definitions"
  on public.companion_definitions for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Authenticated read companion outfits"
  on public.companion_outfits for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Users manage own companion"
  on public.user_companion for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own companion unlocks"
  on public.user_companion_unlocks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated read collectible definitions"
  on public.collectible_definitions for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Users manage own collectibles"
  on public.user_collectibles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated read chest templates"
  on public.chest_templates for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Users manage own chest claims"
  on public.user_chest_claims for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own shrine protection"
  on public.user_shrine_protection for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated read league seasons"
  on public.league_seasons for select
  using (auth.uid() is not null);

create policy "Users manage own league membership"
  on public.league_memberships for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read league memberships for leaderboards"
  on public.league_memberships for select
  using (auth.uid() is not null and opted_in = true);

create policy "Users manage own friend follows"
  on public.friends for all
  using (auth.uid() = follower_id)
  with check (auth.uid() = follower_id);

create policy "Users read friend follows"
  on public.friends for select
  using (auth.uid() = follower_id or auth.uid() = following_id);

create policy "Users read friend activity"
  on public.friend_activity for select
  using (auth.uid() is not null);

create policy "Users insert own friend activity"
  on public.friend_activity for insert
  with check (auth.uid() = user_id);

create policy "Users manage own event encounters"
  on public.user_event_encounters for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own cinematic views"
  on public.user_cinematic_views for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------

insert into public.companion_definitions (slug, name, description, min_bond_level, sort_order) values
  ('young_fox', 'Young Fox', 'Yama at the start of the climb.', 1, 1),
  ('mountain_fox', 'Mountain Fox', 'A seasoned trail companion.', 10, 2),
  ('spirit_fox', 'Spirit Fox', 'Attuned to mountain spirits.', 20, 3),
  ('shrine_fox', 'Shrine Fox', 'Guardian of sacred waypoints.', 35, 4),
  ('celestial_fox', 'Celestial Fox', 'A legend of the summit.', 50, 5);

insert into public.companion_outfits (slug, companion_definition_id, name, min_bond_level, asset_key)
select 'explorer_cloak', id, 'Explorer Cloak', 5, 'yama_explorer' from public.companion_definitions where slug = 'young_fox';

insert into public.companion_outfits (slug, companion_definition_id, name, min_bond_level, asset_key)
select 'scholar_robe', id, 'Scholar Robe', 15, 'yama_scholar' from public.companion_definitions where slug = 'mountain_fox';

insert into public.companion_outfits (slug, companion_definition_id, name, min_bond_level, asset_key)
select 'spirit_aura', id, 'Spirit Aura', 30, 'yama_spirit' from public.companion_definitions where slug = 'spirit_fox';

insert into public.collectible_definitions (slug, region_slug, name, category, sort_order) values
  ('foothills-lantern-1', 'foothills', 'Base Camp Lantern', 'lantern', 1),
  ('foothills-lantern-2', 'foothills', 'Trail Marker Lantern', 'lantern', 2),
  ('foothills-scroll-1', 'foothills', 'Hiragana Scroll', 'scroll', 3),
  ('forest-spirit-1', 'forest-trail', 'Canopy Spirit', 'spirit', 1),
  ('forest-token-1', 'forest-trail', 'Forest Shrine Token', 'token', 2),
  ('n5-relic-1', 'mount-n5', 'Summit Relic', 'relic', 1);

insert into public.chest_templates (slug, kind, title, description, ep_reward, bond_xp_reward, shrine_protection_grant, streak_milestone_days) values
  ('daily-chest', 'daily', 'Daily Trail Chest', 'First climb of the day.', 15, 5, 0, null),
  ('weekly-chest', 'weekly', 'Weekly Summit Chest', 'Weekly quest complete.', 50, 15, 0, null),
  ('streak-7', 'streak', 'Seven-Day Streak Chest', 'A week of steady climbing.', 30, 10, 1, 7),
  ('streak-30', 'streak', 'Thirty-Day Streak Chest', 'A month on the trail.', 100, 25, 1, 30),
  ('streak-100', 'streak', 'Century Streak Chest', 'Legendary dedication.', 250, 50, 2, 100);

insert into public.chest_templates (slug, kind, title, description, ep_reward, bond_xp_reward, collectible_slug) values
  ('boss-foothills', 'boss', 'Spirit of Kana Chest', 'Defeated the Spirit of Kana.', 75, 30, 'foothills-scroll-1'),
  ('boss-forest', 'boss', 'Katakana Warden Chest', 'Defeated the Katakana Warden.', 75, 30, 'forest-token-1');

insert into public.level_rewards (level, title, description, reward_type, reward_value) values
  (15, 'Kana Wanderer', 'Mastered the kana foothills.', 'title', 'kana_wanderer'),
  (25, 'Shrine Guardian', 'Protector of mountain shrines.', 'title', 'shrine_guardian'),
  (35, 'Fox Master', 'Bonded deeply with Yama.', 'title', 'fox_master'),
  (45, 'Spirit Scholar', 'Attuned to mountain lore.', 'title', 'spirit_scholar'),
  (60, 'Kanji Hunter', 'Relentless kanji seeker.', 'title', 'kanji_hunter')
on conflict (level) do nothing;

insert into public.league_seasons (slug, starts_at, ends_at, status)
values (
  'season-2026-w24',
  date_trunc('week', now() at time zone 'utc'),
  date_trunc('week', now() at time zone 'utc') + interval '7 days',
  'active'
);

-- Hiragana and Katakana boss trials
insert into public.trial_templates (
  slug, region_slug, kind, title, description, boss_name,
  pass_score, time_limit_seconds, ep_reward, min_region_progress_percent,
  prerequisite_trial_slug, sort_order
) values
  (
    'foothills-kana-trial',
    'foothills',
    'boss_trial',
    'Spirit of Kana',
    'Prove your hiragana mastery to pass the foothills gate.',
    'Spirit of Kana',
    80,
    300,
    100,
    90,
    null,
    10
  ),
  (
    'forest-kana-trial',
    'forest-trail',
    'boss_trial',
    'Katakana Warden',
    'Face the warden who guards the canopy path.',
    'Katakana Warden',
    80,
    300,
    100,
    90,
    'foothills-kana-trial',
    10
  );

-- Trial steps for foothills-kana-trial (hiragana recall)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 0, 'choice_recall', 'Which hiragana is "a"?', 'あ', '["あ", "い", "う", "え"]'::jsonb, 0
from public.trial_templates t where t.slug = 'foothills-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 1, 'choice_recall', 'Which hiragana is "ka"?', 'か', '["か", "き", "く", "け"]'::jsonb, 0
from public.trial_templates t where t.slug = 'foothills-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 2, 'choice_recall', 'Which hiragana is "shi"?', 'し', '["さ", "し", "す", "せ"]'::jsonb, 1
from public.trial_templates t where t.slug = 'foothills-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 3, 'choice_recall', 'Which hiragana is "no"?', 'の', '["な", "に", "ぬ", "の"]'::jsonb, 3
from public.trial_templates t where t.slug = 'foothills-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 4, 'choice_recall', 'Which hiragana is "ma"?', 'ま', '["ま", "み", "む", "め"]'::jsonb, 0
from public.trial_templates t where t.slug = 'foothills-kana-trial';

-- Trial steps for forest-kana-trial (katakana recall)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 0, 'choice_recall', 'Which katakana is "a"?', 'ア', '["ア", "イ", "ウ", "エ"]'::jsonb, 0
from public.trial_templates t where t.slug = 'forest-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 1, 'choice_recall', 'Which katakana is "ka"?', 'カ', '["カ", "キ", "ク", "ケ"]'::jsonb, 0
from public.trial_templates t where t.slug = 'forest-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 2, 'choice_recall', 'Which katakana is "shi"?', 'シ', '["サ", "シ", "ス", "セ"]'::jsonb, 1
from public.trial_templates t where t.slug = 'forest-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 3, 'choice_recall', 'Which katakana is "no"?', 'ノ', '["ナ", "ニ", "ヌ", "ノ"]'::jsonb, 3
from public.trial_templates t where t.slug = 'forest-kana-trial';

insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select t.id, 4, 'choice_recall', 'Which katakana is "ma"?', 'マ', '["マ", "ミ", "ム", "メ"]'::jsonb, 0
from public.trial_templates t where t.slug = 'forest-kana-trial';

-- Master Summit region placeholder
insert into public.regions (slug, name, description, order_index, unlock_requirement, theme_id, status)
values (
  'master-summit',
  'Master Summit',
  'The celestial realm beyond N1. Infinite mastery challenges await.',
  8,
  'n1-final-trial',
  'master-summit',
  'published'
) on conflict (slug) do nothing;
