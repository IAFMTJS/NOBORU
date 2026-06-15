# Authoritative art sources

Drop painterly PNG/JPG sources here using art-direction kebab-case IDs. Layout mirrors production paths:

```text
assets/art/_source/
  backgrounds/camp/bg-camp-home-night.png
  characters/noboru/base/char-noboru-sitting-campfire.png
  characters/noboru/reactions/char-noboru-reaction-happy.png
```

Publish to `assets/art/` and `public/art/`:

```bash
npm run assets:publish-source
```

Or regenerate the full catalog (authored sources override procedural SVG placeholders):

```bash
npm run assets:generate
```

**Reference mockups** live in `assets/marketing/` — use them as visual reference when creating sources. Do not crop mockup panels into production backgrounds.
