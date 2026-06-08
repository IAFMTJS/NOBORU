ADMIN_PANEL_SPEC.md

NOBORU ADMIN PANEL SPECIFICATION

Version: 1.0

Status: AUTHORITATIVE

This document defines the complete administration system for Noboru.

The Admin Panel exists to manage the entire platform without requiring developer intervention for daily operations.

Every educational item, user, asset, achievement, event, and system configuration must eventually be manageable through the Admin Panel.

⸻

ADMIN PHILOSOPHY

The Admin Panel is a tool.

Not a product.

Not a dashboard showcase.

Not a developer playground.

Its purpose is operational efficiency.

⸻

PRIMARY OBJECTIVES

Allow administrators to:

Manage Content

Manage Users

Manage Assets

Manage Progression

Manage Events

Manage Achievements

Monitor Analytics

Moderate Community Features

Configure Systems

⸻

ACCESS MODEL

Admin access is role-based.

No universal admin account.

⸻

ROLES

Viewer

Moderator

Content Manager

Asset Manager

Curriculum Manager

Analytics Manager

Administrator

Super Administrator

⸻

ROLE PERMISSIONS

Viewer

Can view data.

Cannot modify data.

⸻

Moderator

Can manage users.

Can manage reports.

Cannot modify curriculum.

⸻

Content Manager

Can manage:

Vocabulary

Kanji

Grammar

Lessons

Stories

Dialogues

⸻

Asset Manager

Can manage:

Assets

Art

Icons

Achievements

Yama Variants

⸻

Curriculum Manager

Can publish curriculum changes.

Can modify educational structures.

⸻

Analytics Manager

Can access reports.

Can create dashboards.

⸻

Administrator

Can manage all operational systems.

⸻

Super Administrator

Full access.

Restricted to project owners.

⸻

ADMIN MODULES

Dashboard

Users

Curriculum

Content

Assets

Achievements

Quests

Events

Regions

Games

Analytics

Settings

Audit Logs

⸻

DASHBOARD MODULE

Purpose:

Provide operational overview.

⸻

DASHBOARD WIDGETS

Active Users

Daily Learners

Lesson Completions

Review Completions

Retention

N5 Progression

System Health

Recent Activity

⸻

USER MANAGEMENT MODULE

Purpose:

Manage user accounts.

⸻

USER FEATURES

Search Users

View Profiles

View Progress

View Achievements

View Activity

Suspend Accounts

Restore Accounts

⸻

USER DETAIL VIEW

Display:

Profile

Progress

Mastery

Achievements

Recent Activity

Review Statistics

Current Region

Current Level

⸻

CURRICULUM MODULE

Purpose:

Manage educational structure.

⸻

CURRICULUM FEATURES

Manage Regions

Manage Units

Manage Lessons

Manage Dependencies

Manage Progression

⸻

REGION MANAGEMENT

Create Region

Edit Region

Archive Region

Preview Region

⸻

UNIT MANAGEMENT

Create Unit

Edit Unit

Duplicate Unit

Reorder Units

Archive Units

⸻

CONTENT MANAGEMENT MODULE

Purpose:

Educational content administration.

⸻

CONTENT TYPES

Vocabulary

Kanji

Grammar

Stories

Dialogues

Reading Exercises

Listening Exercises

Challenges

⸻

VOCABULARY MANAGER

Features:

Create Word

Edit Word

Bulk Import

Bulk Export

Tag Management

Audio Management

Relationship Management

Version History

⸻

KANJI MANAGER

Features:

Create Kanji

Edit Kanji

Readings

Examples

Radicals

Stroke Data

Version History

⸻

GRAMMAR MANAGER

Features:

Create Grammar

Edit Grammar

Examples

Relationships

Exercises

Version History

⸻

STORY MANAGER

Features:

Create Story

Edit Story

Sections

Questions

Audio

Difficulty Settings

⸻

DIALOGUE MANAGER

Features:

Create Scenarios

Dialogue Trees

Choices

Branching Logic

Outcome Validation

⸻

CONTENT WORKFLOW

Draft

Review

Approved

Published

Archived

⸻

CONTENT VALIDATION

Required:

Difficulty

JLPT Level

Tags

Examples

Metadata

Relationships

⸻

ASSET MANAGEMENT MODULE

Purpose:

Manage all visual assets.

⸻

ASSET FEATURES

Upload Assets

Replace Assets

Archive Assets

Search Assets

View Metadata

View Usage Locations

Version Control

⸻

ASSET CATEGORIES

Mascots

Avatars

Icons

Achievements

Regions

Backgrounds

Events

Marketing

UI

⸻

YAMA MANAGEMENT

Purpose:

Manage mascot assets.

⸻

FEATURES

Expressions

Variants

Seasonal Versions

Loading Screens

Milestone Assets

⸻

ACHIEVEMENT MODULE

Purpose:

Manage achievements.

⸻

FEATURES

Create Achievement

Edit Achievement

Assign Rewards

Assign Rarity

Preview Unlocks

⸻

QUEST MODULE

Purpose:

Manage quests.

⸻

QUEST TYPES

Daily

Weekly

Regional

Seasonal

Event

⸻

EVENT MODULE

Purpose:

Manage events.

⸻

EVENT FEATURES

Create Event

Edit Event

Assign Rewards

Assign Assets

Configure Duration

Activate Event

Archive Event

⸻

REGION MANAGEMENT MODULE

Purpose:

Manage progression regions.

⸻

FEATURES

Region Configuration

Unlock Requirements

Rewards

Landmarks

Visual Assets

Boss Trials

⸻

GAME MANAGEMENT MODULE

Purpose:

Manage educational games.

⸻

FEATURES

Enable Game

Disable Game

Difficulty Configuration

Reward Configuration

Content Assignment

Analytics

⸻

ANALYTICS MODULE

Purpose:

Educational insight.

⸻

CORE METRICS

Active Users

Retention

Completion Rates

Review Rates

Mastery Growth

Region Completion

N5 Completion

Lesson Performance

⸻

CONTENT ANALYTICS

Vocabulary Performance

Kanji Performance

Grammar Performance

Story Performance

Dialogue Performance

⸻

GAME ANALYTICS

Game Usage

Retention Impact

Educational Impact

Completion Rate

Difficulty Analysis

⸻

CURRICULUM ANALYTICS

Weak Areas

Strong Areas

Drop-Off Points

High Success Lessons

Low Success Lessons

⸻

AUDIT LOG MODULE

Purpose:

Accountability.

⸻

TRACKED EVENTS

Content Changes

User Actions

Role Changes

Asset Changes

Achievement Changes

Event Changes

System Configuration Changes

⸻

SEARCH SYSTEM

Global Search Required.

Must search:

Users

Vocabulary

Kanji

Grammar

Stories

Achievements

Assets

Events

⸻

FILTER SYSTEM

Support:

Status

Region

JLPT Level

Difficulty

Tags

Date Range

Owner

⸻

BULK OPERATIONS

Required:

Bulk Publish

Bulk Archive

Bulk Edit

Bulk Import

Bulk Export

Bulk Tagging

⸻

IMPORT SYSTEM

Supported Formats:

CSV

JSON

Excel

⸻

EXPORT SYSTEM

Supported Formats:

CSV

JSON

Excel

⸻

VERSION HISTORY

All content requires:

Version Tracking

Rollback Support

Change Notes

Editor Tracking

⸻

SECURITY REQUIREMENTS

Role-Based Access

Audit Logging

Permission Validation

Session Monitoring

Secure Actions

⸻

DESTRUCTIVE ACTIONS

Require:

Confirmation

Reason

Audit Log Entry

⸻

ACCESSIBILITY REQUIREMENTS

Keyboard Navigation

Screen Reader Support

Reduced Motion

High Contrast Support

⸻

PERFORMANCE TARGETS

Admin Search < 500ms

Content Load < 2s

Dashboard Load < 2s

Bulk Operations Stable

⸻

MVP ADMIN PANEL

Required For Launch:

Dashboard

Users

Vocabulary

Kanji

Grammar

Lessons

Achievements

Analytics

Settings

Audit Logs

⸻

POST-MVP ADMIN FEATURES

Community Moderation

Event Management

League Management

Advanced Analytics

Asset Automation

MCP Workflows

⸻

SUCCESS CRITERIA

A non-developer should be able to:

Create Lessons

Manage Vocabulary

Manage Kanji

Manage Grammar

Manage Achievements

Manage Users

Review Analytics

Without touching code.

⸻

FAILURE CRITERIA

If routine operations require:

Database Editing

Code Changes

Manual SQL

Developer Intervention

Then the Admin Panel has failed.

⸻

NOBORU ADMIN PRINCIPLE

The Admin Panel should feel like a mountain operations center.

Clear.

Powerful.

Reliable.

Efficient.

The people maintaining the mountain should spend their time improving the climb, not fighting the tools.

END OF ADMIN_PANEL_SPEC.md