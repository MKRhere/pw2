import React from "react";
import { css, cx } from "@emotion/css";
import { intersperse, sleep } from "../util";

// && is used to increase specificity to override global styles

// prettier-ignore
const opaque = css`&& { opacity: 1 }`;

// prettier-ignore
const halfVisible = css`&&& {opacity: 0.5}`;

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

const Flicker: React.FC<{
	children: React.ReactNode;
	index: number;
	description: string;
	style?: React.CSSProperties;
}> = ({ children, index, description, style }) => {
	return (
		<span
			style={style}
			className={css`
				position: relative;

				&&& button:focus ~ .tooltip,
				&&& button:hover ~ .tooltip {
					opacity: 1;
				}

				&&& button:focus,
				&&& button:hover {
					opacity: 1;
				}
			`}>
			<button
				className={css`
					border-bottom: 1px dashed var(--text-colour);
					opacity: 0;
					background-color: transparent;
					border: none;
					color: inherit;
					position: relative;
					font-size: 0.9rem;
				`}
				ref={async el => {
					if (!el) return;

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
				{children}
			</button>
			<span
				className={cx(
					"tooltip",
					css`
						/* tooltip */
						position: absolute;
						top: 150%;
						left: 50%;
						transform: translateX(-50%);
						background: var(--card-tags);
						color: var(--text-colour);
						border-radius: 0.5rem;
						padding: 0.5rem 0.8rem;
						font-size: 0.8rem;
						min-width: 20rem;
						width: fit-content;
						max-width: 80vw;
						opacity: 0;
						transition: opacity 0.2s;
						user-select: none;
						text-align: left;
						pointer-events: none;

						@media screen and (max-width: 65rem) {
							position: fixed;
							top: unset;
							left: 1rem;
							transform: translateY(2rem);
						}
					`,
				)}>
				{description}
			</span>
		</span>
	);
};

const FlickerList: React.FC<{
	list: { text: string; description: string }[];
	style?: React.CSSProperties;
}> = ({ list, style }) => {
	return (
		<ul
			style={style}
			className={css`
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
				margin: 0;
				padding: 0;
				list-style: none;

				&:has(> li button:focus) li button:not(:focus),
				&:has(> li button:hover) li button:not(:hover) {
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
							<Flicker index={index} description={item.description}>
								{item.text}
							</Flicker>
						</li>
					)),
					index => <li key={index}>·</li>,
				),
			]}
		</ul>
	);
};

export default FlickerList;
