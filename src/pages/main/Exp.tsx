import React, { useEffect, useState } from "react";
import { css } from "@emotion/css";
import Container from "../../components/Container";
import { ExpUnit } from "../../components/Exp/Unit";
import { age, experience } from "./data/experience";

const Exp: React.FC = () => {
	const [active, setActive] = useState(-1);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(-1);
		};

		window.addEventListener("keydown", handler);

		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<Container>
			<h2>
				I’m a {age} year old developer from
				<br />
				Chennai, India.
			</h2>
			<p>
				Here are some places I’ve worked at{" "}
				<span
					className={css`
						color: var(--text-subdued);
					`}>
					(recent first)
				</span>
				:
			</p>
			<div
				className={css`
					width: 100%;
					--item-padding: 1.2rem;
					/* offset padding */
					transform: translateX(calc(var(--item-padding) * -1));

					display: grid;
					grid-template-columns: repeat(auto-fit, 20rem);
					gap: 1rem;

					& > * {
						padding-top: 3rem;
					}
				`}>
				{experience.map((unit, i) => (
					<ExpUnit
						key={i}
						active={i === active}
						{...unit}
						onClick={() => setActive(active === i ? -1 : i)}
					/>
				))}
			</div>
		</Container>
	);
};

export default Exp;
