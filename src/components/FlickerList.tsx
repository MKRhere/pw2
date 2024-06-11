import React from "react";
import { css, cx } from "@emotion/css";
import { intersperse, sleep } from "../util";

const tripleBlink = async (el: HTMLElement) => {
	const delay = 150;

	await sleep(1000);
	el.style.opacity = "0.5";
	await sleep(delay);
	el.style.opacity = "1";
	await sleep(delay);
	el.style.opacity = "0.5";
	await sleep(delay);
	el.style.opacity = "1";
	await sleep(delay);
	el.style.opacity = "0.5";
	await sleep(delay * 2);
	el.style.opacity = "1";
};

const Flicker: React.FC<{
	children: React.ReactNode;
	index: number;
	description: string;
}> = ({ children, index, description }) => {
	return (
		<span
			className={css`
				position: relative;

				& button:focus ~ .tooltip,
				& button:hover ~ .tooltip {
					opacity: 1;
				}

				& button:focus,
				& button:hover {
					opacity: 1 !important;
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
					el.style.opacity = "1";

					await sleep(1000 + Math.random() * 1000);
					tripleBlink(el);

					while (true) {
						await sleep(5000 + Math.random() * 10000);
						el.style.opacity = String(0.5 + Math.random() * 0.5);
						await sleep(2000);
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
}> = ({ list }) => {
	return (
		<ul
			className={css`
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
				margin: 0;
				padding: 0;
				list-style: none;

				&:has(> li > span > button:focus) li > span > button:not(:focus),
				&:has(> li > span > button:hover) li > span > button:not(:hover)
					/*  */ {
					opacity: 0.5 !important;
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
