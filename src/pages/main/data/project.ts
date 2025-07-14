export type Project = {
	title: string;
	url?: string;
	description: string;
	cat: string;
	tags: string[];
	wip?: boolean;
	private?: boolean;
};

export const projects: Project[] = [
	{
		title: window.location.hostname.split(".").slice(0, 2).join("."),
		description:
			"This website. You've probably missed some things. Look around.",
		url: "https://github.com/MKRhere/pw2",
		cat: "web",
		tags: ["react", "vite"],
	},
	{
		title: "comptime.ts",
		description:
			"A TypeScript compiler for compile-time expressions, for fewer runtime computations; similar to Zig comptime.",
		url: "https://github.com/feathers-studio/comptime.ts",
		cat: "compiler",
		tags: ["typescript", "compiler", "comptime"],
	},
	{
		title: "hyperactive",
		description: "Suite of fast, reactive web-app development libraries.",
		url: "https://github.com/codefeathers/hyperactive",
		cat: "lib",
		tags: ["reactive", "ui-framework", "typescript"],
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
		title: "true-pg",
		description:
			"The most complete PostgreSQL schema generator for TypeScript, Kysely, Zod, and others.",
		url: "https://github.com/feathers-studio/true-pg",
		cat: "codegen",
		tags: ["postgresql", "schema", "kysely", "zod"],
	},
];

export const otherProjects: Project[] = [
	{
		title: "mkr/pdf (real name TBA)",
		description: "A declarative Figma/flexbox-like layout engine from scratch, with a PDF backend. Allows designing PDFs in code. Canvas backend to be added in the future.",
		url: "",
		cat: "lib",
		tags: [ "declarative", "layout", "pdf" ],
		wip: true,
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
		title: "Telecraft",
		description: "Pluggable Minecraft server administration toolkit.",
		url: "https://github.com/MadrasMC/telecraft",
		cat: "cli",
		tags: ["deno", "minecraft"],
	},
	{
		title: "wiretap",
		description:
			"Extremely tiny universal debug logging utility for all JavaScript runtimes. Published as npm/w.",
		url: "https://github.com/feathers-studio/wiretap",
		cat: "lib",
		tags: ["typescript", "debug", "logging"],
	},
	{
		title: "hyperweb",
		description:
			"An implementation of WebMentions and a self-hosted microblog. A distributed social hyperweb!",
		url: "https://github.com/feathers-studio/hyperweb",
		cat: "web",
		tags: ["typescript", "webmentions", "microblog"],
	},
	{
		title: "ts-parser",
		description:
			"A TypeScript definitions (d.ts) parser from scratch using parser-generators.",
		url: "https://github.com/feathers-studio/ts-parser",
		cat: "lib",
		tags: ["typescript", "parser"],
	},
	{
		title: "hypercss",
		description: "A perfectly spec-compliant CSS parser for TypeScript.",
		url: "https://github.com/feathers-studio/hypercss",
		cat: "lib",
		tags: ["typescript", "parser", "css"],
	},
	{
		title: "zappymail",
		description:
			"A tiny proxy email server to reformat emails from a thirdparty utility.",
		cat: "cli",
		tags: ["typescript", "proxy", "email"],
		private: true,
	},
	{
		title: "storymap",
		description:
			"Reverse-engineered thirdparty map renderer for Vintage Story in Zig ⚡️",
		url: "https://github.com/MadrasMC/storymap",
		cat: "cli",
		tags: ["zig", "map-renderer", "vintage-story"],
		wip: true,
	},
	{
		title: "i3-ts",
		description: "TypeScript bindings for the i3 window manager.",
		url: "https://github.com/feathers-studio/i3-ts",
		cat: "lib",
		tags: ["typescript", "bindings", "i3"],
	},
	{
		title: "mkr/mail",
		description:
			"A personal utility to fetch new emails from an IMAP server and send them to Telegram.",
		url: "https://github.com/MKRhere/mail",
		cat: "bot",
		tags: ["typescript", "imap", "telegram"],
	},
	{
		title: "pg-extract",
		description: "Extract data from PostgreSQL tables into a JSON collection.",
		url: "https://github.com/feathers-studio/pg-extract",
		cat: "lib",
		tags: ["postgresql", "json", "data-extraction"],
	},
	{
		title: "mkr/bin",
		description: "A small personal bin.",
		url: "https://github.com/MKRhere/bin",
		cat: "web",
		tags: ["typescript", "bin"],
	},
	{
		title: window.location.hostname.split(".").slice(0, 2).join("."),
		description: "Did you find all the easter eggs? Keep looking.",
		url: "https://github.com/MKRhere/pw2",
		cat: "web",
		tags: ["react", "vite"],
	},
];
