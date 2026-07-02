NOBORU LEARNING ARCHITECTURE BIBLE

Version: 1.0

⸻

Purpose

The purpose of this document is to define how learning progression works throughout the entire Noboru ecosystem.

This system governs:

* Vocabulary progression
* Grammar progression
* Lesson generation
* Story generation
* Quest generation
* Exam generation
* Daily challenges
* Companion interactions
* Review systems
* Mastery systems
* AI-generated content

Every learning-related system inside Noboru must obey the rules defined in this document.

The primary goal is not rapid memorization.

The primary goal is long-term language acquisition.

Noboru is designed to teach Japanese through gradual exposure, repetition, context, active recall, and meaningful application.

⸻

Core Learning Philosophy

Most language learners fail because they encounter too much information at once.

The human brain does not efficiently learn hundreds of isolated vocabulary items simultaneously.

Learning is strongest when:

1. New information is introduced gradually.
2. Previously learned information repeatedly returns.
3. Knowledge is applied in context.
4. Mistakes are corrected immediately.
5. Mastery is earned through repeated success.
6. Content feels meaningful rather than academic.

Noboru therefore follows six core principles:

* Small Chunks
* Constant Reinforcement
* Contextual Learning
* Progressive Difficulty
* Long-Term Retention
* Meaningful Application

⸻

Learning Flow

Every piece of content follows the same progression.

Discover
↓
Practice
↓
Reinforce
↓
Apply
↓
Test
↓
Master
↓
Review Forever

Words are never considered permanently learned after a single lesson.

Words remain part of the learning ecosystem forever.

⸻

World Tree Structure

The World Tree is the primary progression path.

Structure:

JLPT Level
│
├── Branch
│   │
│   ├── Mini Chapter
│   ├── Mini Chapter
│   ├── Mini Chapter
│   ├── Mini Chapter
│   └── Checkpoint
│
├── Branch
│   │
│   ├── Mini Chapter
│   ├── Mini Chapter
│   ├── Mini Chapter
│   ├── Mini Chapter
│   └── Checkpoint
│
└── Boss Examination

Every Branch focuses on a thematic topic.

Examples:

* Greetings
* Family
* Food
* Travel
* Numbers
* School
* Work
* Daily Activities

⸻

Mini Chapters

Mini Chapters are the smallest learning units.

They are intentionally short.

A player should complete one Mini Chapter within a few minutes.

Mini Chapters introduce new vocabulary while reinforcing older vocabulary.

⸻

Vocabulary Introduction Limits

New vocabulary introduced per Mini Chapter:

N5

6 words

N4

8 words

N3

10 words

N2

12 words

N1

15 words

These limits should rarely be exceeded.

⸻

Active Vocabulary Pool

Every player has an Active Vocabulary Pool.

This pool consists of:

* Current Chapter Vocabulary
* Previous Chapter Vocabulary
* Recently Learned Vocabulary
* Scheduled Review Vocabulary

Example:

Mini Chapter 1

6 active words

Mini Chapter 2

12 active words

Mini Chapter 3

18 active words

Mini Chapter 4

24 active words

The active pool gradually expands.

⸻

Golden Content Rule

No learning activity may require vocabulary that has not yet been introduced.

This rule applies everywhere.

Including:

* Lessons
* Stories
* Quests
* NPC Dialogues
* Exams
* Combat Challenges
* Companion Content
* Daily Activities

Nothing should appear without prior introduction.

Grammar, particles, and conjugation forms are validated via `lib/learning/step-concept.validator.ts` and the algorithmic knowledge block engine.

⸻

Knowledge Blocks (algorithmic)

Lessons decompose ordered `lesson_items` into one-concept-at-a-time blocks at runtime.

Implementation: `lib/learning/knowledge-block/`

Flow per block: teach → layer drills → combine → mastery.

Authoritative spec: [learning-system-redesign.md](./learning-system-redesign.md).

⸻

Vocabulary Lifecycle

Every word follows a complete lifecycle.

Stage 1

Unknown

Player has never encountered the word.

Stage 2

Discovered

Player has seen the word.

Stage 3

Recognized

Player can identify meaning.

Stage 4

Applied

Player can use the word correctly.

Stage 5

Reinforced

Player consistently answers correctly.

Stage 6

Mastered

Player demonstrates long-term retention.

Stage 7

Maintained

Word remains active through periodic review.

Words never disappear entirely.

⸻

Mastery System

Mastery is tracked individually per word.

A word is not mastered simply because it was answered correctly once.

Mastery is earned through repeated success.

Suggested requirements:

* Minimum 15 correct answers
* Multiple exercise types
* Multiple sessions
* Multiple days

Mastery should represent genuine retention.

⸻

Exercise Distribution

Every learning session should approximately contain:

70% Review Content

30% New Content

Example:

20 Questions

14 review questions

6 new questions

This ratio keeps retention high.

⸻

Reinforcement Ecosystem

Words should appear across many systems.

Examples:

Lesson

ありがとう

Matching Game

ありがとう

Story

ありがとう

Quest Dialogue

ありがとう

Exam

ありがとう

Daily Review

ありがとう

The same word appears repeatedly in different contexts.

This creates strong memory pathways.

⸻

Story Integration System

Stories are one of the most important learning tools.

Stories transform isolated vocabulary into meaningful language.

Stories should only use:

* Active Vocabulary
* Previously Mastered Vocabulary
* Current Grammar Structures

If new vocabulary appears:

The word must be:

* Highlighted
* Clickable
* Explained
* Added to future lessons

Stories must never overwhelm the learner.

⸻

Quest Integration System

Quests function as practical language application.

Quest objectives should naturally reinforce learned content.

Examples:

Deliver an item

Read a sign

Answer an NPC

Choose a correct dialogue option

Identify an object

Translate a clue

Quests should feel like gameplay rather than homework.

⸻

Companion Integration System

Companions are learning partners.

They reinforce vocabulary through:

* Dialogue
* Challenges
* Reminders
* Mini-games
* Story Events

Companions should preferentially use vocabulary from the player’s Active Vocabulary Pool.

⸻

Daily Challenge System

Daily Challenges exist for retention.

Daily Challenges should prioritize:

* Recently Learned Words
* Weak Words
* Forgotten Words
* Previously Mastered Words

The goal is memory maintenance.

Not progression.

⸻

Checkpoint System

After every 4-5 Mini Chapters:

Create a Checkpoint.

Checkpoint contents:

Vocabulary Recognition

Listening

Reading

Writing

Context Usage

Mixed Activities

Checkpoints evaluate retention.

Not memorization.

⸻

Branch Boss Examinations

Every Branch concludes with a Boss Examination.

Boss Examinations combine all content from the Branch.

Exam types:

Reading

Listening

Writing

Grammar

Story Comprehension

Applied Vocabulary

Boss Examinations act as major progression gates.

⸻

Review System

Review never ends.

Mastered words continue appearing.

Review frequency decreases over time.

Suggested review intervals:

1 day

3 days

7 days

14 days

30 days

60 days

90 days

180 days

365 days

This creates long-term retention.

⸻

AI Content Generation Rules

All AI-generated content must obey progression restrictions.

The generator must always know:

Player JLPT Level

Unlocked Branches

Unlocked Chapters

Known Vocabulary

Known Grammar

Mastered Vocabulary

Weak Vocabulary

The AI may only generate content from available knowledge.

No exceptions.

⸻

Difficulty Scaling

Difficulty should increase through:

Longer sentences

More grammar combinations

Less support

Faster recognition requirements

Greater context complexity

Difficulty should never increase through random unknown vocabulary.

⸻

Failure Philosophy

Failure is information.

Failure should never feel punishing.

Wrong answers should:

Provide correction

Provide explanation

Provide reinforcement

Encourage retrying

The goal is learning.

Not punishment.

⸻

Retention Philosophy

The ultimate success metric of Noboru is not completion.

The success metric is retention.

A player who remembers a word six months later is more successful than a player who completed fifty lessons in a single day.

Every system inside Noboru should prioritize retention over speed.

⸻

Final Design Principle

Every piece of content inside Noboru should answer one question:

“Does this help the player remember and use Japanese six months from now?”

If the answer is no, the content should be redesigned.

Long-term retention is the highest priority of the entire learning ecosystem.