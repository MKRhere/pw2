import React, { useMemo } from "react";
import { css, cx } from "@emotion/css";
import { format, isBefore, startOfDay } from "date-fns";

export type TimelineUnit = {
	title?: string;
	url?: string;
	img?: string;
	date: string;
};
export type TimelineUnits = TimelineUnit[];

const unit = css`
	display: flex;
	flex-direction: column;
	padding: 2rem 4rem;
	background: rgb(27, 27, 27);
	border: none;
	color: inherit;
	font-size: inherit;
	text-align: inherit;
	font-weight: inherit;
	max-width: 20rem;
	transition: 100ms all;
	text-decoration: none;
	position: relative;

	& > h4 {
		line-height: 1em;
		color: inherit;
	}

	&:hover {
		cursor: pointer;
		color: inherit;
		background: rgb(12, 12, 12);
	}

	&::before {
		content: "";
		width: 3rem;
		height: 3rem;
		border-radius: 100%;
		background: rgb(0, 0, 0);
		position: absolute;
		top: 50%;
		left: 0rem;
		transform: translateX(-50%) translateY(-50%);
	}

	&::after {
		content: "";
		width: 3rem;
		height: 3rem;
		border-radius: 100%;
		background: rgb(0, 0, 0);
		position: absolute;
		top: 50%;
		right: 0rem;
		transform: translateX(50%) translateY(-50%);
	}
`;

const tlcontainer = css`
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	position: relative;
	padding-block-start: 0.5rem;
	padding-block-end: 4rem;

	&::before {
		content: "";
		position: absolute;
		height: 100%;
		width: 2px;
		background: rgb(70, 70, 70) none repeat scroll 0% 0%;
		top: 0;
		left: 2rem;
	}

	&::after {
		content: "";
		position: absolute;
		width: 100%;
		height: 5rem;
		bottom: 0;
		left: 0;
		background: rgb(0, 0, 0);
		background: linear-gradient(
			0deg,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0) 100%
		);
	}
`;

const Unit: React.FC<{ contents: TimelineUnit }> = ({ contents }) => {
	const date = useMemo(() => new Date(contents.date), [contents.date]);

	return (
		<button
			className={cx(
				unit,
				contents.img &&
					css`
						background: url("${contents.img}") center center;
						background-size: 100% auto;
						box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.8);

						&:hover {
							background: url("${contents.img}") center center;
							background-size: 100% auto;
							box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.7);
						}
					`,
			)}
			onClick={() =>
				contents.url
					? window.open(contents.url, "_blank", `noreferrer, noopener`)
					: ""
			}>
			{contents.title ? <h4>{contents.title}</h4> : ""}
			<h3>{format(date, "h:mm a")}</h3>
			<p>{format(date, "do MMM yyyy (eeee)")}</p>
		</button>
	);
};

const Timeline: React.FC<{ contents: TimelineUnits }> = ({ contents }) => {
	const current = useMemo(() => new Date(), []);

	return (
		<div className={tlcontainer}>
			{contents
				.map(unit => ({ ...unit, Date: new Date(unit.date) }))
				.filter(unit => !isBefore(startOfDay(unit.Date), current))
				.map(unit => (
					<Unit key={unit.date} contents={unit} />
				))}
		</div>
	);
};

export default Timeline;
