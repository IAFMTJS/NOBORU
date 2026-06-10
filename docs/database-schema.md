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
difficulty
xp_reward
estimated_duration
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

Fields:

id
name
slug
created_at
updated_at

Examples:

Food
Travel
Family
School
Business
Animals

⸻

vocabulary_category_assignments

Many-to-many relationship.

Fields:

id
vocabulary_id
category_id
created_at
updated_at

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

Functions:

get_review_stats(p_user_id uuid) returns json — aggregated counts for review dashboard stats

⸻

review_history

Fields:

id
review_item_id
result
response_time
created_at

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