# Noboru Backgrounds — Art Library

Portrait mobile backgrounds (9:16) for UI layers. **Not transparent** — full bleed atmospheric art.

## Structure

```
backgrounds/
  core/      — default app atmosphere
  trail/     — journey / progression
  camp/      — camp hub
  shrine/    — achievements, checkpoints
  study/     — dojo / learning
```

## Naming

| Pattern | Example |
|---------|---------|
| Base | `bg_trail_light_v1.png`, `bg_trail_dark_v1.png` |
| Flavor variant | `bg_trail_bamboo_light_v1.png`, `bg_trail_sakura_dark_v1.png` |

**Flavors (subtle only):** `bamboo`, `sakura`, `snow`, `lantern` — edge accents, never dominant.

## Theme palettes

**Light:** parchment `#F4EFE3`, `#E9E1D0`, Forest Green `#5E7357`, soft sunlight  
**Dark:** `#0D1320`, `#131D2D`, Lantern Gold `#D6A85F` glow, moonlit mist  

## Layout rules

- Portrait 9:16 mobile
- **Subtle** — background only, not illustration hero
- Calmer center and lower third for cards + bottom nav
- Stylized realism — AAA fantasy Japan, NOT cartoon/SaaS

Manifest: `scripts/art-direction/background-manifest.json`
