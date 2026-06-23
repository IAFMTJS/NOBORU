-- Minimal shop catalog + purchase ledger (wallet gold derived from EP; gems from chest claims)

create table public.shop_items (
  id text primary key,
  name text not null,
  description text not null,
  category text not null check (category in ('cosmetic', 'trail', 'consumable', 'seasonal')),
  currency text not null check (currency in ('gold', 'gems')),
  price integer not null check (price >= 0),
  icon_label text not null default '🎁',
  collectible_slug text references public.collectible_definitions (slug) on delete set null,
  companion_outfit_slug text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_shop_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  shop_item_id text not null references public.shop_items (id) on delete cascade,
  gold_spent integer not null default 0 check (gold_spent >= 0),
  gems_spent integer not null default 0 check (gems_spent >= 0),
  purchased_at timestamptz not null default now(),
  unique (user_id, shop_item_id)
);

create index user_shop_purchases_user_idx on public.user_shop_purchases (user_id);

create trigger shop_items_set_updated_at
  before update on public.shop_items
  for each row execute function public.set_updated_at();

alter table public.shop_items enable row level security;
alter table public.user_shop_purchases enable row level security;

create policy "Published shop items are readable"
  on public.shop_items for select
  using (status = 'published');

create policy "Users manage own shop purchases"
  on public.user_shop_purchases for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into public.shop_items (
  id, name, description, category, currency, price, icon_label, collectible_slug, featured, sort_order
) values
  ('lantern-trail-skin', 'Lantern Trail', 'Warm amber glow along your path at night.', 'trail', 'gold', 800, '🏮', 'foothills-lantern-1', true, 1),
  ('fox-scarf-cosmetic', 'Fox Scarf', 'A cozy scarf for your companion on cold summits.', 'cosmetic', 'gems', 12, '🧣', null, false, 2),
  ('sakura-petals-trail', 'Sakura Petals', 'Soft petals drift along your climb during spring.', 'seasonal', 'gems', 25, '🌸', null, true, 3),
  ('stamina-tea', 'Mountain Tea', 'Restore one review heart after a tough session.', 'consumable', 'gold', 150, '🍵', null, false, 4),
  ('summit-banner', 'Summit Banner', 'Profile banner celebrating your highest peak.', 'cosmetic', 'gold', 600, '⛰️', 'n5-relic-1', false, 5),
  ('shrine-bell-charm', 'Shrine Bell Charm', 'A gentle chime when you complete daily quests.', 'cosmetic', 'gems', 8, '🔔', 'forest-token-1', false, 6)
on conflict (id) do nothing;
