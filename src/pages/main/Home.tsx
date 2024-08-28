import React from "react";
import Container from "../../components/Container";
import FlickerList from "../../components/FlickerList";
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
		<Container
			className={css`
				--distance: 2rem;
			`}>
			<section
				style={{
					// fiddle
					marginLeft: "-0.3rem",
				}}>
				<h1>MKRhere</h1>
				<FlickerList
					style={{
						// fiddle
						marginTop: "calc(-1.7rem - 2px + var(--distance))",
					}}
					list={[
						{
							text: "Designer",
							description:
								"Graphic design is my passion 🤓 I have plenty of experience with Figma and Adobe Suite tools (especially Photoshop and InDesign)",
						},
						{
							text: "Developer",
							description:
								"🧑🏻‍💻 I started developing websites in 2015, and in 2017 I joined The Devs Network, catapulting my growth as a full-time developer",
						},
						{
							text: "Architect",
							description:
								"I have a formal degree in architecture! I'm an architect in both construction and software 😉",
						},
					]}
				/>
			</section>
			<main
				className={css`
					/* fiddle */
					margin-top: calc(-2.2rem + var(--distance));

					display: flex;
					flex-wrap: wrap;
					gap: var(--distance);
				`}>
				<img
					src="/assets/mkr-in-pixels.png"
					alt="MKR in pixels"
					style={{
						imageRendering: "pixelated",
						height: "8rem",
						aspectRatio: "1",
					}}
				/>
				<article
					style={{
						// fiddle
						marginTop: "-0.4rem",
					}}>
					<section
						className={cx(
							section,
							css`
								gap: 0.2rem;
							`,
						)}>
						<p>
							Welcome to the web home of <b>Anu Rahul Nandhan.</b>
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
				</article>
			</main>
		</Container>
	);
};

export default Home;
