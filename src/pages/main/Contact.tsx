import React from "react";
import { css, cx } from "@emotion/css";
import { useEffect, useState } from "react";
import Container from "../../components/Container";
import { setupCursorTracking } from "../../util";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { DraggableButton } from "../../components/DraggableButton";

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

const Home: React.FC = () => {
	const [contact, setContact] = useState<Contact>(CONTACT);

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

		return () => {
			document.removeEventListener("mousemove", deob);
			document.removeEventListener("scroll", deob);
			document.removeEventListener("click", deob);
			document.removeEventListener("touchstart", deob);
		};
	}, []);

	return (
		<Container
			className={css`
				min-height: 50vh;
				display: flex;
				flex-direction: column;
				position: relative;
			`}>
			<h1>MKRhere</h1>
			<DraggableButton
				className={css`
					bottom: 0rem;
					width: 20rem;
					height: auto;
					aspect-ratio: 3 / 2;
					background: var(--card-tags);
					border-radius: 0.5rem;
					transform: rotateZ(5deg);

					position: absolute;
					bottom: 0;
					left: 0;

					display: flex;
					align-items: center;
					justify-content: center;
				`}>
				<Logo width={100} />
			</DraggableButton>
			<DraggableButton
				className={css`
					margin-top: auto;
					display: flex;
					flex-shrink: 1;
					gap: 1rem;
					font-size: 1rem;

					width: fit-content;
					height: fit-content;
					padding: 1rem 2.8em;
					background: var(--card-bg);
					border-radius: 0.5rem;
					transform: rotateZ(-5deg);

					position: absolute;
					bottom: 0;
					left: 0;

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
				`}
				ref={setupCursorTracking}>
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
			</DraggableButton>
		</Container>
	);
};

export default Home;
