-- Phase 3: onboarding fields on profiles

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists learning_goal text
    check (learning_goal is null or learning_goal in ('anime', 'travel', 'culture', 'work', 'jlpt')),
  add column if not exists current_level text
    check (current_level is null or current_level in ('none', 'n5', 'n4', 'n3', 'n2', 'n1')),
  add column if not exists current_region_slug text not null default 'foothills';

create index profiles_onboarding_completed_idx
  on public.profiles (onboarding_completed);
