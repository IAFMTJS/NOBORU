-- Backfill profiles and user_settings for auth users missing rows.
-- Also re-asserts the signup trigger for environments where it was never applied.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Climber')
  )
  on conflict (user_id) do nothing;

  insert into public.user_settings (user_id, preferred_theme)
  values (new.id, 'dark')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

insert into public.profiles (user_id, display_name)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'display_name', 'Climber')
from auth.users u
where not exists (
  select 1
  from public.profiles p
  where p.user_id = u.id
);

insert into public.user_settings (user_id, preferred_theme)
select u.id, 'dark'
from auth.users u
where not exists (
  select 1
  from public.user_settings s
  where s.user_id = u.id
);
