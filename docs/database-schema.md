database-schema.md

NOBORU DATABASE ARCHITECTURE

Version: 1.0

Status: AUTHORITATIVE

This document defines the canonical database structure for Noboru.

All migrations, repositories, APIs, services and admin tools must follow this schema.

No database table may be introduced without updating this document.

⸻

DATABASE PHILOSOPHY

Educational progress is sacred.

User learning history must never be lost.

All educational systems must be:

* Auditable
* Recoverable
* Versioned
* Scalable

The database is the source of truth.

Gamification systems may consume educational data.

Educational systems must never depend on gamification data.

⸻

DATABASE STANDARDS

Every table must contain:

id
created_at
updated_at

Recommended:

deleted_at

for soft deletes.

⸻

ID STRATEGY

Use:

uuid

for all primary keys.

⸻

TIMESTAMP STRATEGY

Use UTC.

Never store local times.

⸻

AUTH DOMAIN

⸻

users

Managed by Supabase Auth.

Authentication source.

Do not duplicate auth data elsewhere.

⸻

profiles

Stores public profile information.

Fields:

id
user_id
username
display_name
avatar_id
title_id
bio
country
timezone
language
theme
created_at
updated_at

Relationships:

profiles
→ users

⸻

user_settings

Stores preferences.

Fields:

id
user_id
notifications_enabled
sound_enabled
reduced_motion
high_contrast
daily_goal
preferred_theme
preferred_language
created_at
updated_at

⸻

EDUCATIONAL DOMAIN

⸻

regions

Represents world progression.

Examples:

Foothills
Forest Trail
Mount N5
Mount N4
Mount N3
Mount N2
Mount N1
Master Summit

Fields:

id
slug
name
description
order_index
unlock_requirement
theme_id
created_at
updated_at

⸻

units

Belong to regions.

Fields:

id
region_id
name
description
order_index
estimated_duration
created_at
updated_at

Relationship:

units
→ regions

⸻

lessons

Belong to units.

Fields:

id
unit_id
type
title
description
order_index
difficulty
xp_reward
estimated_duration
checkpoint_activity_mix (jsonb, nullable — bible checkpoint activity types for practice lessons)
created_at
updated_at

Relationship:

lessons
→ units

⸻

VOCABULARY DOMAIN

⸻

vocabulary

Master vocabulary table.

Fields:

id
kanji
kana
meaning
part_of_speech
jlpt_level
frequency_rank
difficulty
audio_url
created_at
updated_at

⸻

vocabulary_examples

Fields:

id
vocabulary_id
japanese
english
audio_url
created_at
updated_at

⸻

vocabulary_categories

Thematic vocabulary topics from the Learning Architecture Bible.

Fields:

id
name
slug
description
order_index
status
created_at
updated_at

Examples:

greetings
family
food
travel
numbers
school
work
daily-activities
animals
business

⸻

vocabulary_category_assignments

Many-to-many relationship between vocabulary and thematic categories.

Fields:

id
vocabulary_id
category_id
created_at
updated_at

Unique: (vocabulary_id, category_id)

⸻

learning_branches

World Tree branch metadata layer. `unit_id` aliases CMS units until native branch content ships.

Fields:

id
region_id
unit_id (nullable, unique — CMS alias to units)
category_id (nullable — thematic topic)
slug
name
description
order_index
status
created_at
updated_at

Relationship:

learning_branches
→ regions
→ units (optional alias)
→ vocabulary_categories (optional theme)

⸻

KANJI DOMAIN

⸻

kanji

Master kanji table.

Fields:

id
character
meaning
jlpt_level
grade_level
frequency_rank
stroke_count
created_at
updated_at

⸻

kanji_readings

Fields:

id
kanji_id
reading
reading_type
created_at
updated_at

Reading Types:

onyomi
kunyomi

⸻

kanji_radicals

Fields:

id
kanji_id
radical
meaning
created_at
updated_at

⸻

kanji_examples

Fields:

id
kanji_id
word
reading
meaning
created_at
updated_at

⸻

GRAMMAR DOMAIN

⸻

grammar_points

Fields:

id
title
meaning
explanation
jlpt_level
difficulty
created_at
updated_at

⸻

grammar_examples

Fields:

id
grammar_id
japanese
english
audio_url
created_at
updated_at

⸻

grammar_relationships

Used for related grammar.

Fields:

id
grammar_id
related_grammar_id
created_at
updated_at

⸻

READING DOMAIN

⸻

stories

Fields:

id
title
slug
jlpt_level
difficulty
estimated_read_time
created_at
updated_at

⸻

story_sections

Fields:

id
story_id
content
order_index
created_at
updated_at

⸻

reading_questions

Fields:

id
story_id
question
answer
difficulty
created_at
updated_at

⸻

CONVERSATION DOMAIN

⸻

scenarios

Examples:

Restaurant
Hotel
Airport
Train Station
Shopping

Fields:

id
name
description
difficulty
created_at
updated_at

⸻

dialogue_nodes

Fields:

id
scenario_id
speaker
text
node_type
created_at
updated_at

⸻

dialogue_choices

Fields:

id
node_id
choice_text
next_node_id
is_correct
created_at
updated_at

⸻

REVIEW DOMAIN

⸻

review_items

Central SRS table.

Fields:

id
user_id
content_type
content_id
state
next_review_at
review_count
mastery_score
created_at
updated_at

States:

new
learning
good
strong
mastered
legendary

Indexes:

review_items_user_content_type_idx on (user_id, content_type)
review_items_user_state_idx on (user_id, state)
review_items_user_due_active_idx on (user_id, next_review_at) where state not in ('mastered', 'legendary')

Functions:

get_review_stats(p_user_id uuid) returns json — aggregated counts for review dashboard stats (single-scan CTE)

get_learned_content_count(p_user_id uuid, p_content_type text) returns integer — distinct learned items from review queue and completed lessons

submit_review_rating(p_user_id uuid, p_review_item_id uuid, p_rating text, p_client_event_id uuid) returns json — atomic SRS update + history insert with idempotency. Day intervals: 1, 3, 7, 14, 30, 60, 90, 180, 365 (Learning Architecture Bible).

⸻

user_content_mastery

Per-content mastery depth beyond SRS score (Learning Architecture Bible).

Fields:

id
user_id
content_type
content_id
correct_answer_count
exercise_types (text[])
session_count
practice_day_keys (text[])
last_correct_at
created_at
updated_at

Unique: (user_id, content_type, content_id)

Indexes:

user_content_mastery_user_id_idx on (user_id)
user_content_mastery_content_idx on (content_type, content_id)

RLS: users may select/insert/update own rows only.

⸻

review_history

Fields:

id
user_id
review_item_id
rating
previous_state
new_state
mastery_score
interval_days
client_event_id (nullable, unique per user for idempotent replay)
gamification_applied_at (nullable)
gamification_result (nullable jsonb)
created_at

⸻

DAILY CHALLENGES DOMAIN

⸻

user_daily_challenge_completions

One retention challenge completion per user per local calendar day.

Fields:

id
user_id
challenge_date
correct_count
total_count
vocabulary_ids (uuid[])
client_event_id (nullable, idempotent replay)
completed_at
created_at
updated_at

Unique: (user_id, challenge_date)

Indexes:

user_daily_challenge_completions_user_date_idx on (user_id, challenge_date desc)
user_daily_challenge_completions_client_event_idx on (user_id, client_event_id) where client_event_id is not null

RLS: users may select/insert/update own rows only.

⸻

USER PROGRESS DOMAIN

⸻

user_progress

Tracks learning progress.

Fields:

id
user_id
region_id
unit_id
lesson_id
status
score
completed_at
created_at
updated_at

⸻

user_mastery

Fields:

id
user_id
vocabulary_mastery
kanji_mastery
grammar_mastery
reading_mastery
listening_mastery
writing_mastery
speaking_mastery
overall_mastery
created_at
updated_at

⸻

TRIALS DOMAIN

⸻

trial_templates

Regional boss and final trial definitions.

Fields:

id
slug
region_slug
kind (trial_kind: regional_challenge | boss_trial | final_trial)
title
description
boss_name
pass_score
time_limit_seconds
ep_reward
min_region_progress_percent
prerequisite_trial_slug
sort_order
status
created_at
updated_at

⸻

trial_steps

Ordered steps within a trial template.

Fields:

id
trial_template_id
order_index
step_kind (trial_step_kind)
prompt
display_text
accepted_answers (jsonb)
options (jsonb)
correct_index
match_pairs (jsonb)
content_type (text, nullable — CMS content reference for bible-aligned boss steps)
content_id (uuid, nullable)
created_at
updated_at

trial_step_kind values:

typed_recall
choice_recall
matching
reading_comprehension
listening_comprehension
writing_application
grammar_context
story_comprehension
applied_vocabulary

Indexes:

trial_steps_content_idx on (content_type, content_id) where content_id is not null

⸻

user_trial_progress

Fields:

id
user_id
trial_template_id
best_score
best_grade
passed
passed_at
attempt_count
last_attempt_at
created_at
updated_at

⸻

user_trial_attempts

Fields:

id
user_id
trial_template_id
score_percent
grade
correct_count
total_count
duration_seconds
created_at

⸻

GAMIFICATION DOMAIN

⸻

user_elevation

Fields:

id
user_id
current_level
current_ep
total_ep
created_at
updated_at

⸻

achievements

Fields:

id
name
slug
description
rarity
reward_type
reward_value
created_at
updated_at

⸻

user_achievements

Fields:

id
user_id
achievement_id
unlocked_at
created_at
updated_at

⸻

daily_quests

Fields:

id
title
description
reward
created_at
updated_at

⸻

user_quests

Fields:

id
user_id
quest_id
progress
completed
completed_at
created_at
updated_at

⸻

STREAK DOMAIN

⸻

user_streaks

Fields:

id
user_id
current_streak
longest_streak
last_activity_date
created_at
updated_at

⸻

LEAGUE DOMAIN

⸻

leagues

Fields:

id
name
order_index
created_at
updated_at

Examples:

Bronze Trail
Silver Trail
Gold Trail
Platinum Trail
Diamond Summit
Legend Summit

⸻

league_seasons

Fields:

id
league_id
start_date
end_date
created_at
updated_at

⸻

league_memberships

Fields:

id
user_id
league_id
season_id
ranking
created_at
updated_at

⸻

SOCIAL DOMAIN

⸻

friends

Fields:

id
user_id
friend_user_id
status
created_at
updated_at

⸻

friend_activity

Fields:

id
user_id
activity_type
reference_id
created_at

⸻

ASSET DOMAIN

⸻

assets

Central asset registry.

Fields:

id
name
category
version
file_path
metadata_path
owner_agent
status
created_at
updated_at

⸻

asset_versions

Fields:

id
asset_id
version
change_notes
created_at

⸻

SHOP DOMAIN

⸻

themes

Fields:

id
name
description
unlock_type
created_at
updated_at

⸻

shop_items

Fields:

id
name
category
price
currency
created_at
updated_at

⸻

user_inventory

Fields:

id
user_id
item_id
quantity
created_at
updated_at

⸻

EVENT DOMAIN

⸻

events

Fields:

id
name
description
start_date
end_date
created_at
updated_at

⸻

event_rewards

Fields:

id
event_id
reward_type
reward_value
created_at
updated_at

⸻

ANALYTICS DOMAIN

⸻

analytics_events

Fields:

id
user_id
event_name
event_data
created_at

⸻

SECURITY DOMAIN

⸻

audit_logs

Fields:

id
actor_id
action
resource_type
resource_id
metadata
created_at

⸻

INDEXING REQUIREMENTS

Must index:

user_id
jlpt_level
next_review_at
created_at
updated_at
status
slug

for performance-critical tables.

⸻

ROW LEVEL SECURITY

Required on:

profiles
user_settings
review_items
review_history
user_content_mastery
user_daily_challenge_completions
user_progress
user_mastery
user_elevation
user_achievements
user_streaks
user_inventory
friends

Users may only access their own records unless explicitly public.

⸻

DATABASE SUCCESS CRITERIA

The schema must support:

* Millions of review records
* Years of learning history
* Future expansion
* Additional languages
* Additional game modes
* Additional regions
* New achievement systems

without major redesign.

⸻

NOBORU DATABASE PRINCIPLE

The database is the mountain beneath the trail.

Users never see it.

Everything depends on it.

Build it strong enough to carry years of ascent.

END OF database-schema.md