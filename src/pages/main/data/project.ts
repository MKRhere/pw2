export type Project = {
	title: string;
	url?: string;
	description: string;
	cat: string;
	tags: string[];
	wip?: boolean;
};

export const projects: Project[] = [
	{
		title: window.location.hostname.split(".").slice(0, 2).join("."),
		description: "This website.",
		url: "https://github.com/MKRhere/pw2",
		cat: "web",
		tags: ["react", "vite"],
	},
	{
		title: "hyperactive",
		description: "Suite of fast, reactive web-app development libraries.",
		url: "https://github.com/codefeathers/hyperactive",
		cat: "lib",
		tags: ["reactive", "ui-framework"],
	},
	{
		title: "deno shims",
		description:
			"Node shims for Deno’s runtime API. Transferred to official denoland.",
		url: "https://github.com/denoland/node_shims",
		cat: "lib",
		tags: ["deno", "shims"],
	},
	{
		title: "Telegraf",
		description:
			"Active maintainer of one of the most popular Telegram Bot API libraries for TypeScript.",
		url: "https://github.com/telegraf/telegraf",
		cat: "lib",
		tags: ["typescript", "telegram", "bot-api"],
	},
	{
		title: "mkr/cal",
		description:
			"A complete calendar application with invites, task management, notetaking, and more.",
		url: "https://github.com/MKRhere/cal",
		cat: "web",
		wip: true,
		tags: ["hyperactive", "calendar"],
	},
	{
		title: "Telecraft",
		description: "Pluggable Minecraft server administration toolkit.",
		url: "https://github.com/MadrasMC/telecraft",
		cat: "cli",
		tags: ["minecraft", "node"],
	},
];

export const otherProjects: Project[] = [
	{
		title: "true-pg",
		description:
			"The most complete PostgreSQL schema generator for TypeScript, Kysely, Zod, and others.",
		url: "https://github.com/feathers-studio/true-pg",
		cat: "lib",
		tags: ["postgresql", "schema", "typescript", "kysely", "zod"],
	},
	{
		title: "wiretap",
		description:
			"Extremely tiny debug logging utility for all JavaScript runtimes. Published as npm/yarn.",
		url: "https://github.com/feathers-studio/wiretap",
		cat: "lib",
		tags: ["debug", "logging", "typescript"],
	},
	{
		title: "storymap",
		description:
			"Reverse-engineered thirdparty map renderer for Vintage Story in Zig ⚡️",
		// url: "https://github.com/MadrasMC/storymap",
		cat: "cli",
		tags: ["vintage-story", "zig"],
		wip: true,
	},
	{
		title: "i3-ts",
		description: "TypeScript bindings for the i3 window manager.",
		url: "https://github.com/feathers-studio/i3-ts",
		cat: "lib",
		tags: ["i3", "typescript", "bindings"],
	},
	{
		title: "pg-extract",
		description: "Extract data from PostgreSQL tables into a JSON array.",
		url: "https://github.com/feathers-studio/pg-extract",
		cat: "lib",
		tags: ["postgresql", "json", "data-extraction"],
	},
];
