import React, { forwardRef } from "react";
import { css, cx } from "@emotion/css";
import { intersperse, sleep } from "../util";

// && is a hack to increase specificity, NEVER try to understand this
// if you need to increase specificity just add more &&
// no, actually don't do this, this is a bad practice
// but I'm doing it here because YOLO
// see if I care, I'm a bad person
// psst
// hey
// if you're reading this and you think this is a good idea
// you're a bad person too
// don't do this
// this is bad
//
// are you still reading this?
// why are you still reading this?
// this is a bad idea
// stop reading this
// go do something else
// like, anything else
// literally anything else
// why are you still reading this
// stop
//
// Wait, can you fix this?
// Please?
// I'm sorry
// Please send help
// Send PRs
//
// I hope these comments are removed by the minifier

// prettier-ignore
const opaque = css`&& { opacity: 1 }`;

// prettier-ignore
const halfVisible = css`&&& {opacity: 0.5}`;

// prettier-ignore
const invisible = css`& { opacity: 0 }`;

// prettier-ignore
const opacities = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45].map(each => css`&&& { opacity: ${0.5 + each} }`);

const tripleBlink = async (el: HTMLElement) => {
	const delay = 150;

	await sleep(1000);
	el.classList.add(halfVisible);
	await sleep(delay);
	el.classList.remove(halfVisible);
	await sleep(delay);
	el.classList.add(halfVisible);
	await sleep(delay);
	el.classList.remove(halfVisible);
	await sleep(delay);
	el.classList.add(halfVisible);
	await sleep(delay * 2);
	el.classList.remove(halfVisible);
};

export const Tooltip = forwardRef<
	HTMLButtonElement,
	{
		children: React.ReactNode;
		description: React.ReactNode;
		style?: React.CSSProperties;
	}
>(({ children, description, style }, ref) => {
	return (
		<span
			style={style}
			className={css`
				position: relative;

				&&& button:focus ~ .tooltip,
				&&&:hover .tooltip {
					opacity: 1;
					pointer-events: all;
				}

				&&& button:focus,
				&&&:hover button {
					opacity: 1;
				}
			`}>
			<button
				className={css`
					border-bottom: 1px dashed var(--text-colour);
					background-color: transparent;
					border: none;
					color: inherit;
					position: relative;
					font-size: inherit;
					padding: 0;
				`}
				ref={ref}>
				{children}
			</button>
			<span
				className={cx(
					"tooltip",
					css`
						/* tooltip */
						position: absolute;
						top: 100%;
						left: 50%;
						transform: translateX(-50%);
						opacity: 0;
						transition: opacity 0.2s;
						user-select: none;
						pointer-events: none;
						z-index: 999;

						@media screen and (max-width: 65rem) {
							position: fixed;
							top: unset;
							left: 1rem;
							transform: translateY(2rem);
						}
					`,
				)}>
				<span
					className={css`
						margin: 0.5rem;

						display: block;
						min-width: 20rem;
						width: fit-content;
						max-width: 80vw;
						background: var(--card-tags);
						color: var(--text-colour);
						border-radius: 0.5rem;
						padding: 0.5rem 0.8rem;
						font-size: 0.8rem;
						text-align: left;
						line-height: 1.4;
					`}>
					{description}
				</span>
			</span>
		</span>
	);
});

const FlickerList: React.FC<{
	list: { text: string; description: React.ReactNode }[];
	style?: React.CSSProperties;
}> = ({ list, style }) => {
	return (
		<ul
			style={style}
			className={css`
				display: flex;
				flex-wrap: wrap;
				gap: 0.8rem;
				margin: 0;
				padding: 0;
				list-style: none;

				&:has(:focus) li button:not(:focus),
				&:has(:hover) li button:not(:hover) {
					opacity: 0.5;
				}

				/* any button that has a subsequent button focused, hide its tooltip */
				&&&& li:has(~ li button:focus) .tooltip,
				/* any button that has a previous button focused, hide its tooltip */
				&&&& li:has(button:focus) ~ li .tooltip {
					opacity: 0;
				}
			`}>
			{[
				...intersperse(
					list.map((item, index) => (
						<li
							key={item.text}
							className={css`
								display: inline-block;
							`}>
							<Tooltip
								description={item.description}
								ref={async el => {
									if (!el) return;

									el.classList.add(invisible);

									await sleep(500);
									await sleep(300 * index);
									el.classList.add(opaque);

									await sleep(1000 + Math.random() * 1000);
									tripleBlink(el);

									while (true) {
										await sleep(5000 + Math.random() * 10000);
										const chosen =
											opacities[Math.floor(Math.random() * opacities.length)];
										el.classList.add(chosen);
										await sleep(2000);
										el.classList.remove(chosen);
										tripleBlink(el);
									}
								}}>
								{item.text}
							</Tooltip>
						</li>
					)),
					index => <li key={index}>·</li>,
				),
			]}
		</ul>
	);
};

export default FlickerList;
