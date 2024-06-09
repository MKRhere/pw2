import React from "react";
import { css } from "@emotion/css";
import Container from "../../components/Container";

const exp = [
	{
		title: window.location.hostname,
		description: "This website.",
		url: "https://github.com/MKRhere/pw2",
		cat: "web",
		tags: ["react", "vite"],
	},
	{
		title: "hyperactive",
		description: "Suite of web-app development libraries.",
		url: "https://github.com/codefeathers/hyperactive",
		cat: "lib",
		tags: ["reactive", "ui-framework"],
	},
	{
		title: "denoland/node_shims",
		description:
			"Node shims for Deno’s runtime API. Contributed repo into official denoland.",
		url: "https://github.com/denoland/node_shims",
		cat: "lib",
		tags: ["deno", "shims"],
	},
	{
		title: "Telegraf",
		description:
			"Active maintainer of one of the most popular Telegram Bot API libraries for Node.",
		url: "https://github.com/telegraf/telegraf",
		cat: "lib",
		tags: ["typescript", "telegram", "bot-api"],
	},
	{
		title: "runtype",
		description: "Safely bring runtime values into TypeScript.",
		url: "https://codefeathers.github.io/runtype",
		cat: "lib",
		tags: ["typescript", "runtime"],
	},
	{
		title: "Telecraft",
		description: "Pluggable Minecraft server administration toolkit.",
		url: "https://github.com/MadrasMC/telecraft",
		cat: "tool",
		tags: ["minecraft", "node"],
	},
	{
		title: "Storymap",
		description:
			"Reverse-engineered thirdparty map renderer for Vintage Story in Zig ⚡️",
		// url: "https://github.com/MadrasMC/storymap",
		cat: "tool",
		tags: ["vintage-story", "zig"],
	},
];

type Project = {
	title: string;
	url?: string;
	description: string;
	cat: string;
	tags: string[];
};

const ProjectUnit: React.FC<Project> = ({
	title,
	url,
	description,
	cat,
	tags,
}) => {
	return (
		<div
			className={css`
				position: relative;
				background: var(--card-bg);
				padding: 1.5rem;
				cursor: default;
				border-radius: 0.5rem;

				display: flex;
				flex-direction: column;
				transition: all 200ms;

				:hover {
					filter: hue-rotate(30deg) invert(0.04);
					transform: translateY(-0.2rem);
				}
			`}>
			<a
				className={css`
					display: block;
					text-decoration: none;
					font-weight: 500;
				`}
				href={url}
				target="_blank"
				rel="noreferrer">
				<h4>{title}</h4>
				<p
					className={css`
						color: #bdbdbd;
						margin-bottom: 0.8rem;
					`}>
					{description}
				</p>
				<p
					className={css`
						font-weight: 500;
						color: #9f9f9f;
						font-size: 0.8rem;
						margin-top: auto;
					`}>
					{tags.map(tag => (
						<span
							key={tag}
							className={css`
								display: inline-block;
								padding: 0.2rem 0.4rem;
								background: var(--card-tags);
								color: white;
								border-radius: 0.2rem;
								transition: all 200ms;

								:hover {
									background: var(--card-tags-hover);
								}

								& + & {
									margin-left: 0.6rem;
								}
							`}>
							{tag}
						</span>
					))}
				</p>
				<span
					className={css`
						position: absolute;
						right: 1rem;
						bottom: 1rem;
						color: #bbbbbb;
						font-size: 0.8rem;
					`}>
					{cat}
				</span>
			</a>
		</div>
	);
};

const Exp: React.FC = () => {
	return (
		<Container>
			<h2>Things I've built</h2>
			<p>Some tools, libraries, and apps over time:</p>
			<div
				className={css`
					display: flex;
					width: 100%;
					flex-wrap: wrap;
					gap: 2rem;

					& > * {
						flex-basis: 15rem;
						flex-grow: 1;
					}
				`}>
				{exp.map(unit => (
					<ProjectUnit {...unit} key={unit.title} />
				))}
			</div>
		</Container>
	);
};

export default Exp;
