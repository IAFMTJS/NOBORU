NOBORU UI SPECIFICATION

DOCUMENT 02

JOURNEY WORLD SYSTEM

Version: 1.0

⸻

PURPOSE

This document defines the Journey screen.

The Journey screen is the primary screen of the application.

It is the first screen users see.

It is the most frequently visited screen.

It is the visual identity of Noboru.

Every design decision must prioritize the Journey experience.

⸻

CORE PHILOSOPHY

The Journey is not a menu.

The Journey is not a level select screen.

The Journey is not a progress tracker.

The Journey is a living world.

The player is physically traveling through a mountain landscape.

Lessons are represented as locations along a trail.

Progress is represented as movement through the world.

The player should always feel like they are climbing toward a distant goal.

⸻

SCREEN PURPOSE

The Journey screen serves four purposes.

1. Show current lesson position.
2. Show completed progress.
3. Show future progression.
4. Create motivation to continue.

The Journey screen should never feel informational.

It should feel aspirational.

The user should always want to continue moving forward.

⸻

WORLD STRUCTURE

The entire world is one continuous vertical climb.

The world consists of multiple regions.

Regions are connected by paths.

Paths are connected by lesson nodes.

Nodes are connected by progression.

The world should feel physically connected.

Never create isolated screens for regions.

Never separate regions into different pages.

The world is one world.

⸻

REGION ORDER

Region 01

Foot Hills

Beginner Region

Warm

Safe

Welcoming

⸻

Region 02

Forest Trail

Denser vegetation

Slightly darker

More mysterious

⸻

Region 03

Temple Peak

More elevation

Temple architecture

Long stairways

Sacred atmosphere

⸻

Region 04

The Summit

Highest region

Most prestigious

Most visually dramatic

Final destination

⸻

TRAIL PHILOSOPHY

The trail is the spine of the entire experience.

Every lesson exists on the trail.

Every achievement contributes to progress along the trail.

The trail should feel ancient.

Handcrafted.

Natural.

Never perfectly straight.

Never geometric.

Never artificial.

⸻

TRAIL DESIGN RULES

The trail must:

curve

bend

climb

descend slightly

wind through scenery

The trail must never:

be a straight vertical line

look like a timeline

look like a progress bar

look like a list

look like a flowchart

⸻

LONG TRAIL BEHAVIOR

Extremely Important.

The trail is allowed to extend far beyond the visible screen.

The user scrolls through the trail.

The trail is never compressed.

The trail is never scaled down to fit.

The trail is never transformed into a miniature overview.

The world must feel large.

The user explores it through scrolling.

⸻

CURRENT POSITION RULE

The player’s current lesson is always visible.

When entering the Journey screen:

camera centers near the current lesson.

Never open at the bottom.

Never open at the beginning.

Never open at the region entrance.

Always focus on current progression.

⸻

CAMERA RULES

The camera behaves like a viewport into a larger world.

The camera does not move automatically.

The user controls exploration through scrolling.

The camera should feel stable.

No excessive movement.

No dramatic panning.

No cinematic camera effects during normal use.

⸻

LESSON NODES

Lesson nodes are the primary interactive elements.

Each lesson node represents one lesson.

Each node exists physically on the trail.

Each node must appear embedded into the world.

Nodes should never appear as floating UI buttons.

Nodes should feel like part of the environment.

⸻

NODE SPACING

Minimum distance:

120px

Preferred distance:

180px

Maximum distance:

300px

Spacing may vary.

Perfectly equal spacing should be avoided.

Natural variation is preferred.

⸻

NODE STATES

Each lesson node exists in one of four states.

Locked

Available

Current

Completed

⸻

LOCKED NODE STATE

Dark.

Desaturated.

Minimal glow.

Partially hidden.

Future content should feel distant.

The player should understand it exists.

The player should not feel invited to interact.

⸻

AVAILABLE NODE STATE

Visible.

Warm.

Subtle glow.

Clearly interactive.

The player should feel encouraged to continue.

⸻

CURRENT NODE STATE

Highest visual priority.

Visible from first screen load.

Warm gold glow.

Pulsing light.

Companion attention directed toward this node.

This is the most important node on screen.

⸻

COMPLETED NODE STATE

Completed nodes remain visible.

They should not disappear.

They should provide visible evidence of progress.

Completed nodes emit soft residual light.

The path behind them remains illuminated.

⸻

PATH ILLUMINATION

Progress lights the trail.

Every completed lesson illuminates the section behind it.

The more lessons completed:

the longer the illuminated trail becomes.

This creates visible evidence of growth.

⸻

LESSON COMPLETION ANIMATION

When a lesson is completed:

1. Node activates.
2. Node emits pulse.
3. Gold light expands.
4. Path segment illuminates.
5. Nearby lanterns ignite.
6. XP reward appears.
7. Camera remains stable.

The player should feel progress.

Not spectacle.

⸻

SHRINES

Shrines act as checkpoints.

Shrines are major milestones.

Shrines should feel sacred.

Rare.

Important.

The player should look forward to reaching them.

⸻

SHRINE PLACEMENT

A shrine appears after a significant progression segment.

Shrines must not appear frequently.

Shrines must feel earned.

They should visually dominate nearby lesson nodes.

⸻

SHRINE REWARD EXPERIENCE

Upon reaching a shrine:

checkpoint celebration appears

rewards appear

new region progress may unlock

special visual effects activate

The experience should feel memorable.

⸻

REGION GATES

Region gates separate major regions.

Region gates are represented using existing torii and temple assets.

Never generate substitute architecture.

Never replace approved artwork.

⸻

LOCKED REGIONS

Locked regions remain visible.

The player should always see future goals.

Locked regions should appear:

distant

foggy

partially obscured

less illuminated

Never completely hide future regions.

Mystery is motivating.

⸻

FOG SYSTEM

Fog serves two purposes.

1. Atmosphere.
2. Progression concealment.

Fog density increases with distance from current progress.

Future areas become less readable.

This creates curiosity.

⸻

LANTERN SYSTEM

Lanterns guide the player.

Lanterns reinforce progression.

Lanterns should appear regularly along the trail.

Average spacing:

every 3-5 lesson nodes.

Lanterns must never overlap lesson nodes.

Lanterns must never block interactions.

⸻

ENVIRONMENTAL STORYTELLING

The world should communicate progress.

Examples:

More temples at higher elevations.

More dramatic architecture in advanced regions.

More visual prestige closer to the summit.

The environment itself should reward advancement.

⸻

EVENT BRANCHES

Events exist as side paths.

Events never replace the main path.

Events branch away temporarily.

After completion:

the player returns to the main trail.

The main journey always remains visually dominant.

⸻

BOSS NODES

Boss nodes are major progression challenges.

Boss nodes block advancement.

Boss nodes should feel intimidating.

Boss nodes should visually differ from lesson nodes.

Boss nodes should be immediately recognizable.

⸻

REGION OVERVIEW

The world may be viewed through a region overview sheet.

This is not the primary experience.

The primary experience is always the trail itself.

The overview exists only for navigation.

⸻

WORLD SCALE

The world should always feel larger than the screen.

The player should never feel they have seen everything.

There should always be more mountain above.

There should always be more journey ahead.

The climb should feel endless until mastery is achieved.

⸻

FORBIDDEN DESIGNS

Never use:

lesson grids

lesson lists

horizontal progress bars

chapter cards

floating lesson menus

dashboard layouts

course overview pages

generic gamification interfaces

The Journey must always remain a physical world.

The player is climbing a mountain.

Not completing a checklist.

⸻

END OF DOCUMENT