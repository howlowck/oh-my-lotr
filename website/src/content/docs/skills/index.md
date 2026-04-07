---
title: Skills Overview
description: Built-in skills that agents can load for domain-specific expertise.
---

Skills provide specialized capabilities and refined workflows. They are loaded automatically when relevant, or can be requested explicitly.

| Skill | Description |
|---|---|
| **git-master** | Atomic commits, rebase/squash, history search (blame, bisect, log -S) |
| **frontend-ui-ux** | Designer-turned-developer crafting stunning UI/UX without mockups |
| **github-triage** | Read-only GitHub issue/PR triage with evidence-backed reports |

## How Skills Work

Each skill is a `SKILL.md` file containing tested instructions for a specific domain. When an agent detects that a task matches a skill's domain, it reads the skill file and follows its instructions.

Skills can be combined — for example, a task involving a flowchart in documentation might load both a diagram skill and a documentation skill.
