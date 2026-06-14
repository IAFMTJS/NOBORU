# 03 - Learning, Companion, Rewards, And App States

Source: `D:/NOBORU ART/Mockup (3).PNG`

This board defines Noboru's emotional system, lesson interaction UI, rewards, review cards, analytics, shop, avatar customization, social, events, settings, offline, loading, and empty states. It shows how the learning app becomes a living world rather than a set of generic flashcards.

## Screen 11 - Study Companion Interaction

Purpose: Noboru reacts to learning progress.

Shared card structure:

- Narrow vertical illustrated cards.
- Dark frame with thin warm border.
- Small title at top.
- Speech bubble or short message near top.
- Noboru occupies lower half to two-thirds.
- Background: lantern-lit trail/camp environment.
- Warm light from bottom/side.

Companion cards:

- Teaching: message `Let's learn together!`; Noboru sits with friendly attentive posture near lantern.
- Happy: message `Great job! You're improving!`; Noboru smiles, more upright, positive warm glow.
- Proud: message `You did amazing!`; Noboru chest-forward, confident, ears high.
- Worried: message `Don't give up. You've got this.`; Noboru looks concerned, softer light, maybe paws close.
- Excited: message `A new path is open!`; Noboru energetic, bright eyes, more sparks/fireflies.

Art direction:

- Speech bubbles should feel like dark parchment/glass with thin border.
- Expressions must be readable even at small card size.
- Use the same Noboru base design, only change pose/expression/light.

## Screen 12 - Lesson Types Preview

Purpose: show core learning exercise styles.

Shared structure:

- Five narrow lesson cards in a row.
- Dark rounded card frames.
- Small orange/gold category title at top.
- Minimal UI elements layered over subtle background texture.

### Vocabulary

- Title: `Vocabulary`.
- Japanese word display with large characters and romanization.
- Example seen: kanji/kana for `atarashii`, meaning `new`.
- Multiple choice answer buttons: `old`, `new`, `good`, `big`.
- Buttons are small dark rounded rectangles with warm borders.
- Correct target likely highlighted when selected.

### Kanji Writing

- Title: `Kanji Writing`.
- Large central kanji on a dark practice tile.
- Romanization/meaning under it: `gaku - learn`.
- Lower practice area shows brush stroke path in orange/gold.
- Include faint guide lines or stroke animation trail.

### Listening

- Title: `Listening`.
- Prompt: `Listen and choose`.
- Large circular speaker button in warm red/orange.
- Answer options are vertical dark pills with Japanese kana.
- Use sound-wave or speaker icon.

### Sentence Order

- Title: `Sentence Order`.
- Prompt: `Rearrange the sentence`.
- Word tiles at top or middle, empty slots below.
- Tiles are dark, bordered, and compact.
- Need clear drag/drop affordance without looking modern-flat.

### Conversation

- Title: `Conversation`.
- Prompt: `Talk with Noboru`.
- Speech bubble with Japanese phrase.
- Noboru appears in lower area.
- Large microphone button at bottom in warm red/orange circular shape.
- Text: `Tap to speak`.

## Screen 13 - Correct Answer States

Purpose: celebrate successful answers.

Shared structure:

- Tall narrow reward cards.
- Dark background with bright particles.
- Noboru centered, lit from below.
- Header/title at top.
- XP number large and warm.
- Increasing intensity from Good to Mastery.

States:

- Good: `+10 XP`; small sparkles, Noboru pleased.
- Great: `+20 XP`; more sparkles, brighter face.
- Perfect: `+30 XP`; golden burst, Noboru very happy.
- Streak x5: circular ring with `5 COMBO`; Noboru excited, orange halo.
- Mastery: `PERFECT LESSON`; large golden magic circle behind Noboru, dense stars and ring ornaments.

Art direction:

- Correct states use gold/amber first, not green as the main color.
- Sparks should be small star flecks and magical particles.
- Higher states add stronger rings, halos, and background glow.

## Screen 14 - Wrong Answer States

Purpose: gentle correction, no harsh punishment.

Shared structure:

- Dark narrow cards.
- Top title in orange/red.
- Noboru appears lower half with more subdued or worried expression.
- UI should feel supportive, not alarming.

States:

- Incorrect: message `That's not quite right.`; Noboru looks surprised or apologetic.
- Almost: message `So close! Try this.`; central hint card with Japanese term and translation.
- Hint: message `Here's a hint.`; central vocabulary card, darker and calmer.
- Heart Lost: title `Heart Lost`; message `Keep going!`; row of hearts with one lost/empty.
- Out of Hearts: message `No hearts left! Let's review.`; Noboru sad/tired; buttons `Review` and `Return to Camp`.

Art direction:

- Use warm red/orange accents sparingly.
- Avoid aggressive error red flood.
- Make Noboru empathetic.
- Hint card can use parchment/dark inset panel.

## Screen 15 - Rewards And Unlocks

Purpose: every achievement unlocks something meaningful.

Reward cards:

- Lesson Complete: trail/torii background, `+50 XP`.
- Level Up: large circular badge `24`, text `+1 Talent Point`, golden ring.
- New Badge: golden badge icon, label `Kanji Explorer`.
- New Item: lantern item art, label `Lantern of Insight Equipped`.
- New Trail: bamboo forest art, label `Bamboo Forest Unlocked`.

Shared structure:

- Tall cards with dark border.
- Reward title at top in gold.
- Reward object centered or lower-centered.
- Background art matched to reward type.
- Small golden particles around object.

## Screen 16 - Camp / Home Base

Purpose: main safe hub.

Visual details:

- Wide camp scene with mountains, torii gate, tent, campfire, lanterns.
- Noboru sits in front of fire near center.
- Top-left profile block:
  - Avatar.
  - `Kaito`.
  - `Level 24`.
  - XP progress bar.
- Right-side panel `Today's Plan`:
  - Complete 3 lessons, `1/3`.
  - Learn 5 new words, `2/5`.
  - Review 10 cards, `6/10`.
  - `12 day streak` with flame icon.
- Bottom nav: Journey, Camp active, Study, Bag, Profile.
- Active Camp icon is red-orange.

Art direction:

- This is the cozy anchor screen.
- Fire should be the brightest light source.
- Use the torii gate as a background landmark.
- Today's Plan panel is dark transparent with thin border.

## Screen 17 - Review Cards

Purpose: spaced repetition that fits the world.

Visual details:

- Left review card:
  - Header `Review`, progress `6/20`.
  - Large Japanese word `日本`.
  - Readings/romanization: `にほん`, `nihon`.
  - Meaning: `Japan`.
  - Navigation arrows at sides.
  - Bottom answer buttons: `Again`, `Hard`, `Good`, `Easy`.
- Answer buttons use color-coded circles:
  - Again: red `x`.
  - Hard: orange.
  - Good: green check.
  - Easy: green/leaf.
- Right result card:
  - `Good job!`
  - Noboru sitting in moonlit scene.

Art direction:

- Review card can be dark panel, not plain white flashcard.
- The Japanese word should be large, centered, and beautiful.
- Buttons stay icon-led and compact.

## Screen 18 - Progress Analytics

Purpose: track learning metrics while staying in theme.

Visual details:

- Dark dashboard card.
- Tabs: `Overview`, `Lessons`, `Vocabulary`, `Kanji`.
- Level badge: circular `24`.
- Text: `Level 24`, `1,250 / 2,000 XP`.
- Stat boxes:
  - `Lessons Completed 286`.
  - `Words Learned 1,248`.
  - `Kanji Learned 312`.
- Activity bar chart with days M T W T F S S.
- Streak box: `34 days`.

Art direction:

- Keep analytics restrained and readable.
- Use amber bars, dark panels, thin dividers.
- Circular level badge should look like a warm medallion.

## Screen 19 - Streak Milestones

Purpose: long streak rewards.

Cards:

- `7 Day Streak`, `+100 XP`, torii sunrise.
- `30 Day Streak`, `+1 Trail Item`, fox portrait reward.
- `100 Day Streak`, mountain sunset reward.
- `365 Day Streak`, `+1 Exclusive Title`, title pill `Path Master`.

Art direction:

- Each card is vertical, scenic, and aspirational.
- Torii silhouettes and mountain sunsets recur.
- Strong amber/gold glow for streak achievement.

## Screen 20 - Shop / General Store

Purpose: spend resources in mountain shop.

Visual details:

- Top currency pills:
  - coin `12,450`.
  - gem `1,250`.
  - blue currency `24`.
- Tabs: `Items`, `Cosmetics`, `Trails`, `Special`.
- Item grid:
  - `Lantern of Focus`, `1,000`.
  - `Fox Scarf Crimson`, `800`.
  - `Bamboo Backpack`, `1,200`.
  - `Sakura Petals Trail`, `1,500`.
- Items are painterly icons in dark cards with warm borders.
- Background is dark shop/camp texture.

Art direction:

- Store should feel like a mountain general store, not a flat e-commerce grid.
- Item art is large enough to inspect.
- Prices use coin/gem icons.

## Screen 21 - Avatar And Cosmetics

Purpose: customize Noboru.

Visual details:

- Left vertical preview/skin slot with dark fiery outfit background.
- Middle column of equipment slots:
  - scarf slot.
  - body/outfit slot.
  - backpack/gear slot.
  - accessory/mark slot.
- Right large preview card of Noboru standing.
- Bottom color swatches: warm red, orange, green, blue, navy, purple.
- Noboru shown full-body with white fur, red markings, red scarf, backpack.

Art direction:

- Preview should feel collectible and premium.
- Equipment slots are dark square buttons with clear icon art.
- Color swatches are small circles with subtle border.

## Screen 22 - Friends And Leaderboard

Purpose: compare progress socially.

Visual details:

- Two cards side by side: Friends and Leaderboard.
- Friends list:
  - Hana, Ren, Yuki, You.
  - Small avatars and colored online dots.
- Leaderboard:
  - This Week.
  - Ranked rows 1-4.
  - XP totals.
  - Current user highlighted with warm border/background.
- Dark card material, compact rows, readable text.

Art direction:

- Keep social UI grounded in Noboru style using warm borders and tiny avatar portraits.
- Avoid bright gamified clutter; the scene is calm and camp-like.

## Screen 23 - Events

Purpose: limited time challenges and rewards.

Visual details:

- Left event card: sakura forest/trail art.
- Title: `Sakura Festival`.
- Countdown: `Ends in 12d 6h`.
- Description: `Complete special lessons to earn exclusive rewards.`
- Progress bar: red, `12/20`.
- Right reward panel: `Event Rewards`, icons for gems, special currency, lantern.

Art direction:

- Event art should show sakura trees, pink petals, and trail.
- Reward panel can use darker material so bright rewards pop.

## Screen 24 - Settings

Purpose: clean settings in theme.

Visual details:

- Dark settings list card.
- Rows:
  - Sound, `Music, SFX`, slider icon.
  - Notifications, `Daily reminders, streak alerts`, chevron.
  - Language, `English`, chevron.
  - Account, `Linked with Google`, chevron.
  - About Noboru, `Version 1.0.0`, chevron.
- Icons on left are thin but warm.
- Rows separated by subtle lines.

Art direction:

- Settings can be simpler but still uses dark glass, warm icons, and soft border.

## Screen 25 - Offline Mode

Purpose: no connection but lessons/reviews available.

Visual details:

- Dark card with small illustrated mountain cloud icon.
- Text: `You're offline`.
- Subtext: `Lessons and reviews available offline.`
- Button: `Go to Offline Content`.
- Warm orange outline/filled button.

Art direction:

- Mountain/cloud icon should be painterly and softly glowing.
- Do not use a generic wifi-off illustration alone.

## Screen 26 - Loading States

Purpose: loading feels part of world.

Cards:

- `Loading Camp`: torii/camp image, text `Preparing your camp...`, spinner.
- `Loading Lesson`: mountain image, text `Preparing your lesson...`, spinner.
- `Syncing Progress`: torii image, text `Syncing your progress...`, spinner.

Art direction:

- Each loading card has scenic background art.
- Spinner is small circular ring in amber/green, not default system spinner.
- Text sits near bottom and remains readable.

## Screen 27 - Empty / No Content States

Purpose: clear guidance, beautiful emptiness.

Cards:

- `No Lessons Yet`: text `Start your journey by completing your first lesson.`, Noboru sitting, button `Go to First Lesson`.
- `No Review Cards`: text `You're all caught up! Check back later.`, Noboru sitting, button `Back to Camp`.

Art direction:

- Noboru should make empty states feel encouraging.
- Use dark card, warm button, and a small environment background.

## Learning UI Acceptance Criteria

- Every lesson type has a clear action target and visual hierarchy.
- Noboru expressions must match text tone.
- Correct states feel celebratory; wrong states feel supportive.
- Rewards should show actual item/badge/trail art, not just text.
- Dashboards and settings remain readable but use the same dark material language.
