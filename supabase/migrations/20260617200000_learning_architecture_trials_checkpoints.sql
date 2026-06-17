-- Learning Architecture Bible: boss exam step kinds + checkpoint metadata.

alter type public.trial_step_kind add value if not exists 'reading_comprehension';
alter type public.trial_step_kind add value if not exists 'listening_comprehension';
alter type public.trial_step_kind add value if not exists 'writing_application';
alter type public.trial_step_kind add value if not exists 'grammar_context';
alter type public.trial_step_kind add value if not exists 'story_comprehension';
alter type public.trial_step_kind add value if not exists 'applied_vocabulary';

alter table public.trial_steps
  add column if not exists content_type text,
  add column if not exists content_id uuid;

create index if not exists trial_steps_content_idx
  on public.trial_steps (content_type, content_id)
  where content_id is not null;

alter table public.lessons
  add column if not exists checkpoint_activity_mix jsonb;

comment on column public.lessons.checkpoint_activity_mix is
  'Bible checkpoint activity plan for practice lessons. JSON array of activity types from lib/learning/checkpoint-assembly.service.ts';

comment on column public.trial_steps.content_type is
  'Optional CMS content reference for bible-aligned boss exam steps.';

comment on column public.trial_steps.content_id is
  'Optional CMS content id paired with content_type.';
