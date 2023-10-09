import { css } from "@emotion/css";
import React from "react";
import { setupCursorTracking } from "../../util";
import { Experience } from "./types";

const Circle: React.FC = () => (
	<div className="timeline-segment" aria-hidden>
		<div
			className={css`
				width: 200vw;
				height: 1px;
				background: #333333;
				left: -50vw;
				position: absolute;
				top: calc(-3rem + 0.2rem / 2);
				z-index: 0;
			`}></div>
		<div
			className={css`
				width: 0.25rem;
				height: 0.25rem;
				background: #333333;
				background: #ffffff;
				border-radius: 100%;
				position: absolute;
				top: -3rem;
				left: 0;
				z-index: 100;
			`}></div>
	</div>
);

const btn = css`
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	cursor: pointer;
	padding: 1rem var(--item-padding);
	border-radius: 0.5rem;
	position: relative;
	height: max-content;
	width: 100%;

	background-color: transparent;
	border: none;
	text-align: left;
	display: inherit;

	& > * {
		z-index: 10;
	}

	@media (pointer: fine) {
		&:hover {
			background-color: var(--card-hover);
			z-index: 1000;
			box-shadow: 0 0 25rem 2rem rgba(190, 190, 190, 0.1);
		}
	}

	& .timeline-segment {
		position: absolute;
	}

	& .position {
		color: var(--text-colour);
	}

	& .year,
	& h5 {
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--text-subdued);
	}

	& h5 {
		font-weight: 400;
		margin-block-start: 0.2rem;
	}
`;

export const Content = ({
	onClick,
	title,
	year,
	position,
	location,
}: Experience) => {
	return (
		<button className={btn} onClick={onClick} ref={setupCursorTracking}>
			<div className="dynamic-gradient" />
			<Circle />
			<h4>
				{title}
				<span className="year"> · ({year})</span>
			</h4>
			<span className="position">{position}</span>
			<h5>{location}</h5>
		</button>
	);
};
