NOBORU WORLD MAP & LEARNING JOURNEY SYSTEM

Purpose

The current learning path implementation must be completely removed and rebuilt from scratch.

The existing implementation treats the learning path as a decorative element placed on top of artwork.

This is fundamentally incorrect.

Noboru is not a lesson list with a background image.

Noboru is a journey through Japan.

The user should feel like they are physically travelling through a world while learning Japanese.

The path is not decoration.

The path is the game.

⸻

Core Philosophy

Most language learning apps work like this:

Lessons
→ Units
→ Chapters
→ Lists

Noboru should work like this:

Journey
→ Path
→ Landmarks
→ Regions
→ Mastery Challenges

The user should never feel like they are progressing through menus.

The user should feel like they are travelling through an adventure.

⸻

Critical Architecture Rule

THE PATH IS THE PRIMARY OBJECT.

THE ARTWORK EXISTS TO SUPPORT THE PATH.

Development order:

1. Create path structure.
2. Place lesson nodes on path.
3. Place checkpoints on path.
4. Place landmarks.
5. Create artwork around the path.

Never reverse this order.

Never create artwork first.

Never try to force a path into existing artwork.

⸻

Current Problems

Problem 1

Lesson nodes are floating beside the trail.

They must sit directly on the trail.

⸻

Problem 2

The trail is decorative.

It has no gameplay purpose.

The trail must become the progression system itself.

⸻

Problem 3

The artwork behaves like wallpaper.

The player sees a background and separate lesson buttons.

This breaks immersion.

⸻

Problem 4

The course starts with too many Kana lessons.

The learner immediately experiences repetition.

The beginning of the journey feels boring.

⸻

Desired Experience

The player should immediately understand:

“I am here.”

“I came from there.”

“I am travelling toward that destination.”

The player should feel:

* Progress
* Discovery
* Exploration
* Adventure
* Mastery

Not menu navigation.

⸻

World Structure

The entire Japanese course is one continuous journey.

Example world:

Foothills

↓

Forest Trail

↓

Shrine Valley

↓

Mountain Pass

↓

Snow Fields

↓

Summit Cliffs

↓

Dragon Peak

↓

Master Summit

Each region represents a stage in the learner’s Japanese mastery.

⸻

Region Structure

Each region contains:

* A unique environment
* Multiple lessons
* Checkpoints
* Landmarks
* A final regional exam

Example:

Start Village

↓

Lesson

↓

Lesson

↓

Lesson

↓

Lesson

↓

Checkpoint Shrine

↓

Lesson

↓

Lesson

↓

Lesson

↓

Lesson

↓

Checkpoint Shrine

↓

Lesson

↓

Lesson

↓

Regional Trial

↓

Next Region

⸻

Lesson Nodes

Lesson nodes must always be physically positioned directly on the path.

Never:

* Floating beside the path
* Floating above the path
* Detached from the path

The path should visibly continue from one lesson node to the next.

The player should feel like they are walking the road.

⸻

Trail Design

The trail must feel real.

Examples:

* Dirt roads
* Stone pathways
* Shrine walkways
* Mountain trails
* Snow paths
* Wooden bridges

Avoid:

* Thin glowing lines
* Decorative curves
* Abstract connectors

The player should instantly recognize:

“This is the road I am travelling.”

⸻

Learning Variety System

One of the biggest problems in language apps is repetition.

The player should never spend long periods doing only one lesson type.

Variety must be introduced immediately.

⸻

Early Game Structure

Current problem:

Kana
Kana
Kana
Kana
Kana
Kana
Kana

This becomes repetitive.

⸻

Desired Structure

Lesson 1

Introduction to first Hiragana

Lesson 2

Hiragana practice

Lesson 3

First vocabulary words

Lesson 4

Listening exercise

Lesson 5

Sentence recognition

Checkpoint

Lesson 6

New Hiragana group

Lesson 7

Vocabulary expansion

Lesson 8

Reading exercise

Lesson 9

Listening challenge

Lesson 10

Basic grammar introduction

Checkpoint

The player should experience multiple aspects of Japanese from the beginning.

⸻

Lesson Categories

The system should rotate between:

* Kana
* Vocabulary
* Listening
* Reading
* Grammar
* Speaking
* Sentence Building
* Review
* Culture
* Kanji

Avoid showing the same category repeatedly.

The player should constantly feel:

“I am learning something new.”

⸻

Checkpoint System

Every 4 to 6 lessons the player reaches a checkpoint.

Checkpoints are mandatory.

Players cannot continue until the checkpoint is completed successfully.

⸻

Purpose Of Checkpoints

Checkpoints verify mastery.

They prevent blind progression.

They create milestones.

They create achievement moments.

They improve retention.

⸻

Checkpoint Presentation

Checkpoints should be represented by special structures on the map.

Examples:

* Torii Gates
* Shrines
* Temples
* Watchtowers
* Training Grounds

These should visually stand out from normal lessons.

⸻

Checkpoint Challenges

Checkpoint content should combine all previous lessons since the last checkpoint.

Possible challenge types:

* Reading tests
* Listening tests
* Vocabulary challenges
* Sentence construction
* Translation exercises
* Mixed exams

The checkpoint should feel like a mini boss battle.

⸻

Checkpoint Rewards

Completing a checkpoint grants:

* XP
* Coins
* Achievement progress
* Progression unlock

The player should feel rewarded.

⸻

Regional Trials

Each major region ends with a larger mastery challenge.

Example:

Foothills Final Trial

Tests:

* Hiragana
* Vocabulary
* Reading
* Listening
* Grammar

Passing unlocks the next region.

⸻

Landmarks

Landmarks are essential.

The player should regularly reach meaningful destinations.

Examples:

* Villages
* Shrines
* Torii Gates
* Waterfalls
* Pagodas
* Temples
* Mountain Bridges
* Watchtowers
* Campsites
* Ancient Ruins

Landmarks create anticipation.

The player sees where they are heading.

⸻

Camera Behaviour

The camera follows the journey.

The player scrolls through the world.

The experience should feel like exploring a map.

Not browsing a menu.

⸻

Visual Hierarchy

Priority order:

1. Current lesson
2. Path
3. Checkpoint
4. Upcoming lessons
5. Landmarks
6. Environment

The player must always understand where to go next.

⸻

Art Direction

The environment exists to support progression.

The artwork is not wallpaper.

The artwork is gameplay.

Every visual element should strengthen the feeling of travelling through Japan.

The player should constantly feel movement and exploration.

⸻

Inspiration

Desired mix:

40% Duolingo progression clarity

30% Journey atmosphere

20% Genshin Impact world exploration

10% Japanese fantasy adventure

⸻

Development Roadmap

PHASE 1

Delete current path implementation.

Delete current lesson placement system.

Delete current world map implementation.

Start from a blank state.

⸻

PHASE 2

Build path architecture.

Create:

* Path system
* Lesson placement
* Checkpoint placement
* Scroll behaviour
* Progress tracking

No artwork yet.

⸻

PHASE 3

Build world layout.

Create:

* Regions
* Landmarks
* Checkpoint locations
* Regional trials

⸻

PHASE 4

Create artwork around existing paths.

The artwork adapts to the path.

The path never adapts to the artwork.

⸻

PHASE 5

Add polish.

* Animations
* Weather
* Particles
* Mascot interactions
* Sound effects
* Rewards
* Celebrations

⸻

Final Goal

When players open Noboru they should not feel like they are opening a language-learning app.

They should feel like they are beginning a journey through Japan.

Every lesson is a step forward.

Every checkpoint is a challenge.

Every region is a milestone.

Every landmark is a destination.

The path is not decoration.

The path is the game.