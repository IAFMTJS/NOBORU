NOBORU UI SPECIFICATION

DOCUMENT 10

SCREEN LAYOUT SPECIFICATIONS

Version 1.0

⸻

PURPOSE

The previous documents define:

* philosophy
* systems
* atmosphere
* progression
* immersion

This document defines:

* screen composition
* layout hierarchy
* visual structure
* object placement
* screen balance
* implementation expectations

This document exists to prevent interpretation errors.

The goal is not merely visual consistency.

The goal is structural consistency.

Every screen should feel like it belongs to the same world.

⸻

GLOBAL SCREEN STRUCTURE

Every screen follows the same hierarchy.

Layer 0

Sky

⸻

Layer 1

World Background

⸻

Layer 2

Environment Assets

⸻

Layer 3

Primary World Objects

⸻

Layer 4

Interactive Elements

⸻

Layer 5

Fox Companion

⸻

Layer 6

HUD

⸻

Layer 7

Bottom Navigation

⸻

Layer 8

Modal Layer

⸻

Layer 9

FX Layer

⸻

SCREEN COMPOSITION RULE

Every screen must contain:

World

Object

Interaction

Feedback

Navigation

The world must always occupy the largest amount of screen space.

⸻

JOURNEY SCREEN

Purpose:

Primary application experience.

⸻

JOURNEY COMPOSITION

Top 10%

Player HUD

Level

Profile

Currency

⸻

Middle 75%

Journey World

Trail

Nodes

Lanterns

Shrines

Environment

Fox

⸻

Bottom 15%

Navigation

⸻

JOURNEY VISUAL PRIORITY

Priority 1

Current Lesson Node

Priority 2

Trail

Priority 3

Fox

Priority 4

Shrines

Priority 5

Future Path

Priority 6

HUD

⸻

JOURNEY RESTRICTIONS

Do not place:

Large panels

Statistics cards

Quest panels

Dashboard widgets

Progress reports

Achievement summaries

Inventory access panels

Floating menus

The mountain remains dominant.

⸻

CAMP SCREEN

Purpose:

Home Base

⸻

CAMP COMPOSITION

Top 15%

Player Information

⸻

Middle 70%

Camp Environment

Campfire

Fox

Quest Board

Shrine

Chest

Merchant

Tent

⸻

Bottom 15%

Navigation

⸻

CAMP VISUAL PRIORITY

Priority 1

Campfire

Priority 2

Fox

Priority 3

Quest Board

Priority 4

Reward Chest

Priority 5

Shrine

Priority 6

HUD

⸻

CAMP RULE

The player should immediately understand:

Where everything physically exists.

No system may exist without a physical representation.

⸻

STUDY SCREEN

Purpose:

Learning

⸻

STUDY COMPOSITION

Top 12%

Lesson Header

⸻

Middle 58%

Question Area

⸻

Lower Middle 20%

Answer Area

⸻

Bottom 10%

Feedback Layer

⸻

STUDY VISUAL PRIORITY

Priority 1

Learning Content

Priority 2

Answer Area

Priority 3

Feedback

Priority 4

Environment

Priority 5

Fox

⸻

STUDY RULE

The lesson content must always dominate.

The world supports.

The lesson leads.

⸻

PROFILE SCREEN

Purpose:

Travel Record

⸻

PROFILE COMPOSITION

Top 30%

Identity

Avatar

Name

Title

Current Region

⸻

Middle 40%

Journey Summary

Major Achievements

Milestones

Current Progress

⸻

Bottom 30%

Collections

Titles

Accomplishments

⸻

PROFILE RULE

Must feel personal.

Never administrative.

Never social-media inspired.

⸻

INVENTORY SCREEN

Purpose:

Backpack

⸻

INVENTORY COMPOSITION

Top 15%

Backpack Header

⸻

Middle 70%

Backpack Contents

⸻

Bottom 15%

Item Inspection Area

⸻

INVENTORY RULE

The backpack itself should be visible.

Items should appear physically stored.

Avoid abstract inventory structures.

⸻

MEMORY BOOK SCREEN

Purpose:

Journey History

⸻

MEMORY BOOK COMPOSITION

Entire Screen

Book

Pages

Entries

Illustrations

⸻

MEMORY BOOK RULE

The book is the interface.

Not a UI placed on top of a book.

⸻

ACHIEVEMENT SHRINE

Purpose:

Celebrate Accomplishments

⸻

SHRINE COMPOSITION

Top 25%

Shrine Architecture

⸻

Middle 50%

Achievements

Milestones

Trophies

Decorations

⸻

Bottom 25%

Fox

Atmosphere

Navigation

⸻

SHRINE RULE

Achievements should feel displayed.

Not listed.

⸻

SHOP SCREEN

Purpose:

Merchant Encounter

⸻

SHOP COMPOSITION

Top 20%

Merchant

Shop Identity

⸻

Middle 60%

Displayed Goods

⸻

Bottom 20%

Transaction Area

⸻

SHOP RULE

The merchant must be visible.

The player should feel present in a marketplace.

Never use storefront layouts.

⸻

EVENT SCREEN

Purpose:

Festival Discovery

⸻

EVENT COMPOSITION

Top 15%

Event Introduction

⸻

Middle 65%

Event Path

Activities

Rewards

⸻

Bottom 20%

Participation Controls

⸻

EVENT RULE

Events remain part of the world.

Never feel like advertisements.

⸻

COLLECTION SCREEN

Purpose:

Artifact Collection

⸻

COLLECTION COMPOSITION

Top 15%

Collection Theme

⸻

Middle 70%

Displayed Artifacts

⸻

Bottom 15%

Details

⸻

COLLECTION RULE

Collections should feel curated.

Not catalogued.

⸻

SETTINGS SCREEN

Purpose:

Configuration

⸻

SETTINGS COMPOSITION

Top 15%

Settings Header

⸻

Middle 70%

Settings Categories

⸻

Bottom 15%

Support

Version

⸻

SETTINGS RULE

Must remain visually connected to Noboru.

Never resemble operating system settings.

⸻

LEADERBOARD SCREEN

Purpose:

Recognition

⸻

LEADERBOARD COMPOSITION

Top 20%

Leaderboard Theme

⸻

Middle 60%

Rankings

⸻

Bottom 20%

Player Position

⸻

LEADERBOARD RULE

Recognition.

Not competition.

Not pressure.

⸻

REGION OVERVIEW SCREEN

Purpose:

Navigation Support

⸻

REGION OVERVIEW COMPOSITION

Top 15%

Mountain Overview

⸻

Middle 70%

Regions

Landmarks

Progress

⸻

Bottom 15%

Return To Journey

⸻

REGION OVERVIEW RULE

The overview supports the Journey.

It never replaces the Journey.

⸻

OFFLINE SCREEN

Purpose:

Maintain Connection

⸻

OFFLINE COMPOSITION

Top 30%

Offline Illustration

⸻

Middle 40%

Explanation

⸻

Bottom 30%

Available Actions

⸻

OFFLINE RULE

Offline should feel limited.

Never broken.

⸻

EMPTY STATE SCREEN

Purpose:

Guide Discovery

⸻

EMPTY STATE COMPOSITION

Top 50%

Illustration

Fox

World Object

⸻

Middle 30%

Message

⸻

Bottom 20%

Primary Action

⸻

EMPTY STATE RULE

Communicate:

Not discovered yet.

Never:

Nothing exists.

⸻

SCREEN BALANCE RULE

World Content

Minimum 60%

Interface Content

Maximum 40%

Any screen exceeding this ratio must be reviewed.

⸻

IMPLEMENTATION TEST

Before implementation ask:

What occupies most of the screen?

If the answer is:

cards

menus

lists

tables

statistics

panels

the layout is incorrect.

The answer should be:

the world.

⸻

FINAL RULE

A player should recognize Noboru from a screenshot with all text removed.

If the screenshot resembles a traditional app interface:

The layout has failed.

⸻

END OF DOCUMENT