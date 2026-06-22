-- JWorld Option A: five JLPT world regions (n5–n1), merge legacy N5 split, act_index on units.

alter table public.units
  add column if not exists act_index smallint;

comment on column public.units.act_index is
  'Vertical chapter inside a JLPT world (e.g. N5 act 1–3). Nullable for worlds without acts.';

-- ─── Ensure target world n5 exists ───────────────────────────────────────────

insert into public.regions (slug, name, description, order_index, unlock_requirement, status)
select
  'n5',
  'Realm of First Light',
  'Hiragana, katakana, and the full JLPT N5 climb — three acts, one world.',
  0,
  null,
  'published'::public.content_status
where not exists (select 1 from public.regions where slug = 'n5');

-- ─── Merge foothills + forest-trail + mount-n5 units into n5 ───────────────

do $$
declare
  n5_id uuid;
  foothills_id uuid;
  forest_id uuid;
  mount_n5_id uuid;
  base_order integer := 0;
begin
  select id into n5_id from public.regions where slug = 'n5' limit 1;
  select id into foothills_id from public.regions where slug = 'foothills' limit 1;
  select id into forest_id from public.regions where slug = 'forest-trail' limit 1;
  select id into mount_n5_id from public.regions where slug = 'mount-n5' limit 1;

  if n5_id is null then
    raise exception 'jworld migration: n5 region missing';
  end if;

  if foothills_id is not null then
    update public.units u
    set
      region_id = n5_id,
      act_index = 1,
      order_index = base_order + u.order_index
    where u.region_id = foothills_id;

    select coalesce(max(order_index), -1) + 1 into base_order
    from public.units where region_id = n5_id and act_index = 1;

    update public.learning_branches lb
    set region_id = n5_id
    where lb.region_id = foothills_id;
  end if;

  if forest_id is not null then
    update public.units u
    set
      region_id = n5_id,
      act_index = 2,
      order_index = base_order + u.order_index
    where u.region_id = forest_id;

    select coalesce(max(order_index), -1) + 1 into base_order
    from public.units where region_id = n5_id;

    update public.learning_branches lb
    set region_id = n5_id
    where lb.region_id = forest_id;
  end if;

  if mount_n5_id is not null then
    update public.units u
    set
      region_id = n5_id,
      act_index = 3,
      order_index = base_order + u.order_index
    where u.region_id = mount_n5_id;

    update public.learning_branches lb
    set region_id = n5_id
    where lb.region_id = mount_n5_id;
  end if;
end $$;

-- ─── Rename mount-n* → n* ──────────────────────────────────────────────────

update public.regions
set
  slug = 'n4',
  name = 'Realm of the Green Ascent',
  description = 'JLPT N4 — daily conversation and the first serious ascent.',
  order_index = 1,
  unlock_requirement = 'n5-final-trial'
where slug = 'mount-n4';

update public.regions
set
  slug = 'n3',
  name = 'Realm of the Cloudline',
  description = 'JLPT N3 — comprehension through fog and ridge.',
  order_index = 2,
  unlock_requirement = 'n4-final-trial'
where slug = 'mount-n3';

update public.regions
set
  slug = 'n2',
  name = 'Realm of the Sky Temple',
  description = 'JLPT N2 — discipline above the clouds.',
  order_index = 3,
  unlock_requirement = 'n3-final-trial'
where slug = 'mount-n2';

update public.regions
set
  slug = 'n1',
  name = 'Realm of the Celestial Summit',
  description = 'JLPT N1 — mastery at the celestial peak.',
  order_index = 4,
  unlock_requirement = 'n2-final-trial'
where slug = 'mount-n1';

-- ─── Merge master-summit into n1 ───────────────────────────────────────────

do $$
declare
  n1_id uuid;
  summit_id uuid;
  base_order integer;
begin
  select id into n1_id from public.regions where slug = 'n1' limit 1;
  select id into summit_id from public.regions where slug = 'master-summit' limit 1;

  if n1_id is not null and summit_id is not null then
    select coalesce(max(order_index), -1) + 1 into base_order
    from public.units where region_id = n1_id;

    update public.units u
    set
      region_id = n1_id,
      order_index = base_order + u.order_index
    where u.region_id = summit_id;

    update public.learning_branches lb
    set region_id = n1_id
    where lb.region_id = summit_id;
  end if;
end $$;

-- ─── Archive legacy region rows (merged into worlds) ───────────────────────

update public.regions
set status = 'archived'::public.content_status
where slug in ('foothills', 'forest-trail', 'mount-n5', 'master-summit');

-- ─── Trial + collectible region_slug ─────────────────────────────────────────

update public.trial_templates
set region_slug = 'n5'
where region_slug in ('foothills', 'forest-trail', 'mount-n5');

update public.trial_templates
set region_slug = 'n4'
where region_slug = 'mount-n4';

update public.trial_templates
set region_slug = 'n3'
where region_slug = 'mount-n3';

update public.trial_templates
set region_slug = 'n2'
where region_slug = 'mount-n2';

update public.trial_templates
set region_slug = 'n1'
where region_slug in ('mount-n1', 'master-summit');

update public.collectible_definitions
set region_slug = 'n5'
where region_slug in ('foothills', 'forest-trail', 'mount-n5');

update public.collectible_definitions
set region_slug = 'n4'
where region_slug = 'mount-n4';

update public.collectible_definitions
set region_slug = 'n3'
where region_slug = 'mount-n3';

update public.collectible_definitions
set region_slug = 'n2'
where region_slug = 'mount-n2';

update public.collectible_definitions
set region_slug = 'n1'
where region_slug in ('mount-n1', 'master-summit');

-- ─── Profile region pointers ───────────────────────────────────────────────

update public.profiles
set current_region_slug = 'n5'
where current_region_slug in ('foothills', 'forest-trail', 'mount-n5');

update public.profiles
set current_region_slug = 'n4'
where current_region_slug = 'mount-n4';

update public.profiles
set current_region_slug = 'n3'
where current_region_slug = 'mount-n3';

update public.profiles
set current_region_slug = 'n2'
where current_region_slug = 'mount-n2';

update public.profiles
set current_region_slug = 'n1'
where current_region_slug in ('mount-n1', 'master-summit');

alter table public.profiles
  alter column current_region_slug set default 'n5';
