# 06 - Asset Inventory And Naming

This file turns the mockup documentation into a production asset checklist. Use it when asking Cursor to create files, organize generated art, or implement image references in the app.

## Recommended Folder Structure

Use a structure like this for generated art assets:

```text
assets/
  art/
    backgrounds/
      camp/
      trail/
      shrine/
      events/
      weather/
      loading/
    characters/
      noboru/
        base/
        reactions/
        outfits/
    ui/
      navbars/
      panels/
      buttons/
      icons/
      nodes/
      rewards/
    props/
      camp/
      shrine/
      inventory/
      particles/
```

If the repo already has another asset convention, keep the existing convention and map these names into it.

## Naming Rules

- Use lowercase kebab-case.
- Prefix by category.
- Include state and theme when useful.
- Include size or ratio only when multiple sizes exist.
- Keep names descriptive enough that a designer can understand them without opening the file.

Examples:

```text
bg-trail-foot-hills-night.png
bg-trail-forest-rainy.png
bg-event-sakura-branching-path.png
bg-shrine-checkpoint-temple-peak.png
char-noboru-sitting-campfire.png
char-noboru-worried-out-of-hearts.png
nav-dark-camp-lantern-active-camp.png
nav-snow-journey-active-journey.png
icon-nav-dojo-torii-active-green.svg
node-lesson-current-amber.png
panel-dark-glass-large.png
button-primary-red-default.png
reward-badge-kanji-explorer.png
prop-inventory-lantern.png
particle-sakura-petals.png
```

## Export Guidance

### Backgrounds

- Export full screens as raster images.
- Keep important UI-safe areas in mind:
  - top status/profile area.
  - center path/lesson node area.
  - bottom navigation area.
- Avoid placing critical details behind expected bottom nav.
- Make backgrounds at least 2x target mobile resolution.
- Suggested ratio: 9:16 for phone screens, wide 16:9 or 3:1 for panoramic region strips.

### Character Art

- Export Noboru poses with transparent background where possible.
- Keep a small soft shadow/glow as a separate optional layer if implementation supports it.
- Do not crop ears, tail, scarf, or backpack unless the pose is intentionally peeking from an edge.
- Maintain consistent red markings across all poses.
- Maintain consistent scarf color unless the asset is explicitly a cosmetic variant.

### UI Materials

- Export reusable panels as 9-slice capable assets if possible.
- Corners and borders should preserve texture.
- Provide dark glass, parchment, wood, rope scroll, ice, and premium gold variants.
- Include both empty panel textures and sample composed cards.

### Icons

- Icons may be vector or raster, but they must remain legible at small nav size.
- Provide inactive, active, locked, and completed variants where relevant.
- If vector, include texture via overlay or implementation effects rather than losing the painterly identity.

### Particles

- Export particles separately when possible:
  - spark.
  - ember.
  - sakura petal.
  - snowflake.
  - rain streak.
  - magic ring.
  - golden star fleck.
- Use particles sparingly in UI implementation so text remains readable.

## Required Background Assets

### Trail Backgrounds

- `bg-trail-foot-hills-night` - dark foothill village, torii, lanterns, first region path.
- `bg-trail-forest-current-night` - forest trail with centered lesson position.
- `bg-trail-temple-peak-locked` - foggy future region, grey locked atmosphere.
- `bg-trail-temple-peak-boss` - red-black boss temple, smoke, embers.
- `bg-trail-long-region` - tall route view with distant red peak.
- `bg-trail-world-overview` - zoomed-out world with four labeled regions.
- `bg-trail-multi-region-panorama` - wide Foot Hills, Forest Trail, Temple Peak, Summit panorama.
- `bg-trail-mini-compact` - compact crop with Noboru and nodes.

### Weather And Time Backgrounds

- `bg-weather-trail-sunny`.
- `bg-weather-trail-rainy`.
- `bg-weather-trail-night`.
- `bg-weather-trail-snowy`.
- `bg-time-trail-morning`.
- `bg-time-trail-afternoon`.
- `bg-time-trail-evening`.
- `bg-time-trail-night`.

### Camp Backgrounds

- `bg-camp-home-night` - tent, campfire, torii, mountains, lanterns.
- `bg-camp-daily-quests` - camp with wooden quest board area.
- `bg-camp-loading` - torii/camp scene for loading.
- `bg-camp-offline` - quiet dark camp/mountain offline card.

### Shrine Backgrounds

- `bg-shrine-achievements`.
- `bg-shrine-checkpoint`.
- `bg-shrine-lesson-complete-path`.
- `bg-shrine-region-transition-torii`.

### Event Backgrounds

- `bg-event-sakura-trail`.
- `bg-event-sakura-map`.
- `bg-event-sakura-rewards`.
- `bg-event-bamboo-forest-unlocked`.

### Utility Backgrounds

- `bg-shop-general-store-dark`.
- `bg-avatar-cosmetics-preview`.
- `bg-memory-book-frame`.
- `bg-settings-dark-panel`.
- `bg-social-leaderboard-dark`.

## Required Noboru Character Assets

### Base Poses

- `char-noboru-sitting-campfire`.
- `char-noboru-standing-traveler`.
- `char-noboru-walking-backpack`.
- `char-noboru-reading-book`.
- `char-noboru-meditating-dojo`.
- `char-noboru-telescope-world`.
- `char-noboru-running-ember`.
- `char-noboru-hero-profile`.
- `char-noboru-winter-staff`.
- `char-noboru-from-behind-region-transition`.
- `char-noboru-peeking-locked-detail`.

### Reactions

- `char-noboru-reaction-teaching`.
- `char-noboru-reaction-happy`.
- `char-noboru-reaction-proud`.
- `char-noboru-reaction-worried`.
- `char-noboru-reaction-excited`.
- `char-noboru-reaction-oops`.
- `char-noboru-reaction-encouraging`.
- `char-noboru-reaction-out-of-hearts`.
- `char-noboru-reaction-mastery`.

### Environmental Variants

- `char-noboru-weather-sunny`.
- `char-noboru-weather-rainy-umbrella`.
- `char-noboru-weather-night-lantern`.
- `char-noboru-weather-snowy-cloak`.

### Cosmetics

- `char-noboru-cosmetic-scarf-crimson`.
- `char-noboru-cosmetic-backpack-bamboo`.
- `char-noboru-cosmetic-fox-mask`.
- `char-noboru-cosmetic-preview-base`.

## Required Navigation Assets

Create each as a complete composed navbar and optionally as separate shell/icon pieces.

- `nav-dark-camp-lantern-active-camp`.
- `nav-light-sakura-parchment-active-camp`.
- `nav-moonlit-journey-active-journey`.
- `nav-bamboo-dojo-active-dojo`.
- `nav-pink-sakura-world-active-world`.
- `nav-cosmic-world-active-world`.
- `nav-rope-scroll-dojo-active-dojo`.
- `nav-snow-journey-active-journey`.
- `nav-ember-camp-active-camp`.
- `nav-premium-gold-profile-active-profile`.
- `nav-app-dark-active-journey`.
- `nav-app-dark-active-camp`.
- `nav-app-dark-active-study`.
- `nav-app-dark-active-bag`.
- `nav-app-dark-active-profile`.

## Required Icon Assets

### Navigation Icons

- `icon-nav-camp-tent`.
- `icon-nav-journey-mountain`.
- `icon-nav-dojo-torii`.
- `icon-nav-world-pagoda`.
- `icon-nav-world-compass`.
- `icon-nav-profile-person`.
- `icon-nav-profile-fox`.
- `icon-nav-study-book`.
- `icon-nav-bag-backpack`.

For each nav icon, create:

- inactive muted version.
- active amber version.
- active blue version where journey/snow is used.
- active green version where dojo/bamboo is used.
- active red version where sakura/camp is used.
- active gold version where premium/profile is used.

### Trail Node Icons

- `icon-node-lesson-camp`.
- `icon-node-vocabulary`.
- `icon-node-kanji`.
- `icon-node-listening`.
- `icon-node-boss-mask`.
- `icon-node-lock`.
- `icon-node-complete-check`.
- `icon-node-event-sakura`.
- `icon-node-region-foot-hills`.
- `icon-node-region-forest`.
- `icon-node-region-temple-peak`.
- `icon-node-region-summit`.

### UI Icons

- `icon-ui-close`.
- `icon-ui-back`.
- `icon-ui-menu-dots`.
- `icon-ui-chevron-right`.
- `icon-ui-settings`.
- `icon-ui-speaker`.
- `icon-ui-microphone`.
- `icon-ui-eye-preview`.
- `icon-ui-flame-streak`.
- `icon-ui-gem`.
- `icon-ui-coin`.
- `icon-ui-xp`.
- `icon-ui-heart-full`.
- `icon-ui-heart-empty`.
- `icon-ui-check`.
- `icon-ui-cross`.
- `icon-ui-notification-bell`.
- `icon-ui-globe-language`.
- `icon-ui-account`.

## Required UI Surfaces

### Panels

- `panel-dark-glass-small`.
- `panel-dark-glass-medium`.
- `panel-dark-glass-large`.
- `panel-dark-glass-bottom-sheet`.
- `panel-parchment-memory-page`.
- `panel-wood-daily-quest-board`.
- `panel-rope-scroll`.
- `panel-premium-gold-frame`.
- `panel-ice-blue-card`.
- `panel-sakura-pink-card`.

### Buttons

- `button-primary-red-default`.
- `button-primary-red-hover`.
- `button-primary-red-pressed`.
- `button-secondary-dark-default`.
- `button-secondary-dark-hover`.
- `button-gold-outline-default`.
- `button-small-icon-dark`.
- `button-review-again`.
- `button-review-hard`.
- `button-review-good`.
- `button-review-easy`.

### Progress Controls

- `progress-amber-thin`.
- `progress-red-event`.
- `progress-green-complete`.
- `progress-xp-level`.
- `progress-streak-milestones`.
- `scroll-indicator-trail-vertical`.

## Required Reward And Inventory Assets

### Rewards

- `reward-xp-badge`.
- `reward-gem-purple`.
- `reward-lantern`.
- `reward-level-medallion-24`.
- `reward-badge-kanji-explorer`.
- `reward-title-path-master`.
- `reward-trail-bamboo-forest`.

### Inventory

- `item-lantern`.
- `item-dango`.
- `item-onigiri`.
- `item-daruma`.
- `item-scroll`.
- `item-omamori`.
- `item-sakura`.
- `item-fan`.
- `item-fox-mask`.
- `item-stone-lantern`.
- `item-scarf-crimson`.
- `item-backpack-bamboo`.
- `item-sakura-petals-trail`.

## State Matrix

Use this matrix to make sure no generated component only has a default state.

| Component | Required states |
| --- | --- |
| Lesson node | incomplete, current, completed, locked, boss, event |
| Nav item | inactive, active, disabled |
| Button | default, hover/focus, pressed, disabled |
| Lesson answer | idle, selected, correct, wrong, hint |
| Progress row | empty, partial, complete, locked |
| Reward card | hidden, revealed, claimed |
| Inventory item | locked, owned, selected, equipped |
| Companion | neutral, happy, proud, worried, excited, sad |
| Loading card | loading, success, failure/sync issue |
| Trail background | normal, fogged locked, completed glow, event overlay |

## Layering Order For Screens

Use this order when composing screens:

1. Base background painting.
2. Atmospheric overlays: fog, rain, snow, petals, embers.
3. Environment lights: lantern glow, campfire glow, node glow.
4. Trail path and nodes.
5. Noboru character.
6. Main UI panels/cards.
7. Text and icons.
8. Foreground particles and reward sparks.
9. Vignette or edge shadow.

## Cursor Acceptance Prompt

After generating assets, ask Cursor to verify:

> Check every generated Noboru art asset against the art-direction markdown. Confirm that filenames follow the inventory, all required visual states exist, Noboru is consistent, active/locked/completed states are visually distinct, and every background includes shrine/trail/lantern/mountain identity where appropriate.

