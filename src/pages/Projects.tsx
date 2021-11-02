import React from "react";
import { css } from "@emotion/css";
import Container from "../components/Container";

const exp = [
	{
		title: window.location.hostname,
		description: "This website.",
		url: "https://github.com/mkrhere/pw2",
		cat: "web",
		tags: ["react", "vite"],
	},
	{
		title: "hyperactive",
		description: "(in dev) Fully reactive UI framework.",
		url: "https://github.com/codefeathers/hyperactive",
		cat: "lib",
		tags: ["reactive", "ui-framework"],
	},
	{
		title: "runtype",
		description: "Runtime-safe library to bring untyped values into TypeScript.",
		url: "https://codefeathers.github.io/runtype",
		cat: "lib",
		tags: ["typescript", "runtime"],
	},
	{
		title: "Telecraft",
		description: "Pluggable Minecraft server management utils.",
		url: "https://github.com/telecraft",
		cat: "tool",
		tags: ["minecraft", "node"],
	},
	{
		title: "mkr/bin",
		description: "Frontend JavaScript-free code-sharing pastebin app.",
		url: "https://github.com/mkrhere/bin",
		cat: "web",
		tags: ["mithril", "ssr", "pastebin"],
	},
	{
		title: "The Guard",
		description: "Telegram bot to help administer networks with large number of groups.",
		url: "https://github.com/thedevs-network/the-guard",
		cat: "bot",
		tags: ["telegram", "bot"],
	},
];

type Project = {
	title: string;
	url: string;
	description: string;
	cat: string;
	tags: string[];
};

const ProjectUnit: React.FunctionComponent<Project> = ({ title, url, description, cat, tags }) => {
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
						font-weight: bold;
						color: #bbbbbb;
						font-size: 0.8rem;
					`}>
					{cat}
				</span>
			</a>
		</div>
	);
};

const Exp: React.FunctionComponent = () => {
	return (
		<Container next="/contact">
			<h2>What else have I built?</h2>
			<p>Some tools, libraries, and apps over time:</p>
			<div
				className={css`
					display: flex;
					width: 100%;
					flex-wrap: wrap;

					& > * {
						flex-basis: 15rem;
						flex-grow: 1;
						margin-top: 2rem;
						margin-right: 3%;
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
