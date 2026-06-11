-- Phase C: foundational radicals (scaffold for future WaniKani-style layer)

create table if not exists public.kanji_radicals (
  id uuid primary key default gen_random_uuid(),
  character text not null unique,
  meaning text not null,
  mnemonic text,
  jlpt_level public.jlpt_level not null default 'n5',
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kanji_radicals enable row level security;

create policy "Authenticated users read published radicals"
  on public.kanji_radicals for select
  using (
    auth.uid() is not null
    and (status = 'published' or public.is_content_admin())
  );

create policy "Content admins manage radicals"
  on public.kanji_radicals for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.kanji_radicals (character, meaning, mnemonic, jlpt_level, status)
select v.character, v.meaning, v.mnemonic, v.jlpt_level, v.status
from (
  values
    ('一', 'one', 'A single horizontal stroke', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('丨', 'line', 'A vertical stick', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('口', 'mouth', 'An open square like a mouth', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('日', 'sun', 'A box with a line — the sun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('月', 'moon', 'The crescent in a box', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('人', 'person', 'Two legs of a person', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('木', 'tree', 'Tree with branches', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('水', 'water', 'Splashing water drops', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('火', 'fire', 'Flames rising', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('土', 'earth', 'Soil on the ground', 'n5'::public.jlpt_level, 'published'::public.content_status)
) as v(character, meaning, mnemonic, jlpt_level, status)
where not exists (
  select 1 from public.kanji_radicals existing where existing.character = v.character
);
