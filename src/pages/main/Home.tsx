import React, { useContext } from "react";
import FlickerList, { Tooltip } from "../../components/FlickerList.tsx";
import { css, cx } from "@emotion/css";
import { Emoji } from "../../components/Emoji.tsx";
import { AnimateEntry } from "../../components/AnimateEntry.tsx";
import { AppContext } from "../../AppContext.ts";
import { Anchor, Button } from "../../components/ButtonOrAnchor.tsx";

const Home: React.FC = () => {
	const context = useContext(AppContext);

	return (
		<AnimateEntry
			as="main"
			delay={200}
			className={css`
				--gap: 2.2rem;
				display: flex;
				flex-direction: column;
				gap: var(--gap);
			`}>
			<section>
				<h1
					style={{
						// fiddle
						marginLeft: "-0.31rem",
					}}>
					MKRhere
				</h1>
				<FlickerList
					style={{
						// fiddle
						marginTop: "calc(-1rem + var(--gap))",
						marginLeft: "-0.1rem",
						fontSize: "0.9rem",
					}}
					list={[
						{
							text: "Designer",
							description: (
								<>
									Graphic design is my passion <Emoji emoji="nerd" /> I have
									plenty of experience with Figma and Adobe Suite tools
									(especially Photoshop and InDesign)
								</>
							),
						},
						{
							text: "Developer",
							description: (
								<>
									<Emoji emoji="technologist" /> I started developing websites
									in 2015, and in 2017 I joined The Devs Network, catapulting my
									growth as a full-time developer
								</>
							),
						},
						{
							text: "Architect",
							description: (
								<>
									I have a formal degree in architecture! I'm an architect in
									both construction and software <Emoji emoji="2x" />
								</>
							),
						},
					]}
				/>
			</section>

			<article
				className={css`
					/* Makes it look visually consistently spaced, even though it's correctly spaced by gap already */
					margin-top: -0.8rem;
					display: flex;
					flex-wrap: wrap;
					white-space: nowrap;
					gap: 0.5rem;
					background: #ff6600;
					padding: 0.5rem 1rem;
					width: fit-content;
					color: #fff;
					font-weight: 700;
					& a {
						color: #fff;
						font-weight: 500;
						&:hover {
							color: #fff;
							text-decoration: underline;
						}
					}
				`}>
				<p>We made it to HackerNews!</p>
				<Emoji emoji="tada" />
				<Anchor href="https://news.ycombinator.com/item?id=44778898">
					[comments]
				</Anchor>
				<Anchor href="https://comptime.js.org">[project]</Anchor>
			</article>

			<main
				className={css`
					/* fiddle */
					margin-top: calc(-2.4rem + var(--gap));

					display: flex;
					flex-wrap: wrap;
					gap: var(--gap);

					& img {
						image-rendering: pixelated;
						vertical-align: middle;

						&.emoji {
							margin-left: 0.4em;
						}
					}
				`}>
				<img
					src="/assets/mkr-in-pixels.png"
					alt="MKR in pixels"
					style={{
						height: "8rem",
						aspectRatio: "1",
					}}
				/>
				<article
					className={css`
						/* fiddle */
						margin-top: -0.4rem;
						display: flex;
						flex-direction: column;
						gap: 1rem;
					`}>
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 0.2rem;
						`}>
						<p>
							Welcome to the web home of{" "}
							<Tooltip
								description={
									<>
										For legal reasons, my name is <i>Anu Rahul Nandhan</i>, but
										I generally go by my{" "}
										<a
											href="https://en.wiktionary.org/wiki/nom_de_guerre"
											target="_blank"
											rel="noreferrer">
											nom-de-guerre
										</a>{" "}
										Muthu Kumar.
									</>
								}>
								<b>Muthu Kumar</b>.
							</Tooltip>
						</p>
						<p>
							I'm from Chennai, South India
							<Emoji emoji="ind" />
						</p>
					</div>
					{/* <p>
						I'm looking for work!
						<Emoji emoji="tada" baseline />
					</p>
					<div
						className={css`
							display: flex;
							gap: 0.8rem;
							flex-wrap: wrap-reverse;
							margin-top: 0.8rem;

							& > * {
								min-width: fit-content;
							}
						`}>
						<Button
							className={css`
								width: fit-content;
								z-index: 0;

								& a {
									display: flex;
									align-items: center;
									gap: 1rem;
									width: 100%;
									height: 100%;
									min-width: max-content;
								}

								& a:hover {
									color: inherit;
								}
							`}
							ref={setupCursorTracking}>
							<div className="dynamic-gradient" />
							<a href="https://mkr.pw/resume" target="_blank">
								Download my resume
								<Arrow />
							</a>
						</Button>
					</div> */}
					<Button
						className={cx(
							"contact-button",
							css`
								width: fit-content;
								font-weight: 700;
							`,
						)}
						onClick={() => context.contact.set(true)}>
						Let's talk!
					</Button>
				</article>
			</main>
		</AnimateEntry>
	);
};

export default Home;
