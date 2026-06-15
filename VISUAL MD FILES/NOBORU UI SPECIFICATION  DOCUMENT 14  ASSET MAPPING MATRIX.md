NOBORU UI SPECIFICATION

DOCUMENT 14

ASSET MAPPING MATRIX

Version 1.0

⸻

PURPOSE

This document defines the exact relationship between:

* assets
* screens
* systems
* states
* layers

This document exists to eliminate interpretation.

If Document 13 defines asset ownership,

Document 14 defines asset deployment.

Cursor must never decide asset placement independently.

All placement decisions originate from this document.

⸻

GLOBAL LAYER MATRIX

Layer 0

Sky

⸻

Layer 1

Region Backgrounds

Mountains

Valleys

Skylines

⸻

Layer 2

Environment Assets

Trees

Rocks

Vegetation

Buildings

⸻

Layer 3

Path Assets

Trails

Stairs

Bridges

Roads

⸻

Layer 4

Interactive Assets

Nodes

Shrines

Torii Gates

Quest Board

Chest

Merchant

⸻

Layer 5

Companion Layer

Fox

⸻

Layer 6

HUD Layer

Level

XP

Profile

Currencies

⸻

Layer 7

Navigation Layer

Bottom Navigation

⸻

Layer 8

Modal Layer

Dialogs

Books

Quest Panels

Reward Screens

⸻

Layer 9

FX Layer

Particles

Glows

Atmospheric Effects

⸻

REGION BACKGROUND MATRIX

Asset Category	Foothills	Forest Trail	Temple Peak	Summit
Beginner Mountains	YES	NO	NO	NO
Forest Mountains	NO	YES	NO	NO
Temple Mountains	NO	NO	YES	NO
Summit Mountains	NO	NO	NO	YES
Low Fog	YES	YES	YES	NO
Heavy Fog	NO	YES	YES	NO
Sacred Fog	NO	NO	YES	YES

⸻

TRAIL ASSET MATRIX

Asset	Journey	Camp	Study	Profile
Main Trail	YES	NO	NO	NO
Side Trail	YES	NO	NO	NO
Event Trail	YES	NO	NO	NO
Trail Lanterns	YES	NO	NO	NO
Trail Shrines	YES	NO	NO	NO

⸻

LESSON NODE MATRIX

State	Visible	Interactive	Glow	FX
Locked	YES	NO	LOW	NONE
Available	YES	YES	MEDIUM	LOW
Current	YES	YES	HIGH	MEDIUM
Completed	YES	OPTIONAL	LOW	LOW

⸻

SHRINE MATRIX

Shrine Type	Journey	Camp	Events
Checkpoint Shrine	YES	NO	NO
Streak Shrine	NO	YES	NO
Event Shrine	NO	NO	YES
Achievement Shrine	NO	YES	NO

⸻

TORII GATE MATRIX

Usage	Allowed
Region Entry	YES
Region Exit	YES
Major Shrine Entrance	YES
Decoration	NO
Background Filler	NO
Random Placement	NO

⸻

FOX MATRIX

Screen	Visible
Journey	YES
Camp	YES
Study	LIMITED
Profile	OPTIONAL
Inventory	OPTIONAL
Settings	NO
Notifications	NO
Shop	OPTIONAL
Memory Book	NO

⸻

FOX STATE MATRIX

Event	Fox State
Correct Answer	Happy
Perfect Answer	Excited
Lesson Complete	Celebrating
Boss Victory	Proud
Region Unlock	Celebrating
Long Inactivity	Sleepy
Multiple Mistakes	Concerned
Quest Complete	Happy

⸻

CAMP MATRIX

Asset	Permanent
Campfire	YES
Tent	YES
Quest Board	YES
Merchant	YES
Reward Chest	YES
Streak Shrine	YES
Fox Area	YES

⸻

CAMPFIRE MATRIX

State	Trigger
Default	New Player
Enhanced	Progression
Advanced	High Progression
Festival	Event Active

Campfire never disappears.

Campfire never relocates.

Campfire always remains center screen.

⸻

QUEST BOARD MATRIX

Content Type	Allowed
Daily Quest	YES
Weekly Quest	YES
Event Quest	YES
Seasonal Quest	YES
Statistics	NO
Inventory	NO
Shop Content	NO

⸻

MERCHANT MATRIX

Category	Allowed
Companion Cosmetics	YES
Camp Decorations	YES
Seasonal Items	YES
Event Items	YES
Learning Boosters	NO
Power Ups	NO
Pay To Win	NO

⸻

CHEST MATRIX

Reward Type	Allowed
XP	YES
Cosmetic	YES
Decoration	YES
Title	YES
Collection Item	YES
Power Boost	NO

⸻

INVENTORY MATRIX

Asset Type	Inventory
Companion Items	YES
Decorations	YES
Cosmetics	YES
Event Items	YES
Collections	YES
Quest Items	YES

⸻

INVENTORY PRESENTATION MATRIX

Layout Type	Allowed
Backpack Layout	YES
Travel Bag Layout	YES
Artifact Layout	YES
Grid Layout	NO
Spreadsheet Layout	NO
MMORPG Layout	NO

⸻

ACHIEVEMENT MATRIX

Presentation	Allowed
Plaques	YES
Banners	YES
Statues	YES
Shrine Decorations	YES
Achievement Grid	NO
Badge Wall	NO
Card Collection	NO

⸻

COLLECTION MATRIX

Style	Allowed
Museum Display	YES
Artifact Display	YES
Curated Collection	YES
Inventory View	NO
Storage View	NO

⸻

MEMORY BOOK MATRIX

Element	Allowed
Journal Pages	YES
Illustrations	YES
Milestones	YES
Discoveries	YES
Timeline Feed	NO
Activity Feed	NO
Database View	NO

⸻

SHOP MATRIX

Style	Allowed
Merchant Stall	YES
Market Setup	YES
Festival Vendor	YES
Ecommerce Store	NO
Product Catalog	NO
Webshop	NO

⸻

STATISTICS MATRIX

Element	Allowed
Lessons Completed	YES
Words Learned	YES
Kanji Learned	YES
Journey Distance	YES
Streak	YES
Graphs	NO
Analytics Charts	NO
KPI Dashboards	NO

⸻

REGION OVERVIEW MATRIX

Feature	Allowed
Region Name	YES
Landmark Preview	YES
Completion Summary	YES
Boss Status	YES
Chapter Select	NO
Primary Navigation	NO
Level Select	NO

⸻

FX MATRIX

FX Type	Allowed
Lantern Glow	YES
Fire Glow	YES
Embers	YES
Leaves	YES
Snow	YES
Rain	YES
Fireflies	YES
Fog	YES
Neon FX	NO
Laser FX	NO
Holograms	NO

⸻

AUDIO MATRIX

Audio	Allowed
Wind	YES
Fire	YES
Birds	YES
Water	YES
Temple Bells	YES
Leaves	YES
Sci-Fi Sounds	NO
Notification Pings	NO
Corporate UI Sounds	NO

⸻

FORBIDDEN UNIVERSAL ASSETS

Never use:

Corporate icons

Material Design assets

Business dashboard assets

Spreadsheet assets

Admin UI assets

Sci-fi assets

Cyberpunk assets

Neon effects

Modern enterprise visuals

⸻

IMPLEMENTATION CHECKLIST

Before placing any asset verify:

✓ Correct Region

✓ Correct Layer

✓ Correct Screen

✓ Correct State

✓ Correct Ownership

✓ Correct Purpose

✓ Allowed By Matrix

✓ Supports Immersion

⸻

FINAL RULE

An asset should never appear because it is available.

An asset should appear because it belongs.

Every placement decision must be intentional.

Every asset must strengthen the illusion that Noboru is a living mountain world.

If an asset weakens that illusion:

Do not use it.

⸻

END OF DOCUMENT