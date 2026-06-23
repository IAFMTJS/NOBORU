-- Backfill auth JWT app_metadata from profiles to reduce middleware DB fallback.

update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
  'onboarding_completed', coalesce(p.onboarding_completed, false),
  'display_name', p.display_name,
  'role', coalesce(p.role, 'user')
)
from public.profiles p
where p.id = u.id
  and (
    (u.raw_app_meta_data ->> 'onboarding_completed') is null
    or (u.raw_app_meta_data ->> 'display_name') is null
    or (u.raw_app_meta_data ->> 'display_name') = ''
  );
