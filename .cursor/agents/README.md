# Noboru Agent System

Authoritative governance for all AI and human development work on Noboru.

## Two file types in this folder

| Location | Purpose | Used by |
|----------|---------|---------|
| Flat `*.md` files (66) | **Cursor subagents** with YAML frontmatter | Cursor Agent delegation, `/agent-name` |
| [core/](./core/) + [subagents/](./subagents/) | **Governance docs** (roles, hierarchy) | Human reference, regeneration source |

Example: `.cursor/agents/vocabulary-agent.md` is the runnable subagent. `.cursor/agents/subagents/vocabulary-agent.md` is the governance definition.

## Master Documents

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | 16 primary agents - roles, authority, outputs |
| [SUBAGENTS.md](./SUBAGENTS.md) | 50 specialist sub-agents under primary hierarchy |

## Individual Agent Definitions

| Directory | Count | Contents |
|-----------|-------|----------|
| [core/](./core/) | 16 | One file per primary agent |
| [subagents/](./subagents/) | 50 | One file per sub-agent |

Regenerate governance and Cursor subagent files after master doc changes:

```bash
powershell -ExecutionPolicy Bypass -File scripts/generate-agent-files.ps1
```

## Using Cursor subagents

```
/vocabulary-agent design the vocabulary feature module
/frontend-agent build the review screen layout
```

Agent can also delegate automatically based on each file's `description` field.

## Governance Chain

All agents inherit rules from:

1. `docs/MASTER_PROMPT.md`
2. `.cursor/agents/AGENTS.md`
3. `.cursor/agents/SUBAGENTS.md`
4. `.cursor/rules/*.mdc`

## Hierarchy

```
Founder Vision
  → Product Manager Agent
  → Software Architect Agent
  → Domain Agents (Frontend, Backend, Database, Content, …)
  → Sub-Agents (Navigation, Schema, JLPT, Mascot, …)
  → Implementation
```

## Prime Directive

Every agent must support **The Climb**. Educational quality wins over engagement metrics.
