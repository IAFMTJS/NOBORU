-- Phase 15: Elevation system (EP, levels, rewards, event log)

create table public.level_rewards (
  id uuid primary key default gen_random_uuid(),
  level integer not null unique check (level >= 1 and level <= 100),
  title text not null,
  description text,
  reward_type text not null default 'title'
    check (reward_type in ('title', 'badge', 'cosmetic')),
  reward_value text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_elevation (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  current_level integer not null default 1 check (current_level >= 1 and current_level <= 100),
  current_ep integer not null default 0 check (current_ep >= 0),
  total_ep integer not null default 0 check (total_ep >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.elevation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_type text not null
    check (source_type in (
      'lesson_complete',
      'review_rating',
      'reading_complete',
      'listening_complete',
      'achievement',
      'quest',
      'game'
    )),
  source_id uuid,
  ep_amount integer not null check (ep_amount > 0),
  description text not null,
  created_at timestamptz not null default now()
);

create index user_elevation_user_id_idx on public.user_elevation (user_id);
create index elevation_events_user_created_idx
  on public.elevation_events (user_id, created_at desc);

create trigger level_rewards_set_updated_at
  before update on public.level_rewards
  for each row execute function public.set_updated_at();

create trigger user_elevation_set_updated_at
  before update on public.user_elevation
  for each row execute function public.set_updated_at();

alter table public.level_rewards enable row level security;
alter table public.user_elevation enable row level security;
alter table public.elevation_events enable row level security;

create policy "Authenticated users read published level rewards"
  on public.level_rewards for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage level rewards"
  on public.level_rewards for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own elevation"
  on public.user_elevation for select
  using (auth.uid() = user_id);

create policy "Users insert own elevation"
  on public.user_elevation for insert
  with check (auth.uid() = user_id);

create policy "Users update own elevation"
  on public.user_elevation for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own elevation events"
  on public.elevation_events for select
  using (auth.uid() = user_id);

create policy "Users insert own elevation events"
  on public.elevation_events for insert
  with check (auth.uid() = user_id);

insert into public.level_rewards (level, title, description, reward_type, reward_value, status)
select v.level, v.title, v.description, v.reward_type, v.reward_value, 'published'
from (
  values
    (1, 'Base Camper', 'Every climb begins at base camp.', 'title', 'base_camper'),
    (2, 'Trail Walker', 'You are finding your footing on the trail.', 'title', 'trail_walker'),
    (5, 'Forest Climber', 'Steady steps through the forest canopy.', 'title', 'forest_climber'),
    (10, 'Summit Seeker', 'The summit is coming into view.', 'title', 'summit_seeker'),
    (20, 'Mountain Guide', 'You help light the path for others.', 'title', 'mountain_guide'),
    (50, 'Legendary Climber', 'A rare ascent few ever reach.', 'badge', 'legendary_climber')
) as v(level, title, description, reward_type, reward_value)
where not exists (
  select 1 from public.level_rewards lr where lr.level = v.level
);
