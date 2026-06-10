-- Phase 24: Public beta feedback collection

create type public.feedback_category as enum (
  'bug',
  'trail_ux',
  'lesson_ux',
  'audio',
  'pwa',
  'content',
  'other'
);

create type public.feedback_status as enum (
  'new',
  'reviewed',
  'resolved'
);

create table public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category public.feedback_category not null,
  rating smallint check (rating is null or (rating >= 1 and rating <= 5)),
  message text not null,
  route text,
  context jsonb,
  status public.feedback_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_feedback_user_id_idx on public.user_feedback (user_id, created_at desc);
create index user_feedback_status_idx on public.user_feedback (status, created_at desc);

create trigger user_feedback_set_updated_at
  before update on public.user_feedback
  for each row execute function public.set_updated_at();

alter table public.user_feedback enable row level security;

create policy "Users insert own feedback"
  on public.user_feedback for insert
  with check (auth.uid() = user_id);

create policy "Users read own feedback"
  on public.user_feedback for select
  using (auth.uid() = user_id);

create policy "Content admins read all feedback"
  on public.user_feedback for select
  using (public.is_content_admin());

create policy "Content admins update feedback status"
  on public.user_feedback for update
  using (public.is_content_admin())
  with check (public.is_content_admin());

-- Curriculum polish for beta readability
update public.regions
set description = 'The next summit path. Unlock after the Final N5 Trial, then climb with N4 vocabulary, grammar, kanji, reading, and listening.'
where slug = 'mount-n4';

update public.regions
set description = 'The first summit path. Complete N5 vocabulary, grammar, kanji, reading, listening, and trials.'
where slug = 'mount-n5';
