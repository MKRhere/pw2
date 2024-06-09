import React from "react";
import { css, cx } from "@emotion/css";
import { Story } from "./Story";
import { Experience } from "./types";
import { Content } from "./Content";
import { offscreenWidth } from "../constants";

const expUnit = css`
	--final-height: 24rem;
	--unit-height: 9rem;
	--story-height: calc(var(--final-height) - var(--unit-height));
	--transition-time: 200ms;

	& > * {
		line-height: 1em;
		font-size: 1rem;
	}

	& > button {
		border: 1px solid transparent;
		transition: all calc(var(--transition-time) * 2);
	}

	&.active > button {
		background-color: var(--card-active);
		border: 1px solid var(--card-active-border);
		box-shadow: 0 0 50rem 0 rgba(190, 190, 190, 0.5);
		z-index: 800;

		& .year,
		& h5 {
			color: var(--text-colour);
		}
	}

	margin-block-end: 0.5rem;

	/* -- Animation stuff -- */

	height: var(--unit-height);
	transition: height var(--transition-time) ease-in-out;

	& .story {
		opacity: 0;
		transition: all calc(var(--transition-time)) ease-in-out;
		transition-delay: 0ms;
	}

	&.active {
		transition-delay: 0ms;

		.timeline-circle {
			background: #ffffff;
		}

		.story {
			transition-delay: var(--transition-time);
			opacity: 1;
		}

		@media screen and (min-width: ${offscreenWidth}) {
			transition-delay: var(--transition-time);
			height: var(--final-height);
		}

		@media screen and (max-width: ${offscreenWidth}) {
			.story {
				transition-delay: 0ms;
				position: fixed;
				inset: 0;
				top: 10rem;
			}
		}
	}

	/* -- */
`;

export const ExpUnit = (props: Experience) => {
	const { active } = props;
	return (
		<div className={cx(expUnit, { active })}>
			<Content {...props} />
			<Story {...props} />
		</div>
	);
};
