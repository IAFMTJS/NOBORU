# Assets

| Location | Purpose |
|----------|---------|
| `assets/marketing/mockup_*.png` | Design references only — never served in-app |
| `assets/art/` | Source art per [art-direction/06_asset_inventory_and_naming.md](../art-direction/06_asset_inventory_and_naming.md) |
| `public/art/` | Published WebP served at `/art/*` |

Regenerate production art:

```bash
npm run assets:generate
```

See [`art-direction/`](../art-direction/README.md) for the full visual spec.
