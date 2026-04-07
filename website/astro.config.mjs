import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	site: "https://howlowck.github.io",
	base: "/oh-my-lotr",
	integrations: [
		starlight({
			title: "Oh My LOTR",
			description:
				"The AI agent harness for GitHub Copilot — multi-agent orchestration with specialized agents, skills, and MCP servers.",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/howlowck/oh-my-lotr",
				},
			],
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Introduction", slug: "getting-started/introduction" },
						{ label: "Installation", slug: "getting-started/installation" },
					],
				},
				{
					label: "Agents",
					autogenerate: { directory: "agents" },
				},
				{
					label: "Skills",
					autogenerate: { directory: "skills" },
				},
			],
		}),
	],
});
