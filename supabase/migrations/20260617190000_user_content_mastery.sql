-- Bible mastery tracking: per-content depth beyond SRS score.

create table public.user_content_mastery (
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

create index user_content_mastery_user_id_idx on public.user_content_mastery (user_id);
create index user_content_mastery_content_idx on public.user_content_mastery (content_type, content_id);

alter table public.user_content_mastery enable row level security;

create policy user_content_mastery_select_own
  on public.user_content_mastery
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy user_content_mastery_insert_own
  on public.user_content_mastery
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy user_content_mastery_update_own
  on public.user_content_mastery
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger user_content_mastery_set_updated_at
  before update on public.user_content_mastery
  for each row execute function public.set_updated_at();
