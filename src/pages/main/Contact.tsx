import React from "react";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import Container from "../../components/Container";

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
	Twitter: { value: "MKRhere", link: "https://twitter.com/MKRhere" },
	GitHub: { value: "MKRhere", link: "https://github.com/MKRhere" },
	Email: {
		value: "mυthυkυmαr@thεfεαthεrs.in",
		link: "mailto:mυthυkυmαr@thεfεαthεrs.in",
		replacer: {
			υ: "u",
			ε: "e",
			α: "a",
		},
	},
	Phone: {
		value: "+9Ι Γ8Δ5 Γ9 8Δ88",
		link: "tel:+91Γ8Δ5Γ98Δ88",
		replacer: {
			Ι: "1",
			Δ: "4",
			Γ: "7",
		},
	},
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
			end
			next="/"
			className={css`
				min-height: 50vh;
				display: flex;
				flex-direction: column;
			`}>
			<h1>MKRhere</h1>
			<div
				className={css`
					margin-top: auto;
					display: flex;

					ul {
						padding: 0;
						margin-left: 1rem;

						li {
							list-style: none;
						}
					}
				`}>
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
										rel="noreferrer">
										{value.value}
									</a>
								) : (
									value.value
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</Container>
	);
};

export default Home;
