import React, { useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import { ExpUnit } from "../../components/Exp/Unit";
import { age, experience } from "./data/experience";
import { offscreenWidth } from "../../components/constants";
import { Tags } from "../../components/Exp/Tags";
import useSearchParams from "../../util/useSearchParams";
import useLocation from "wouter/use-location";
import { AnimateEntry } from "../../components/AnimateEntry";

const exp_route = /^\/experience\/?[^\/]*$/;
const slug_replace = /^\/experience\/?/;

const Exp: React.FC = () => {
	const [location, navigate] = useLocation();
	const tags = useSearchParams("tag");
	const [entryDelay, setEntryDelay] = useState(true);

	useEffect(() => {
		if (tags.size) setEntryDelay(false);
	}, [tags]);

	if (!exp_route.test(location)) {
		navigate("/experience", { replace: true });
		return null;
	}

	const slug = location.replace(slug_replace, "").replace("/", "");

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const slug = window.location.pathname
				.replace(slug_replace, "")
				.replace("/", "");
			if (slug) if (e.key === "Escape") window.history.back();
		};

		window.addEventListener("keydown", handler);

		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<>
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
			<Tags
				tags={["Programming", "Design", "Architecture", "Writing"]}
				selected={tags}
			/>
			<AnimateEntry
				as="section"
				delay={entryDelay ? 150 : 0}
				className={cx(
					css`
						width: 100%;
						--item-padding: 1.2rem;

						display: grid;
						grid-template-columns: repeat(auto-fit, 20rem);
						row-gap: 0.5rem;
						column-gap: 1rem;

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
							active={slug === unit.slug}
							{...unit}
							onClick={() => {
								if (slug === unit.slug) return navigate("/experience");
								if (slug)
									navigate(`/experience/${unit.slug}`, { replace: true });
								else navigate(`/experience/${unit.slug}`);
							}}
						/>
					))}
			</AnimateEntry>
		</>
	);
};

export default Exp;
