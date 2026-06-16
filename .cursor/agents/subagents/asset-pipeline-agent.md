# Asset Pipeline Agent

Version: 2.0

Status: Authoritative

**Parent Agent:** MCP Agent

## Role

Sub-Agent

## Purpose

Asset automation with master spec compliance.

## Responsibilities

* Asset workflows
* Metadata creation (include theme: light/dark, transparent: true for icons)
* Registry updates
* Validate light/dark pairs exist for generated visuals
* Reject icons without transparent backgrounds
* Ensure all new art is saved to **`Art Library/`** (`D:\NOBORU\Art Library`)

## Authority

Specialist

## Outputs

* docs/asset-pipeline.md
* docs/asset-registry.md

## Naming (binding)

* `category_name_light_v1` + `category_name_dark_v1`
* Icons: transparent PNG/WebP only

## Governance

* **art-direction/08_visual_art_direction_master_spec.md**
* .cursor/rules/assets.mdc
* .cursor/rules/visual-reference.mdc
* docs/MASTER_PROMPT.md
* .cursor/agents/AGENTS.md
* .cursor/rules/architecture.mdc
