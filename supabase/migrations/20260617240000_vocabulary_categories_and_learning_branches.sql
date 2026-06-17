-- Learning Architecture Bible: thematic vocabulary categories + world tree branches.

create table public.vocabulary_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  order_index integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vocabulary_category_assignments (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid not null references public.vocabulary (id) on delete cascade,
  category_id uuid not null references public.vocabulary_categories (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vocabulary_id, category_id)
);

create index vocabulary_category_assignments_vocab_idx
  on public.vocabulary_category_assignments (vocabulary_id);

create index vocabulary_category_assignments_category_idx
  on public.vocabulary_category_assignments (category_id);

create table public.learning_branches (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions (id) on delete cascade,
  unit_id uuid unique references public.units (id) on delete set null,
  category_id uuid references public.vocabulary_categories (id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  order_index integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index learning_branches_region_idx
  on public.learning_branches (region_id, order_index);

create index learning_branches_category_idx
  on public.learning_branches (category_id);

create trigger vocabulary_categories_set_updated_at
  before update on public.vocabulary_categories
  for each row execute function public.set_updated_at();

create trigger vocabulary_category_assignments_set_updated_at
  before update on public.vocabulary_category_assignments
  for each row execute function public.set_updated_at();

create trigger learning_branches_set_updated_at
  before update on public.learning_branches
  for each row execute function public.set_updated_at();

alter table public.vocabulary_categories enable row level security;
alter table public.vocabulary_category_assignments enable row level security;
alter table public.learning_branches enable row level security;

create policy vocabulary_categories_read_published
  on public.vocabulary_categories
  for select
  to authenticated
  using (status = 'published' or public.is_content_admin());

create policy vocabulary_categories_admin_manage
  on public.vocabulary_categories
  for all
  to authenticated
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy vocabulary_category_assignments_read
  on public.vocabulary_category_assignments
  for select
  to authenticated
  using (auth.uid() is not null);

create policy vocabulary_category_assignments_admin_manage
  on public.vocabulary_category_assignments
  for all
  to authenticated
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy learning_branches_read_published
  on public.learning_branches
  for select
  to authenticated
  using (status = 'published' or public.is_content_admin());

create policy learning_branches_admin_manage
  on public.learning_branches
  for all
  to authenticated
  using (public.is_content_admin())
  with check (public.is_content_admin());

comment on table public.vocabulary_categories is
  'Bible thematic vocabulary topics (Food, Travel, Family, etc.).';

comment on table public.learning_branches is
  'World Tree branch metadata. unit_id aliases CMS units until native branch content ships.';

-- Bible thematic categories
insert into public.vocabulary_categories (name, slug, description, order_index, status)
select seed.name, seed.slug, seed.description, seed.order_index, 'published'
from (
  values
    ('Greetings', 'greetings', 'Hello, goodbye, thanks, and polite phrases.', 1),
    ('Family', 'family', 'Family members and relationships.', 2),
    ('Food', 'food', 'Meals, drinks, restaurants, and ingredients.', 3),
    ('Travel', 'travel', 'Transport, directions, places, and movement.', 4),
    ('Numbers', 'numbers', 'Counting, dates, times, and quantities.', 5),
    ('School', 'school', 'Classroom, study, and education vocabulary.', 6),
    ('Work', 'work', 'Jobs, office, and professional contexts.', 7),
    ('Daily Activities', 'daily-activities', 'Routine actions, hobbies, and everyday life.', 8),
    ('Animals', 'animals', 'Pets, wildlife, and creature vocabulary.', 9),
    ('Business', 'business', 'Commerce, shopping, and transactions.', 10)
) as seed(name, slug, description, order_index)
where not exists (
  select 1 from public.vocabulary_categories existing where existing.slug = seed.slug
);

-- Backfill learning branches from published curriculum units.
insert into public.learning_branches (
  region_id,
  unit_id,
  category_id,
  slug,
  name,
  description,
  order_index,
  status
)
select
  u.region_id,
  u.id,
  cat.id,
  r.slug || '-' || trim(both '-' from lower(regexp_replace(u.name, '[^a-zA-Z0-9]+', '-', 'g'))),
  u.name,
  u.description,
  u.order_index,
  u.status
from public.units u
inner join public.regions r on r.id = u.region_id
left join lateral (
  select c.id
  from public.vocabulary_categories c
  where c.slug = case
    when u.name ilike '%greet%' or u.name ilike '%hello%' or u.name ilike '%polite%' then 'greetings'
    when u.name ilike '%family%' or u.name ilike '%people%' or u.name ilike '%body%' then 'family'
    when u.name ilike '%food%' or u.name ilike '%meal%' or u.name ilike '%drink%' or u.name ilike '%restaurant%' or u.name ilike '%kitchen%' then 'food'
    when u.name ilike '%travel%' or u.name ilike '%transport%' or u.name ilike '%station%' or u.name ilike '%place%' or u.name ilike '%direction%' or u.name ilike '%city%' then 'travel'
    when u.name ilike '%number%' or u.name ilike '%count%' or u.name ilike '%time%' or u.name ilike '%calendar%' or u.name ilike '%date%' then 'numbers'
    when u.name ilike '%school%' or u.name ilike '%student%' or u.name ilike '%study%' or u.name ilike '%class%' then 'school'
    when u.name ilike '%work%' or u.name ilike '%job%' or u.name ilike '%office%' or u.name ilike '%business%' then 'work'
    when u.name ilike '%animal%' or u.name ilike '%nature%' then 'animals'
    when u.name ilike '%shop%' or u.name ilike '%money%' or u.name ilike '%store%' then 'business'
    else 'daily-activities'
  end
  limit 1
) cat on true
where u.status = 'published'
  and r.slug in ('foothills', 'forest-trail', 'mount-n5', 'mount-n4')
  and not exists (
    select 1 from public.learning_branches existing where existing.unit_id = u.id
  );

-- Assign vocabulary to thematic categories via lesson curriculum paths.
insert into public.vocabulary_category_assignments (vocabulary_id, category_id)
select distinct li.content_id, lb.category_id
from public.lesson_items li
inner join public.lessons l on l.id = li.lesson_id
inner join public.learning_branches lb on lb.unit_id = l.unit_id
where li.content_type = 'vocabulary'
  and lb.category_id is not null
  and not exists (
    select 1
    from public.vocabulary_category_assignments existing
    where existing.vocabulary_id = li.content_id
      and existing.category_id = lb.category_id
  );

-- Core greeting vocabulary (not always tied to a themed unit yet).
insert into public.vocabulary_category_assignments (vocabulary_id, category_id)
select v.id, c.id
from public.vocabulary v
inner join public.vocabulary_categories c on c.slug = 'greetings'
where v.kana in (
  'こんにちは',
  'ありがとう',
  'さようなら',
  'おはよう',
  'こんばんは',
  'すみません',
  'ごめんなさい'
)
and v.status = 'published'
and not exists (
  select 1
  from public.vocabulary_category_assignments existing
  where existing.vocabulary_id = v.id
    and existing.category_id = c.id
);
