NOBORU - MASTER_PROMPT.md

PART 1 - VISION, BRAND, ARCHITECTURE, RULES & AGENTS

â¸»

PROJECT IDENTITY

Project Name:

Noboru

Meaning:

* To Climb
* To Rise
* To Ascend

Core Philosophy:

Learning Japanese is not a checklist.

Learning Japanese is a climb.

Every lesson is another step.

Every review session builds strength.

Every challenge prepares the learner for higher elevations.

Every JLPT level is a new summit.

Users are not completing lessons.

Users are ascending.

â¸»

PROJECT MISSION

Create the worldâ€™s best Japanese learning platform.

The platform must combine:

* Educational effectiveness
* Beautiful design
* Long-term retention
* Deep gamification
* Modern technology
* Offline capability
* Premium user experience

The platform should feel like:

* A learning platform
* An adventure game
* A personal growth journey

The platform should never feel like:

* Homework
* Corporate training software
* A productivity tracker
* A streak addiction machine

â¸»

PRIMARY OBJECTIVE

Before implementing features:

1. Design architecture
2. Create documentation
3. Create rule systems
4. Create agent systems
5. Create database architecture
6. Create design system
7. Create asset pipeline
8. Create development roadmap

Never build random screens first.

Never skip planning phases.

Never introduce technical debt intentionally.

â¸»

DEVELOPMENT PHILOSOPHY

Every decision must optimize for:

* Scalability
* Maintainability
* User experience
* Educational effectiveness
* Long-term growth

Shortcuts are forbidden.

Temporary solutions become permanent problems.

Build systems.

Not pages.

Build foundations.

Not demos.

â¸»

NO EXTERNAL AI POLICY

Noboru must function completely without external AI providers.

Forbidden:

* OpenAI
* Anthropic
* Gemini
* Mistral
* Grok
* Any paid cloud AI service

The application must remain fully usable with:

* No AI
* No internet
* No cloud processing

Future AI support must be optional.

Future AI support must be abstracted.

â¸»

FUTURE LOCAL AI SUPPORT

Create interfaces only.

Do not implement.

Possible future providers:

* Ollama
* Llama
* Gemma
* Qwen
* DeepSeek

The application must continue functioning if all AI services are disabled.

â¸»

PRODUCT PILLARS

Pillar 1

Mastery

The goal is fluency.

Not engagement metrics.

â¸»

Pillar 2

Progress

Users should always feel forward momentum.

â¸»

Pillar 3

Adventure

Learning should feel like exploration.

â¸»

Pillar 4

Achievement

Every accomplishment should feel meaningful.

â¸»

Pillar 5

Consistency

Small daily actions create mastery.

â¸»

Pillar 6

Wonder

Japan should feel fascinating and worth discovering.

â¸»

TARGET AUDIENCE

Beginner Learners

No prior Japanese knowledge.

â¸»

Anime Learners

Goal:

Watch anime without subtitles.

Read manga.

â¸»

Travelers

Goal:

Visit Japan.

Communicate confidently.

â¸»

Cultural Learners

Goal:

Understand Japanese culture.

â¸»

Serious JLPT Students

Goal:

Pass N5 through N1.

â¸»

BRAND IDENTITY

Brand Name:

Noboru

Brand Personality:

* Encouraging
* Curious
* Determined
* Adventurous
* Respectful
* Intelligent

Never:

* Condescending
* Manipulative
* Guilt-driven
* Childish
* Hyperactive

â¸»

BRAND PROMISE

Every day you climb a little higher.

Every lesson matters.

Every review strengthens you.

Every challenge prepares you.

Every summit leads to another horizon.

â¸»

VISUAL THEME

Primary Theme:

Mountain Ascent

Secondary Theme:

Japanese Discovery

Supporting Themes:

* Trails
* Mountains
* Shrines
* Lanterns
* Torii Gates
* Clouds
* Maps
* Exploration
* Summits

â¸»

VISUAL INSPIRATION

Japanese mountain villages

Traditional shrines

Japanese hiking trails

Apple product design

Nintendo polish

Modern premium SaaS

Minimalist interfaces

Adventure journals

â¸»

DESIGN FEELING

The application should feel:

* Premium
* Calm
* Focused
* Inspiring
* Elegant
* Modern

Never:

* Cluttered
* Loud
* Aggressive
* Cheap
* Generic

â¸»

CORE MASCOT

Name:

Yama

Species:

Japanese Mountain Fox

Role:

Climbing Companion

Yama is not a teacher.

Yama is not a coach.

Yama climbs alongside the learner.

â¸»

YAMA PERSONALITY

Curious

Adventurous

Supportive

Determined

Resilient

Friendly

Observant

Never annoying.

Never overly energetic.

Never childish.

â¸»

YAMA DESIGN

Canonical reference: yama_main_light_v1 / yama_main_dark_v1

White fluffy fur

Black accents (ear tips, paw tips, tail tip)

Red forehead diamond sigil

Golden swirl markings on haunches and tail

Deep red scarf with dual-peak mountain logo

Large expressive eyes (warm orange-red)

Premium painterly illustration style

Slight anime influence

Nintendo-level charm

MVP simplification: no backpack or temple bell in canonical design

Backpack and bell reserved for future Yama variants

â¸»

YAMA EXPRESSIONS

Happy

Excited

Thinking

Studying

Focused

Determined

Celebrating

Confused

Surprised

Sleepy

Victorious

Legendary

â¸»

APP EXPERIENCE

The user should feel:

â€œI am progressing.â€

Not:

â€œI am maintaining a streak.â€

The application should motivate through achievement.

Not guilt.

â¸»

TECH STACK

Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion

Backend:

* Supabase
* PostgreSQL
* Edge Functions

Authentication:

* Supabase Auth

Analytics:

* Posthog

Hosting:

* Vercel

â¸»

PLATFORM REQUIREMENTS

Mobile First

PWA First

Offline First

Dark Mode

Light Mode

Fast Loading

Native Feeling

Accessible

Responsive

Production Ready

â¸»

PROJECT STRUCTURE

/docs

/agents

/agents/core

/agents/subagents

/.cursor

/.cursor/rules

/app

/components

/features

/lib

/hooks

/stores

/services

/types

/tests

/scripts

/assets

/supabase

â¸»

DOCUMENTATION REQUIREMENTS

Generate:

vision.md

product-strategy.md

personas.md

user-flows.md

information-architecture.md

design-system.md

database-schema.md

api-specification.md

gamification.md

jlpt-architecture.md

content-strategy.md

testing-strategy.md

deployment.md

art-direction.md

asset-registry.md

â¸»

CURSOR RULE SYSTEM

Generate:

architecture.mdc

frontend.mdc

backend.mdc

database.mdc

uiux.mdc

gamification.mdc

security.mdc

testing.mdc

deployment.mdc

accessibility.mdc

performance.mdc

animations.mdc

content.mdc

japanese-learning.mdc

assets.mdc

Each rule file must contain:

Purpose

Requirements

Coding Standards

Success Criteria

Failure Criteria

Examples

Anti-Patterns

â¸»

CORE AGENTS

Generate all agents before development.

â¸»

PRODUCT MANAGER AGENT

Responsibilities:

* Product roadmap
* Feature prioritization
* User stories
* Requirements

Outputs:

PRDs

Feature specifications

Roadmaps

â¸»

SOFTWARE ARCHITECT AGENT

Responsibilities:

* System architecture
* Folder structures
* Service boundaries
* Scalability planning

Outputs:

Architecture documentation

Technical specifications

â¸»

FRONTEND AGENT

Responsibilities:

* Components
* Screens
* UI architecture
* Mobile experience

Outputs:

Frontend implementation

â¸»

BACKEND AGENT

Responsibilities:

* APIs
* Services
* Business logic

Outputs:

Backend implementation

â¸»

DATABASE AGENT

Responsibilities:

* Schemas
* Relationships
* Indexes
* Migrations

Outputs:

Database architecture

â¸»

CONTENT AGENT

Responsibilities:

* Vocabulary
* Grammar
* Kanji
* JLPT content

Outputs:

Educational systems

â¸»

GAMIFICATION AGENT

Responsibilities:

* XP
* Levels
* Quests
* Achievements

Outputs:

Progression systems

â¸»

QA AGENT

Responsibilities:

* Testing
* Validation
* Regression prevention

Outputs:

Test suites

â¸»

DEVOPS AGENT

Responsibilities:

* Deployments
* CI/CD
* Infrastructure

Outputs:

Deployment systems

â¸»

SECURITY AGENT

Responsibilities:

* Security reviews
* Access control
* Data protection

Outputs:

Security architecture

â¸»

ACCESSIBILITY AGENT

Responsibilities:

* WCAG compliance
* Screen readers
* Keyboard navigation

Outputs:

Accessibility standards

â¸»

ANALYTICS AGENT

Responsibilities:

* Metrics
* Event tracking
* User behavior

Outputs:

Analytics architecture

â¸»

ART DIRECTOR AGENT

Responsibilities:

* Visual identity
* Asset consistency
* Style guides
* Quality control

Outputs:

Art direction system

â¸»

DEVELOPMENT WORKFLOW

Every new feature follows:

Research

Documentation

Architecture

Design

Implementation

Testing

Review

Deployment

Documentation Update

No exceptions.

â¸»

QUALITY STANDARDS

Every feature must include:

Documentation

Type Safety

Error Handling

Loading States

Empty States

Analytics

Accessibility

Responsive Design

Dark Mode

Testing

Performance Validation

Production Readiness

â¸»

FORBIDDEN PRACTICES

No placeholder systems

No TODO-driven architecture

No duplicated business logic

No untyped code

No undocumented systems

No hardcoded data

No premature optimization

No technical debt by design

â¸»

END OF PART 1

NEXT: PART 2 - LEARNING SYSTEMS, JLPT ARCHITECTURE, CONTENT ENGINE, GAMIFICATION, REVIEW SYSTEMS, GAMES, PROGRESSION

NOBORU - MASTER_PROMPT.md

PART 2 - LEARNING SYSTEMS, JLPT ARCHITECTURE, CONTENT ENGINE, GAMIFICATION & PROGRESSION

â¸»

EDUCATIONAL PHILOSOPHY

Noboru exists to create actual Japanese proficiency.

Success is measured by:

* Comprehension
* Retention
* Recall
* Conversation ability
* Reading ability
* Listening ability
* JLPT readiness

Success is NOT measured solely by:

* Streaks
* Session count
* Screen time
* XP farming

Educational outcomes always take priority over engagement mechanics.

â¸»

LEARNING MODEL

Noboru teaches through:

Input

â†’ Understanding

â†’ Recognition

â†’ Recall

â†’ Production

â†’ Mastery

Every concept must move through all stages.

â¸»

LEARNING PILLARS

Pillar 1

Vocabulary

â¸»

Pillar 2

Kanji

â¸»

Pillar 3

Grammar

â¸»

Pillar 4

Reading

â¸»

Pillar 5

Listening

â¸»

Pillar 6

Speaking

â¸»

Pillar 7

Writing

â¸»

FULL JLPT ROADMAP

The platform must support:

JLPT N5

JLPT N4

JLPT N3

JLPT N2

JLPT N1

â¸»

N5 TARGETS

Vocabulary:

800+

Kanji:

100+

Grammar:

Core beginner grammar

Goal:

Basic communication

â¸»

N4 TARGETS

Vocabulary:

1500+

Kanji:

300+

Grammar:

Lower intermediate

Goal:

Daily conversation

â¸»

N3 TARGETS

Vocabulary:

3700+

Kanji:

650+

Grammar:

Intermediate

Goal:

Independent comprehension

â¸»

N2 TARGETS

Vocabulary:

6000+

Kanji:

1000+

Grammar:

Advanced

Goal:

Work and study readiness

â¸»

N1 TARGETS

Vocabulary:

10000+

Kanji:

2000+

Grammar:

Near-native comprehension

Goal:

Advanced fluency

â¸»

WORLD STRUCTURE

The application is divided into Regions.

Each Region represents a stage of ascent.

â¸»

REGION 1

The Foothills

Focus:

Hiragana

â¸»

REGION 2

Forest Trail

Focus:

Katakana

â¸»

REGION 3

Mount N5

â¸»

REGION 4

Mount N4

â¸»

REGION 5

Mount N3

â¸»

REGION 6

Mount N2

â¸»

REGION 7

Mount N1

â¸»

FINAL REGION

Master Summit

â¸»

UNIT STRUCTURE

Every Unit contains:

Vocabulary

Grammar

Listening

Reading

Speaking

Writing

Challenge

Review

Mini Boss

â¸»

LESSON STRUCTURE

Every lesson follows:

Introduction

Learning

Guided Practice

Recognition

Recall

Production

Challenge

Review

Completion

â¸»

LESSON TYPES

Vocabulary Lesson

Grammar Lesson

Kanji Lesson

Listening Lesson

Reading Lesson

Writing Lesson

Speaking Lesson

Challenge Lesson

Review Lesson

Boss Lesson

â¸»

VOCABULARY SYSTEM

Every word contains:

Kanji

Kana

Meaning

Part of Speech

JLPT Level

Frequency Ranking

Audio

Example Sentences

Associated Grammar

Difficulty Rating

Tags

Categories

â¸»

VOCABULARY PRACTICE TYPES

Recognition

Recall

Typing

Listening

Matching

Sentence Completion

Translation

Timed Challenge

Memory Challenge

â¸»

KANJI ACADEMY

Kanji is a dedicated system.

Not merely a lesson type.

â¸»

KANJI DATA STRUCTURE

Each Kanji contains:

Character

Meaning

On Reading

Kun Reading

Stroke Order

Radicals

Frequency

JLPT Level

Examples

Mnemonics

Writing Practice

Review Status

Mastery Score

â¸»

KANJI PRACTICE MODES

Recognition

Recall

Writing

Stroke Order

Listening

Meaning Match

Reading Match

Sentence Usage

Speed Review

Boss Challenge

â¸»

GRAMMAR SYSTEM

Every grammar point contains:

Meaning

Explanation

Usage Rules

Common Mistakes

Example Sentences

Formal Usage

Informal Usage

Related Grammar

JLPT Classification

â¸»

GRAMMAR LESSON FLOW

Introduction

Explanation

Examples

Guided Practice

Production Practice

Challenge

Review

â¸»

LISTENING SYSTEM

Audio Sources:

Male Voice

Female Voice

Slow

Normal

Fast

â¸»

LISTENING EXERCISES

Multiple Choice

Fill Blank

Dictation

Shadowing

Sentence Match

Conversation Listening

Story Listening

â¸»

READING SYSTEM

Content Types:

Stories

Dialogs

Journal Entries

Signs

Menus

Articles

News

Literature

â¸»

READING PROGRESSION

N5

Simple Sentences

â¸»

N4

Short Dialogs

â¸»

N3

Stories

â¸»

N2

Articles

â¸»

N1

Advanced Content

â¸»

WRITING SYSTEM

Hiragana

Katakana

Kanji

Sentence Writing

Free Writing

Dictation

Writing Challenges

â¸»

SPEAKING SYSTEM

Phase 1:

Self Practice

Recording

Shadowing

Pronunciation Guides

â¸»

Phase 2:

Local Speech Engine Integration

Optional

Never required

â¸»

CONVERSATION SYSTEM

No AI required.

Built using dialogue trees.

â¸»

SCENARIOS

Restaurant

Train Station

Hotel

Airport

School

Shopping

Workplace

Friends

Travel

Emergencies

â¸»

CONVERSATION STRUCTURE

Scenario

Character

Dialogue

User Choice

Response

Outcome

Feedback

Progress Tracking

â¸»

REVIEW SYSTEM

Review is a core pillar.

Not a secondary feature.

â¸»

REVIEW STATES

New

Learning

Good

Strong

Mastered

Legendary

â¸»

REVIEW INTERVALS

1 Day

3 Days

7 Days

14 Days

30 Days

90 Days

180 Days

365 Days

â¸»

ADAPTIVE STUDY ENGINE

No AI.

Deterministic Logic Only.

â¸»

INPUTS

Accuracy

Lesson Completion

Weak Skills

Review Backlog

Kanji Performance

Vocabulary Performance

Grammar Performance

Study Frequency

â¸»

OUTPUTS

Recommended Lessons

Recommended Reviews

Weak Area Alerts

Suggested Goals

Suggested Challenges

â¸»

GAMIFICATION PHILOSOPHY

Gamification supports learning.

Learning does not support gamification.

Educational outcomes always win.

â¸»

ELEVATION SYSTEM

XP is renamed:

Elevation Points

EP

â¸»

LEVEL SYSTEM

Levels:

1 - 100

Future Expansion:

Unlimited Prestige

â¸»

LEVEL REWARDS

Themes

Titles

Badges

Icons

Profile Frames

Yama Variants

Cosmetics

â¸»

ACHIEVEMENT SYSTEM

Achievement Categories:

Learning

Vocabulary

Kanji

Grammar

Reading

Listening

Writing

Speaking

Streaks

Challenges

Events

Exploration

â¸»

ACHIEVEMENT RARITIES

Common

Uncommon

Rare

Epic

Legendary

Mythic

â¸»

ACHIEVEMENT EXAMPLES

First Step

Trail Walker

Camp Builder

Mountain Scout

Peak Seeker

Summit Challenger

Master Climber

Legend of Noboru

â¸»

DAILY QUESTS

Learn New Words

Review Words

Complete Lessons

Practice Kanji

Complete Reading

Complete Listening

â¸»

WEEKLY QUESTS

Complete Regions

Master Vocabulary

Master Kanji

Finish Challenges

Participate In Events

â¸»

SEASONAL EVENTS

Cherry Blossom Festival

Summer Festival

Moon Festival

Winter Expedition

New Year Climb

Special Event Regions

â¸»

LEAGUE SYSTEM

Bronze Trail

Silver Trail

Gold Trail

Platinum Trail

Diamond Summit

Master Summit

Legend Summit

â¸»

LEADERBOARDS

Friends

Regional

Global

Seasonal

Event Based

â¸»

REWARD ECONOMY

Currencies:

Elevation Points

Gold

Gems

Event Tokens

â¸»

SHOP SYSTEM

Themes

Icons

Badges

Frames

Yama Skins

Seasonal Cosmetics

Profile Decorations

â¸»

COLLECTION SYSTEMS

Kanji Collection

Vocabulary Collection

Achievement Collection

Title Collection

Theme Collection

Badge Collection

Yama Collection

â¸»

GAME CENTER

Games must reinforce learning.

No disconnected mini-games.

â¸»

GAME 1

Kanji Hunter

â¸»

GAME 2

Vocabulary Rush

â¸»

GAME 3

Memory Dungeon

â¸»

GAME 4

Tokyo Runner

â¸»

GAME 5

Word Match

â¸»

GAME 6

Fishing Challenge

â¸»

GAME 7

Tower Defense

â¸»

GAME 8

Rhythm Challenge

â¸»

GAME 9

Boss Battles

â¸»

GAME 10

Memory Palace

â¸»

BOSS SYSTEM

Each Region ends with a Trial.

Trials test:

Vocabulary

Kanji

Grammar

Listening

Reading

Review Knowledge

â¸»

REGIONAL BOSSES

Foothills Guardian

Forest Spirit

N5 Sentinel

N4 Keeper

N3 Warden

N2 Sage

N1 Master

Summit Legend

â¸»

MASTERY TRACKING

Track:

Vocabulary Mastery

Kanji Mastery

Grammar Mastery

Listening Mastery

Reading Mastery

Writing Mastery

Speaking Mastery

Overall Mastery

â¸»

USER PROFILE

Track:

Current Region

Elevation

Level

Achievements

Streak

Mastery

Collections

Recent Activity

â¸»

LONG TERM GOAL

Users should feel:

I am climbing.

I am improving.

I am becoming capable.

The journey matters.

The summit matters.

The next step matters.

Every action should reinforce the feeling of ascent.

â¸»

END OF PART 2

NEXT: PART 3 - DATABASE ARCHITECTURE, MCP SYSTEMS, ASSET PIPELINE, ART DIRECTION, ADMIN PANEL, DEPLOYMENT, TESTING, SECURITY & RELEASE ROADMAP

NOBORU - MASTER_PROMPT.md

PART 3 - DATABASE ARCHITECTURE, MCP SYSTEMS, ASSET PIPELINE, ADMIN PANEL, SECURITY, TESTING & RELEASE ROADMAP

â¸»

TECHNICAL PHILOSOPHY

Noboru is a long-term product.

The codebase must remain maintainable for years.

Every architectural decision must favor:

* Scalability
* Maintainability
* Performance
* Developer Experience
* Educational Reliability

Avoid:

* Overengineering
* Premature optimization
* Vendor lock-in
* Tight coupling
* Hidden dependencies

â¸»

CORE STACK

Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion

Backend:

* Supabase
* PostgreSQL
* Edge Functions

Authentication:

* Supabase Auth

Analytics:

* Posthog

Hosting:

* Vercel

PWA:

* Service Workers
* Offline Sync
* Installable App

â¸»

DATABASE PHILOSOPHY

All learning progress must be:

* Traceable
* Recoverable
* Auditable
* Versioned

User data must never be lost.

Educational progress is critical data.

â¸»

CORE DATABASE TABLES

USERS

Stores authentication data.

â¸»

PROFILES

Stores:

* Username
* Avatar
* Preferences
* Theme
* Language Settings

â¸»

USER_SETTINGS

Stores:

* Notifications
* Accessibility
* Audio Preferences
* Learning Preferences

â¸»

REGIONS

Foothills

Forest Trail

Mount N5

Mount N4

Mount N3

Mount N2

Mount N1

Master Summit

â¸»

UNITS

Belong to Regions.

Contain lessons.

â¸»

LESSONS

Store:

* Type
* Difficulty
* XP Rewards
* Dependencies

â¸»

VOCABULARY

Store:

* Kanji
* Kana
* Meaning
* Audio
* Frequency
* JLPT Level
* Categories

â¸»

KANJI

Store:

* Character
* Readings
* Stroke Order
* Radicals
* Examples

â¸»

GRAMMAR

Store:

* Rules
* Examples
* Explanations
* Difficulty

â¸»

STORIES

Store reading content.

â¸»

DIALOGUES

Store branching conversation content.

â¸»

REVIEWS

Store SRS review state.

â¸»

USER_PROGRESS

Tracks:

* Lessons
* Units
* Regions
* Mastery

â¸»

ACHIEVEMENTS

Stores:

* Name
* Category
* Rarity
* Unlock Conditions

â¸»

USER_ACHIEVEMENTS

User unlocks.

â¸»

LEAGUES

League structure.

â¸»

LEAGUE_SEASONS

Season data.

â¸»

CHALLENGES

Daily and weekly challenges.

â¸»

USER_STREAKS

Learning streak tracking.

â¸»

FRIENDS

Social relationships.

â¸»

NOTIFICATIONS

System notifications.

â¸»

EVENTS

Seasonal events.

â¸»

THEMES

Unlockable themes.

â¸»

SHOP_ITEMS

Cosmetics and unlockables.

â¸»

ANALYTICS_EVENTS

Tracked events.

â¸»

AUDIT_LOGS

System auditing.

â¸»

DATABASE REQUIREMENTS

Every table requires:

Primary Keys

Foreign Keys

Indexes

Constraints

Created At

Updated At

Soft Delete Support

â¸»

ROW LEVEL SECURITY

All user-owned data must use RLS.

Requirements:

User can access own data.

User cannot access another userâ€™s private data.

Admin roles explicitly defined.

â¸»

MIGRATION STANDARDS

Every schema change requires:

Migration

Documentation Update

Rollback Strategy

Test Coverage

â¸»

API ARCHITECTURE

Use:

Service Layer Pattern

Never query database directly from UI.

â¸»

REQUIRED LAYERS

UI Layer

Application Layer

Service Layer

Repository Layer

Database Layer

â¸»

FEATURE MODULE STRUCTURE

Each feature contains:

components/

hooks/

services/

types/

tests/

constants/

documentation/

â¸»

STATE MANAGEMENT

Use:

Server State

Client State

Derived State

Avoid unnecessary global state.

â¸»

ERROR HANDLING

Every feature must include:

Loading State

Empty State

Error State

Recovery Path

Logging

â¸»

OFFLINE FIRST REQUIREMENTS

The app must remain useful without internet.

â¸»

OFFLINE FEATURES

Vocabulary Reviews

Kanji Reviews

Reading

Lesson Progress

Achievement Tracking

Profile Access

Downloaded Content

â¸»

OFFLINE STORAGE

Use:

IndexedDB

Caching

Background Sync

Conflict Resolution

â¸»

MCP ARCHITECTURE

Support MCP integrations.

Design architecture now.

Implement integrations later.

â¸»

MCP USE CASES

Asset Generation

Content Generation

Audio Generation

Future Automation

Asset Management

â¸»

MCP WORKFLOW EXAMPLE

Create Character

Generate Prompt

Generate Asset

Validate Asset

Generate Metadata

Store Asset

Register Asset

Update Registry

â¸»

VISUAL ASSET PIPELINE

All assets must use centralized art direction.

No independent asset generation.

â¸»

ASSET STRUCTURE

/assets

/assets/avatars

/assets/mascots

/assets/icons

/assets/badges

/assets/achievements

/assets/themes

/assets/backgrounds

/assets/characters

/assets/enemies

/assets/bosses

/assets/items

/assets/events

/assets/seasons

/assets/loading

/assets/marketing

/assets/social

/assets/screenshots

â¸»

ASSET METADATA

Every asset requires:

metadata.json

Contains:

id

name

version

category

tags

created_at

updated_at

source_prompt

owner_agent

â¸»

ASSET REGISTRY

Track:

Asset ID

Asset Name

Version

Category

Dependencies

Usage Locations

Owner Agent

Status

â¸»

ART DIRECTOR SYSTEM

All assets require approval through Art Director Agent.

No exceptions.

â¸»

ART DIRECTOR RESPONSIBILITIES

Visual Consistency

Style Enforcement

Color System

Composition Rules

Asset Validation

Quality Standards

â¸»

NOBORU VISUAL STYLE

Theme:

Japanese Mountain Adventure

Feel:

Premium

Calm

Elegant

Modern

Explorative

Educational

â¸»

STYLE REFERENCES

Japanese Mountain Trails

Traditional Shrines

Torii Gates

Lanterns

Maps

Adventure Journals

Nintendo Charm

Apple Polish

â¸»

MASCOT SYSTEM

Mascot:

Yama

Species:

Japanese Mountain Fox

â¸»

YAMA AGENT

Responsibilities:

Expressions

Poses

Variants

Animations

Seasonal Versions

Event Versions

â¸»

YAMA VARIANTS

Explorer Yama

Scholar Yama

Winter Yama

Festival Yama

Legendary Yama

Summit Yama

â¸»

ICON AGENT

Responsible for:

Navigation Icons

Feature Icons

Achievement Icons

Shop Icons

System Icons

â¸»

ACHIEVEMENT AGENT

Responsible for:

Badge Design

Reward Assets

Rarity Visuals

Unlock Effects

â¸»

GAME ASSET AGENT

Responsible for:

Enemies

Bosses

Rewards

Regions

Collectibles

â¸»

CONTENT MANAGEMENT SYSTEM

Content must be editable.

Never hardcode educational content.

â¸»

CONTENT TYPES

Vocabulary

Kanji

Grammar

Dialogues

Stories

Challenges

Achievements

Events

â¸»

ADMIN PANEL

Create from day one.

â¸»

ADMIN FEATURES

User Management

Content Management

Achievement Management

Game Management

League Management

Event Management

Asset Management

Analytics

Reports

Moderation

Notifications

â¸»

CONTENT TOOLS

Vocabulary Editor

Kanji Editor

Grammar Editor

Dialogue Editor

Story Editor

Challenge Editor

Achievement Editor

Event Editor

â¸»

ANALYTICS PHILOSOPHY

Measure learning effectiveness.

Not addiction.

â¸»

TRACKED METRICS

Retention

Completion

Accuracy

Mastery

Review Completion

Challenge Completion

Region Progression

Learning Time

â¸»

SECURITY REQUIREMENTS

Authentication Required

Role-Based Permissions

Input Validation

Rate Limiting

Secure APIs

RLS Enforcement

Audit Logs

â¸»

TESTING PHILOSOPHY

Every feature must be testable.

â¸»

REQUIRED TEST TYPES

Unit Tests

Integration Tests

End-to-End Tests

Accessibility Tests

Performance Tests

Regression Tests

â¸»

PERFORMANCE TARGETS

Initial Load < 2 Seconds

Interaction Response < 100ms

Lighthouse > 90

Offline Support Required

â¸»

ACCESSIBILITY REQUIREMENTS

WCAG Compliance

Keyboard Navigation

Screen Reader Support

High Contrast Support

Reduced Motion Support

â¸»

DEPLOYMENT PIPELINE

Development

Testing

Staging

Production

â¸»

CI/CD REQUIREMENTS

Lint

Type Check

Unit Tests

Integration Tests

Build Verification

Deployment Validation

â¸»

RELEASE PHILOSOPHY

Ship stable.

Not fast.

Quality beats speed.

â¸»

DEVELOPMENT PHASES

PHASE 1

Architecture

Documentation

Rules

Agents

â¸»

PHASE 2

Database

Authentication

Design System

â¸»

PHASE 3

Learning Engine

Vocabulary

Kanji

Grammar

â¸»

PHASE 4

Review System

Adaptive Study Engine

Progress Tracking

â¸»

PHASE 5

Gamification

Achievements

Leagues

Economy

â¸»

PHASE 6

Games

Boss Battles

Regions

Collections

â¸»

PHASE 7

Community

Friends

Challenges

Social Features

â¸»

PHASE 8

Asset Pipeline

MCP Integrations

Advanced Content Tools

â¸»

PHASE 9

Optimization

Accessibility

Security Hardening

Performance

â¸»

PHASE 10

Public Launch

â¸»

FINAL DIRECTIVE

You are not building a language learning application.

You are building Noboru.

Noboru is a mountain.

Every system should reinforce ascent.

Every lesson should move the learner upward.

Every visual should support the journey.

Every achievement should feel earned.

Every interaction should encourage progress.

Build a product users can spend years climbing.

Never sacrifice educational quality for engagement.

Never sacrifice maintainability for speed.

Always prioritize mastery.

Always prioritize the climb.

â¸»

END OF MASTER_PROMPT.md

NOBORU MASTER SPECIFICATION COMPLETE


