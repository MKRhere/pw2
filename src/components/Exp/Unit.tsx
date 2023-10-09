import React from "react";
import { css, cx } from "@emotion/css";
import { Story } from "./Story";
import { Experience } from "./types";
import { Content } from "./Content";

const expUnit = css`
	--final-height: 20rem;
	--unit-height: 9rem;
	--story-height: calc(var(--final-height) - var(--unit-height));
	--transition-time: 300ms;

	& > * {
		line-height: 1em;
		font-size: 1rem;
	}

	& button {
		border: 1px solid transparent;
		transition: all calc(var(--transition-time) * 2);
	}

	&.active button {
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
		transition: opacity var(--transition-time) ease-in-out;
		transition-delay: 0;
	}

	&.active {
		height: var(--final-height);
		transition-delay: 0;
		transition-delay: var(--transition-time);

		.story {
			opacity: 1;
			transition: opacity calc(var(--transition-time) * 2) ease-in-out;
			transition-delay: var(--transition-time);
		}
	}

	/* -- */
`;

export const ExpUnit = (props: Experience) => {
	return (
		<div className={cx(expUnit, { active: props.active })}>
			<Content {...props} />
			<Story {...props} />
		</div>
	);
};
