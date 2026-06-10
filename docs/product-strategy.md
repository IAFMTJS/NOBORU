# Noboru Product Strategy

Version: 1.0

Status: AUTHORITATIVE

This document defines target audiences, market positioning, MVP scope, and competitive differentiation for Noboru.

**Related documents:** [vision.md](./vision.md), [prd.md](./prd.md), [mvp-roadmap.md](./mvp-roadmap.md), [personas.md](./personas.md)

---

## Strategic Objective

Guide learners from absolute beginner to JLPT N1 through structured progression, spaced repetition, mastery tracking, and adventure-oriented gamification — without sacrificing educational integrity for engagement metrics.

---

## Target Audiences

From [MASTER_PROMPT.md](./MASTER_PROMPT.md) and [prd.md](./prd.md):

| Audience | Primary Goal | Noboru Value |
|----------|--------------|--------------|
| Complete beginners | Learn from zero | Structured Foothills path, hiragana/katakana, gentle onboarding |
| Anime learners | Consume media without subtitles | Vocabulary, reading, listening, cultural context |
| Travelers | Communicate in Japan | Practical vocabulary, conversation, situational grammar |
| Cultural learners | Understand Japan deeply | Cultural context woven into lessons and regions |
| JLPT students | Pass N5 through N1 | JLPT-aligned curriculum, mastery tracking, boss trials |

All audiences share one platform. Personalization happens through onboarding goals, pacing, and recommended focus — not separate products.

---

## Positioning Statement

**For** motivated Japanese learners who want real mastery,

**Noboru** is a premium mobile-first learning platform

**that** turns language study into a mountain ascent — combining JLPT-structured curriculum, spaced repetition, and adventure gamification.

**Unlike** streak-driven apps that optimize for daily habits over fluency,

**Noboru** prioritizes educational outcomes, offline capability, and a calm premium experience that users can climb for years.

---

## MVP vs Post-MVP

### MVP Definition

From [prd.md](./prd.md):

The MVP is **not** a Duolingo clone.

The MVP **is** a complete learning ecosystem capable of teaching Japanese through **JLPT N5** with strong foundations for future expansion.

#### MVP Modules (In Scope)

| Domain | Capabilities |
|--------|--------------|
| Authentication | Email login, registration, password reset, session persistence |
| Onboarding | Goal, level, daily goal, theme, Yama introduction |
| Home | Region, trail, continue learning, daily goal, elevation, quests |
| Learn | Regions, units, lessons (vocabulary, kanji, grammar) |
| Review | SRS hub, due reviews, mastery stats, weak areas |
| Progress | Lesson/unit/region tracking, mastery states |
| Gamification | Elevation (EP), daily quests, MVP achievements |
| Profile & Settings | Avatar, stats, theme, audio, notifications, account |
| Admin | Content management for vocabulary, kanji, grammar, lessons, users |
| Platform | Offline support, dark/light mode, PWA, lesson audio |
| Learning UX | Visual trail path, immersive interactive lessons (typed recall, drills beyond MCQ) |

#### MVP Success Metrics

Users can:

- Learn hiragana and katakana
- Complete N5 curriculum (Foothills → Forest Trail → Mount N5)
- Review effectively via SRS
- Track progress and understand progression
- Maintain motivation through elevation and achievements
- Experience the Noboru identity (climb metaphor, Yama, premium UX)

### Post-MVP (Explicitly Deferred)

From [prd.md](./prd.md) and [mvp-roadmap.md](./mvp-roadmap.md):

| Module | Rationale for Deferral |
|--------|------------------------|
| Community (friends, social) | Requires stable learning core first |
| Leagues & competitive leaderboards | Priority 6 — after gamification foundations |
| Advanced games (Tokyo Runner, Fishing, Tower Defense) | MVP ships 5 learning games only |
| Seasonal events | Requires content and event infrastructure |
| Local AI | Interfaces only; no implementation in MVP |
| Voice recognition | Post-MVP speaking pillar expansion |
| Premium store | Economy exists; monetization deferred |
| N4–N1 content | Architecture ready; content phased by JLPT level |
| Guest mode | Optional; auth-first for progress integrity |

### Build Priority Order

From [mvp-roadmap.md](./mvp-roadmap.md):

```
Foundations → Learning Systems → Review Systems → Progress Tracking
→ Gamification → Social Systems → Expansion
```

Never build engagement systems before educational foundations exist.

---

## Competitive Differentiation

### vs. Streak-Driven Apps (Duolingo, etc.)

| Dimension | Typical Competitor | Noboru |
|-----------|-------------------|--------|
| Primary metric | Daily streak, XP | Mastery, elevation, JLPT alignment |
| Metaphor | Game levels, crowns | Mountain ascent, regions, summits |
| Retention | Fear of losing streaks | Achievement and visible progress |
| Content depth | Breadth-first gamification | JLPT-structured depth (see [jlpt-content-architecture.md](./jlpt-content-architecture.md)) |
| Offline | Limited or premium-gated | Core learning offline-first by design |
| AI dependency | Increasingly cloud-AI driven | Functions fully without external AI |

### vs. SRS-Only Tools (Anki, etc.)

| Dimension | SRS Tools | Noboru |
|-----------|-----------|--------|
| Curriculum | User-built decks | Authoritative JLPT pipeline |
| UX | Utility-focused | Premium adventure-oriented PWA |
| Gamification | Minimal or plugin-based | Integrated elevation, quests, achievements |
| Content creation | User responsibility | Managed content pipeline + admin panel |

### vs. Textbook / Course Platforms

| Dimension | Traditional Courses | Noboru |
|-----------|---------------------|--------|
| Engagement | Self-discipline required | Daily quests, games, Yama companion |
| Mobile | Often desktop-first | Mobile-first, thumb-reachable |
| Progress visibility | Chapter completion | Trail, region, elevation, mastery dashboards |
| Review | Separate study habit | Integrated SRS review center |

### Noboru's Moat

1. **Educational architecture** — Single source of truth in [jlpt-content-architecture.md](./jlpt-content-architecture.md)
2. **Systems-first codebase** — Layered architecture prevents feature chaos (see [architecture.mdc](../.cursor/rules/architecture.mdc))
3. **Brand coherence** — Climb metaphor, Yama, art direction, and design system are unified
4. **Offline-first PWA** — Study anywhere without connectivity anxiety
5. **No AI lock-in** — Sustainable without recurring AI API costs
6. **Long-horizon design** — Built for N1 and years of retention, not MVP-only thinking

---

## Monetization Strategy (Future)

MVP is learning-focused. Future premium may offer:

- Convenience (advanced analytics, extra cosmetic customization)
- Customization (themes, Yama variants, profile frames)

Premium must **never** gate educational progress, SRS, core lessons, or mastery tracking.

---

## Key Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Feature chaos before foundations | [mvp-roadmap.md](./mvp-roadmap.md) enforced build order |
| Gamification overshadowing learning | Gamification reads educational progress; never the reverse |
| Content quality at scale | [content-pipeline.md](./content-pipeline.md) lifecycle and admin panel |
| Visual inconsistency | [asset-pipeline.md](./asset-pipeline.md) and [asset-registry.md](./asset-registry.md) |
| Technical debt | Architecture rules, typed APIs, per-feature tests |

---

## Decision Framework

When evaluating a feature request, ask:

1. Does it improve **mastery** or only engagement?
2. Does it fit the **climb metaphor**?
3. Is the **educational foundation** ready?
4. Can it work **offline**?
5. Does it align with **MVP scope** or belong post-MVP?

If engagement wins over mastery, reject or redesign.

---

END OF product-strategy.md
