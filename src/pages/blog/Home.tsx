import { css, cx } from "@emotion/css";
import React, { useEffect, useState } from "react";
import useLocation from "wouter/use-location";
import { Spacer } from "../../components/Spacer";
import { ArticleSubHeader } from "./components/ArticleSubHeader";
import { BlogPost } from "./components/BlogContent";
import { articles, getBlogPath } from "../../data";
import { ReactComponent as DrawClose } from "../../assets/arrow-thin.svg";
import { useNav } from "../../util";

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
	const [location] = useLocation();
	const navigate = useNav();

	const isArticleOpen = Boolean(location.split("/blog")[1]);
	const [isAsideClosed, setAsideClosed] = useState(isArticleOpen);

	useEffect(() => {
		if (!isArticleOpen) setAsideClosed(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isArticleOpen]);

	useEffect(() => {
		if (!isArticleOpen) return;

		const handler = (e: KeyboardEvent) =>
			e.key === "Escape" && navigate("/blog")(e);

		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isArticleOpen]);

	return (
		<div
			data-home
			key="blog-home"
			className={cx(
				{ "article-open": isArticleOpen, "aside-closed": isAsideClosed },
				css`
					display: flex;
					background: #1a1a1a;
					height: 100%;
					width: 100vw;
					overflow: hidden;
					position: relative;

					@media screen and (max-width: 80rem) {
						div& > .draw-ctl {
							display: none;
						}

						&:not(.article-open) {
							aside {
								min-width: 100vw;
							}
						}
						&:is(.article-open) {
							aside {
								min-width: 0;
								max-width: 0;
							}
						}
					}

					& > aside,
					& > aside .blog-list {
						transition: transform 300ms, min-width 300ms, max-width 300ms;
					}

					&:is(.aside-closed) {
						& aside {
							overflow: hidden;
							min-width: 0;
							max-width: 0;
						}

						& aside .blog-list {
							transform: translateX(-1000%);
						}
					}
				`,
			)}>
			<button
				onClick={() => setAsideClosed(closed => !closed)}
				className={cx(
					"draw-ctl",
					css`
						border: none;
						padding: 1rem;
						padding-block: 10vw;
						display: flex;
						min-width: 3.6rem;
						max-width: 3.6rem;
						transition: background-color 100ms;
						background-color: #151515;
						position: absolute;
						width: 100%;
						height: 100%;
						transition: transform 300ms;
						z-index: 1000;

						&:hover {
							background-color: #0c0c0c;
						}
					`,
					!isArticleOpen &&
						css`
							transform: translateX(-100%);
						`,
				)}>
				<DrawClose
					style={{ width: "2.6rem", height: "1rem" }}
					className={cx(
						css`
							transform: rotate(180deg);
							transition: transform 100ms;
						`,
						{
							[css`
								transform: rotate(0deg);
							`]: isAsideClosed,
						},
					)}
				/>
			</button>
			<aside
				className={css`
					height: 100%;
					width: 100%;
					flex: 2;
					max-width: 45rem;
					overflow-y: auto;
				`}>
				<div
					className={cx(
						"blog-list",
						css`
							width: 100%;
							display: flex;
							flex-direction: column;
							gap: 1rem;
							padding-inline: 8vw;
							padding-block: 9vw;
							min-width: min(30rem, 100vw);

							@media screen and (max-width: 50rem) {
								padding-block-start: 4rem;
								padding-block-end: 6rem;
							}
						`,
					)}>
					<Header />
					<Spacer y={2} />
					{articles.map(article => {
						const { title, snippet } = article;
						const path = getBlogPath(article);

						return (
							<span
								key={path}
								onClick={() => navigate(path)}
								className={css`
									display: flex;
									flex-direction: column;
									gap: 0.25rem;
									padding: 1rem;
									border-radius: 0.5rem;
									transition: background 300ms;

									&:hover {
										background: #111111;
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
							</span>
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
						z-index: 900;
						display: flex;
						position: relative;
						overflow: hidden;

						& > * {
							height: 100%;
							width: 100%;
						}
					`,
				)}>
				<div
					key="blog-content"
					className={cx(
						css`
							background: #111111;
							position: absolute;
							transition: transform 300ms;
							transform: translateX(100%);
							overflow-y: auto;
							overflow-x: hidden;

							display: flex;
							justify-content: center;
						`,
						isArticleOpen &&
							css`
								transform: translateX(0%);
							`,
					)}>
					<div
						className={css`
							height: 100%;
							width: 100%;
							display: flex;
							flex-direction: column;
							padding-inline: 8vw;
							padding-block: 7vw;
							gap: 1.5rem;
							max-width: 60rem;
							height: fit-content;

							@media screen and (max-width: 50rem) {
								padding-block-start: 4rem;
								padding-block-end: 6rem;
							}
						`}>
						{isArticleOpen && <BlogPost />}
					</div>
				</div>
			</article>
		</div>
	);
};

export default BlogHome;
