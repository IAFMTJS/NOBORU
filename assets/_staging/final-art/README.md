# Final Art Drop Zone

Drop mockup-quality PNGs here, then run:

```bash
npm run assets:ingest-mockup
```

Filenames must match `assets/_staging/ingest-manifest.json` entries (e.g. `ui_camp_base_night_v2.png`).

After ingest, update `lib/assets/registry.ts` to point production paths at the new v2/v3 IDs.
