import React, { useEffect, useRef } from "react";
import { css, cx } from "@emotion/css";
import { ReactComponent as Close } from "../../assets/close.svg";
import { Experience } from "./types";
import { offscreenWidth } from "../constants";

const story = css`
	position: absolute;
	left: 0;
	width: 100%;
	border-radius: 0.5rem;
	display: flex;

	& * {
		line-height: 140%;
	}

	& .story-content {
		& > div {
			max-height: 100%;
			margin: 0;
			column-count: 3;
			column-gap: 2.5rem;
			color: var(--text-subdued);
			font-weight: 400;

			& p {
				font-size: 0.9rem;
			}

			& > p + p {
				margin-block-start: 1.4em;
			}
		}
	}

	/* desktop & tablet */
	@media screen and (min-width: ${offscreenWidth}) {
		/* offset padding */
		transform: translateX(calc(var(--item-padding) * -1));

		& .story-handle {
			display: none;
		}

		& .story-content {
			padding: 1.5rem;
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			gap: 3rem;
			margin-block-start: 1rem;
			height: var(--story-height);
		}
	}

	/* mobile */
	@media screen and (max-width: ${offscreenWidth}) {
		position: fixed;
		display: flex;
		justify-content: center;
		height: calc(100vh - 10rem);
		width: 100vw;
		left: 0;
		z-index: 900;
		font-size: 1.25rem;
		background: var(--bg-colour);
		border-inline: 1px solid var(--offscreen-handle);
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;

		/*
			Push this offscreen element out of screen;
			Unit.ts will pull it up when .active
		*/
		top: 100vh;

		& .story-handle {
			content: "";
			width: 100%;
			height: 1rem;
			background-color: var(--offscreen-handle);
			position: absolute;
			top: 0;
			left: 0;

			&::before {
				/* TODO: keep until we implement drag */
				display: none;

				content: "";
				position: absolute;
				width: 2rem;
				height: 0.2rem;
				background-color: var(--offscreen-handle-tab);
				z-index: 900;
				inset: 0;
				top: 0;
				margin: auto;
			}
		}

		& .story-content {
			--padding: 12vw;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			/* height: 100%; */
			max-width: 40rem;

			margin-block: calc(var(--padding) + 1rem);
			overflow-x: hidden;
			overflow-y: auto;
			overscroll-behavior: contain;

			& > img {
				margin-inline: var(--padding);
				/* align-self: center; */
			}

			& > div {
				column-count: unset;
				padding-inline: var(--padding);
				padding-block-end: 4rem;
				height: 100%;
				overflow-y: auto;

				& p {
					font-size: 1rem;
				}
			}

			& > .closer {
				display: flex;
			}
		}
	}
`;

const story_logo = css`
	height: 4rem;
	width: 4rem;
	margin-inline-start: var(--padding);

	background: rgba(40, 40, 40);
	border-radius: 100%;

	& img {
		height: 100%;
		border-radius: 100%;
	}
`;

const closer = css`
	display: none;
	appearance: none;
	border: none;
	background: var(--card-active);
	color: var(--text-subdued);
	width: 1.8rem;
	height: 1.8rem;
	padding: 0.2rem;
	border-radius: 3rem;

	& svg {
		width: 0.8rem;
		height: 0.8rem;
	}

	/* set in mobile mode */
	/* display: flex; */
	justify-content: center;
	align-items: center;

	position: absolute;
	top: calc(1rem + var(--padding));
	right: var(--padding);
	cursor: pointer;

	transform: rotate(90deg);
`;

export const Story = ({ title, description, logo, active }: Experience) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (active)
			setTimeout(() => ref.current?.scrollIntoView({ block: "end" }), 300);
	}, [active]);

	return (
		<div
			ref={ref}
			className={cx(story, "story")}
			id={active ? "active-story" : undefined}>
			<div aria-hidden className="story-handle" />
			<div className="story-content">
				<picture className={cx("story-logo", story_logo)}>
					<source srcSet={`/assets/logos/` + logo + ".avif"} />
					<img alt={title + " logo"} src={`/assets/logos/` + logo + ".png"} />
				</picture>
				<button
					title="Close story"
					className={cx("closer", closer)}
					onClick={() => window.history.back()}>
					<Close />
				</button>
				<div>{description}</div>
			</div>
		</div>
	);
};
