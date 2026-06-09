-- Phase 11: Review engine (SRS history, intervals, weak-area support)

alter table public.review_items
  add column if not exists interval_days integer not null default 0,
  add column if not exists streak_count integer not null default 0;

create table public.review_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  review_item_id uuid not null references public.review_items (id) on delete cascade,
  rating text not null check (rating in ('again', 'good', 'strong')),
  previous_state public.review_state not null,
  new_state public.review_state not null,
  mastery_score integer not null
    check (mastery_score >= 0 and mastery_score <= 100),
  interval_days integer not null default 0,
  created_at timestamptz not null default now()
);

create index review_history_user_created_idx
  on public.review_history (user_id, created_at desc);

create index review_history_review_item_id_idx
  on public.review_history (review_item_id);

alter table public.review_history enable row level security;

create policy "Users read own review history"
  on public.review_history for select
  using (auth.uid() = user_id);

create policy "Users insert own review history"
  on public.review_history for insert
  with check (auth.uid() = user_id);
