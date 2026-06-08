ASSET_PIPELINE.md

NOBORU ASSET CREATION & MANAGEMENT PIPELINE

Version: 1.0

Status: AUTHORITATIVE

This document defines the complete lifecycle of every visual asset within Noboru.

All illustrations, icons, mascots, achievements, regions, backgrounds, UI assets, marketing images, event assets, and future generated content must follow this pipeline.

No asset may enter production without following this process.

This document exists to prevent visual inconsistency, duplicate assets, broken branding, and asset management chaos.

⸻

ASSET PHILOSOPHY

Assets are part of the product.

Assets are not decoration.

Every asset should:

Support learning

Support immersion

Support progression

Support Noboru’s identity

⸻

PRIMARY GOAL

Every visual asset should immediately feel like:

Noboru.

Not:

A generic anime app.

A corporate learning platform.

A random mobile game.

A collection of unrelated images.

⸻

ASSET OWNERSHIP

Primary Owner:

Art Director Agent

Supporting Agents:

Mascot Agent

Avatar Agent

Icon Agent

Achievement Art Agent

Region Art Agent

Enemy Agent

UI Art Agent

Asset Pipeline Agent

⸻

ASSET LIFECYCLE

Concept

↓

Specification

↓

Creation

↓

Review

↓

Approval

↓

Metadata Generation

↓

Registry Entry

↓

Production

↓

Versioning

↓

Retirement

No asset may skip stages.

⸻

ASSET CATEGORIES

Mascots

Avatars

Icons

Achievements

Regions

Backgrounds

Characters

Enemies

Bosses

Items

UI Illustrations

Events

Seasonal Assets

Marketing Assets

Social Media Assets

Loading Screens

⸻

FOLDER STRUCTURE

/assets
/avatars
/mascots
/icons
/achievements
/regions
/backgrounds
/characters
/enemies
/bosses
/items
/events
/seasons
/loading
/marketing
/social
/ui

⸻

FILE NAMING RULES

Never use:

final.png
final2.png
final_real.png
new_final_v7.png

Humans seem magnetically attracted to these names. Resist.

⸻

REQUIRED NAMING FORMAT

category_name_variant_version

Examples:

yama_explorer_v1
achievement_first_step_v1
region_mount_n5_v1
icon_review_center_v1

⸻

VERSIONING RULES

Major Change

v2

Minor Change

Metadata only.

No filename change.

⸻

REQUIRED METADATA

Every asset must have:

metadata.json

⸻

METADATA STRUCTURE

{
  "id": "",
  "name": "",
  "version": "",
  "category": "",
  "owner_agent": "",
  "created_at": "",
  "updated_at": "",
  "status": "",
  "tags": [],
  "usage_locations": []
}

⸻

ASSET REGISTRY

Every asset must be registered.

⸻

REGISTRY FIELDS

Asset ID

Asset Name

Category

Version

Owner Agent

Dependencies

Usage Locations

Status

Created Date

Updated Date

⸻

STATUS VALUES

Draft

Review

Approved

Production

Deprecated

Archived

⸻

MASCOT PIPELINE

Owner:

Mascot Agent

⸻

YAMA CREATION FLOW

Concept

↓

Pose Specification

↓

Expression Definition

↓

Art Creation

↓

Art Director Review

↓

Metadata Creation

↓

Registry Entry

↓

Production

⸻

YAMA ASSET TYPES

Expressions

Poses

Achievements

Loading Screens

Events

Seasonal Variants

Region Variants

⸻

YAMA EXPRESSION LIBRARY

Happy

Thinking

Focused

Reading

Writing

Exploring

Celebrating

Confused

Sleepy

Victorious

Legendary

⸻

YAMA VARIANT LIBRARY

Explorer Yama

Scholar Yama

Winter Yama

Festival Yama

Moon Festival Yama

Legendary Yama

Summit Yama

⸻

AVATAR PIPELINE

Owner:

Avatar Agent

⸻

AVATAR REQUIREMENTS

Consistent Style

Multiple Variants

Light Mode Compatible

Dark Mode Compatible

Accessibility Friendly

⸻

ICON PIPELINE

Owner:

Icon Agent

⸻

ICON RULES

Single Icon Family

Consistent Stroke Width

Readable At Small Sizes

Recognizable Instantly

⸻

ICON CATEGORIES

Navigation

Learning

Review

Achievements

Games

Community

Settings

Admin

System

⸻

ACHIEVEMENT PIPELINE

Owner:

Achievement Art Agent

⸻

ACHIEVEMENT CREATION FLOW

Achievement Design

↓

Rarity Assignment

↓

Badge Creation

↓

Review

↓

Approval

↓

Registry Entry

⸻

ACHIEVEMENT TIERS

Common

Uncommon

Rare

Epic

Legendary

Mythic

⸻

REGION ART PIPELINE

Owner:

Region Art Agent

⸻

REGION ASSETS

Landmarks

Maps

Backgrounds

Loading Screens

Trails

Shrines

Summits

⸻

REGION REQUIREMENTS

Each region requires:

Unique Visual Identity

Unique Landmarks

Unique Atmosphere

Unique Illustrations

⸻

ENEMY PIPELINE

Owner:

Enemy Agent

⸻

ENEMY PHILOSOPHY

Bosses are trials.

Not villains.

Not monsters.

Not enemies to hate.

⸻

ENEMY CATEGORIES

Guardians

Keepers

Sentinels

Wardens

Sages

Masters

Legends

⸻

UI ART PIPELINE

Owner:

UI Art Agent

⸻

UI ART TYPES

Loading States

Empty States

Success States

Error States

Achievement Screens

Region Screens

⸻

LOADING SCREEN SYSTEM

Every loading screen should tell a small story.

Examples:

Yama reading.

Yama climbing.

Yama studying.

Yama resting.

Yama exploring.

⸻

EVENT PIPELINE

Event assets require:

Theme

Visual Direction

Asset Set

Achievement Set

Marketing Set

⸻

SEASONAL ASSETS

Spring

Summer

Autumn

Winter

Cherry Blossom Festival

Moon Festival

New Year

⸻

MARKETING ASSETS

Must follow same style guide.

No separate marketing identity.

⸻

SOCIAL MEDIA ASSETS

Platform Variants:

Instagram

TikTok

YouTube

X

Reddit

Website

⸻

MCP INTEGRATION ARCHITECTURE

Future Support Only.

⸻

MCP PURPOSES

Asset Creation

Metadata Generation

Asset Validation

Asset Organization

Pipeline Automation

⸻

MCP WORKFLOW

Asset Request

↓

Specification

↓

Creation

↓

Validation

↓

Metadata

↓

Registry Update

↓

Production

⸻

QUALITY CONTROL CHECKLIST

Before approval:

Visual Style Match

Correct Naming

Metadata Exists

Registry Entry Exists

Resolution Valid

Accessibility Check

Usage Defined

Version Defined

⸻

RETIREMENT PIPELINE

Asset Deprecated

↓

Replacement Assigned

↓

Registry Updated

↓

Archive Created

↓

Removal From Production

⸻

ACCESSIBILITY REQUIREMENTS

Icons:

Readable

High Contrast

Recognizable

⸻

Illustrations:

Meaningful

Non-essential information not hidden in visuals

⸻

PERFORMANCE REQUIREMENTS

Assets must be optimized.

⸻

IMAGE FORMATS

Preferred:

WebP

⸻

Fallback:

PNG

⸻

Avoid:

Large uncompressed assets

⸻

RESOLUTION STRATEGY

Provide:

1x

2x

3x

where appropriate.

⸻

ASSET SUCCESS CRITERIA

A user should see any asset and immediately think:

“This belongs to Noboru.”

⸻

ASSET FAILURE CRITERIA

If an asset could belong equally to:

A random anime app

A crypto startup

A generic mobile game

A corporate dashboard

Then the asset fails review.

⸻

NOBORU ASSET PRINCIPLE

Every asset should strengthen the mountain.

Every illustration should support the climb.

Every icon should guide the learner.

Every badge should feel earned.

Every visual should reinforce the journey upward.

The mountain must feel like one world.

Not a collection of files.

END OF ASSET_PIPELINE.md