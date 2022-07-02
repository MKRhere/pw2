import { css, cx } from "@emotion/css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Spacer } from "../../components/Spacer";
import { ArticleSubHeader } from "./components/ArticleSubHeader";
import { BlogPost } from "./components/BlogContent";
import { articles, getBlogPath } from "../../data";
import { ReactComponent as DrawClose } from "../../assets/draw-close.svg";

const Header: React.FC = () => {
	return (
		<header
			className={css`
				padding-inline: 1rem;
			`}>
			<div>
				<h1
					className={css`
						display: inline-block;
						font-size: 3rem;
						color: #fff;
						position: relative;
						z-index: 100;
						&::before {
							position: absolute;
							content: "";
							background: #d6a700;
							width: 120%;
							height: 50%;
							z-index: -100;
							left: -10%;
							top: 25%;
						}
					`}>
					#MKR
				</h1>
				<p>
					Words from{" "}
					<a
						href="https://mkr.pw"
						className={css`
							font-weight: 700;

							&:hover {
								color: var(--primary-colour);
							}
						`}>
						Muthu Kumar
					</a>
				</p>
			</div>
			<div>
				<p>Designer / Developer / Architect</p>
			</div>
		</header>
	);
};

const BlogHome: React.FC = () => {
	const location = useLocation();

	const isArticleOpen = Boolean(location.pathname.split("/blog")[1]);
	const [isAsideClosed, setAsideClosed] = useState(isArticleOpen);

	useEffect(() => {
		if (!isArticleOpen) setAsideClosed(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isArticleOpen]);

	return (
		<div
			className={cx(
				{ "article-open": isArticleOpen, "aside-closed": isAsideClosed },
				css`
					display: flex;
					background: #1d1d1d;
					height: 100%;
					width: 100vw;
					overflow: hidden;

					@media screen and (max-width: 80rem) {
						div& > .draw-ctl {
							display: none;
						}

						&:not(.article-open) {
							aside {
								min-width: 100vw;
							}
							main {
								max-width: 0;
							}
						}
						&:is(.article-open) {
							aside {
								display: none;
							}
							main {
								max-width: 0;
							}
						}
					}

					&:is(.aside-closed) {
						aside {
							max-width: 0;
						}
					}

					& > aside,
					& > article {
						transition: all 250ms;

						@media screen and (max-width: 50rem) {
							padding-block-start: 4rem;
							padding-block-end: 6rem;
						}
					}

					& > .draw-ctl {
						border: none;
						padding: 1rem;
						padding-block: 10vw;
						display: flex;
						min-width: 3.6rem;
						max-width: 3.6rem;
					}
				`,
			)}>
			{isArticleOpen ? (
				<button
					onClick={() => setAsideClosed(closed => !closed)}
					className={cx(
						"draw-ctl",
						css`
							transition: background-color 100ms;
							background-color: #262626;

							&:hover {
								background-color: #323232;
							}
						`,
					)}>
					<DrawClose
						width="2.6rem"
						className={cx(
							css`
								transition: transform 100ms;
							`,
							{
								[css`
									transform: rotate(180deg);
								`]: isAsideClosed,
							},
						)}
					/>
				</button>
			) : (
				<div className="draw-ctl"></div>
			)}
			<aside
				className={css`
					height: 100%;
					width: 100%;
					flex: 2;
					max-width: 45rem;
				`}>
				<div
					className={css`
						height: 100%;
						width: 100%;
						overflow-y: auto;
						display: flex;
						flex-direction: column;
						gap: 1rem;
						padding: 8vw;
						min-width: 30rem;
					`}>
					<Header />
					<Spacer y={2} />
					{articles.map(article => {
						const { title, snippet } = article;
						const path = getBlogPath(article);

						return (
							<div key={path}>
								<Link
									to={path}
									className={css`
										display: flex;
										flex-direction: column;
										gap: 0.25rem;
										padding: 1rem;
										border-radius: 0.5rem;
										transition: all 300ms;

										&:hover {
											background: #262626;
										}

										& h3 {
											padding: 0;
											font-size: 1.4rem;
										}

										& * {
											line-height: 1.2em;
										}
									`}>
									<h3>{title}</h3>
									<ArticleSubHeader article={article} />
									<Spacer />
									<p>{snippet}</p>
								</Link>
							</div>
						);
					})}
				</div>
			</aside>
			<article
				className={cx(
					{ "article-open": isArticleOpen },
					css`
						height: 100%;
						width: 100%;
						flex: 3;
						z-index: 1000;
					`,
				)}>
				<div
					className={css`
						height: 100%;
						width: 100%;
						overflow-y: auto;
						overflow-x: hidden;
						padding: 8vw;
						background-color: #262626;
						display: flex;
						flex-direction: column;
						gap: 1.5rem;
					`}>
					<Routes>
						<Route path="/" element={<div></div>} />
						<Route path="/*" element={<BlogPost />} />
					</Routes>
				</div>
			</article>
		</div>
	);
};

export default BlogHome;
