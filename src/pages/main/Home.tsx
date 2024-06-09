import React from "react";
import Container from "../../components/Container";
import Dashed from "../../components/Dashed";
import { ReactComponent as Arrow } from "../../assets/arrow-thin.svg";
import { css, cx } from "@emotion/css";
import { setupCursorTracking } from "../../util";

const section = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	justify-content: center;
`;

const Home: React.FC = () => {
	return (
		<Container>
			<h1>MKRhere</h1>
			<section
				className={cx(
					section,
					css`
						gap: 0.2rem;
					`,
				)}>
				<p>
					Welcome to the web home of <Dashed>designer</Dashed>,{" "}
					<Dashed>developer</Dashed>, and <Dashed>architect</Dashed>{" "}
					<b>Anu Rahul Nandhan.</b>
				</p>
				<p>
					I'm also commonly known as <b>Muthu Kumar</b>.
				</p>
			</section>
			<section className={section}>
				<p>I'm looking for work! 🎉</p>
				<button
					className={css`
						background: var(--card-tags);
						border: 0;
						border-radius: 0.5rem;
						width: fit-content;
						color: var(--text-colour);
						cursor: pointer;
						font-size: 1rem;

						position: relative;
						z-index: 0;

						& a {
							display: flex;
							align-items: center;
							gap: 1rem;
							padding: 1rem 2rem;
						}

						& a:hover {
							color: inherit;
						}
					`}
					ref={setupCursorTracking}>
					<div className="dynamic-gradient" />
					<a href="https://mkr.pw/resume" target="_blank">
						Download Resume
						<Arrow />
					</a>
				</button>
			</section>
		</Container>
	);
};

export default Home;
