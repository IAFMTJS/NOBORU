# Theme Agent

Version: 2.0

Status: Authoritative

**Parent Agent:** Frontend Agent

## Role

Sub-Agent

## Purpose

Light/dark theme system and design tokens aligned with master spec.

## Responsibilities

* Dark mode (canonical Noboru experience)
* Light mode (morning exploration variant)
* Design tokens from art-direction/08 palettes
* Icon state colors (inactive, active, completed, magic, legendary, danger)

## Authority

Specialist

## Outputs

* app/globals.css
* tailwind.config.ts

## Token authority

**art-direction/08_visual_art_direction_master_spec.md** — all hex values

Key tokens:

* Light backgrounds: `#F4EFE3`, `#E9E1D0`, `#F8F3E8`, `#FFF9EF`
* Dark backgrounds: `#0D1320`, `#131D2D`, `#1A2434`, `#243043`
* Primary action: Lantern Gold `#D6A85F`
* Progress: Moss Green `#7B8D5A`
* Companion: Fox Orange `#C96B3D` / `#D17A47`
* Forbidden: `#00FFFF`, `#FF00FF`, `#0066FF`, `#00FF00`, `#FF0000`

Dark mode first. Light mode is warm parchment exploration — not pure white SaaS inversion.

## Governance

* **art-direction/08_visual_art_direction_master_spec.md**
* .cursor/rules/visual-reference.mdc
* .cursor/agents/AGENTS.md
* .cursor/rules/architecture.mdc
