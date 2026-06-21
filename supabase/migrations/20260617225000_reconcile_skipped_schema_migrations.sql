-- Reconcile schema skipped when duplicate migration timestamps were applied.
-- See: 20260617190000, 20260617200000, 20260617220000 pairs in supabase/migrations/.

alter type public.trial_step_kind add value if not exists 'reading_comprehension';
alter type public.trial_step_kind add value if not exists 'listening_comprehension';
alter type public.trial_step_kind add value if not exists 'writing_application';
alter type public.trial_step_kind add value if not exists 'grammar_context';
alter type public.trial_step_kind add value if not exists 'story_comprehension';
alter type public.trial_step_kind add value if not exists 'applied_vocabulary';

alter table public.trial_steps
  add column if not exists content_type text,
  add column if not exists content_id uuid;

create index if not exists trial_steps_content_idx
  on public.trial_steps (content_type, content_id)
  where content_id is not null;

alter table public.lessons
  add column if not exists checkpoint_activity_mix jsonb;

comment on column public.lessons.checkpoint_activity_mix is
  'Bible checkpoint activity plan for practice lessons. JSON array of activity types from lib/learning/checkpoint-assembly.service.ts';

comment on column public.trial_steps.content_type is
  'Optional CMS content reference for bible-aligned boss exam steps.';

comment on column public.trial_steps.content_id is
  'Optional CMS content id paired with content_type.';

create table if not exists public.user_content_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_type text not null,
  content_id uuid not null,
  correct_answer_count integer not null default 0 check (correct_answer_count >= 0),
  exercise_types text[] not null default '{}',
  session_count integer not null default 0 check (session_count >= 0),
  practice_day_keys text[] not null default '{}',
  last_correct_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

create index if not exists user_content_mastery_user_id_idx
  on public.user_content_mastery (user_id);

create index if not exists user_content_mastery_content_idx
  on public.user_content_mastery (content_type, content_id);

alter table public.user_content_mastery enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_content_mastery'
      and policyname = 'user_content_mastery_select_own'
  ) then
    create policy user_content_mastery_select_own
      on public.user_content_mastery
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_content_mastery'
      and policyname = 'user_content_mastery_insert_own'
  ) then
    create policy user_content_mastery_insert_own
      on public.user_content_mastery
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_content_mastery'
      and policyname = 'user_content_mastery_update_own'
  ) then
    create policy user_content_mastery_update_own
      on public.user_content_mastery
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

drop trigger if exists user_content_mastery_set_updated_at on public.user_content_mastery;
create trigger user_content_mastery_set_updated_at
  before update on public.user_content_mastery
  for each row execute function public.set_updated_at();

create table if not exists public.user_daily_challenge_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  challenge_date date not null,
  correct_count integer not null check (correct_count >= 0),
  total_count integer not null check (total_count > 0),
  vocabulary_ids uuid[] not null default '{}',
  client_event_id uuid,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, challenge_date),
  check (correct_count <= total_count)
);

create unique index if not exists user_daily_challenge_completions_client_event_idx
  on public.user_daily_challenge_completions (user_id, client_event_id)
  where client_event_id is not null;

create index if not exists user_daily_challenge_completions_user_date_idx
  on public.user_daily_challenge_completions (user_id, challenge_date desc);

alter table public.user_daily_challenge_completions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_daily_challenge_completions'
      and policyname = 'user_daily_challenge_completions_select_own'
  ) then
    create policy user_daily_challenge_completions_select_own
      on public.user_daily_challenge_completions
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_daily_challenge_completions'
      and policyname = 'user_daily_challenge_completions_insert_own'
  ) then
    create policy user_daily_challenge_completions_insert_own
      on public.user_daily_challenge_completions
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_daily_challenge_completions'
      and policyname = 'user_daily_challenge_completions_update_own'
  ) then
    create policy user_daily_challenge_completions_update_own
      on public.user_daily_challenge_completions
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

drop trigger if exists user_daily_challenge_completions_set_updated_at on public.user_daily_challenge_completions;
create trigger user_daily_challenge_completions_set_updated_at
  before update on public.user_daily_challenge_completions
  for each row execute function public.set_updated_at();
