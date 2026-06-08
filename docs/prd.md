PRD.md

NOBORU PRODUCT REQUIREMENTS DOCUMENT

Version: 1.0

Status: AUTHORITATIVE

This document defines the complete Product Requirements for Noboru MVP.

This document translates the vision, architecture, design system, and educational systems into an executable product.

All implementation work must reference this document.

⸻

PRODUCT OVERVIEW

Product Name:

Noboru

Category:

Japanese Language Learning Platform

Platform:

PWA

Mobile First

Offline First

Primary Audience:

* Complete Beginners
* Anime Learners
* Travelers
* JLPT Students

Primary Goal:

Guide users from absolute beginner to JLPT N1 through structured progression, review systems, gamification, and mastery-focused learning.

⸻

MVP DEFINITION

The MVP is NOT:

A Duolingo clone.

The MVP IS:

A complete learning ecosystem capable of teaching Japanese through JLPT N5 with strong foundations for future expansion.

⸻

MVP SUCCESS METRICS

Users can:

Learn Hiragana

Learn Katakana

Complete N5 Curriculum

Review effectively

Track progress

Maintain motivation

Understand progression

Experience the Noboru identity

⸻

MVP MODULES

Included:

Authentication

Onboarding

Home

Learn

Vocabulary

Kanji

Grammar

Review

Progress Tracking

Achievements

Daily Quests

Profile

Settings

Admin Panel

Offline Support

Dark Mode

Light Mode

⸻

POST-MVP MODULES

Not Required Initially:

Community

Friends

Leagues

Advanced Games

Seasonal Events

Local AI

Voice Recognition

Premium Store

N2-N1 Content

⸻

USER JOURNEY

STAGE 1

Discovery

User installs Noboru.

⸻

STAGE 2

Onboarding

User selects:

Goal

Current level

Daily study goal

Theme preference

⸻

STAGE 3

First Climb

User begins Foothills.

Learns Hiragana.

⸻

STAGE 4

Progress

User advances through regions.

Builds vocabulary.

Learns grammar.

Completes reviews.

⸻

STAGE 5

Mastery

User completes N5.

Unlocks next mountain.

⸻

AUTHENTICATION

Requirements:

Email Login

Email Registration

Password Reset

Remember Session

Guest Mode (optional)

⸻

ONBOARDING

Screen 1

Welcome To Noboru

⸻

Screen 2

Why Are You Learning Japanese?

Options:

Anime

Travel

Culture

Work

JLPT

⸻

Screen 3

Current Level

None

N5

N4

N3

N2

N1

⸻

Screen 4

Daily Goal

5 min

10 min

20 min

30 min

60 min

⸻

Screen 5

Theme Preference

Light Mode

Dark Mode

Default: Dark Mode

⸻

Screen 6

Meet Yama

Introduction to companion.

Uses canonical yama_main_light_v1 or yama_main_dark_v1 based on theme selection.

⸻

Screen 7

Begin Ascent

Start Foothills.

⸻

HOME SCREEN

Must Display:

Current Region

Current Trail

Continue Learning

Daily Goal

Elevation Progress

Recent Achievement

Review Queue

Daily Quest

⸻

LEARN TAB

Displays:

Regions

Units

Lessons

Progress

Upcoming Challenges

⸻

REGION SYSTEM

MVP Regions:

Foothills

Forest Trail

Mount N5

⸻

LESSON SYSTEM

Every lesson contains:

Introduction

Teaching

Guided Practice

Recognition

Recall

Review

Completion

⸻

LESSON TYPES

Vocabulary

Grammar

Kanji

Listening

Reading

Challenge

Review

⸻

VOCABULARY SYSTEM

Features:

Word Detail Page

Audio

Examples

Categories

Mastery Tracking

Review Integration

⸻

KANJI ACADEMY

Features:

Kanji Detail

Readings

Examples

Stroke Order

Mastery Tracking

Review Integration

⸻

GRAMMAR SYSTEM

Features:

Grammar Cards

Examples

Exercises

Review Integration

⸻

REVIEW CENTER

Purpose:

Central review hub.

Displays:

Due Reviews

Review History

Mastery Stats

Weak Areas

⸻

SRS SYSTEM

States:

New

Learning

Good

Strong

Mastered

Legendary

Intervals:

1

3

7

14

30

90

180

365

Days

⸻

DAILY QUESTS

Examples:

Learn 10 Words

Complete 2 Lessons

Review 20 Items

Earn 100 EP

Rewards:

EP

Gold

Achievements

⸻

ACHIEVEMENT SYSTEM

MVP Achievements:

First Step

First Lesson

10 Lessons

100 Words

50 Kanji

7 Day Streak

N5 Completed

⸻

PROFILE SCREEN

Displays:

Avatar

Yama Variant

Current Region

Current Level

Mastery Stats

Achievements

Recent Activity

⸻

SETTINGS

Theme

Language

Audio

Notifications

Accessibility

Data Sync

Account

⸻

ADMIN PANEL

MVP Requirements:

Manage Vocabulary

Manage Kanji

Manage Grammar

Manage Lessons

Manage Regions

Manage Users

Manage Achievements

Manage Quests

⸻

OFFLINE REQUIREMENTS

Must Work Offline:

Vocabulary

Kanji

Grammar

Reviews

Downloaded Lessons

Progress Tracking

⸻

NOTIFICATIONS

Daily Reminder

Review Reminder

Quest Completion

Achievement Unlock

⸻

ANALYTICS

Track:

Lesson Completion

Review Completion

Retention

Mastery

Region Progression

Quest Completion

⸻

ACCESSIBILITY

Required:

Screen Reader

Keyboard Navigation

Reduced Motion

High Contrast

⸻

DARK MODE

Primary experience.

Must feel:

Calm

Focused

Premium

⸻

LIGHT MODE

Secondary experience.

Must feel:

Clean

Fresh

Readable

⸻

PERFORMANCE TARGETS

Load Time < 2 Seconds

Interaction < 100ms

Lighthouse > 90

Offline Functional

⸻

RELEASE CRITERIA

The MVP is complete when:

Users can learn through N5.

Users can review content.

Users can track mastery.

Users understand progression.

The Noboru identity is fully visible.

The experience feels cohesive.

The climb feels real.

⸻

MVP FAILURE CONDITIONS

If users:

Only chase XP

Ignore learning

Cannot retain vocabulary

Cannot understand grammar

Cannot complete practical Japanese tasks

Then the MVP fails.

⸻

PRODUCT PRINCIPLE

Noboru is not a lesson app.

Noboru is a mountain.

The product succeeds when learners feel themselves climbing it.

END OF PRD.md