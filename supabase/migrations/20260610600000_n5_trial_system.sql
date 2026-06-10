-- Phase 21: N5 trial system — regional challenges, boss trial, final trial

create type public.trial_kind as enum (
  'regional_challenge',
  'boss_trial',
  'final_trial'
);

create type public.trial_step_kind as enum (
  'typed_recall',
  'choice_recall',
  'matching'
);

create type public.trial_grade as enum (
  'pass',
  'excellent',
  'perfect',
  'mastery',
  'legendary'
);

create table public.trial_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  region_slug text not null,
  kind public.trial_kind not null,
  title text not null,
  description text,
  boss_name text not null,
  pass_score integer not null default 70 check (pass_score >= 0 and pass_score <= 100),
  time_limit_seconds integer check (time_limit_seconds is null or time_limit_seconds > 0),
  ep_reward integer not null default 100 check (ep_reward > 0),
  min_region_progress_percent integer not null default 80
    check (min_region_progress_percent >= 0 and min_region_progress_percent <= 100),
  prerequisite_trial_slug text,
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trial_steps (
  id uuid primary key default gen_random_uuid(),
  trial_template_id uuid not null references public.trial_templates (id) on delete cascade,
  order_index integer not null default 0,
  step_kind public.trial_step_kind not null,
  prompt text not null,
  display_text text not null,
  accepted_answers jsonb,
  options jsonb,
  correct_index integer,
  match_pairs jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trial_template_id, order_index)
);

create table public.user_trial_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trial_template_id uuid not null references public.trial_templates (id) on delete cascade,
  best_score integer not null default 0 check (best_score >= 0 and best_score <= 100),
  best_grade public.trial_grade,
  passed boolean not null default false,
  passed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_attempt_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, trial_template_id)
);

create table public.user_trial_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trial_template_id uuid not null references public.trial_templates (id) on delete cascade,
  score_percent integer not null check (score_percent >= 0 and score_percent <= 100),
  grade public.trial_grade,
  correct_count integer not null default 0 check (correct_count >= 0),
  total_count integer not null default 0 check (total_count >= 0),
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  passed boolean not null default false,
  ep_awarded integer check (ep_awarded is null or ep_awarded > 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz not null default now()
);

create index trial_steps_template_idx on public.trial_steps (trial_template_id, order_index);
create index user_trial_progress_user_idx on public.user_trial_progress (user_id);
create index user_trial_attempts_user_idx on public.user_trial_attempts (user_id, completed_at desc);

create trigger trial_templates_set_updated_at
  before update on public.trial_templates
  for each row execute function public.set_updated_at();

create trigger trial_steps_set_updated_at
  before update on public.trial_steps
  for each row execute function public.set_updated_at();

create trigger user_trial_progress_set_updated_at
  before update on public.user_trial_progress
  for each row execute function public.set_updated_at();

alter table public.trial_templates enable row level security;
alter table public.trial_steps enable row level security;
alter table public.user_trial_progress enable row level security;
alter table public.user_trial_attempts enable row level security;

create policy "Authenticated users read published trial templates"
  on public.trial_templates for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage trial templates"
  on public.trial_templates for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published trial steps"
  on public.trial_steps for select
  using (
    auth.uid() is not null
    and (
      public.is_content_admin()
      or exists (
        select 1 from public.trial_templates t
        where t.id = trial_template_id and t.status = 'published'
      )
    )
  );

create policy "Content admins manage trial steps"
  on public.trial_steps for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own trial progress"
  on public.user_trial_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own trial progress"
  on public.user_trial_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own trial progress"
  on public.user_trial_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own trial attempts"
  on public.user_trial_attempts for select
  using (auth.uid() = user_id);

create policy "Users insert own trial attempts"
  on public.user_trial_attempts for insert
  with check (auth.uid() = user_id);

alter table public.elevation_events drop constraint if exists elevation_events_source_type_check;

alter table public.elevation_events add constraint elevation_events_source_type_check
  check (source_type in (
    'lesson_complete',
    'review_rating',
    'reading_complete',
    'listening_complete',
    'achievement',
    'quest',
    'game',
    'trial'
  ));

-- Seed MVP trials
insert into public.trial_templates (
  slug, region_slug, kind, title, description, boss_name,
  pass_score, time_limit_seconds, ep_reward, min_region_progress_percent,
  prerequisite_trial_slug, sort_order, status
)
select * from (
  values
    (
      'foothills-guardian',
      'foothills',
      'regional_challenge'::public.trial_kind,
      'Foothills Guardian',
      'Prove your hiragana foundation before leaving base camp.',
      'Foothills Guardian',
      70, 180, 75, 80, null::text, 1, 'published'::public.content_status
    ),
    (
      'forest-spirit',
      'forest-trail',
      'regional_challenge'::public.trial_kind,
      'Forest Spirit Challenge',
      'Recall katakana under pressure on the forest trail.',
      'Forest Spirit',
      70, 180, 100, 80, null::text, 2, 'published'::public.content_status
    ),
    (
      'mount-n5-proving-ground',
      'mount-n5',
      'regional_challenge'::public.trial_kind,
      'N5 Proving Ground',
      'Mixed vocabulary and grammar recall before the summit trial.',
      'Trail Warden',
      75, 240, 125, 85, null::text, 3, 'published'::public.content_status
    ),
    (
      'n5-sentinel',
      'mount-n5',
      'boss_trial'::public.trial_kind,
      'N5 Sentinel Trial',
      'Face the sentinel guarding the N5 summit path.',
      'N5 Sentinel',
      75, 300, 200, 90, 'mount-n5-proving-ground', 4, 'published'::public.content_status
    ),
    (
      'n5-final-trial',
      'mount-n5',
      'final_trial'::public.trial_kind,
      'Final N5 Trial',
      'The capstone challenge validating N5 recall and comprehension.',
      'Summit Arbiter',
      80, 420, 300, 95, 'n5-sentinel', 5, 'published'::public.content_status
    )
) as seed (slug, region_slug, kind, title, description, boss_name, pass_score, time_limit_seconds, ep_reward, min_region_progress_percent, prerequisite_trial_slug, sort_order, status)
where not exists (select 1 from public.trial_templates existing where existing.slug = seed.slug);

-- Foothills Guardian steps (hiragana typed recall)
with trial as (
  select id from public.trial_templates where slug = 'foothills-guardian' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers)
select trial.id, s.order_index, 'typed_recall'::public.trial_step_kind, s.prompt, s.display_text, s.accepted_answers::jsonb
from trial,
(values
  (1, 'Type the romaji for this hiragana.', 'あ', '["a"]'),
  (2, 'Type the romaji for this hiragana.', 'い', '["i"]'),
  (3, 'Type the romaji for this hiragana.', 'う', '["u"]'),
  (4, 'Type the romaji for this hiragana.', 'か', '["ka"]'),
  (5, 'Type the romaji for this hiragana.', 'き', '["ki"]'),
  (6, 'Type the romaji for this hiragana.', 'さ', '["sa"]')
) as s(order_index, prompt, display_text, accepted_answers)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);

-- Forest Spirit steps (katakana typed recall)
with trial as (
  select id from public.trial_templates where slug = 'forest-spirit' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers)
select trial.id, s.order_index, 'typed_recall'::public.trial_step_kind, s.prompt, s.display_text, s.accepted_answers::jsonb
from trial,
(values
  (1, 'Type the romaji for this katakana.', 'ア', '["a"]'),
  (2, 'Type the romaji for this katakana.', 'イ', '["i"]'),
  (3, 'Type the romaji for this katakana.', 'ウ', '["u"]'),
  (4, 'Type the romaji for this katakana.', 'カ', '["ka"]'),
  (5, 'Type the romaji for this katakana.', 'キ', '["ki"]'),
  (6, 'Type the romaji for this katakana.', 'サ', '["sa"]')
) as s(order_index, prompt, display_text, accepted_answers)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);

-- N5 Proving Ground (choice recall)
with trial as (
  select id from public.trial_templates where slug = 'mount-n5-proving-ground' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, options, correct_index)
select trial.id, s.order_index, 'choice_recall'::public.trial_step_kind, s.prompt, s.display_text, s.options::jsonb, s.correct_index
from trial,
(values
  (1, 'What does this word mean?', 'こんにちは', '["Hello","Goodbye","Thank you","Excuse me"]', 0),
  (2, 'What does this word mean?', 'ありがとう', '["Hello","Thank you","Teacher","Friend"]', 1),
  (3, 'What does this word mean?', 'わたし', '["You","They","I, me","We"]', 2),
  (4, 'What does this word mean?', 'せんせい', '["Student","Teacher","School","Book"]', 1),
  (5, 'Choose the correct meaning.', '学生', '["Teacher","Student","School","Station"]', 1),
  (6, 'Choose the correct meaning.', '学校', '["House","Shop","School","Country"]', 2),
  (7, 'Choose the correct meaning.', '今日', '["Tomorrow","Yesterday","Today","Now"]', 2),
  (8, 'Choose the correct meaning.', '水', '["Fire","Water","Food","Fish"]', 1)
) as s(order_index, prompt, display_text, options, correct_index)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);

-- N5 Sentinel (mixed)
with trial as (
  select id from public.trial_templates where slug = 'n5-sentinel' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
select trial.id, s.order_index, s.step_kind::public.trial_step_kind, s.prompt, s.display_text,
  s.accepted_answers::jsonb, s.options::jsonb, s.correct_index, s.match_pairs::jsonb
from trial,
(values
  (1, 'typed_recall', 'Type the meaning in English.', '友達', '["friend"]', null, null, null),
  (2, 'choice_recall', 'What does this mean?', '駅', null, '["House","Station","Shop","School"]', 1, null),
  (3, 'typed_recall', 'Type the romaji.', '一', '["ichi","1","one"]', null, null, null),
  (4, 'choice_recall', 'What does this mean?', 'ごはん', null, '["Water","Rice, meal","Fish","Meat"]', 1, null),
  (5, 'matching', 'Match each word to its meaning.', 'Match the pairs', null, null, null,
    '[{"id":"m1","prompt":"行く","answer":"to go"},{"id":"m2","prompt":"来る","answer":"to come"},{"id":"m3","prompt":"見る","answer":"to see"}]'),
  (6, 'choice_recall', 'What does this mean?', '国', null, '["City","Country","Time","Friend"]', 1, null),
  (7, 'typed_recall', 'Type the meaning in English.', '時間', '["time"]', null, null, null),
  (8, 'choice_recall', 'What does this mean?', '店', null, '["Shop","House","School","Teacher"]', 0, null),
  (9, 'typed_recall', 'Type the romaji.', '五', '["go","5","five"]', null, null, null),
  (10, 'choice_recall', 'What does this mean?', '魚', null, '["Meat","Fish","Fruit","Water"]', 1, null)
) as s(order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);

-- Final N5 Trial (capstone)
with trial as (
  select id from public.trial_templates where slug = 'n5-final-trial' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
select trial.id, s.order_index, s.step_kind::public.trial_step_kind, s.prompt, s.display_text,
  s.accepted_answers::jsonb, s.options::jsonb, s.correct_index, s.match_pairs::jsonb
from trial,
(values
  (1, 'typed_recall', 'Type the romaji.', 'あ', '["a"]', null, null, null),
  (2, 'typed_recall', 'Type the romaji.', 'ア', '["a"]', null, null, null),
  (3, 'choice_recall', 'What does this mean?', 'こんにちは', null, '["Hello","Goodbye","Thanks","Teacher"]', 0, null),
  (4, 'choice_recall', 'What does this mean?', 'ありがとう', null, '["Hello","Thank you","Friend","School"]', 1, null),
  (5, 'typed_recall', 'Type the meaning in English.', '私', '["i","me","i me"]', null, null, null),
  (6, 'choice_recall', 'What does this mean?', '先生', null, '["Student","Teacher","School","Today"]', 1, null),
  (7, 'matching', 'Match vocabulary to meanings.', 'Match the pairs', null, null, null,
    '[{"id":"f1","prompt":"学校","answer":"school"},{"id":"f2","prompt":"友達","answer":"friend"},{"id":"f3","prompt":"水","answer":"water"},{"id":"f4","prompt":"店","answer":"shop"}]'),
  (8, 'choice_recall', 'What does this mean?', '今日', null, '["Yesterday","Tomorrow","Today","Now"]', 2, null),
  (9, 'typed_recall', 'Type the meaning in English.', '時間', '["time"]', null, null, null),
  (10, 'choice_recall', 'What does this mean?', '行く', null, '["to come","to go","to see","to eat"]', 1, null),
  (11, 'choice_recall', 'What does this mean?', '来る', null, '["to go","to come","to read","to write"]', 1, null),
  (12, 'choice_recall', 'What does this mean?', '国', null, '["City","Country","Station","Shop"]', 1, null)
) as s(order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);
