CONTENT_PIPELINE.md

NOBORU CONTENT CREATION & MANAGEMENT PIPELINE

Version: 1.0

Status: AUTHORITATIVE

This document defines how educational content is created, reviewed, stored, versioned, validated, published, and maintained within Noboru.

No educational content may enter production without following this pipeline.

This document exists to prevent content chaos.

Because building the app is hard.

Maintaining 10,000+ vocabulary items, 2,000+ kanji, thousands of grammar examples, dialogues, stories, reviews, quizzes and future expansions is much harder.

⸻

PIPELINE PHILOSOPHY

Content is the product.

The code exists to deliver content.

If content quality is poor:

Noboru fails.

If content quality is excellent:

The platform succeeds.

Content quality takes priority over content quantity.

⸻

CONTENT OWNERSHIP

Educational content belongs to:

Content Agent

Supported by:

Vocabulary Agent

Kanji Agent

Grammar Agent

Story Agent

Conversation Agent

JLPT Agent

Review Agent

⸻

CONTENT TYPES

Vocabulary

Kanji

Grammar

Lessons

Dialogs

Stories

Listening Exercises

Speaking Exercises

Writing Exercises

Challenges

Boss Trials

Achievements

Cultural Content

Events

⸻

CONTENT LIFECYCLE

Draft

↓

Review

↓

Approved

↓

Published

↓

Active

↓

Deprecated

↓

Archived

No content may skip stages.

⸻

CONTENT VERSIONING

Every content item must support:

Version Number

Revision History

Change Log

Rollback

Author Tracking

Approval Tracking

⸻

REQUIRED CONTENT FIELDS

Every content item contains:

id
slug
title
version
status
difficulty
jlpt_level
created_at
updated_at
created_by
approved_by

⸻

JLPT CLASSIFICATION RULE

Every educational item must belong to:

N5

N4

N3

N2

N1

Or:

Foundation

Universal

Mixed

⸻

DIFFICULTY SYSTEM

Every content item receives:

Beginner

Easy

Medium

Hard

Advanced

Expert

⸻

VOCABULARY PIPELINE

⸻

VOCABULARY STRUCTURE

Each word requires:

Kanji

Kana

English Meaning

Part Of Speech

JLPT Level

Frequency Rank

Difficulty

Audio

Examples

Tags

Related Kanji

Related Grammar

Categories

⸻

VOCABULARY CREATION FLOW

Research

↓

Create Entry

↓

Add Examples

↓

Add Audio

↓

Review

↓

Publish

⸻

VOCABULARY QUALITY RULES

Must be common.

Must be useful.

Must be natural.

Must reflect real Japanese.

Avoid obscure vocabulary unless required.

⸻

VOCABULARY EXAMPLE RULES

Every vocabulary item requires:

Minimum:

3 Example Sentences

Target:

5 Example Sentences

⸻

Examples should include:

Formal Usage

Informal Usage

Practical Usage

Contextual Usage

⸻

KANJI PIPELINE

⸻

KANJI STRUCTURE

Every kanji requires:

Character

Meaning

On Reading

Kun Reading

Stroke Count

Stroke Order

Radicals

Frequency

JLPT Level

Examples

Mnemonic

⸻

KANJI CREATION FLOW

Research

↓

Create Entry

↓

Add Readings

↓

Add Examples

↓

Add Mnemonic

↓

Review

↓

Publish

⸻

KANJI QUALITY RULES

Kanji order follows:

Frequency

↓

JLPT

↓

Practical Usefulness

⸻

GRAMMAR PIPELINE

⸻

GRAMMAR STRUCTURE

Each grammar point requires:

Meaning

Structure

Explanation

Examples

Common Mistakes

Related Grammar

Difficulty

JLPT Classification

⸻

GRAMMAR CREATION FLOW

Research

↓

Draft

↓

Examples

↓

Exercises

↓

Review

↓

Publish

⸻

GRAMMAR EXAMPLE RULES

Minimum:

5 Examples

Target:

10 Examples

Must include:

Positive

Negative

Formal

Informal

Contextual

⸻

STORY PIPELINE

⸻

STORY TYPES

Dialogs

Short Stories

Journal Entries

Travel Stories

Cultural Stories

Articles

News

Literature

⸻

STORY STRUCTURE

Title

Level

Word Count

Difficulty

Vocabulary List

Grammar List

Questions

Answers

Audio

⸻

STORY CREATION FLOW

Outline

↓

Writing

↓

Vocabulary Mapping

↓

Grammar Mapping

↓

Questions

↓

Review

↓

Publish

⸻

DIALOGUE PIPELINE

⸻

SCENARIO TYPES

Restaurant

Hotel

Airport

Train Station

Shopping

School

Friends

Work

Travel

Emergency

⸻

DIALOGUE STRUCTURE

Characters

Situation

Dialogue Tree

Choices

Feedback

Outcome

⸻

AUDIO PIPELINE

⸻

AUDIO TYPES

Vocabulary

Sentences

Stories

Dialogues

Listening Exercises

Pronunciation Samples

⸻

AUDIO REQUIREMENTS

Clear

Native

Consistent

Noise Free

Normalized Volume

⸻

LESSON PIPELINE

⸻

LESSON STRUCTURE

Introduction

Teaching

Guided Practice

Recognition

Recall

Production

Review

Completion

⸻

LESSON REQUIREMENTS

Educational Goal

Difficulty

Estimated Time

Prerequisites

Success Criteria

⸻

REVIEW PIPELINE

⸻

REVIEW ITEM TYPES

Vocabulary

Kanji

Grammar

Listening

Reading

⸻

REVIEW GENERATION RULE

Review content is generated from:

Existing educational content

Never duplicate manually.

⸻

CHALLENGE PIPELINE

⸻

CHALLENGE TYPES

Daily

Weekly

Regional

Boss

Seasonal

⸻

CHALLENGE REQUIREMENTS

Educational Purpose

Difficulty

Rewards

Success Criteria

⸻

BOSS TRIAL PIPELINE

Bosses are educational assessments.

Not combat.

⸻

TRIAL CONTENT

Vocabulary

Kanji

Grammar

Listening

Reading

Review

⸻

TRIAL CREATION FLOW

Blueprint

↓

Question Selection

↓

Difficulty Validation

↓

Review

↓

Publish

⸻

CULTURAL CONTENT PIPELINE

⸻

CULTURAL TOPICS

Food

Etiquette

Festivals

History

Modern Japan

Travel

Work Culture

Media

Traditions

⸻

CULTURAL CONTENT RULE

Culture supplements language.

Culture never replaces language.

⸻

CONTENT TAGGING SYSTEM

Every item requires tags.

Examples:

food
travel
school
business
family
nature
daily-life
shopping

⸻

CONTENT RELATIONSHIP SYSTEM

Vocabulary may link to:

Kanji

Grammar

Stories

Dialogues

Reviews

⸻

Kanji may link to:

Vocabulary

Stories

Reviews

⸻

Grammar may link to:

Vocabulary

Dialogues

Stories

Exercises

⸻

CONTENT APPROVAL SYSTEM

Approval Required Before Publish.

Reviewer cannot equal creator.

⸻

CONTENT STATUS VALUES

Draft

In Review

Approved

Published

Deprecated

Archived

⸻

CONTENT METRICS

Track:

Completion

Accuracy

Review Performance

Retention

Difficulty Rating

User Feedback

⸻

CONTENT RETIREMENT RULE

Content may be retired if:

Incorrect

Outdated

Poor Performance

Duplicate

Replaced

⸻

CONTENT LOCALIZATION

Future support:

English

Dutch

French

German

Spanish

⸻

Japanese content remains canonical.

⸻

ADMIN CONTENT TOOLS

Required Editors:

Vocabulary Editor

Kanji Editor

Grammar Editor

Story Editor

Dialogue Editor

Challenge Editor

Achievement Editor

⸻

AUTOMATED VALIDATION RULES

Before publish:

Required Fields

JLPT Classification

Examples Present

Difficulty Present

Tags Present

Relationships Valid

⸻

CONTENT SUCCESS CRITERIA

A learner should be able to:

Understand

Recall

Use

Recognize

Apply

Everything they learn.

⸻

CONTENT FAILURE CRITERIA

Content fails if:

It exists only to increase lesson count.

It exists only to create XP.

It teaches unnatural Japanese.

It teaches isolated facts without context.

⸻

NOBORU CONTENT PRINCIPLE

Every word teaches something useful.

Every kanji teaches something practical.

Every grammar point unlocks expression.

Every story teaches understanding.

Every review strengthens memory.

Content is the mountain.

The app is merely the trail leading through it.

END OF CONTENT_PIPELINE.md