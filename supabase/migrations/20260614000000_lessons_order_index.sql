-- Phase 1: World Map & Learning Journey — lesson ordering within units

alter table public.lessons
  add column if not exists order_index integer not null default 0;

-- Backfill: assign 0, 1, 2... per unit_id ordered by title (temporary bootstrap)
with ranked as (
  select
    id,
    row_number() over (
      partition by unit_id
      order by title asc, id asc
    ) - 1 as new_order_index
  from public.lessons
)
update public.lessons l
set order_index = ranked.new_order_index
from ranked
where l.id = ranked.id;

create index if not exists lessons_unit_order_idx
  on public.lessons (unit_id, order_index);
