import { css } from "emotion";
import Container from "../components/Container";

const exp = [
	{
		title: window.location.hostname,
		description: "This website.",
		url: "https://github.com/mkrhere/pw2",
		cat: "web",
		tags: ["react", "css-in-js"],
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
		title: window.location.hostname,
		description: "This website.",
		url: "https://github.com/mkrhere/pw2",
		cat: "web",
		tags: ["react", "css-in-js"],
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
];

const ExpUnit = ({ title, url, description, cat, tags }) => {
	return (
		<div
			className={css`
				position: relative;
				border: 0.2rem solid var(--primary-color);
				padding: 1rem;
				cursor: default;

				display: flex;
				flex-direction: column;
				transition: filter;

				:hover {
					filter: hue-rotate(30deg);
				}
			`}>
			<div
				className={css`
					position: absolute;
					border-top: 0.5rem solid var(--primary-color);
					top: 0;
					left: 0;
				`}></div>
			<a
				className={css`
					display: block;
					text-decoration: none;
				`}
				href={url}
				target="_blank"
				rel="noreferrer">
				<h3>{title}</h3>
				<p
					className={css`
						color: #bdbdbd;
						margin-bottom: 0.8rem;
					`}>
					{description}
				</p>
				<p
					className={css`
						font-weight: 800;
						color: #9f9f9f;
						font-size: 0.8rem;
						margin-top: auto;
					`}>
					{tags.map(tag => (
						<span key={tag}>#{tag} </span>
					))}
				</p>
				<span
					className={css`
						position: absolute;
						right: 1rem;
						bottom: 1rem;
						font-weight: bold;
						color: #bbb;
						font-size: 0.8rem;
					`}>
					{cat}
				</span>
			</a>
		</div>
	);
};

function Exp() {
	return (
		<Container>
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
					<ExpUnit {...unit} />
				))}
			</div>
		</Container>
	);
}

export default Exp;
