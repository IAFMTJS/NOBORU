-- Journey landmarks: CMS-owned destinations along regional paths

create table public.journey_landmarks (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions (id) on delete cascade,
  slug text not null,
  label text not null,
  subtitle text,
  kind text not null check (
    kind in ('village', 'shrine', 'torii', 'bridge', 'overlook', 'camp')
  ),
  trigger_after_lesson_count integer not null check (trigger_after_lesson_count > 0),
  path_position numeric check (
    path_position is null or (path_position >= 0 and path_position <= 1)
  ),
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (region_id, slug)
);

create index journey_landmarks_region_status_idx
  on public.journey_landmarks (region_id, status, order_index);

alter table public.journey_landmarks enable row level security;

create policy "Published journey landmarks are readable by authenticated users"
  on public.journey_landmarks
  for select
  to authenticated
  using (status = 'published');

create policy "Content managers manage journey landmarks"
  on public.journey_landmarks
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in (
          'content_manager',
          'curriculum_manager',
          'administrator',
          'super_administrator'
        )
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in (
          'content_manager',
          'curriculum_manager',
          'administrator',
          'super_administrator'
        )
    )
  );
