MVP_ROADMAP.md

NOBORU MVP EXECUTION ROADMAP

Version: 1.0

Status: AUTHORITATIVE

This document defines the exact order in which Noboru must be built.

The purpose of this roadmap is to prevent feature chaos.

Noboru must be built in layers.

Never build advanced systems before foundations exist.

⸻

ROADMAP PHILOSOPHY

A language learning platform is not:

Screens

Buttons

Achievements

Games

Animations

A language learning platform is:

Content

Learning Systems

Review Systems

Progress Tracking

Only after those exist should engagement systems be introduced.

⸻

DEVELOPMENT PRIORITY ORDER

Priority 1

Foundations

↓

Priority 2

Learning Systems

↓

Priority 3

Review Systems

↓

Priority 4

Progress Tracking

↓

Priority 5

Gamification

↓

Priority 6

Social Systems

↓

Priority 7

Expansion

⸻

PHASE 0

PROJECT FOUNDATION

Goal:

Create a stable development environment.

⸻

DELIVERABLES

Repository Setup

Folder Structure

TypeScript Setup

Tailwind Setup

ShadCN Setup

Supabase Setup

Authentication Setup

Documentation Setup

Cursor Rules Setup

Agent System Setup

⸻

DEFINITION OF DONE

Project compiles.

Project deploys.

Architecture exists.

Documentation exists.

⸻

PHASE 1

DESIGN SYSTEM FOUNDATION

Goal:

Create visual consistency before building screens.

⸻

DELIVERABLES

Theme System

Color System

Typography System

Spacing System

Button Components

Card Components

Form Components

Navigation Components

Modal Components

Loading Components

⸻

DEFINITION OF DONE

Reusable UI system exists.

All future screens use design system.

⸻

PHASE 2

AUTHENTICATION & USER CORE

Goal:

Allow users to exist.

⸻

DELIVERABLES

Registration

Login

Logout

Password Reset

Profile Creation

User Settings

Theme Selection

⸻

DATABASE TABLES

profiles

user_settings

⸻

DEFINITION OF DONE

Users can create accounts.

Users can sign in.

Users can manage profiles.

⸻

PHASE 3

ONBOARDING

Goal:

Begin the Noboru journey.

⸻

DELIVERABLES

Welcome Flow

Goal Selection

Level Selection

Daily Goal Setup

Yama Introduction

Region Introduction

⸻

DEFINITION OF DONE

New users enter Foothills successfully.

⸻

PHASE 4

CONTENT MANAGEMENT SYSTEM

Goal:

Allow educational content creation.

⸻

DELIVERABLES

Vocabulary CMS

Kanji CMS

Grammar CMS

Lesson CMS

Region CMS

Achievement CMS

⸻

DATABASE TABLES

vocabulary

kanji

grammar_points

lessons

regions

achievements

⸻

DEFINITION OF DONE

Content can be created without developers.

⸻

PHASE 5

LEARNING ENGINE

Goal:

Deliver actual Japanese lessons.

⸻

DELIVERABLES

Lesson Framework

Lesson Navigation

Vocabulary Lessons

Kanji Lessons

Grammar Lessons

Lesson Completion Tracking

⸻

DEFINITION OF DONE

Users can complete lessons.

Progress is saved.

⸻

PHASE 6

HIRAGANA REGION

Goal:

Complete Foothills.

⸻

CONTENT

All Hiragana

Practice Lessons

Reading Exercises

Review Content

⸻

DEFINITION OF DONE

User can read Hiragana.

⸻

PHASE 7

KATAKANA REGION

Goal:

Complete Forest Trail.

⸻

CONTENT

All Katakana

Reading Exercises

Practice Lessons

Review Content

⸻

DEFINITION OF DONE

User can read Katakana.

⸻

PHASE 8

N5 VOCABULARY SYSTEM

Goal:

Introduce real Japanese vocabulary.

⸻

DELIVERABLES

Vocabulary Lessons

Word Details

Examples

Audio

Mastery Tracking

⸻

DEFINITION OF DONE

Users learn first N5 vocabulary.

⸻

PHASE 9

N5 GRAMMAR SYSTEM

Goal:

Introduce practical grammar.

⸻

DELIVERABLES

Grammar Lessons

Examples

Exercises

Review Integration

⸻

DEFINITION OF DONE

Users understand basic sentence construction.

⸻

PHASE 10

KANJI ACADEMY

Goal:

Teach N5 Kanji.

⸻

DELIVERABLES

Kanji Pages

Readings

Examples

Practice

Mastery Tracking

⸻

DEFINITION OF DONE

Users learn first 100+ Kanji.

⸻

PHASE 11

REVIEW ENGINE

Goal:

Create long-term retention.

⸻

DELIVERABLES

Review Queue

SRS Logic

Mastery States

Review History

Weak Area Detection

⸻

DEFINITION OF DONE

Users receive scheduled reviews.

⸻

PHASE 12

READING SYSTEM

Goal:

Introduce comprehension.

⸻

DELIVERABLES

Stories

Dialogs

Reading Questions

Progress Tracking

⸻

DEFINITION OF DONE

Users can read beginner content.

⸻

PHASE 13

LISTENING SYSTEM

Goal:

Introduce listening comprehension.

⸻

DELIVERABLES

Audio Lessons

Listening Challenges

Audio Playback

Listening Tracking

⸻

DEFINITION OF DONE

Users can complete listening exercises.

⸻

PHASE 14

PROGRESS TRACKING

Goal:

Visualize growth.

⸻

DELIVERABLES

Mastery Dashboard

Region Progress

Unit Progress

Learning Statistics

Review Statistics

⸻

DEFINITION OF DONE

Users understand progress.

⸻

PHASE 15

ELEVATION SYSTEM

Goal:

Introduce progression identity.

⸻

DELIVERABLES

Elevation Points

Level System

Level Rewards

Level Calculations

⸻

DEFINITION OF DONE

Users gain levels through learning.

⸻

PHASE 16

ACHIEVEMENT SYSTEM

Goal:

Reward meaningful accomplishments.

⸻

DELIVERABLES

Achievement Engine

Unlock Tracking

Achievement Showcase

Rarity System

⸻

DEFINITION OF DONE

Achievements unlock correctly.

⸻

PHASE 17

IMMERSIVE LEARNING & TRAIL EXPERIENCE

Goal:

Make learning feel active, visual, and expedition-like — not a wall of text cards.

Noboru is not a Duolingo clone, but lessons and the learning path must match the clarity and interactivity users expect from modern language apps while keeping the mountain-climb identity.

⸻

DELIVERABLES

Learning Path Visual Trail

Node-based region/unit/lesson map with locked, available, in-progress, and completed states

Clear “continue climbing” entry point from home and `/learn`

Trail progress visible at a glance (not list-only cards)

Home Dashboard Visual Refresh

Expedition-oriented home layout: region, trail, elevation, quests, and continue-learning as primary visuals

Reduce text-heavy card walls; prioritize one primary action per screen

Interactive Lesson Engine (beyond teach → multiple choice)

Typed recall for hiragana, katakana, vocabulary, and kanji where appropriate

Additional drill types: matching, ordering, tap-to-build, and fill-in-blank

Immediate feedback animations and step-level progress within lessons

Audio in Lessons

Vocabulary and kanji pronunciation playback during teach and recall steps

Replay control and respect for user audio settings

Lesson Immersion

Contextual examples, ruby/furigana presentation, and reading support during drills

Story/dialogue/listening steps integrated into the same immersive player flow

⸻

DEFINITION OF DONE

Users can type or interactively answer — not only pick from multiple choice after passive Japanese display

Learning path reads as a visual climb/trail, not a plain text list

Home feels like starting an expedition, not browsing a dashboard of cards

Audio plays reliably during core vocabulary and character lessons

⸻

PHASE 18

DAILY QUEST SYSTEM

Goal:

Provide structure and tie daily goals to the visual trail experience.

⸻

DELIVERABLES

Daily Quests

Weekly Quests

Quest Tracking

Quest Rewards

Quest cards integrated into home trail layout (Phase 17)

Quest objectives deep-link into lessons, reviews, and interactive drills

⸻

DEFINITION OF DONE

Users receive daily objectives that feel connected to their climb, not isolated checklist items.

⸻

PHASE 19

YAMA SYSTEM

Goal:

Bring Noboru to life across home, lessons, and milestones.

⸻

DELIVERABLES

Yama Appearances

Achievement Reactions

Loading States

Milestone Interactions

Yama encouragement during interactive lesson feedback

Celebration moments on trail node completion and level-up

⸻

DEFINITION OF DONE

Yama integrated throughout app, including lesson and path progression moments.

⸻

PHASE 20

OFFLINE SYSTEM & PWA

Goal:

Offline-first learning with a native-feeling installable app.

⸻

DELIVERABLES

PWA Foundation

Web app manifest, icons, and install prompt

Service worker for app shell and asset caching

Standalone/mobile home-screen experience

Offline Lessons

Offline Reviews

Offline Progress

Offline Audio Cache for downloaded or previously played lesson audio

Sync Engine

Conflict Resolution

⸻

DEFINITION OF DONE

Core learning works offline.

App is installable as a PWA and feels like a real mobile product, not only a responsive website.

⸻

PHASE 21

N5 TRIALS

Goal:

Validate learning through immersive, high-stakes challenges.

⸻

DELIVERABLES

Regional Challenges

Final N5 Trial

Performance Tracking

Completion Rewards

Trial formats use Phase 17 interactive drill types (typed input, mixed challenges)

Timed and multi-step trial flows with strong visual feedback

⸻

DEFINITION OF DONE

Users can complete N5 region through challenges that test real recall and comprehension.

⸻

PHASE 22

N4 EXPANSION

Goal:

Begin scaling content on the same immersive trail and lesson systems.

⸻

DELIVERABLES

N4 Curriculum

N4 Vocabulary

N4 Grammar

N4 Kanji

N4 trail nodes and lessons using interactive lesson engine from Phase 17

⸻

DEFINITION OF DONE

N4 path exists with the same visual trail and interactive lesson standards as N5.

⸻

PHASE 23

PERFORMANCE HARDENING

Goal:

Production readiness for interactive lessons, audio, and PWA delivery.

⸻

DELIVERABLES

Optimization (lesson player, trail map, audio loading, PWA cache)

Accessibility Audit

Security Audit

Testing Coverage

Analytics Validation

Lighthouse and mobile interaction targets for home, learn path, and lesson flows

⸻

DEFINITION OF DONE

Production quality reached for immersive learning, audio, and PWA surfaces.

⸻

PHASE 24

PUBLIC BETA

Goal:

Validate with real users.

⸻

DELIVERABLES

Beta Release

Feedback Collection

Bug Fixes

Curriculum Improvements

UX validation on trail clarity, lesson interactivity, audio, and PWA install flow

⸻

DEFINITION OF DONE

Stable beta users actively learning through the visual trail and interactive lesson formats.

⸻

PHASE 25

OFFICIAL LAUNCH

Goal:

Release Noboru publicly.

⸻

LAUNCH CRITERIA

Foothills Complete

Forest Trail Complete

N5 Complete

Review Engine Stable

Offline Stable

PWA Installable

Achievement System Stable

Immersive Lesson Engine Stable (typed and interactive drills live)

Visual Learning Trail Stable

Lesson Audio Stable

Admin Tools Stable

Analytics Stable

⸻

EXPLICITLY EXCLUDED FROM MVP

Leagues

Friends

Chat

Community

Advanced Games

Seasonal Events

Marketplace

Voice AI

External AI

N3 Content

N2 Content

N1 Content

⸻

MVP SUCCESS METRICS

30-Day Retention

Lesson Completion

Interactive Lesson Engagement (typed/input drill completion rate)

Review Completion

Vocabulary Retention

Kanji Retention

N5 Completion Rate

Learning Path Continuation (users returning via trail / continue-climbing)

PWA Install Rate

User Satisfaction

⸻

MVP FAILURE METRICS

High XP Usage

Low Retention

Low Comprehension

Low Review Usage

Poor Educational Outcomes

⸻

FINAL ROADMAP PRINCIPLE

Never build systems merely because they are exciting.

Build systems because they improve learning.

A beautiful mountain starts with the foundation beneath it.

Without that foundation, everything above eventually slides downhill.

END OF MVP_ROADMAP.md