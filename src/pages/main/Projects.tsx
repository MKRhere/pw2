import React from "react";
import { css } from "@emotion/css";
import Container from "../../components/Container";
import { projects } from "./data/project";

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
						font-size: 0.9rem;
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
					display: grid;
					grid-template-columns: repeat(auto-fit, 20rem);
					gap: 1rem;
					width: 100%;
				`}>
				{projects.map(unit => (
					<ProjectUnit {...unit} key={unit.title} />
				))}
			</div>
		</Container>
	);
};

export default Exp;
