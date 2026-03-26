# Oh My LOTR (Lord of the Rings)

The AI agent harness for GitHub Copilot CLI — multi-agent orchestration with 11 specialized agents, 3 skills, and 1 MCP server.

> Initial Agent Specialties and Skills Ported from [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent).

## Installation

### Option 1 (Recommended) - VSCode

1. Enable [Agent Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins) in VSCode (`chat.plugins.enabled` tro true)
2. Add `oh-my-lotr` to marketplace urls like so, optionally include the default marketplace repos.
```json
// settings.json
"chat.plugins.enabled": true,
"chat.plugins.marketplaces": [
    "howlowck/oh-my-lotr",
    // "github/awesome-copilot" (default)
    // "github/copilot-plugins" (default)
]
```
3. Go to extensions and search for `@agentPlugins` to bring up the available Agent Plugins

![alt text](docs/media/readme/install-structions.png)

### Options 2 - Copilot CLI

1. Clone this repository:
   ```bash
   git clone https://github.com/howlowck/oh-my-lotr.git
   ```

2. Install as a Copilot CLI plugin:
   ```bash
   copilot plugin install ./oh-my-lotr
   ```

3. Use `copilot` normally — all agents and skills are automatically available.

## What's Included

### Agents (11)

| Agent | Default Model | Role | Writes Code | 
|---|---|---|---|
| **frodo** | Claude Opus 4.6 | Main orchestrator — plans, delegates, implements simple tasks, verifies | Yes (simple tasks) | 
| **gandalf** | Claude Sonnet 4.6 | Master orchestrator — coordinates agents across large work plans | No (delegation only) | 
| **aragorn** | Claude Opus 4.6 | Strategic planner — interviews users, generates `.oml/plans/*.md` | No (plans only) | 
| **gimli** | GPT-5.4 | Autonomous deep worker — explores thoroughly, completes end-to-end | Yes | 
| **samwise** | Claude Sonnet 4.6 | Focused task executor — same discipline as frodo, no delegation | Yes | 
| **elrond** | GPT-5.4 | Read-only consultant — high-IQ reasoning for architecture and debugging | No (read-only) | 
| **faramir** | Claude Opus 4.6 | Pre-planning consultant — finds hidden gaps, ambiguities, failure points | No (analysis only) | 
| **legolas** | GPT-5.4 | Plan reviewer — evaluates work plans for clarity and completeness | No (review only) | 
| **gollum** | Grok Code Fast 1 | Codebase explorer — contextual grep across files, patterns, and structure | No (search only) | 
| **bilbo** | Claude Haiku 4.5 | External researcher — searches docs, OSS examples, and remote codebases | No (search only) | 
| **galadriel** | GPT-4o | Media analyzer — interprets PDFs, images, and diagrams | No (analysis only) |

### Skills (3)

| Skill | Description |
|---|---|
| **git-master** | Atomic commits, rebase/squash, history search (blame, bisect, log -S) |
| **frontend-ui-ux** | Designer-turned-developer crafting stunning UI/UX without mockups |
| **github-triage** | Read-only GitHub issue/PR triage with evidence-backed reports |

## Usage

Once installed in vscode, you'll find all the agents in Github Copilot Chat, or you can use `copilot` CLI as normal. Invoke agents using `/agent` then select Frodo.

Skills are loaded automatically when relevant, or requested explicitly in agent prompts.

## Meet the Fellowship

Each agent in Oh My Lord is named after a Lord of the Rings character whose qualities mirror their role in the system. Together they form a Fellowship — orchestrators, planners, workers, scouts, and advisors — each with a distinct purpose.

---

### Frodo — The Inspiration

<img src="docs/media/agents/frodo-role.png" width="480" alt="Frodo — Main Orchestrator" />

> *"Even the smallest person can change the course of the future."*

**Role**: Driver for success — the default agent most users interact with.

**What he does**: Frodo receives your request, assesses complexity, and decides the best path forward. For simple tasks he rolls up his sleeves and implements directly. For complex work he delegates to specialists — firing parallel exploration agents, consulting Elrond on architecture, or handing off more complex planning and strategy to Aragorn. He tracks progress obsessively with todo lists and verifies every deliverable before reporting back.

**Philosophy**: Work, delegate, verify, ship. No AI slop. Frodo carries the burden of every task to its end — his code should be indistinguishable from a senior engineer's.

| | |
|---|---|
| **Model** | Claude Opus 4.6 |
| **Reasoning** | Highest — complex orchestration, implicit requirement parsing, codebase maturity assessment |
| **Writes code** | Yes (simple/medium tasks) |
| **Delegates to** | All agents |
| **Best for** | General-purpose requests, multi-step implementations, anything you're not sure who to ask |

---

### Aragorn — The Strategist

<img src="docs/media/agents/aragorn-role-night.png" width="480" alt="Aragorn — Strategic Planner" />

> *"I do not know what strength is in my blood, but I swear to you I will not let the White City fall."*

**Role**: Strategic planning consultant — interviews users and produces detailed work plans.

**What he does**: Aragorn is a planner, not an implementer. When you bring him a task, he interviews you to understand requirements, fires exploration agents to research the codebase, consults Faramir to catch blind spots, and generates a comprehensive work plan to `.oml/plans/*.md`. He classifies intent (trivial, refactoring, greenfield, architecture), adapts his interview depth accordingly, and structures plans for maximum parallel execution.

**Philosophy**: Planning is not doing. Aragorn brings the foresight of a Ranger and the strategic mind of a King. He'll refuse to implement even if you ask — and he'll explain why planning saves hours of debugging.

| | |
|---|---|
| **Model** | Claude Opus 4.6 |
| **Reasoning** | Highest — requirement analysis, scope decomposition, parallelism design |
| **Writes code** | No (`.oml/*.md` plans and drafts only) |
| **Delegates to** | Gollum, Bilbo, Faramir, Legolas, Elrond |
| **Best for** | Feature planning, migration strategies, complex refactoring plans, architecture design sessions |

---

### Gandalf — The Orchestrator

<img src="docs/media/agents/gandalf-role.png" width="480" alt="Gandalf — Master Orchestrator" />

> *"All we have to decide is what to do with the time that is given us."*

**Role**: Master orchestrator — conducts the entire workflow across a work plan.

**What he does**: Gandalf takes a work plan (typically generated by Aragorn) and coordinates every agent needed to execute it. He parses TODO items, dispatches tasks to the right agents in parallel waves, tracks completion, and runs the final verification wave. He never writes code himself — he conducts the orchestra.

**Philosophy**: Pure coordination. Gandalf wields wisdom and authority to marshal all forces of Middle-earth toward a single goal. He's the right choice when a plan is too large or too parallel for Frodo to handle alone.

| | |
|---|---|
| **Model** | Claude Sonnet 4.6 |
| **Reasoning** | High — coordination logic, dependency tracking, multi-wave orchestration |
| **Writes code** | No (delegation only) |
| **Delegates to** | All agents |
| **Best for** | Executing large work plans, multi-wave parallel orchestration, release coordination |

---

### Gimli — The Relentless

<img src="docs/media/agents/gimil-role.png" width="480" alt="Gimli — Autonomous Deep Worker" />

> *"Certainty of death. Small chance of success. What are we waiting for?"*

**Role**: Autonomous deep worker — explores thoroughly, then completes tasks end-to-end.

**What he does**: Gimli is the agent you call when you want something done start-to-finish without hand-holding. He follows a strict loop: explore the codebase, plan changes, decide whether to self-implement or delegate, execute, and verify — all in a single turn. He persists through failures, tries alternative approaches, and only asks for help as a last resort after exhausting creative alternatives.

**Philosophy**: 100% or nothing. Gimli endures until the job is done. He doesn't ask permission — he acts. If verification fails, he tries a different approach. After 3 failed approaches, he consults Elrond. He never leaves code in a broken state.

| | |
|---|---|
| **Model** | GPT-5.4 |
| **Reasoning** | High — autonomous decision-making, multi-approach problem solving |
| **Writes code** | Yes (primary code writer for deep tasks) |
| **Delegates to** | Gollum, Bilbo, Elrond, Faramir, Legolas, Samwise |
| **Best for** | End-to-end feature implementation, deep debugging, autonomous problem-solving, tasks requiring persistence |

---

### Samwise — The Loyal Companion

<img src="docs/media/agents/samwise-role.png" width="480" alt="Samwise — Focused Task Executor" />

> *"I can't carry it for you, but I can carry you."*

**Role**: Focused task executor — does exactly what's asked, directly and efficiently.

**What he does**: Samwise is Frodo's workhorse. When Frodo or Gandalf delegates a specific, well-scoped task, Samwise executes it with the same discipline and quality standards — but without further delegation. He's lean: no orchestration overhead, no sub-delegation chains, just clean execution with verification.

**Philosophy**: Dense over verbose. Start immediately, no acknowledgments. Samwise doesn't overthink — he does the work, verifies it's clean, and reports back. He's the reliable companion who carries the load without complaint.

| | |
|---|---|
| **Model** | Claude Sonnet 4.6 |
| **Reasoning** | Medium-high — focused execution, pattern matching, code quality |
| **Writes code** | Yes (primary delegated executor) |
| **Delegates to** | Gollum, Bilbo (search only) |
| **Best for** | Well-scoped implementation tasks delegated from orchestrators, single-concern changes |

---

### Elrond — The Wise

<img src="docs/media/agents/elrond-role-night.png" width="480" alt="Elrond — Read-Only Consultant" />

> *"I was there, Gandalf. I was there three thousand years ago."*

**Role**: Read-only consultant — high-IQ reasoning for architecture decisions and hard debugging.

**What he does**: Elrond reads code, analyzes architecture, and provides expert consultation — but never modifies anything. He's the agent you consult when you've failed twice at debugging, when you're making architectural decisions with long-term impact, or when you need a second opinion on a complex design. His reasoning quality is the highest available.

**Philosophy**: Wisdom without action. Elrond has seen it all — three thousand years of software patterns. He provides the insight; others execute. He's expensive to consult, so other agents reserve him for problems that truly warrant his attention.

| | |
|---|---|
| **Model** | GPT-5.4 |
| **Reasoning** | Highest — deep analysis, multi-system tradeoffs, architectural foresight |
| **Writes code** | No (read-only, consultation only) |
| **Delegates to** | None |
| **Best for** | Architecture decisions, hard debugging (after 2+ failed attempts), security/performance review, unfamiliar code patterns |

---

### Faramir — The Scout

<img src="docs/media/agents/faramir-role-night.png" width="480" alt="Faramir — Pre-Planning Consultant" />

> *"I do not love the bright sword for its sharpness, nor the arrow for its swiftness. I love only that which they defend."*

**Role**: Pre-planning consultant — identifies what everyone else missed before the plan is written.

**What he does**: Faramir reviews a planning session's context — the user's goal, interview findings, research results — and identifies hidden intentions, unasked questions, scope creep risks, unstated assumptions, and missing guardrails. Aragorn consults Faramir automatically before generating every work plan. His output prevents costly rework by catching gaps early.

**Philosophy**: Defense through foresight. Faramir doesn't plan the attack — he ensures the plan won't fail by finding its weaknesses first. He protects what matters by asking the questions nobody thought to ask.

| | |
|---|---|
| **Model** | Claude Opus 4.6 |
| **Reasoning** | Highest — ambiguity detection, assumption surfacing, failure mode analysis |
| **Writes code** | No (analysis only) |
| **Delegates to** | None |
| **Best for** | Pre-plan gap analysis (called automatically by Aragorn), complex requirement validation |

---

### Legolas — The Keen-Eyed

<img src="docs/media/agents/legolas-role.png" width="480" alt="Legolas — Plan Reviewer" />

> *"A red sun rises. Blood has been spilled this night."*

**Role**: Plan reviewer — the quality gate that work plans must pass.

**What he does**: Legolas reads a work plan and answers one question: *"Can a capable developer execute this plan without getting stuck?"* He verifies that file references actually exist, that tasks have enough context to start, and that QA scenarios are executable. He rejects only for true blockers — not style preferences or minor gaps. When he says "OKAY," the plan is ready.

**Philosophy**: Approval bias — when in doubt, approve. Legolas is a blocker-finder, not a perfectionist. He trusts developers to figure out minor gaps. But if a referenced file doesn't exist or a task is completely impossible to start, he'll reject with a maximum of 3 specific, actionable issues.

| | |
|---|---|
| **Model** | GPT-5.4 |
| **Reasoning** | High — reference verification, executability assessment, practical judgment |
| **Writes code** | No (review only) |
| **Delegates to** | None |
| **Best for** | High-accuracy plan review (optional step in Aragorn's workflow), blocking-issue detection |

---

### Gollum — The Deep Explorer

<img src="docs/media/agents/gollum-role.png" width="480" alt="Gollum — Codebase Explorer" />

> *"We knows. We knows safe paths in the dark."*

**Role**: Codebase explorer — fast, fearless contextual grep across the entire project.

**What he does**: Gollum crawls through the codebase to find files, patterns, implementations, and structure. Other agents fire him in parallel (often 2-5 instances at once) to search for auth patterns, error handling conventions, test file placement, module boundaries, and more. He's cheap and fast — designed to be used liberally as a search tool, not a consultant.

**Philosophy**: Know the dark paths. Gollum goes where others won't — deep into unfamiliar module structures, cross-layer dependencies, and buried configuration files. He returns with what he found and moves on. No opinions, just results.

| | |
|---|---|
| **Model** | Grok Code Fast 1 |
| **Reasoning** | Low — optimized for speed, not analysis |
| **Writes code** | No (search only) |
| **Delegates to** | None |
| **Best for** | Finding code patterns, file discovery, cross-module searches, codebase structure mapping |

---

### Bilbo — The Librarian of Rivendell

<img src="docs/media/agents/bilbo-role-night.png" width="480" alt="Bilbo — External Docs Researcher" />

> *"I'm going on an adventure!"*

**Role**: External researcher — searches official docs, OSS examples, and remote codebases.

**What he does**: Bilbo ventures beyond the local codebase to find answers in the wider world. He finds production-quality OSS implementations on GitHub, clones repos to read official documentation directly, and retrieves current best practices. When an agent encounters an unfamiliar library or needs to know the recommended approach for a framework feature, Bilbo is the one they send.

**Philosophy**: There and back again. Bilbo travels to the external world of docs and open source, gathers the knowledge, and brings it home. He's the translator between what the docs say and what your codebase needs.

| | |
|---|---|
| **Model** | Claude Haiku 4.5 |
| **Reasoning** | Low-medium — search synthesis, relevance filtering |
| **Writes code** | No (search only) |
| **Delegates to** | None |
| **Best for** | Library documentation lookup, finding OSS examples, best practice research, unfamiliar API usage |

---

### Galadriel — The Mirror's Keeper

<img src="docs/media/agents/galadriel-role.png" width="480" alt="Galadriel — Media Analyzer" />

> *"Even the smallest person can change the course of the future... if they know what they're looking at."*

**Role**: Media analyzer — interprets PDFs, images, and diagrams that other agents can't parse.

**What she does**: Galadriel looks into her Mirror and sees what others cannot — the content within binary files. When agents encounter a PDF spec, a design mockup, an architecture diagram, or a screenshot, they invoke Galadriel to extract structured information from it. She returns descriptions, extracted data, and summaries that text-based agents can work with.

**Philosophy**: Sight beyond sight. Galadriel's Mirror reveals the truth within any visual form. She doesn't act on what she sees — she illuminates it for others to act upon.

| | |
|---|---|
| **Model** | GPT-5 Nano |
| **Reasoning** | Low — focused on visual interpretation, not complex reasoning |
| **Writes code** | No (analysis only) |
| **Delegates to** | None |
| **Best for** | PDF extraction, image description, diagram interpretation, screenshot analysis |

---

## Architecture

```
oh-my-lotr/
  plugin.json          # Plugin manifest
  .mcp.json            # MCP server configuration
  hooks.json           # Hook definitions
  agents/              # 11 agent definitions (.agent.md)
  skills/              # 3 skill definitions (*/SKILL.md)
```

### Agent Hierarchy

```
frodo / gandalf (orchestrators)
  |-- delegates to -->  samwise (executor)
  |-- consults   -->  elrond (architecture/debugging)
  |-- plans with -->  aragorn (strategic planning)
  |-- analyzes   -->  faramir (pre-planning), legolas (review)
  |-- searches   -->  gollum (codebase), bilbo (external)
  |-- inspects   -->  galadriel (media)
  |-- deep work  -->  gimli (autonomous)
```

## Origin

This is a port of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent), originally built as an [OpenCode](https://opencode.ai) plugin. The agent prompts, skills, and MCP configurations have been adapted from OpenCode's TypeScript format to Copilot CLI's `.agent.md` markdown format.

Key adaptations:
- Agent prompts converted from TypeScript to `.agent.md` with YAML frontmatter
- Background task/session systems replaced with direct agent invocation (`@agent-name`)
- OpenCode-specific tool references generalized for Copilot CLI
- `explore` and `librarian` renamed to `gollum` and `bilbo` with LOTR character names

## License

MIT
