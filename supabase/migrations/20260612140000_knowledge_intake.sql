-- Knowledge intake: self-reported prior knowledge before adaptive practice

alter table public.profiles
  add column if not exists knowledge_intake_completed_at timestamptz;

create index if not exists profiles_knowledge_intake_completed_idx
  on public.profiles (knowledge_intake_completed_at)
  where knowledge_intake_completed_at is not null;
