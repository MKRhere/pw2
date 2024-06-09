import React from "react";
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
			display: flex;
			flex-direction: column;
			gap: 3rem;
			/* height: 100%; */
			max-width: 40rem;

			margin-block: 4rem;
			overflow-x: hidden;
			overflow-y: auto;
			overscroll-behavior: contain;

			& > img {
				margin-inline: 4rem;
			}

			& > div {
				column-count: unset;
				padding-inline: 4rem;
				padding-block-end: 3rem;
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

export const Story = ({ description, logo, active }: Experience) => {
	return (
		<div
			className={cx(story, "story")}
			id={active ? "active-story" : undefined}>
			<div aria-hidden className="story-handle" />
			<div className="story-content">
				<img
					src={`/assets/logos/` + logo}
					className={cx(
						"story-logo",
						css`
							height: 4rem;
							width: 4rem;

							background: rgba(40, 40, 40);
							border-radius: 100%;
						`,
					)}
				/>
				<button
					className={cx(
						"closer",
						css`
							display: none;
							appearance: none;
							border: none;
							background: var(--card-active);
							color: var(--text-subdued);
							width: 3rem;
							height: 3rem;
							border-radius: 3rem;

							/* set in mobile mode */
							/* display: flex; */
							justify-content: center;
							align-items: center;

							position: absolute;
							top: 4rem;
							right: 4rem;
							cursor: pointer;

							transform: rotate(90deg);
						`,
					)}
					onClick={() => window.history.back()}>
					<Close />
				</button>
				<div>{description}</div>
			</div>
		</div>
	);
};
