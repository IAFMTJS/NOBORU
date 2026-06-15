NOBORU UI SPECIFICATION

DOCUMENT 12

SCREEN-BY-SCREEN IMPLEMENTATION SPECIFICATIONS

Version 1.0

⸻

PURPOSE

Previous documents define:

* philosophy
* immersion
* systems
* layouts
* components

This document defines exactly how each screen should be implemented.

This document exists to remove ambiguity.

No implementation should rely on interpretation.

No implementation should rely on assumptions.

No implementation should rely on common mobile design patterns.

Every screen should be buildable directly from this specification.

⸻

SCREEN 01

JOURNEY SCREEN

Purpose:

Primary application experience.

⸻

Physical Location

Mountain Trail

⸻

Player Feeling

Exploration

Progress

Curiosity

⸻

Required Elements

Trail

Lesson Nodes

Fox

Lanterns

Shrines

Environment

HUD

Navigation

⸻

Screen Priority

1 Current Node

2 Trail

3 Fox

4 Future Path

5 Shrines

6 Environment

7 HUD

⸻

Must Never Contain

Cards

Lesson Lists

Level Select Menus

Statistics Panels

Quest Dashboards

Achievement Panels

Inventory Widgets

Region Cards

⸻

Implementation Rule

The player should immediately understand:

“I am standing somewhere on a mountain trail.”

⸻

SCREEN 02

LESSON ENTRY SCREEN

Purpose

Begin Lesson

⸻

Physical Location

Current Lesson Location

⸻

Required Elements

Lesson Name

Difficulty

Rewards

Begin Button

Environment

⸻

Player Feeling

Preparation

Anticipation

⸻

Forbidden

Generic modal

Quiz launcher

Card popup

⸻

SCREEN 03

VOCABULARY LESSON

Purpose

Vocabulary Learning

⸻

Physical Location

Travel Study Area

⸻

Required Elements

Word

Audio

Answers

Progress

Hearts

⸻

Visual Priority

Word must dominate.

⸻

Forbidden

Quiz website appearance

Survey appearance

Educational software appearance

⸻

SCREEN 04

KANJI LESSON

Purpose

Kanji Recognition

⸻

Required Elements

Large Kanji

Reading

Examples

Feedback

⸻

Rule

Kanji occupies visual center.

⸻

SCREEN 05

LISTENING LESSON

Purpose

Listening Comprehension

⸻

Visual Priority

Audio interaction.

⸻

Required Elements

Audio

Answers

Feedback

⸻

Rule

Audio button is primary object.

⸻

SCREEN 06

MATCHING LESSON

Purpose

Association Learning

⸻

Required Elements

Cards

Connections

Feedback

⸻

Rule

Movement feels tactile.

⸻

SCREEN 07

CONVERSATION LESSON

Purpose

Language Simulation

⸻

Required Elements

Character

Dialogue

Choices

Feedback

⸻

Rule

Character must feel part of the world.

⸻

SCREEN 08

LESSON COMPLETE

Purpose

Celebrate Progress

⸻

Required Elements

XP

Rewards

Journey Advancement

Continue

Fox Reaction

⸻

Player Feeling

Forward Momentum

⸻

Rule

Progress should feel connected to the mountain.

⸻

SCREEN 09

SHRINE CHECKPOINT

Purpose

Major Milestone

⸻

Required Elements

Shrine

Rewards

Celebration

Fox Reaction

⸻

Player Feeling

Achievement

⸻

Rule

Memorable moment.

⸻

SCREEN 10

REGION UNLOCK

Purpose

Reveal New Region

⸻

Required Elements

Gate

Fog Removal

Region Reveal

Fox Reaction

Continue

⸻

Player Feeling

Discovery

⸻

Rule

One of the strongest moments in the application.

⸻

SCREEN 11

CAMP

Purpose

Home Base

⸻

Required Elements

Campfire

Fox

Quest Board

Chest

Merchant

Shrine

Tent

Navigation

⸻

Rule

Everything must exist physically.

⸻

Forbidden

Dashboard layouts

Widget systems

Management screens

⸻

SCREEN 12

QUEST BOARD

Purpose

Quest Access

⸻

Required Elements

Quest List

Quest Rewards

Progress

⸻

Rule

Quest Board remains visible.

⸻

Forbidden

Quest Dashboard

Task Manager

⸻

SCREEN 13

STREAK SHRINE

Purpose

Consistency Tracking

⸻

Required Elements

Shrine

Lanterns

Milestones

Decorations

⸻

Rule

Visual growth represents streak growth.

⸻

SCREEN 14

REWARD CHEST

Purpose

Reward Collection

⸻

Required Elements

Chest

Rewards

Animations

⸻

Rule

Rewards originate from the chest.

⸻

SCREEN 15

MERCHANT

Purpose

Cosmetic Acquisition

⸻

Required Elements

Merchant

Goods

Prices

Interaction

⸻

Rule

Feels like a merchant encounter.

⸻

Forbidden

Storefront

Product Grid

Webshop

⸻

SCREEN 16

INVENTORY

Purpose

Backpack Management

⸻

Required Elements

Backpack

Stored Items

Inspection Area

⸻

Rule

Player should feel like opening a backpack.

⸻

Forbidden

Inventory Grids

MMORPG Inventory

Spreadsheet Layouts

⸻

SCREEN 17

PROFILE

Purpose

Travel Record

⸻

Required Elements

Avatar

Name

Title

Journey Status

Achievements

Collections

⸻

Rule

Feels personal.

Not social.

⸻

SCREEN 18

MEMORY BOOK

Purpose

Journey History

⸻

Required Elements

Book

Pages

Milestones

Discoveries

Illustrations

⸻

Rule

Book is the interface.

⸻

SCREEN 19

ACHIEVEMENT SHRINE

Purpose

Achievement Display

⸻

Required Elements

Plaques

Banners

Statues

Trophies

⸻

Rule

Achievements displayed physically.

⸻

Forbidden

Achievement Grid

Badge Collection Page

⸻

SCREEN 20

COLLECTIONS

Purpose

Artifact Display

⸻

Required Elements

Artifacts

Categories

Descriptions

⸻

Rule

Museum feeling.

Not inventory feeling.

⸻

SCREEN 21

EVENTS

Purpose

Festival Content

⸻

Required Elements

Event Story

Activities

Rewards

Progress

⸻

Rule

Feels integrated into the world.

⸻

Forbidden

Advertisement style layouts

Promotional popups

⸻

SCREEN 22

LEADERBOARD

Purpose

Recognition

⸻

Required Elements

Players

Titles

Ranks

Achievements

⸻

Rule

Recognition.

Not competition.

⸻

SCREEN 23

FRIENDS

Purpose

Journey Comparison

⸻

Required Elements

Friends

Current Region

Achievements

Titles

⸻

Rule

Celebrate others.

Never pressure.

⸻

SCREEN 24

REGION OVERVIEW

Purpose

Navigation Support

⸻

Required Elements

Regions

Landmarks

Completion

Boss Status

⸻

Rule

Secondary screen only.

⸻

Forbidden

Primary navigation

Level select

Chapter menu

⸻

SCREEN 25

STATISTICS

Purpose

Motivational Reflection

⸻

Required Elements

Lessons

Words

Kanji

Streak

Journey Distance

⸻

Rule

Simple.

Minimal.

Supportive.

⸻

Forbidden

Graphs

Analytics Dashboards

Business Intelligence Layouts

Data Visualization Pages

⸻

SCREEN 26

SETTINGS

Purpose

Configuration

⸻

Required Elements

Audio

Language

Accessibility

Privacy

Support

⸻

Rule

Remain visually connected to Noboru.

⸻

Forbidden

OS-style settings

Generic settings menus

⸻

SCREEN 27

NOTIFICATIONS

Purpose

Review Updates

⸻

Required Elements

Achievements

Rewards

Events

Milestones

⸻

Rule

Useful.

Never noisy.

⸻

SCREEN 28

OFFLINE MODE

Purpose

Offline Continuity

⸻

Required Elements

Offline Status

Available Features

Explanation

⸻

Rule

Limited.

Not broken.

⸻

SCREEN 29

EMPTY STATES

Purpose

Encourage Discovery

⸻

Required Elements

Illustration

Message

Action

⸻

Rule

Player has not discovered this yet.

Never communicate absence.

⸻

IMPLEMENTATION VALIDATION

Before implementation of any screen verify:

1. Physical Location Exists
2. World Dominates Layout
3. Screen Matches Philosophy
4. No Generic Mobile Patterns
5. No Dashboard Patterns
6. No Spreadsheet Patterns
7. No Ecommerce Patterns
8. No Administrative Patterns
9. No Corporate UI Patterns
10. Screen Supports Immersion

⸻

FINAL RULE

If a screenshot can be mistaken for:

a productivity app

a learning platform

an ecommerce site

a dashboard

an admin tool

a statistics portal

then the implementation has failed.

A screenshot should immediately communicate:

“This is Noboru.”

⸻

END OF DOCUMENT