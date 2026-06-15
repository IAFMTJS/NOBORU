NOBORU UI SPECIFICATION

DOCUMENT 08

INTERACTIONS, ANIMATIONS, FX, STATES & EDGE CASES

Version 1.0

⸻

PURPOSE

This document defines every interaction rule, animation rule, visual effect rule, state behavior and edge case handling within Noboru.

This document exists to ensure consistency.

Every animation should feel like it belongs to the same world.

Every interaction should feel predictable.

Every state should feel intentional.

If another document defines what something is, this document defines how it behaves.

⸻

CORE PHILOSOPHY

Movement creates life.

Feedback creates satisfaction.

Consistency creates trust.

Animations should support the world.

Animations should never exist for their own sake.

The player should feel movement.

Never notice animation systems.

⸻

MOTION PRINCIPLES

All movement should feel:

natural

organic

gentle

deliberate

⸻

AVOID

Mechanical movement

Robotic movement

Instant appearance

Harsh transitions

Excessive bouncing

Overly energetic motion

⸻

MOTION REFERENCES

Wind

Fire

Flowing water

Falling leaves

Floating lanterns

Breathing

⸻

GLOBAL TIMINGS

Micro Feedback

150ms

⸻

Button Press

120ms

⸻

State Change

250ms

⸻

Screen Transition

400ms

⸻

Major Reward

800ms

⸻

Level Up

1200ms

⸻

Region Unlock

1500ms

⸻

BUTTON STATES

Every button has:

Idle

Hover

Pressed

Disabled

Loading

Locked

⸻

IDLE STATE

Default appearance.

No movement.

Subtle presence.

⸻

PRESSED STATE

Scale:

96%

Duration:

120ms

Return:

Smooth

Immediate feedback required.

⸻

DISABLED STATE

Lower opacity.

No glow.

No animation.

Clearly unavailable.

⸻

LOCKED STATE

Visible.

Unavailable.

Mystery retained.

Player understands future unlock exists.

⸻

TOUCH FEEDBACK

Every touch produces feedback.

Examples:

Glow

Scale

Ripple

Pulse

Sound

⸻

SCREEN TRANSITIONS

Screen changes should feel connected.

Never abrupt.

Never hard cuts.

⸻

ALLOWED TRANSITIONS

Fade

Slide

Depth Shift

Focus Transition

⸻

FORBIDDEN TRANSITIONS

Flash

Spin

Zoom Explosion

Excessive Motion

Random Effects

⸻

JOURNEY SCROLL BEHAVIOR

Scrolling should feel smooth.

Momentum should feel natural.

No aggressive snapping.

No forced camera movement.

⸻

NODE INTERACTION

Node Selected

Glow Increases

Pulse Appears

Node Expands Slightly

Interaction Panel Opens

⸻

NODE COMPLETION

Completed node receives:

Light Pulse

Path Activation

Lantern Update

Reward Trigger

⸻

PATH ACTIVATION

When progress advances:

Path lights forward.

Light travels toward next objective.

Light should feel magical.

Not technological.

⸻

SHRINE ACTIVATION

Shrines have unique activation.

Sequence:

Glow

Lantern Ignition

Ambient Light Increase

Reward Presentation

Celebration

⸻

LEVEL UP ANIMATION

XP Threshold Reached

Pause

Light Expansion

Level Display

Fox Reaction

Reward Reveal

Return To Activity

⸻

ACHIEVEMENT ANIMATION

Achievement Icon Appears

Title Revealed

Light Pulse

Reward Display

Dismiss

⸻

REGION UNLOCK ANIMATION

One of the most important animations.

Sequence:

Fog Clears

Gate Activates

New Region Revealed

Ambient Light Expands

Fox Reacts

Camera Shifts

Player Continues

⸻

BOSS VICTORY ANIMATION

Boss Defeated

Victory Recognition

Reward Sequence

Progress Update

Journey Update

Region Update If Applicable

⸻

PARTICLE SYSTEM

Particles enhance atmosphere.

Particles never dominate the screen.

⸻

PARTICLE TYPES

Embers

Leaves

Fireflies

Snow

Rain

Fog

Light Dust

Lantern Sparks

⸻

PARTICLE DENSITY

Low

Subtle

Consistent

Never overwhelming

⸻

AMBIENT EFFECTS

Effects should exist continuously.

Examples:

Lantern Flicker

Fire Glow

Wind Movement

Fog Drift

Tree Sway

⸻

FOX ANIMATIONS

Fox animations should blend naturally.

Transitions must feel seamless.

No instant state changes.

⸻

LESSON FEEDBACK FX

Correct

Gold Pulse

⸻

Great

Gold Pulse + Particles

⸻

Perfect

Gold Pulse + Enhanced Celebration

⸻

ERROR FEEDBACK FX

Brief

Clear

Educational

Never aggressive

Never punishing

⸻

MODAL BEHAVIOR

Modals appear above content.

Background softly darkens.

World remains visible.

The player should never feel disconnected.

⸻

MODAL ANIMATION

Fade In

Scale Up Slightly

Focus Attention

⸻

TOOLTIP RULES

Tooltips should be rare.

Use only when necessary.

Avoid clutter.

⸻

LOADING PHILOSOPHY

Loading screens remain inside the world.

Never display generic loading indicators.

Never display empty white screens.

⸻

LOADING STATES

Journey Loading

Camp Loading

Lesson Loading

Profile Loading

Event Loading

⸻

JOURNEY LOADING

Display world artwork.

Ambient animation continues.

Player remains immersed.

⸻

CAMP LOADING

Display camp environment.

Fire animation remains active.

⸻

LESSON LOADING

Display thematic transition.

Maintain atmosphere.

⸻

NETWORK LOSS

Player should never feel punished.

Connection issues should be explained calmly.

⸻

OFFLINE TRANSITION

Connection Lost

Offline Status Appears

Available Features Continue

⸻

EMPTY STATES

Every empty state must feel intentional.

⸻

NO ACHIEVEMENTS

Player has not discovered achievements yet.

⸻

NO FRIENDS

Journey awaits companions.

⸻

NO EVENTS

No current festivals available.

⸻

NO COLLECTIONS

Future discoveries await.

⸻

ERROR STATES

Errors should be:

clear

helpful

brief

non-technical

⸻

ACCESSIBILITY

All interactions must support:

touch

screen readers

reduced motion

high contrast

large text

⸻

REDUCED MOTION MODE

All major animations simplified.

Information preserved.

Atmosphere maintained.

⸻

TABLET RULES

The world expands.

The UI adapts.

Elements reposition.

Never simply scale up.

⸻

LARGE SCREEN RULES

Additional world content visible.

Additional atmosphere visible.

UI remains readable.

⸻

SMALL SCREEN RULES

Critical content prioritized.

No overlapping elements.

No hidden interactions.

⸻

ULTRA LONG TRAILS

Trail may extend indefinitely.

Performance must remain stable.

Virtualization required.

Only visible sections should render.

⸻

HIGH LEVEL PLAYERS

1000+ lessons

5000+ lessons

10000+ lessons

All progression systems must remain stable.

No visual overflow.

No UI breakage.

⸻

EXTREME INVENTORIES

Large collections must remain navigable.

No performance degradation.

⸻

EXTREME ACHIEVEMENT COUNTS

Achievement screens must scale gracefully.

No infinite loading.

No visual clutter.

⸻

EVENT OVERLOAD

Multiple events may coexist.

Priority system required.

World clarity preserved.

⸻

MEMORY MANAGEMENT

Particles optimized.

Animations optimized.

Large trails optimized.

⸻

PERFORMANCE TARGETS

Target:

60 FPS

Minimum acceptable:

30 FPS

Animation consistency prioritized.

⸻

IMMERSION CHECK

Before implementing any feature ask:

Does this feel like part of the mountain journey?

If the answer is no:

Redesign it.

⸻

FINAL RULE

The player should never feel like they are using an application.

The player should feel like they are traveling through a living world while learning Japanese.

Every animation.

Every effect.

Every transition.

Every interaction.

Must reinforce that illusion.

⸻

END OF DOCUMENT