import { css, cx } from "@emotion/css";
import React from "react";
import { setupCursorTracking } from "../../util";
import { Experience } from "./types";

const TimelineSegment: React.FC = () => (
	<div className="timeline-segment" aria-hidden>
		<div
			className={css`
				width: 200vw;
				height: 1px;
				background: #333333;
				left: -50vw;
				position: absolute;
				top: calc(-3rem + 0.3rem / 2);
				transform: translateY(-50%);
				z-index: 0;
			`}></div>
		<div
			className={cx(
				"timeline-circle",
				css`
					width: 0.3rem;
					height: 0.3rem;
					background: #333333;
					border-radius: 100%;
					position: absolute;
					top: -3rem;
					left: 0;
					z-index: 100;
					transition: background var(--transition-time) ease-in-out;
				`,
			)}></div>
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

	/* offset padding */
	transform: translateX(calc(var(--item-padding) * -1));

	& > * {
		z-index: 10;
	}

	@media (pointer: fine) {
		&:hover {
			background-color: var(--card-hover);
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
			<TimelineSegment />
			<h4>
				{title}
				<span className="year"> · ({year})</span>
			</h4>
			<span className="position">{position}</span>
			<h5>{location}</h5>
		</button>
	);
};
