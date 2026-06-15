# Mascot art pipeline (Phase O)

Separate track from code gap-closure. Uses existing repo tooling; does not block learner routes.

## Current inventory

- **28 Noboru poses** mapped in `lib/assets/art-mappings.ts` (`NOBORU_POSE_ASSETS`, `YAMA_EXPRESSION_ASSETS`).
- **Code wiring:** `yamaService` resolves context → expression → asset ref; `validate-mappings` checks files exist under `public/art/`.

## Generate new poses

1. Produce source art (PNG) per art-direction brief under `VISUAL MD FILES/`.
2. Stage files in the art-direction staging folder used by `npm run assets:publish-source`.
3. Run sticker post-process when backgrounds are baked:

   ```bash
   node scripts/art-direction/character-sticker-process.mjs
   ```

4. Publish into `public/art/characters/noboru/`:

   ```bash
   npm run assets:publish-source
   ```

5. Register each new pose in `NOBORU_POSE_ASSETS` and extend `YAMA_EXPRESSION_ASSETS` / `yama.constants.ts` pools as needed.
6. Verify:

   ```bash
   npm run assets:validate
   ```

## Expansion targets (Doc 05)

| Category     | Spec min | Next step                                      |
|-------------|----------|------------------------------------------------|
| Happy       | 10       | Add variants; map in `YAMA_EXPRESSION_ASSETS` |
| Celebrating | 15       | Ceremony + level-up poses                      |
| Encouraging | 10       | Drill fail + camp idle                         |
| Thinking    | 8        | Grammar / puzzle contexts                      |
| Concerned   | 8        | Error + offline states                         |
| Surprised   | 6        | Unlock + chest reveals                         |
| Determined  | 8        | Trial + checkpoint                             |
| Seasonal    | 12       | Event branch + weather overlays                |
| Evolution   | 5+       | `companionEvolutionSlug` skin variants         |
| Cosmetics   | many     | Profile + camp equip preview                   |

## Code hooks (already in place)

- Journey fox: `JourneyFoxCompanion` — expression from `yamaService`, no trail chat bubble.
- Camp idle: `CampFoxIdle` — rotates mapped campfire poses.
- Ceremonies: `AchievementRevealCeremony`, level-up, chest open.
- Nav mascots: `NAV_TAB_MASCOT_ASSETS` per tab.

New art only requires registry updates + optional `yamaService` pool entries; no route changes.
