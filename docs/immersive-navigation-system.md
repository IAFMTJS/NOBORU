NOBORU IMMERSIVE NAVIGATION SYSTEM

Purpose

The current bottom navigation bar feels generic and disconnected from the Noboru experience.

It could belong to any mobile application.

Noboru is not a productivity app.

Noboru is not a finance app.

Noboru is not a social media app.

Noboru is an adventure through Japan.

The navigation system should reinforce that identity.

⸻

Core Philosophy

The navigation bar should feel alive.

The navigation bar should feel like part of the game world.

The navigation bar should not feel like a standard mobile menu.

Every tab should represent a destination or activity within the Noboru universe.

The Mountain Fox should be integrated into the navigation system.

⸻

Current Problems

Problem 1

Icons feel generic.

The current navigation communicates functionality.

It does not communicate adventure.

⸻

Problem 2

The Mountain Fox is absent.

The mascot is one of Noboru’s strongest assets.

The navigation completely ignores it.

⸻

Problem 3

The navigation feels static.

Nothing moves.

Nothing reacts.

Nothing feels alive.

⸻

Problem 4

The navigation does not reinforce the journey theme.

The user should constantly feel like they are travelling through Japan.

⸻

Design Goal

The navigation should immediately communicate:

Adventure

Progress

Exploration

Training

Discovery

Companionship

The player should feel that they are interacting with the Noboru world itself.

⸻

Navigation Structure

Current:

Home
Learn
Training
Explore
Profile

Replace with:

Camp
Journey
Dojo
World
Profile

⸻

Tab Definitions

Camp

Purpose:

Player headquarters.

Contains:

* Daily goals
* Streak
* Notifications
* Recommended activities
* Mountain Fox updates

Visual Theme:

Campfire

Lantern

Rest area

Warm lighting

⸻

Journey

Purpose:

Main progression system.

Contains:

* World path
* Lessons
* Checkpoints
* Region progression

Visual Theme:

Mountain trail

Adventure path

Climbing

Exploration

⸻

Dojo

Purpose:

Training Grounds.

Contains:

* Kana practice
* Vocabulary practice
* Grammar practice
* Listening practice
* Weakness training

Visual Theme:

Japanese dojo

Training grounds

Shrine training area

⸻

World

Purpose:

Discovery system.

Contains:

* Regions
* Lore
* Collectibles
* Landmarks
* Achievements
* Unlockables

Visual Theme:

Map

Compass

Exploration

Travel

⸻

Profile

Purpose:

Player identity.

Contains:

* Stats
* Achievements
* Progress
* Customization

Visual Theme:

Traveler journal

Explorer profile

⸻

Mountain Fox Integration

The Mountain Fox should become part of the navigation.

This is one of the most important requirements.

The mascot should not simply appear somewhere on the screen.

The mascot should interact with the selected tab.

⸻

Example Behaviors

Camp Active

The fox sits beside a campfire.

Warm glow effects.

Relaxed posture.

⸻

Journey Active

The fox wears a backpack.

Looking toward a mountain.

Ready to travel.

⸻

Dojo Active

The fox is meditating.

Training.

Practicing.

Focused.

⸻

World Active

The fox holds a map.

Or a compass.

Exploring.

⸻

Profile Active

The fox stands proudly.

Achievement pose.

Traveler pose.

⸻

Visual Identity

The navigation must match the existing Noboru art style.

Use:

* Japanese fantasy atmosphere
* Warm lighting
* Soft magical effects
* Shrine-inspired visuals
* Adventure aesthetics

Avoid:

* Flat corporate UI
* Generic mobile design
* Generic icons
* Material Design appearance
* SaaS dashboard aesthetics

⸻

Active State Design

The active tab should feel special.

Possible effects:

* Soft glow
* Ambient particles
* Lantern light
* Campfire light
* Magical aura
* Fox interaction

The selected tab should feel alive.

⸻

Animation Requirements

Subtle animations only.

Examples:

Camp

* Flickering campfire

Journey

* Moving clouds
* Small drifting particles

Dojo

* Floating leaves

World

* Rotating compass

Profile

* Gentle glow

The navigation should feel responsive and premium.

⸻

Mascot Asset Requirements

Create dedicated Mountain Fox assets specifically for navigation.

Examples:

Camp Fox

Journey Fox

Dojo Fox

World Fox

Profile Fox

Each version should maintain:

* Same character
* Same proportions
* Same style
* Same colors

Only pose and expression change.

⸻

Technical Requirements

The navigation must remain:

* Mobile friendly
* Lightweight
* Responsive
* Accessible

Animations should not reduce performance.

⸻

Final Goal

When a user sees the navigation bar, they should instantly recognize Noboru.

The navigation should become part of the game’s identity.

The Mountain Fox should feel like a companion travelling alongside the user.

The navigation should not feel like a menu.

It should feel like another part of the journey.

⸻

Implementation Assets

Shipped via `npm run assets:nav-fox`:

* `icon_nav_{camp,journey,dojo,world,profile}_v1` — themed tab icons
* `yama_nav_{tab}_{dark,light}_v1` — dedicated Mountain Fox nav stickers with tab props
* Registry helpers: `getNavIconPath`, `getNavFoxPath`
* UI: `NavFoxImage`, `NavTabItem`