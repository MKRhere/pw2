import React from "react";
import { css, cx } from "@emotion/css";
import { otherProjects, projects, type Project } from "./data/project";

const styles = {
	project: css`
		position: relative;
		background: var(--card-bg);
		padding: 1.2rem;
		cursor: default;
		border-radius: 0.5rem;

		display: flex;
		flex-direction: column;
		transition: all 200ms;

		:hover {
			filter: invert(0.08);
			transform: translateY(-0.2rem);
		}

		header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		header {
			margin-bottom: 0.5rem;
		}
	`,
	tag: css`
		display: inline-block;
		padding: 0.1rem 0.4rem;
		background: var(--card-tags);
		color: var(--text-colour);
		border-radius: 0.2rem;
		transition: all 200ms;

		:hover {
			background: var(--card-tags-hover);
		}

		& + & {
			margin-left: 0.6rem;
		}
	`,
};

const ProjectUnit: React.FC<Project> = unit => {
	return (
		<div
			className={styles.project}
			title={unit.title + (unit.wip ? " (WIP)" : "")}>
			<a
				className={css`
					display: flex;
					flex-direction: column;
					height: 100%;
					text-decoration: none;
					font-weight: 500;
					cursor: ${unit.wip ? "default" : "pointer"};
				`}
				href={unit.wip ? undefined : unit.url}
				target="_blank"
				rel="noreferrer">
				<header>
					<h4>{unit.title}</h4>
					<span
						className={css`
							color: var(--text-subdued);
							font-size: 0.8rem;
							font-family: monospace;
						`}>
						{"{"} {unit.cat} {"}"}
					</span>
				</header>
				<p
					className={css`
						color: #bdbdbd;
						margin-bottom: 0.8rem;
						font-size: 0.9rem;
					`}>
					{unit.description}
				</p>
				<p
					className={css`
						font-weight: 500;
						color: #9f9f9f;
						font-size: 0.8rem;
						margin-top: auto;
					`}>
					{unit.tags.map(tag => (
						<span key={tag} className={styles.tag}>
							{tag}
						</span>
					))}
				</p>
			</a>
		</div>
	);
};

const otherProjectsStyle = css`
	width: 100%;
	border-collapse: collapse;
	border-radius: 0.5rem;
	overflow: hidden;
	color: var(--text-colour);

	* {
		border-collapse: collapse;
	}

	th {
		color: var(--text-subdued);
	}

	th,
	td {
		padding: 0.9rem 1rem;
		text-align: left;
		line-height: 1.6;
	}

	td {
		border-top: 1px solid var(--table-border);
	}

	/* border-bottom: 1px solid var(--table-border); */

	td a {
		display: block;
		min-width: max-content;
	}
`;

const Exp: React.FC = () => {
	return (
		<>
			<h2>Things I've built</h2>
			<p>A few projects I'm proud of:</p>
			<div
				className={css`
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
					gap: 1rem;
					width: 100%;
				`}>
				{projects.map(unit => (
					<ProjectUnit {...unit} key={unit.title} />
				))}
			</div>
			<hr />
			<p>
				Apart from the above, I've also built some other interesting stuff over
				time using a variety of technologies:
			</p>
			<table className={otherProjectsStyle}>
				<thead>
					<tr>
						<th>Project</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{otherProjects.map(unit => (
						<tr key={unit.title}>
							<td
								className={css`
									vertical-align: top;
								`}>
								<a
									className={cx(
										unit.wip &&
											css`
												color: var(--text-subdued);
												cursor: default;
											`,
									)}
									href={unit.wip ? undefined : unit.url}
									target="_blank"
									rel="noreferrer"
									title={unit.title + (unit.wip ? " (WIP)" : "")}>
									{unit.title}
								</a>
							</td>
							<td>
								{unit.description}
								<span
									className={css`
										margin-top: 0.4rem;
										display: block;
										color: var(--text-subdued);
										font-size: 0.9rem;
										font-family: monospace;
									`}>
									# {unit.tags.join(", ")}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default Exp;
