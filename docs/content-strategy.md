# Noboru Content Strategy

Version: 1.0

Status: AUTHORITATIVE

This document defines how educational content is created, aligned with JLPT standards, managed through the content pipeline, and prepared for future CMS integration.

**Related documents:** [jlpt-content-architecture.md](./jlpt-content-architecture.md), [content-pipeline.md](./content-pipeline.md), [prd.md](./prd.md), [admin-panel-spec.md](./admin-panel-spec.md)

---

## Strategic Principle

> Content is the product. The code exists to deliver content.

From [content-pipeline.md](./content-pipeline.md):

- Content quality takes priority over content quantity
- If content quality is poor, Noboru fails
- If content quality is excellent, the platform succeeds

Educational content is sacred — never hardcoded into UI components. See [architecture.mdc](../.cursor/rules/architecture.mdc).

---

## Content Ownership

| Domain | Owner | Responsibility |
|--------|-------|----------------|
| Vocabulary | Vocabulary feature + Content Agent | Words, meanings, audio, examples |
| Kanji | Kanji feature + Kanji Agent | Characters, readings, strokes, radicals |
| Grammar | Grammar feature + Grammar Agent | Rules, explanations, exercises |
| Lessons | Learning feature + Curriculum Manager | Assembly, sequencing, dependencies |
| Stories / Dialogues | Story/Conversation Agents | Reading and conversation content |
| JLPT alignment | JLPT Agent | Level tagging, coverage verification |
| Reviews | Review Agent | SRS item generation from content |
| Boss trials | Content + Game design | Region assessments |

Lessons **assemble** content. Lessons do **not** own vocabulary, kanji, or grammar data.

---

## JLPT Alignment

From [jlpt-content-architecture.md](./jlpt-content-architecture.md):

### Supported Levels

N5 → N4 → N3 → N2 → N1 → Master Summit

MVP ships **N5 complete** across three regions:

| Region | JLPT Scope |
|--------|------------|
| Foothills | Hiragana, katakana, foundations |
| Forest Trail | Early N5 vocabulary and grammar |
| Mount N5 | Full N5 curriculum completion |

### Learning Pillars Per Level

Every JLPT level must contain:

- Vocabulary (30%)
- Kanji (20%)
- Grammar (20%)
- Reading (10%)
- Listening (10%)
- Speaking (5%)
- Writing (5%)
- Review integration
- Cultural context
- Conversation

### Educational Model

All content follows the mastery pipeline:

```
Exposure → Understanding → Recognition → Recall → Production → Mastery → Long-Term Retention
```

No content may skip stages.

---

## Content Types

From [content-pipeline.md](./content-pipeline.md):

| Type | MVP | Post-MVP |
|------|-----|----------|
| Vocabulary | ✓ | |
| Kanji | ✓ | |
| Grammar | ✓ | |
| Lessons | ✓ | |
| Dialogues | Partial | Full branching |
| Stories | | ✓ |
| Listening exercises | | ✓ |
| Speaking exercises | | ✓ |
| Writing exercises | | ✓ |
| Challenges | ✓ | |
| Boss trials | ✓ | |
| Achievements | ✓ | |
| Cultural content | Woven in | Expanded |
| Events | | ✓ |

---

## Content Lifecycle

Every content item passes through:

```
Draft → Review → Approved → Published → Active → Deprecated → Archived
```

No content may skip stages.

### Versioning Requirements

Every content item supports:

- Version number
- Revision history
- Change log
- Rollback capability
- Author tracking
- Approval tracking

### Required Fields

From [content-pipeline.md](./content-pipeline.md):

`id`, `slug`, `version`, `status`, `jlpt_level`, `created_at`, `updated_at`, `author_id`, `approved_by`, plus domain-specific fields.

---

## Content Pipeline Overview

### Creation Flow

```
1. Specification    — JLPT Agent defines coverage requirements
2. Draft            — Domain agent creates content item
3. Peer Review      — Second agent validates accuracy
4. Approval         — Content Manager approves
5. Database Insert  — Repository layer persists to Supabase
6. Lesson Assembly  — Curriculum Manager links items to lessons
7. Publish          — Status → Published → Active
8. Monitor          — Analytics on completion, retention, weak areas
```

### Quality Gates

| Gate | Criteria |
|------|----------|
| Accuracy | Native-level review for Japanese content |
| JLPT alignment | Tagged and verified against level requirements |
| Pedagogy | Follows exposure-to-mastery model |
| Accessibility | Audio available, readable formatting |
| Offline | Cacheable for offline study |
| Metadata | Complete required fields |

### Scale Targets

From [content-pipeline.md](./content-pipeline.md):

- 10,000+ vocabulary items
- 2,000+ kanji
- Thousands of grammar examples
- Dialogues, stories, quizzes, and future expansions

Architecture must support this scale from day one even if MVP content is smaller.

---

## MVP Content Plan

### Phase 1: Foundations (Foothills)

- Hiragana complete set (46 + variations)
- Katakana complete set
- 50–100 foundational vocabulary
- Basic greetings and introductions
- Cultural context: writing system origins

### Phase 2: Forest Trail

- 200–400 N5 vocabulary
- 50–80 N5 kanji
- 20–30 N5 grammar points
- Simple dialogues
- Reading passages (short)

### Phase 3: Mount N5

- Remaining N5 vocabulary to full coverage
- Remaining N5 kanji to full coverage
- Remaining N5 grammar to full coverage
- Boss trial: N5 Sentinel
- Achievement: N5 Completed

---

## Admin Panel as Content CMS (MVP)

From [admin-panel-spec.md](./admin-panel-spec.md):

The admin panel serves as the MVP content management interface:

| Module | Capabilities |
|--------|-------------|
| Vocabulary Manager | CRUD, audio upload, JLPT tagging |
| Kanji Manager | CRUD, stroke data, radical linking |
| Grammar Manager | CRUD, example sentences |
| Lesson Builder | Assemble content into lesson steps |
| Region Manager | Region/unit/lesson hierarchy |
| Achievement Manager | Achievement definitions |
| Quest Manager | Quest templates |

Admin is a tool for operational efficiency — not a product showcase.

---

## Future CMS

### Why a Dedicated CMS

As content scales beyond MVP, a dedicated CMS provides:

- Workflow automation (draft → review → approve)
- Content scheduling and embargo
- Multi-author collaboration
- Visual lesson builder
- Translation management (UI + content localization)
- Asset linking from [asset-registry.md](./asset-registry.md)
- Bulk import/export

### CMS Requirements (Future)

| Requirement | Detail |
|-------------|--------|
| Integration | Reads/writes via repository layer — never bypasses services |
| Versioning | Full revision history with rollback |
| Validation | Schema validation before publish |
| Preview | Preview lessons before activation |
| Offline packaging | Generate offline content bundles |
| JLPT dashboard | Coverage gaps per level |

### Candidate Approaches

1. **Extended Admin Panel** — evolve admin into full CMS (lowest friction)
2. **Headless CMS** — external CMS with Supabase sync (higher flexibility)
3. **Custom CMS** — purpose-built for Japanese educational content (highest control)

Decision deferred until N5 content is stable and N4 production begins.

---

## Content Localization (Future)

- UI language localization separate from Japanese educational content
- Japanese educational content remains in Japanese with learner-language explanations
- Example sentences may have multilingual glosses

---

## Content Analytics

Track per content item:

- Completion rate
- Average accuracy in reviews
- Time to mastery
- Weak area correlation
- Drop-off points within lessons

Analytics inform content revision — not engagement manipulation.

---

## Agent Responsibilities

From [content-pipeline.md](./content-pipeline.md):

| Agent | Role |
|-------|------|
| Content Agent | Overall content strategy and quality |
| Vocabulary Agent | Vocabulary creation and validation |
| Kanji Agent | Kanji creation and validation |
| Grammar Agent | Grammar creation and validation |
| Story Agent | Reading content |
| Conversation Agent | Dialogue content |
| JLPT Agent | Level alignment and coverage |
| Review Agent | SRS integration |

---

## Content Anti-Patterns

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Hardcoded words in components | Fetch from repository |
| Lesson owns vocabulary data | Reference vocabulary by ID |
| Skip review stage | Full mastery pipeline |
| Publish without approval | Lifecycle enforcement |
| Quantity over quality | JLPT-verified accuracy first |
| Engagement-optimized fluff | Mastery-optimized content |

---

END OF content-strategy.md
