import { css } from "emotion";
import { useEffect, useState } from "react";
import Container from "../components/Container";

const A = css`
	text-decoration: none;
`;

function Home() {
	const [contact, setContact] = useState({
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
	});

	useEffect(() => {
		const deob = () => {
			Object.keys(contact).forEach(key => {
				const replacers = contact[key].replacer;
				if (replacers) {
					contact[key].value = contact[key].value.replace(
						new RegExp(Object.keys(replacers).join("|"), "g"),
						r => replacers[r] || r,
					);
					if (contact[key].link)
						contact[key].link = contact[key].link.replace(
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
			next="/"
			arrowReversed={true}
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
									<a className={A} href={value.link} target="_blank" rel="noreferrer">
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
}

export default Home;
