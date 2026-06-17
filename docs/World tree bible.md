NOBORU - World Tree Art Bible & Asset Specification

Overview

The World Tree is the visual backbone of NOBORU.

Players progress from JLPT N5 at the roots of the tree to JLPT N1 at the celestial crown.

The World Tree is not a background image.

It is a modular world structure that must support infinite vertical expansion, biome transitions, future content additions and procedural assembly.

Every asset must be designed with modularity and seamless integration as the highest priority.

⸻

Core Concept

The player climbs a mythical Japanese World Tree.

The tree represents mastery of the Japanese language.

Each JLPT level represents a major region of the tree.

Progression

N5 - The Roots

Theme:

* Foundations
* Discovery
* Growth

Visuals:

* Massive roots
* Moss
* Ancient soil
* Glowing fungi
* Underground springs

⸻

N4 - The Foothills

Theme:

* Exploration
* First mastery

Visuals:

* Lower trunk
* Forest atmosphere
* Torii remnants
* Waterfalls
* Mist

⸻

N3 - The Ancient Trunk

Theme:

* Understanding

Visuals:

* Larger trunk sections
* Ancient carvings
* Shrine remnants
* Spiritual activity

⸻

N2 - The Canopy

Theme:

* Wisdom

Visuals:

* Clouds
* Branch networks
* Floating islands
* Sakura forests

⸻

N1 - Celestial Crown

Theme:

* Enlightenment

Visuals:

* Golden leaves
* Celestial architecture
* Divine energy
* Stars and cosmic light

⸻

Visual Direction

Art Style

Required:

* Semi-realistic fantasy
* Japanese mythology inspired
* Painterly rendering
* High detail
* Rich atmosphere
* Strong depth perception
* Soft magical lighting

Avoid:

* Cartoon style
* Anime style
* Chibi style
* Pixel art
* Realistic photography
* Generic mobile game art

Target references:

* Ori and the Blind Forest
* Spirit of the North
* Ghost of Tsushima environments
* Princess Mononoke forests
* Fantasy JRPG world maps

⸻

World Tree Design Rules

The tree must feel:

* Ancient
* Sacred
* Alive
* Endless
* Mysterious
* Impossible in scale

The tree should feel larger than mountains.

The environment should feel built around the tree rather than the tree existing within the environment.

⸻

Critical Asset Rules

Transparent Background

ALL assets must have:

* Fully transparent background
* No baked sky
* No baked terrain
* No baked UI elements

Required format:

PNG

Transparency must be preserved.

⸻

Seamless Construction

Every asset must connect seamlessly.

No visible seams.

No hard cutoffs.

No edge artifacts.

Top and bottom connections must align.

Left and right decorative elements may extend beyond asset bounds.

⸻

Lighting Consistency

All assets must share:

* Light direction
* Shadow direction
* Atmospheric color palette
* Scale language

No asset should appear to originate from a different world.

⸻

Asset Categories

1. Root Segments

Purpose:

N5 region construction.

Required:

* Root_A
* Root_B
* Root_C
* Root_D
* Root_E

Features:

* Moss
* Ancient bark
* Fungi
* Soil interaction

Transparent background required.

⸻

2. Trunk Segments

Purpose:

Main vertical tree body.

Required:

* Trunk_A
* Trunk_B
* Trunk_C
* Trunk_D
* Trunk_E
* Trunk_F
* Trunk_G
* Trunk_H

Variation examples:

* Normal bark
* Golden veins
* Scarred bark
* Hollow sections
* Spiritual growth
* Ancient carvings

Transparent background required.

⸻

3. Transition Segments

Purpose:

Biome transitions.

Required:

* Root_To_Trunk
* Trunk_To_Ancient
* Ancient_To_Canopy
* Canopy_To_Celestial

Transparent background required.

⸻

4. Canopy Segments

Purpose:

Upper tree construction.

Required:

* Canopy_A
* Canopy_B
* Canopy_C
* Canopy_D
* Canopy_E

Features:

* Branch systems
* Leaves
* Sunlight shafts

Transparent background required.

⸻

5. Celestial Segments

Purpose:

N1 construction.

Required:

* Celestial_A
* Celestial_B
* Celestial_C
* Celestial_D

Features:

* Golden bark
* Divine light
* Cosmic energy

Transparent background required.

⸻

Decorative Overlay Assets

These are independent assets.

Never baked into tree segments.

Nature

* Moss_01
* Moss_02
* Moss_03
* Vine_01
* Vine_02
* Vine_03
* Mushroom_01
* Mushroom_02
* Mushroom_03

⸻

Japanese Mythology

* Torii_Remnant_01
* Torii_Remnant_02
* Stone_Lantern_01
* Stone_Lantern_02
* Fox_Shrine_01
* Fox_Shrine_02
* Sacred_Rope_01

⸻

Magical

* Spirit_Crystal_01
* Spirit_Crystal_02
* Rune_Cluster_01
* Rune_Cluster_02
* Spirit_Flame_01
* Spirit_Flame_02

⸻

Background Depth Assets

Used to create scale.

Required:

* Distant_Mountains
* Distant_Tree_01
* Distant_Tree_02
* Distant_Forest
* Floating_Island_01
* Floating_Island_02
* Waterfall_01
* Waterfall_02

Transparent background required.

⸻

Foreground Assets

Used for parallax.

Required:

* Foreground_Leaves_01
* Foreground_Leaves_02
* Foreground_Branches_01
* Foreground_Branches_02
* Foreground_Mist_01
* Foreground_Mist_02

Transparent background required.

⸻

Effects Assets

Required:

* Mist_Light
* Mist_Heavy
* Floating_Leaves
* Fireflies
* Spirit_Particles
* Sakura_Petals
* Divine_Sparks

Transparent background required.

⸻

Technical Requirements

Preferred Resolution:

2048x2048

Minimum Resolution:

1024x1024

File Format:

PNG

Background:

Transparent

Color Space:

sRGB

Compression:

Lossless

⸻

Modular Assembly Requirements

Every segment must:

* Connect vertically
* Allow random combinations
* Preserve tree silhouette
* Maintain believable scale

Any segment must be able to connect to any compatible segment without visible breaks.

The final result should support thousands of unique tree layouts while appearing to be a single living World Tree.

⸻

Design Goal

The player should never feel like they are climbing repeating assets.

The player should feel like they are climbing a sacred, living, ancient World Tree that stretches from the roots of knowledge to the heavens themselves.



# Scale Rules

Human = 1 unit

Torii Gate = 3-5 units

Fox Shrine = 4-8 units

Large Branch = 20-50 units

Tree Trunk Width = 100-500 units

Background Mountains = always smaller than trunk width

The World Tree must visually dominate every scene.



# Asset Naming Convention

WT_ROOT_A_01

WT_ROOT_A_02

WT_TRUNK_A_01

WT_TRUNK_B_01

WT_CANOPY_A_01

WT_CELESTIAL_A_01

WT_OVERLAY_MOSS_01

WT_OVERLAY_VINE_01

WT_EFFECT_MIST_01



# Connector System

WT_CONNECT_ROOT_TRUNK

WT_CONNECT_TRUNK_ANCIENT

WT_CONNECT_ANCIENT_CANOPY

WT_CONNECT_CANOPY_CELESTIAL



# Asset Socket System

Socket Types

TOP_CONNECT

BOTTOM_CONNECT

LEFT_BRANCH

RIGHT_BRANCH

OVERLAY_ATTACH

BACKGROUND_ATTACH

FOREGROUND_ATTACH


#Color Bible

Roots
	Deep Green
	Dark Brown
	Soft Amber


Foothills
	Forest Green
	Slate Blue
	Gold


Ancient trunk
	Dark Teal
	Ancient Gold
	Stone Gray


Canopy
	Sakura Pink
	Cloud White
	Sky Blue

Celestial
	Gold
	Ivory
	Starlight Blue


#Camera Rules

Camera Angle

Always portrait composition.

Tree centered.

Player path visible.

No horizontal landscape compositions.

No top-down view.

No side-scroller framing.



#Negative Rules

Never include:

Buildings
Characters
UI
Text
Logos
Weapons
Anime Faces
Skyboxes
Ground Planes
Opaque Backgrounds
Modern Objects


#Layer System

LAYER 1
Background

LAYER 2
Distant World Tree

LAYER 3
Main Tree

LAYER 4
Decorations

LAYER 5
Effects

LAYER 6
Foreground


#Biome Evolution Rules

As the player climbs:

Mist decreases
Light increases
Gold increases
Vegetation becomes rarer
Spiritual elements become more common



#Future Expansion Framework

All assets must support:

Future Biomes
Future Regions
Seasonal Variants
Event Decorations
Procedural Placement




#Asset Matrix

Roots
├─ Root Segments
├─ Root Decorations
├─ Root Effects

Trunk
├─ Trunk Segments
├─ Trunk Decorations
├─ Trunk Effects

Canopy
├─ Canopy Segments
├─ Canopy Decorations
├─ Canopy Effects

Celestial
├─ Celestial Segments
├─ Celestial Decorations
├─ Celestial Effects



#Generation Rules

Every asset must:

- Fit portrait orientation
- Be centered
- Maintain trunk continuity
- Avoid abrupt silhouette changes
- Preserve lighting direction
- Support vertical stacking


#Variation Rules

Each new asset must introduce at least one:

- Shape variation
- Lighting variation
- Texture variation
- Structural variation



#Rarity Framework
Common
Uncommon
Rare
Epic
Legendary
Mythic


#Seasonal Overlay System
Spring
Summer
Autumn
Winter
Festival
Corrupted

#Performance Rules
Maximum PNG size

2048x2048

Maximum file size

5 MB

Transparency required

No unnecessary empty space


#AI Prompt Template
Create a modular World Tree asset.

Region:
[N5/N4/N3/N2/N1]

Asset Type:
[Trunk/Root/Canopy/etc]

Requirements:

- Transparent background
- Portrait composition
- Seamless vertical connection
- Japanese mythology inspired
- Semi realistic fantasy
- Ancient sacred world tree
- No characters
- No text
- No UI
- No buildings
- High detail







# Asset Production Status

## Roots
- [ ] Root_A
- [ ] Root_B
- [ ] Root_C
- [ ] Root_D
- [ ] Root_E

## Trunk
- [ ] Trunk_A
- [ ] Trunk_B
- [ ] Trunk_C
- [ ] Trunk_D
- [ ] Trunk_E
- [ ] Trunk_F
- [ ] Trunk_G
- [ ] Trunk_H

## Canopy
...






# Silhouette Rules

The trunk must always remain readable.

The center trunk shape must never disappear.

Decorations may extend outward.

The player's eye must always identify the World Tree first.

No asset may visually overpower the trunk.
