---
title: Installation
description: How to install and configure Oh My LOTR.
---

## Option 1 (Recommended) — VS Code Agent Plugin

1. Enable [Agent Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins) in VS Code by setting `chat.plugins.enabled` to `true`.

2. Add `oh-my-lotr` to your marketplace URLs:

```json
// settings.json
{
  "chat.plugins.enabled": true,
  "chat.plugins.marketplaces": [
    "howlowck/oh-my-lotr"
  ]
}
```

3. Open the Extensions view and search for `@agentPlugins` to browse available Agent Plugins.

## Option 2 — Copilot CLI

1. Clone the repository:

```bash
git clone https://github.com/howlowck/oh-my-lotr.git
```

2. Install as a Copilot CLI plugin:

```bash
copilot plugin install ./oh-my-lotr
```

3. Use `copilot` normally — all agents and skills are automatically available.
