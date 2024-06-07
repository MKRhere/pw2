import React, { useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import Container from "../../components/Container";
import { ExpUnit } from "../../components/Exp/Unit";
import { age, experience } from "./data/experience";
import { offscreenWidth } from "../../components/constants";
import { Tags } from "../../components/Exp/Tags";
import useSet from "../../util/useSet";

const Exp: React.FC = () => {
	const [active, setActive] = useState(-1);
	const tags = useSet<string>();

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
			<section>
				<Tags
					tags={["Programming", "Design", "Architecture", "Writing"]}
					selected={tags}
				/>
			</section>
			<div
				className={cx(
					css`
						width: 100%;
						--item-padding: 1.2rem;

						display: grid;
						grid-template-columns: repeat(auto-fit, 20rem);
						gap: 1rem;

						@media screen and (min-width: ${offscreenWidth}) {
							transform: translateX(0);
						}

						& > * {
							padding-top: 2.4rem;
						}
					`,
				)}>
				{experience
					.filter(unit => !tags.size || unit.tags.some(tag => tags.has(tag)))
					.map((unit, i) => (
						<ExpUnit
							key={i}
							active={i === active}
							{...unit}
							onClick={() => {
								if (active === i) return setActive(-1);

								setActive(i);
								setTimeout(() => {
									const active = window.document.getElementById("active-story");

									if (!active)
										return console.error("Unexpected missing #active-story");
								}, 300);
							}}
						/>
					))}
			</div>
		</Container>
	);
};

export default Exp;
