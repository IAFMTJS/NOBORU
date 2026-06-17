-- Daily retention challenge completion tracking (Learning Architecture Bible).

create table public.user_daily_challenge_completions (
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

create unique index user_daily_challenge_completions_client_event_idx
  on public.user_daily_challenge_completions (user_id, client_event_id)
  where client_event_id is not null;

create index user_daily_challenge_completions_user_date_idx
  on public.user_daily_challenge_completions (user_id, challenge_date desc);

alter table public.user_daily_challenge_completions enable row level security;

create policy user_daily_challenge_completions_select_own
  on public.user_daily_challenge_completions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy user_daily_challenge_completions_insert_own
  on public.user_daily_challenge_completions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy user_daily_challenge_completions_update_own
  on public.user_daily_challenge_completions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger user_daily_challenge_completions_set_updated_at
  before update on public.user_daily_challenge_completions
  for each row execute function public.set_updated_at();
