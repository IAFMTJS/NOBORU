# 05 - Cursor Generation Brief

Use this file as the direct generation and implementation brief for Cursor. It condenses the full art bible into actionable instructions and acceptance checks.

## One-Sentence Product Art Brief

Noboru is a painterly Japanese mountain-learning RPG where a white fox companion guides the user through glowing lesson trails, cozy campfire hubs, shrine milestones, seasonal paths, and tactile dark/parchment UI.

## Universal Prompt Prefix

Use this prefix before generating any Noboru screen, component, or asset:

> Painterly premium mobile RPG UI for Noboru, a Japanese language learning adventure. Dark blue-black mountain atmosphere, warm lantern/campfire glow, Japanese shrine and trail motifs, handcrafted dark glass/parchment/wood UI, white fox companion with red forehead markings, red scarf, backpack, expressive ears, cozy but epic mood, high readability, detailed environmental depth, no flat generic SaaS styling.

## Screen Generation Checklist

Every generated screen should answer:

- What is the environment: camp, trail, shrine, forest, sakura, snow, bamboo, shop, memory book, boss temple?
- Where is Noboru, and what emotion/pose is he showing?
- What is the main light source?
- What is the active user action?
- Which UI material is used: dark glass, parchment, wood, stone, ice, brass/gold?
- Are progress, active, locked, complete, and reward states visually distinct?
- Does the screen include foreground, midground, and background detail?
- Are labels readable over the art?

## Global Component Checklist

### Bottom Navigation

- 5 items.
- Icons above labels.
- Active tab has colored icon, colored label, glowing underline/dot.
- Inactive tabs are muted grey/brown.
- Use consistent icon meanings:
  - Journey: mountain/path.
  - Camp: tent/campfire.
  - Study: book.
  - Bag: backpack.
  - Profile: fox head or person.
  - Dojo: torii when using concept nav.
  - World: pagoda or compass.
- If using concept-style nav, Noboru overlaps left edge.

### Trail Map

- Winding path from bottom to top.
- Uneven glowing stepping stones.
- Current node larger and warmer.
- Locked nodes grey with padlock.
- Completed nodes green check or bright filled glow.
- Future path fogged but visible.
- Lanterns and shrine/temple details along the way.

### Lesson Card

- Dark rounded card.
- Title, lesson number, type/topic.
- XP and duration.
- Strong CTA if actionable.
- Background art visible behind card.

### Reward Card

- Central reward object or icon.
- Gold/amber halo and sparks.
- Text label for exact unlock.
- If item reward, show actual item art.

### Empty/Loading State

- Noboru illustration.
- Scenic background.
- One clear action or status line.
- Small amber spinner or red/orange button.

## Required Asset Families

Create or maintain these asset families if building final art:

1. Noboru base poses:
   - sitting calm.
   - walking/traveling.
   - meditating.
   - reading.
   - cheering.
   - worried.
   - excited.
   - sad/out of hearts.
   - heroic/profile.
   - winter travel.
2. Noboru reaction variants:
   - happy.
   - proud.
   - encouraging.
   - teaching.
   - oops.
   - mastery.
3. Region backgrounds:
   - Foot Hills.
   - Forest Trail.
   - Temple Peak.
   - The Summit.
   - Sakura Festival side path.
   - Bamboo Forest.
   - Boss shrine.
4. UI materials:
   - dark glass/lacquer card.
   - cream parchment.
   - pink sakura parchment.
   - wood plank board.
   - rope scroll border.
   - icy blue stone/parchment.
   - black and gold premium frame.
5. Icons:
   - camp/tent.
   - journey/mountain.
   - dojo/torii.
   - world/pagoda.
   - world/compass.
   - profile/person.
   - fox head.
   - study/book.
   - bag/backpack.
   - lock.
   - speaker.
   - microphone.
   - flame.
   - gem.
   - XP badge.
   - lantern.
   - check mark.
   - close/back/menu.
6. Inventory items:
   - lantern.
   - dango.
   - onigiri.
   - daruma.
   - scroll.
   - omamori.
   - sakura.
   - fan.
   - fox mask.
   - stone lantern.

## Exact Screen Inventory To Generate

### From Mockup 1

- 10 bottom nav concepts:
  - dark camp lantern.
  - light sakura parchment.
  - moonlit journey.
  - bamboo dojo.
  - pink sakura world.
  - cosmic explorer.
  - rope scroll dojo.
  - snow journey.
  - ember camp.
  - premium gold profile.

### From Mockup 2

- short trail starting region.
- long trail full region.
- focused current position trail.
- future locked path.
- branching sakura event path.
- boss challenge node.
- progress overlay.
- zoomed-out world view.
- zoomed-in node view.
- before/after path animation.
- region transition.
- locked node detail.
- weather variants: sunny, rainy, night, snowy.
- time variants: morning, afternoon, evening, night.
- current lesson pin.
- next lesson preview.
- multi-region journey.
- mini compact trail.

### From Mockup 3

- companion interaction cards: teaching, happy, proud, worried, excited.
- lesson type cards: vocabulary, kanji writing, listening, sentence order, conversation.
- correct answer states: good, great, perfect, streak x5, mastery.
- wrong answer states: incorrect, almost, hint, heart lost, out of hearts.
- reward cards: lesson complete, level up, new badge, new item, new trail.
- camp/home base.
- review cards.
- progress analytics.
- streak milestones.
- shop/general store.
- avatar/cosmetics.
- friends/leaderboard.
- event detail.
- settings.
- offline mode.
- loading states.
- empty/no content states.

### From Mockup 4

- achievement shrine.
- daily quest camp.
- region overview bottom sheet.
- lesson complete path screen.
- checkpoint shrine.
- fox companion reaction library.
- environmental reaction cards.
- inventory/backpack.
- long trail example.
- memory book.
- seasonal event map.

## Prompt Fragments By Theme

### Dark Trail

> vertical mobile screen, moonlit Japanese mountain trail, winding glowing stone path, warm lanterns, dark forest, distant torii gate, small shrine houses, blue-black sky, amber lesson nodes, current node with golden halo, dark glass UI overlays.

### Camp Home

> cozy night mountain camp, canvas tent, campfire center, red torii gate in background, Noboru fox sitting by fire, lanterns, stars, warm orange light, dark transparent quest panel, bottom navigation.

### Shrine Reward

> ceremonial red torii shrine, thick sacred rope, hanging paper shide, stone steps, lanterns, white fox companion, golden achievement medallion, reward panel with XP, purple gem, lantern item, magical amber halo.

### Sakura Event

> dark mountain trail transformed by sakura festival, pink cherry blossoms and drifting petals, warm path lights, event side route, red progress card, seasonal rewards, soft pink accents against blue-black forest.

### Snow Region

> icy blue mountain trail, snowbanks, falling snow, frosted stone lantern, Noboru in blue winter cloak holding staff, glowing blue journey icon, cold moonlight with tiny warm lantern accents.

### Boss Challenge

> ominous red-black temple at night, smoky volcanic mountain, ember particles, large locked boss seal with oni mask icon, dark warning card, red underlighting, high contrast.

### Memory Book

> tactile parchment memory book UI, aged pages, binder rings, side tabs, small painted thumbnails, warm ink text, dark frame, Japanese language learning milestones.

## Common Text Labels

Use these exact labels where relevant:

- Player: `Kaito`
- Levels: `Lv. 12`, `Level 24`
- Regions: `Foot Hills`, `Foothills`, `Forest Trail`, `Temple Peak`, `The Summit`
- Lessons: `Lesson 6 Greetings`, `Lesson 9 Listening`, `Lesson 10 Word Order`, `Lesson 12 Vocabulary`, `Lesson 14 Kanji`, `Lesson 16 Advanced Grammar`
- Event: `Sakura Festival`, `Ends in 12d 6h`
- Rewards: `+50 XP`, `+100 XP`, `+1 Talent Point`, `Kanji Explorer`, `Lantern of Insight Equipped`, `Bamboo Forest Unlocked`
- Buttons: `Start Lesson`, `Preview`, `View Event`, `Continue Climbing`, `Back to Journey`, `Go to First Lesson`, `Back to Camp`

## Japanese Learning Text Examples

Use when exact learning content is needed:

- `ありがとう` - `arigatou - thank you`
- `日本` - `nihon` - `Japan`
- `学生` - `gakusei` - `student`
- `新しい` - `atarashii` - `new`

## Quality Bar

Cursor output is acceptable only if:

- It is immediately recognizable as Noboru, not a generic fantasy app.
- Noboru's fox design is consistent across screens.
- The chosen active state is visually obvious before reading text.
- The screen remains readable at mobile size.
- Background art is integrated with UI, not pasted behind it.
- Every card has material texture, border, lighting, and hierarchy.
- Locked and empty states still feel beautiful.
- The art contains enough small props and particles to feel handcrafted.

