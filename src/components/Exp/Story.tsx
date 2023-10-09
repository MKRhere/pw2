import React from "react";
import { css, cx } from "@emotion/css";
import { Experience } from "./types";

const story = css`
	position: absolute;
	left: 0;
	width: 100%;
	border-radius: 0.5rem;
	display: flex;

	overflow: hidden;

	& .contents {
		padding: 1.5rem;
		line-height: 1.25rem;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 2rem;
		margin-block-start: 1rem;
		height: var(--story-height);

		& ul {
			max-height: 100%;
			margin: 0;
			column-count: 3;
			column-gap: 2rem;
			color: var(--text-subdued);
			font-weight: 400;

			& li + li {
				margin-block-start: 0.5rem;
			}

			& li::marker {
				content: "";
				font-weight: 800;
				padding-top: 1rem;
			}
		}
	}
`;

export const Story = ({ description, logo }: Experience) => {
	return (
		<div className={cx(story, "story")}>
			<div className="contents">
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
				<ul>{description}</ul>
			</div>
		</div>
	);
};
