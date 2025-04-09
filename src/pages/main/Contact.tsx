import React from "react";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { setupCursorTracking } from "../../util/index.ts";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { Flippable } from "../../components/Flippable.tsx";
import { AnimateEntry } from "../../components/AnimateEntry.tsx";
import { Draggable } from "../../draggable.attempts/6/Draggable2.tsx";

const A = css`
	text-decoration: none;
`;

type Contact = {
	[k: string]: {
		value: string;
		link?: string;
		replacer?: Record<string, string>;
	};
};

const CONTACT: Contact = {
	"Email": {
		value: "һі@mκr.рw",
		link: "mailto:һі@mκr.рw",
		replacer: {
			һ: "h",
			і: "i",
			κ: "k",
			р: "p",
		},
	},
	"GitHub": { value: "MKRhere", link: "https://github.com/MKRhere" },
	"Twitter/𝕏": { value: "MKRhere", link: "https://twitter.com/MKRhere" },
	"Phone": {
		value: "+9Ι Γ8Δ5 Γ9 8Δ88",
		link: "tel:+91Γ8Δ5Γ98Δ88",
		replacer: {
			Ι: "1",
			Δ: "4",
			Γ: "7",
		},
	},
	"Blog": { value: "→", link: "https://MKRhere.com" },
};

const CARD_COUNT = 5;
// slightly random rotations within -20 to 20 degrees
const CARD_ROTATION_VARIANCE = 20 * (Math.PI / 180);

const contactCards = Array.from({ length: CARD_COUNT }, () => {
	const rotation =
		Math.random() * CARD_ROTATION_VARIANCE - CARD_ROTATION_VARIANCE / 2;
	return rotation;
});

const Contact: React.FC = () => {
	const [contact, setContact] = useState<Contact>(CONTACT);
	const [visible, setVisible] = useState(contactCards.length);

	useEffect(() => {
		const deob = () => {
			Object.keys(contact).forEach(key => {
				const sect = contact[key];
				const replacers = sect.replacer;
				if (replacers) {
					sect.value = sect.value.replace(
						new RegExp(Object.keys(replacers).join("|"), "g"),
						r => replacers[r] || r,
					);
					if (sect.link)
						sect.link = sect.link.replace(
							new RegExp(Object.keys(replacers).join("|"), "g"),
							r => replacers[r] || r,
						);
				}
			});

			setContact({ ...contact });
		};

		document.addEventListener("mousemove", deob, { once: true });
		document.addEventListener("scroll", deob, { once: true });
		document.addEventListener("click", deob, { once: true });
		document.addEventListener("touchstart", deob, { once: true });
		document.addEventListener("keydown", deob, { once: true });

		return () => {
			document.removeEventListener("mousemove", deob);
			document.removeEventListener("scroll", deob);
			document.removeEventListener("click", deob);
			document.removeEventListener("touchstart", deob);
			document.removeEventListener("keydown", deob);
		};
	}, []);

	return (
		<>
			<h1>MKRhere</h1>
			{visible < 1 && (
				<AnimateEntry as="article" delay={500}>
					<p>Great. You've distributed all the cards!</p>
					<p>What now?</p>
					<br />
					<a href="/">Start over?</a>
				</AnimateEntry>
			)}
			<AnimateEntry
				as="main"
				delay={200}
				className={css`
					width: 100%;
					min-height: max(40vh, 11rem);
					height: 100%;
					position: relative;
				`}>
				{contactCards.map((rot, i) => (
					<Draggable
						key={i}
						onPageExit={() => setVisible(v => v - 1)}
						onPageEnter={() => setVisible(v => v + 1)}
						initialRotation={rot}
						className={css`
							width: 21rem;
							height: 13rem;
							font-size: 1rem;

							@media screen and (max-width: 40rem) {
								width: 18rem;
								height: 11rem;
								font-size: 0.85rem;
							}

							position: absolute;
							bottom: 0;
							left: 0;

							padding: 0;
							background: transparent;
						`}
						ref={setupCursorTracking}>
						<Flippable
							defaultFlipped={i !== contactCards.length - 1}
							front={
								<main
									className={css`
										height: 100%;
										width: 100%;

										overflow: hidden;
										border-radius: 0.5rem;
										background: var(--card-bg);

										box-shadow: 0 0 6rem 0 rgba(0, 0, 0, 0.7);

										display: flex;
										align-items: center;
										justify-content: center;
										gap: 1rem;
										font-size: inherit;

										padding: 1rem 2.8em;

										ul {
											padding: 0;
											display: flex;
											flex-direction: column;
											gap: 0.5rem;
											max-width: 50vw;

											li {
												list-style: none;
												min-width: 4rem;
												max-width: 100%;
											}

											li a {
												display: block;
												max-width: 100%;
												white-space: nowrap;
												text-overflow: ellipsis;
												overflow: hidden;
											}

											/* Blog entry */
											li:last-child {
												margin-block-start: 1rem;
											}
										}
									`}>
									<div className="dynamic-gradient" />
									<ul
										className={css`
											text-align: right;
										`}>
										{Object.keys(contact).map(key => (
											<li key={key}>
												<b>{key}.</b>
											</li>
										))}
									</ul>
									<ul>
										{Object.keys(contact).map(key => {
											const value = contact[key];

											return (
												<li key={key}>
													{value.link ? (
														<a
															className={A}
															href={value.link}
															target="_blank"
															rel="noreferrer"
															style={{ width: "fit-content" }}>
															{value.value}
														</a>
													) : (
														value.value
													)}
												</li>
											);
										})}
									</ul>
								</main>
							}
							back={
								<main
									className={css`
										width: 100%;
										height: 100%;

										overflow: hidden;
										border-radius: 0.5rem;
										background: var(--card-active);
										border: 1px solid var(--card-active-border);

										display: flex;
										align-items: center;
										justify-content: center;
									`}>
									<Logo width={100} />
								</main>
							}
						/>
					</Draggable>
				))}
			</AnimateEntry>
		</>
	);
};

export default Contact;
