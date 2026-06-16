# Kitsune Companion — Art Library

**Character:** Yama / magical kitsune companion (stylized realism, NOT mascot)  
**Authority:** [08_visual_art_direction_master_spec.md](../../art-direction/08_visual_art_direction_master_spec.md)

All sprites: **transparent RGBA PNG**, `_light_v1` + `_dark_v1` pairs.

## Folder structure

| Subfolder | Contents |
|-----------|----------|
| `base/` | Camp, travel, sleep, profile hero, peek, from-behind |
| `reactions/` | Happy, proud, worried, excited, teaching, oops, mastery, etc. |
| `weather/` | Sunny, rain, night lantern, snow, sakura |
| `loading/` | Waiting, walking loop |
| `gameplay/` | Determined, training, reward presenting |
| `personalization/` | Avatar bust, silhouette, cosmetic scarf/backpack/mask |

## Naming

`kitsune_{pose_or_emotion}_light_v1.png`  
`kitsune_{pose_or_emotion}_dark_v1.png`

## Pipeline

```bash
node scripts/art-direction/process-kitsune-companion.mjs
```

Or manually:

```bash
node scripts/art-direction/strip-icon-backgrounds.mjs "Art Library/characters/kitsune"
node scripts/art-direction/derive-dark-icons.mjs "Art Library/characters/kitsune"
node scripts/art-direction/audit-transparency.mjs "Art Library/characters/kitsune"
```

Manifest: `scripts/art-direction/kitsune-companion-manifest.json`
