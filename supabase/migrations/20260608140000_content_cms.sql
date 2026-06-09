-- Phase 4: Content CMS tables, roles, and RLS

create type public.content_status as enum (
  'draft',
  'review',
  'approved',
  'published',
  'archived'
);

create type public.jlpt_level as enum ('n5', 'n4', 'n3', 'n2', 'n1');

create type public.achievement_rarity as enum (
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic'
);

alter table public.profiles
  add column if not exists role text not null default 'learner'
    check (role in (
      'learner',
      'viewer',
      'moderator',
      'content_manager',
      'asset_manager',
      'curriculum_manager',
      'analytics_manager',
      'administrator',
      'super_administrator'
    ));

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  order_index integer not null default 0,
  unlock_requirement text,
  theme_id text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions (id) on delete cascade,
  name text not null,
  description text,
  order_index integer not null default 0,
  estimated_duration integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units (id) on delete cascade,
  type text not null default 'mixed',
  title text not null,
  description text,
  difficulty integer not null default 1,
  xp_reward integer not null default 0,
  estimated_duration integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  kanji text,
  kana text not null,
  meaning text not null,
  part_of_speech text,
  jlpt_level public.jlpt_level,
  frequency_rank integer,
  difficulty integer not null default 1,
  audio_url text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kanji (
  id uuid primary key default gen_random_uuid(),
  character text not null unique,
  meaning text not null,
  jlpt_level public.jlpt_level,
  grade_level integer,
  frequency_rank integer,
  stroke_count integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kanji_readings (
  id uuid primary key default gen_random_uuid(),
  kanji_id uuid not null references public.kanji (id) on delete cascade,
  reading text not null,
  reading_type text not null check (reading_type in ('onyomi', 'kunyomi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.grammar_points (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meaning text not null,
  explanation text,
  jlpt_level public.jlpt_level,
  difficulty integer not null default 1,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  rarity public.achievement_rarity not null default 'common',
  reward_type text,
  reward_value integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index regions_slug_idx on public.regions (slug);
create index regions_status_idx on public.regions (status);
create index units_region_id_idx on public.units (region_id);
create index lessons_unit_id_idx on public.lessons (unit_id);
create index vocabulary_jlpt_level_idx on public.vocabulary (jlpt_level);
create index vocabulary_status_idx on public.vocabulary (status);
create index kanji_jlpt_level_idx on public.kanji (jlpt_level);
create index kanji_status_idx on public.kanji (status);
create index grammar_points_jlpt_level_idx on public.grammar_points (jlpt_level);
create index grammar_points_status_idx on public.grammar_points (status);
create index achievements_slug_idx on public.achievements (slug);
create index achievements_status_idx on public.achievements (status);

create trigger regions_set_updated_at
  before update on public.regions
  for each row execute function public.set_updated_at();

create trigger units_set_updated_at
  before update on public.units
  for each row execute function public.set_updated_at();

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

create trigger vocabulary_set_updated_at
  before update on public.vocabulary
  for each row execute function public.set_updated_at();

create trigger kanji_set_updated_at
  before update on public.kanji
  for each row execute function public.set_updated_at();

create trigger kanji_readings_set_updated_at
  before update on public.kanji_readings
  for each row execute function public.set_updated_at();

create trigger grammar_points_set_updated_at
  before update on public.grammar_points
  for each row execute function public.set_updated_at();

create trigger achievements_set_updated_at
  before update on public.achievements
  for each row execute function public.set_updated_at();

create or replace function public.is_content_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role in (
        'content_manager',
        'curriculum_manager',
        'administrator',
        'super_administrator'
      )
  );
$$;

alter table public.regions enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.vocabulary enable row level security;
alter table public.kanji enable row level security;
alter table public.kanji_readings enable row level security;
alter table public.grammar_points enable row level security;
alter table public.achievements enable row level security;

-- Published content readable by authenticated users
create policy "Authenticated users read published regions"
  on public.regions for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage regions"
  on public.regions for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published units"
  on public.units for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage units"
  on public.units for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published lessons"
  on public.lessons for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage lessons"
  on public.lessons for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published vocabulary"
  on public.vocabulary for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage vocabulary"
  on public.vocabulary for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published kanji"
  on public.kanji for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage kanji"
  on public.kanji for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published kanji readings"
  on public.kanji_readings for select
  using (
    auth.uid() is not null
    and (
      public.is_content_admin()
      or exists (
        select 1 from public.kanji k
        where k.id = kanji_id and k.status = 'published'
      )
    )
  );

create policy "Content admins manage kanji readings"
  on public.kanji_readings for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published grammar"
  on public.grammar_points for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage grammar"
  on public.grammar_points for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published achievements"
  on public.achievements for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage achievements"
  on public.achievements for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.regions (slug, name, description, order_index, status)
values (
  'foothills',
  'Foothills',
  'The base of the climb. Hiragana, katakana, and beginner foundations.',
  0,
  'published'
)
on conflict (slug) do nothing;

insert into public.units (region_id, name, description, order_index, status)
select id, 'Base Camp', 'Starter lessons at the foot of the mountain.', 0, 'published'
from public.regions
where slug = 'foothills'
  and not exists (
    select 1 from public.units u
    inner join public.regions r on r.id = u.region_id
    where r.slug = 'foothills' and u.name = 'Base Camp'
  );
