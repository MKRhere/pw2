import { css, cx } from "@emotion/css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Spacer } from "../../components/Spacer";
import { ArticleSubHeader } from "./components/ArticleSubHeader";
import { BlogPost } from "./components/BlogContent";
import { articles, getBlogPath } from "../../data";

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
	const [isAsideClosed, setAsideClosed] = useState(false);

	useEffect(() => {
		if (isArticleOpen) setAsideClosed(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
						&:not(.article-open) {
							aside {
								min-width: 100vw;
							}
							main {
								display: none;
							}
						}
						&:is(.article-open) {
							aside {
								display: none;
							}
							main {
								min-width: 100vw;
							}
						}
					}

					&:is(.aside-closed) {
						aside {
							display: none;
						}
					}

					& > aside,
					& > article {
						@media screen and (max-width: 50rem) {
							padding-block-start: 4rem;
							padding-block-end: 6rem;
						}
					}
				`,
			)}>
			<aside
				className={css`
					height: 100%;
					width: 100%;
					overflow-y: auto;
					flex: 2;
					display: flex;
					flex-direction: column;
					gap: 1rem;
					padding: 8vw;
					max-width: 45rem;
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
			</aside>
			<article
				className={cx(
					{ "article-open": isArticleOpen },
					css`
						height: 100%;
						width: 100%;
						overflow-y: auto;
						overflow-x: hidden;
						padding: 8vw;
						background-color: #262626;
						flex: 3;
						display: flex;
						flex-direction: column;
						gap: 1.5rem;
					`,
				)}>
				<Routes>
					<Route path="/" element={<div></div>} />
					<Route path="/*" element={<BlogPost />} />
				</Routes>
			</article>
		</div>
	);
};

export default BlogHome;
