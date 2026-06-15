# Assets

| Location | Purpose |
|----------|---------|
| `assets/marketing/mockup_*.png` | Design references only — never served in-app |
| `assets/art/_source/` | **Authoritative painterly PNG sources** (mockup-referenced) |
| `assets/art/` | Published PNG/WebP per [art-direction/06](../art-direction/06_asset_inventory_and_naming.md) |
| `public/art/` | Served at `/art/*` |

Publish hand-authored sources (overrides procedural placeholders):

```bash
npm run assets:publish-source
```

Full catalog regenerate (SVG placeholders where no `_source` exists):

```bash
npm run assets:generate
```

See [`art-direction/`](../art-direction/README.md) for the visual spec.
