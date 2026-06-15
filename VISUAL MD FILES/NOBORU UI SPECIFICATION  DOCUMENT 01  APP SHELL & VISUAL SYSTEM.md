NOBORU UI SPECIFICATION

DOCUMENT 01

APP SHELL & VISUAL SYSTEM

Version: 1.0

⸻

PURPOSE

This document defines the global visual system used throughout the entire Noboru application.

This document does NOT define individual screens.

This document defines:

* visual language
* layout rules
* layer hierarchy
* navigation structure
* asset usage rules
* spacing system
* typography
* atmosphere
* animation principles

All screens in the application must follow these rules without exception.

If a screen-specific document conflicts with this document, this document takes priority.

⸻

CORE PHILOSOPHY

Noboru is not a productivity app.

Noboru is not a dashboard.

Noboru is not a flashcard application.

Noboru is a journey through a living world.

The user should always feel like they are physically travelling through a mountain landscape.

The UI exists on top of a world.

The world never exists behind the UI.

The world is the primary experience.

The UI is secondary.

Every screen must preserve immersion.

At no point should the user feel like they have left the world.

⸻

VISUAL PILLARS

The entire visual identity is built on five pillars.

Pillar 1: Journey

Everything represents progression.

Nothing should feel static.

Every screen should communicate movement toward mastery.

⸻

Pillar 2: Warmth

The world must feel welcoming.

Warm lantern light is used throughout the experience.

Orange and gold lighting are preferred over cold lighting.

⸻

Pillar 3: Mystery

The future path is never fully revealed.

The user should always feel there is more ahead.

Distant regions should feel discoverable.

⸻

Pillar 4: Achievement

Progress must feel meaningful.

Unlocks should feel earned.

Every milestone should create emotional reward.

⸻

Pillar 5: Living World

The world must feel alive.

Even when nothing happens.

Small animations should always be present.

Examples:

* lantern flickering
* fire movement
* floating particles
* ambient fog
* subtle light pulsing

⸻

APP STRUCTURE

The application consists of five primary destinations.

1. Journey
2. Camp
3. Study
4. Bag
5. Profile

These destinations are permanently accessible through bottom navigation.

Navigation never disappears.

Navigation never changes position.

Navigation always remains anchored to the bottom of the screen.

⸻

SCREEN HIERARCHY

Every screen follows the same layer hierarchy.

Layer 0

Sky Background

⸻

Layer 1

World Background

Examples:

* mountains
* forests
* valleys
* temples

⸻

Layer 2

Environment Assets

Examples:

* lanterns
* trees
* rocks
* buildings

⸻

Layer 3

Path Assets

Examples:

* trails
* roads
* stairs
* bridges

⸻

Layer 4

Interactive Assets

Examples:

* lesson nodes
* checkpoint shrines
* event nodes
* rewards

⸻

Layer 5

Companion Layer

Fox companion

Always rendered above world assets.

⸻

Layer 6

HUD Layer

Examples:

* XP
* profile image
* progress indicators

⸻

Layer 7

Navigation Layer

Bottom navigation

Always visible

Always above gameplay content

⸻

Layer 8

Modal Layer

Examples:

* dialogs
* popups
* region selectors

⸻

Layer 9

FX Layer

Examples:

* particles
* glow effects
* reward animations

⸻

ASSET USAGE RULES

The project already contains approved artwork.

Existing artwork must always be used.

Never generate replacement artwork.

Never generate alternative artwork.

Never procedurally create new world landmarks.

Never procedurally create new temples.

Never procedurally create new mountain structures.

Use only approved visual assets.

⸻

WORLD STYLE

The world must always feel handcrafted.

Never use:

* generic gradients
* flat vector backgrounds
* material design illustrations
* futuristic elements
* sci-fi architecture
* cyberpunk visuals
* neon effects

⸻

TIME OF DAY

Default world state:

Early evening

Approximate time:

18:00 - 20:00

Lighting characteristics:

* warm
* golden
* cinematic

Never use:

* bright daylight
* noon sunlight
* white lighting

⸻

LIGHT SOURCES

Every light source must have a visible origin.

Allowed light sources:

* lanterns
* shrine lights
* campfires
* lesson nodes
* temple windows

Not allowed:

* random floating glow
* unexplained bloom
* arbitrary light circles

Every glow must originate from a visible object.

⸻

COLOR SYSTEM

Background Primary

#05070A

Background Secondary

#0B1118

Gold Accent

#F5C97A

Orange Accent

#E47B3A

Red Accent

#B84432

Text Primary

#F7F1E6

Text Secondary

#B6AA97

Success

#7BBF72

Error

#D55C5C

Locked

#6A6A6A

⸻

TYPOGRAPHY

Primary Font

Cinzel

Used for:

* titles
* region names
* shrine headings

⸻

Secondary Font

Inter

Used for:

* body text
* buttons
* descriptions

⸻

Title Size

32px

Weight 700

⸻

Section Header

24px

Weight 600

⸻

Body Text

16px

Weight 400

⸻

Small Labels

12px

Weight 500

⸻

SPACING SYSTEM

Base Unit

8px

Allowed spacing values:

8
16
24
32
40
48
64

Avoid arbitrary spacing.

All spacing must derive from the base unit.

⸻

CARD SYSTEM

All cards use:

Background:

95% dark glass

Border Radius:

20px

Border:

1px subtle gold tint

Shadow:

Large soft shadow

⸻

Cards never use:

Bright white backgrounds

Sharp corners

Hard shadows

Neon borders

⸻

ICONOGRAPHY

Icons must feel handcrafted.

Preferred themes:

* shrine
* mountain
* lantern
* trail
* temple

Avoid:

* corporate icons
* office icons
* generic productivity symbols

⸻

BOTTOM NAVIGATION

Fixed Position

Bottom of screen

Never scrolls

Never hides

Height:

88px plus safe area

⸻

Tabs

Journey

Camp

Study

Bag

Profile

⸻

Selected State

Gold accent

Subtle glow

Active icon animation

⸻

Inactive State

Muted text

Muted icon

No glow

⸻

ANIMATION PHILOSOPHY

Animations should feel magical.

Not mechanical.

Not technical.

Not corporate.

Movement should resemble:

* wind
* fire
* flowing water

Avoid robotic movement.

⸻

MOTION TIMING

Micro Interaction

150ms

⸻

Small Transition

250ms

⸻

Standard Transition

400ms

⸻

Major Reward Animation

800ms

⸻

Region Unlock Animation

1500ms

⸻

PARALLAX RULES

Background moves slower than foreground.

Sky moves least.

Path moves most.

Parallax must remain subtle.

Maximum offset:

15%

Never create dramatic parallax.

⸻

IMMERSION RULES

The user should never feel they have left the world.

Loading screens remain in-world.

Menus remain in-world.

Progress remains in-world.

Rewards remain in-world.

Every interaction must feel connected to the mountain journey.

⸻

FORBIDDEN DESIGN PATTERNS

Do not use:

* dashboards
* tables
* spreadsheet layouts
* card grids for lessons
* level lists
* dropdown-heavy interfaces
* corporate admin UI

Noboru is a world first.

UI second.

⸻

END OF DOCUMENT