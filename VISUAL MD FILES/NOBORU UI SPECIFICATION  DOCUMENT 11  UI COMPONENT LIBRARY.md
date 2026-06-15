NOBORU UI SPECIFICATION

DOCUMENT 11

UI COMPONENT LIBRARY

Version 1.0

⸻

PURPOSE

This document defines every reusable UI component within Noboru.

The purpose of this document is to eliminate interpretation.

Every component must behave consistently.

Every component must visually belong to the world.

Every component must support immersion.

This document defines:

* purpose
* placement
* visual treatment
* interaction rules
* animation rules
* forbidden implementations

If a component is not defined here, a new component specification must be created before implementation.

⸻

COMPONENT 001

LESSON NODE

Purpose:

Represents a lesson location on the trail.

⸻

Visual Identity

Stone marker

Lantern marker

Trail shrine

World object

⸻

Never

Button

Card

Menu item

List element

⸻

States

Locked

Available

Current

Completed

⸻

Current State

Highest visual priority.

Warm gold glow.

Subtle pulse.

Fox attention directed toward node.

⸻

Interaction

Tap Node

Node expands slightly

Glow intensifies

Lesson panel appears

⸻

Forbidden

Floating button appearance

Card appearance

UI icon appearance

⸻

COMPONENT 002

BOSS NODE

Purpose:

Major progression challenge.

⸻

Visual Identity

Large shrine

Sacred gate

Unique landmark

⸻

States

Locked

Available

Completed

⸻

Visual Priority

Higher than lesson nodes.

Lower than current objective.

⸻

Forbidden

Large monster card

Boss menu entry

Boss selection screen

⸻

COMPONENT 003

SHRINE

Purpose:

Major milestone.

⸻

Visual Identity

Torii gate

Temple structure

Sacred landmark

⸻

Interaction

Activation

Glow

Lantern ignition

Reward reveal

⸻

Forbidden

Checkpoint button

Progress card

Achievement tile

⸻

COMPONENT 004

FOX COMPANION

Purpose:

Emotional anchor.

⸻

Placement

World only.

⸻

Never

HUD

Widget

Assistant

Floating UI

Chat bubble system

Notification system

⸻

States

Idle

Happy

Excited

Proud

Focused

Celebrating

Concerned

Sleepy

⸻

COMPONENT 005

CAMPFIRE

Purpose:

Camp centerpiece.

⸻

Visual Identity

Permanent world object.

⸻

Always Visible

Yes

⸻

States

Idle

Enhanced

Festival

Advanced

⸻

Forbidden

UI decoration

Static image

Background prop

⸻

COMPONENT 006

QUEST BOARD

Purpose:

Quest access.

⸻

Visual Identity

Wooden board

Camp structure

⸻

Interaction

Tap Board

Quest sheet opens

⸻

Forbidden

Quest menu

Quest dashboard

Quest tab

⸻

COMPONENT 007

REWARD CHEST

Purpose:

Reward collection.

⸻

States

Closed

Available

Opening

Collected

⸻

Interaction

Tap

Open

Reward sequence

⸻

Forbidden

Inbox

Mailbox

Notification center

Reward list

⸻

COMPONENT 008

MEMORY BOOK

Purpose:

Journey history.

⸻

Visual Identity

Physical book.

⸻

Interaction

Open page

Flip page

Browse memories

⸻

Forbidden

Timeline UI

Activity feed

History table

⸻

COMPONENT 009

MERCHANT

Purpose:

Shop interaction.

⸻

Visual Identity

Traveler

Merchant stand

Festival vendor

⸻

Required

Merchant visible on screen.

⸻

Forbidden

Storefront

Product catalog

Ecommerce layout

⸻

COMPONENT 010

INVENTORY ITEM

Purpose:

Collected object.

⸻

Visual Identity

Physical possession.

⸻

Display Style

Placed inside backpack.

Displayed on cloth.

Displayed in storage compartment.

⸻

Forbidden

Inventory slot

Grid cell

Spreadsheet row

⸻

COMPONENT 011

ACHIEVEMENT PLAQUE

Purpose:

Achievement representation.

⸻

Visual Identity

Plaque

Banner

Shrine ornament

Statue

⸻

Interaction

Inspect

Reveal details

⸻

Forbidden

Badge grid

Achievement card

Achievement tile

⸻

COMPONENT 012

STREAK SHRINE

Purpose:

Consistency representation.

⸻

Visual Growth

Additional lanterns

Additional decorations

Additional architecture

⸻

Forbidden

Calendar tracker

Heat map

Productivity chart

⸻

COMPONENT 013

REGION GATE

Purpose:

Region transition.

⸻

Visual Identity

Torii

Temple gate

Mountain pass

⸻

States

Locked

Unlocking

Unlocked

⸻

Forbidden

Chapter card

Region button

Menu entry

⸻

COMPONENT 014

LANTERN

Purpose:

Progress guidance.

⸻

Placement

Trail edge

Camp area

Shrine area

⸻

Behavior

Warm glow

Subtle flicker

Ambient atmosphere

⸻

Forbidden

Random decorative light

Navigation icon

⸻

COMPONENT 015

XP REWARD

Purpose:

Effort feedback.

⸻

Behavior

Appear briefly.

Fade naturally.

⸻

Visual Priority

Low.

⸻

Forbidden

Persistent XP counters

Large reward dashboards

Reward spam

⸻

COMPONENT 016

LEVEL UP MODAL

Purpose:

Major progression moment.

⸻

Sequence

Level Up

Reward

Fox Reaction

Continue

⸻

Visual Priority

Very High

⸻

Forbidden

Generic popup

Corporate modal

Alert dialog

⸻

COMPONENT 017

ACHIEVEMENT REVEAL

Purpose:

Celebrate accomplishment.

⸻

Sequence

Reveal

Glow

Reward

Dismiss

⸻

Forbidden

Toast notification

System notification

Small popup

⸻

COMPONENT 018

EVENT PATH

Purpose:

Temporary content.

⸻

Visual Identity

Branching trail.

⸻

Rule

Always connected to main path.

⸻

Forbidden

Separate event menu

Event dashboard

Event hub page

⸻

COMPONENT 019

PROFILE BANNER

Purpose:

Identity display.

⸻

Contains

Avatar

Name

Title

Region

Level

⸻

Visual Identity

Travel record.

⸻

Forbidden

Social profile

Social feed

Account management page

⸻

COMPONENT 020

BOTTOM NAVIGATION

Purpose:

Primary navigation.

⸻

Tabs

Journey

Camp

Study

Bag

Profile

⸻

Behavior

Always visible.

Always anchored.

Never hidden.

⸻

Forbidden

Side menu

Hamburger menu

Floating navigation

⸻

COMPONENT CREATION RULE

Before creating a new component ask:

Can an existing component solve this problem?

If yes:

Reuse.

If no:

Create a new specification.

⸻

COMPONENT IMMERSION TEST

Every component must answer:

What physical object does this represent?

If no answer exists:

The component must be redesigned.

⸻

FINAL RULE

Components should feel like parts of a living world.

Never parts of an application.

The player interacts with places.

Objects.

Characters.

Artifacts.

Not UI.

⸻

END OF DOCUMENT