-- Phase 25: Official launch analytics persistence

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  occurred_at timestamptz not null,
  properties jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_user_id_idx on public.analytics_events (user_id, occurred_at desc);
create index analytics_events_name_idx on public.analytics_events (name, occurred_at desc);

alter table public.analytics_events enable row level security;

create policy "Users insert own analytics events"
  on public.analytics_events for insert
  with check (auth.uid() = user_id);

create policy "Users read own analytics events"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "Content admins read all analytics events"
  on public.analytics_events for select
  using (public.is_content_admin());
