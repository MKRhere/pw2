import React, { useEffect, useState } from "react";
import useLocation from "wouter/use-location";
import { marked } from "marked";
import { Article, blog, getBlogPath, nextAndPrev } from "../../../data";
import "../../../blog.css";
import { ArticleSubHeader } from "./ArticleSubHeader";
import { css, cx } from "@emotion/css";
import { ReactComponent as Arrow } from "../../../assets/arrow-thin.svg";
import { ReactComponent as Close } from "../../../assets/close.svg";
import { ellipses, rewriteExtn, useNav } from "../../../util";

const Markdown: React.FC<{ content: string }> = ({ content }) => {
	return (
		<div
			className={css`
				& > * {
					width: 100%;
				}

				& img {
					width: 100%;
					padding-block: 1.5rem;
				}

				& blockquote {
					margin-inline: 0;
					padding-inline-start: 1.5rem;
					border-inline-start: 1px solid var(--text-colour);
				}
			`}
			dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
	);
};

const Preview: React.FC<{ article: Article }> = ({ article }) => {
	return (
		<div
			className={cx(
				"preview",
				css`
					background-color: #353535;
					opacity: 0;
					pointer-events: none;
					position: absolute;
					transition: opacity 300ms;
					max-width: 100%;
					bottom: 4rem;
					right: 0;
					border-radius: 0.5rem;
					overflow: hidden;
					width: 13rem;
					display: flex;
					flex-direction: column;

					& * {
						line-height: 1.25em;
					}

					& img {
						max-width: 100%;
					}

					& header {
						padding: 0.6rem 1rem 0.8rem 1rem;
						display: flex;
						flex-direction: column;
						gap: 0.5rem;
					}

					& h3 {
						font-size: 1.2rem;
					}

					& p {
						font-size: 0.9rem;
						color: var(--text-subdued);
					}
				`,
			)}>
			<img src={"/blog/assets/" + article["featured-img"]} alt="Featured" />
			<header>
				<h3>{article.title}</h3>
				<p>{ellipses(article.snippet, 110)}</p>
			</header>
		</div>
	);
};

const btn = css`
	background-color: #535353;
	border: 0;
	cursor: pointer;
	border-radius: 0.5rem;
	padding: 0.5rem 1.4rem;
	color: #c8c8c8;
	font-size: 1.2rem;
	display: flex;
	align-items: center;
	gap: 0.8rem;
	font-weight: 600;
	transition: background-color 150ms;

	&:hover {
		background-color: #414141;
		color: var(--text-colour);
	}

	& svg {
		height: 2rem;
		width: 1.5rem;
	}
`;

export const BlogPost: React.FC = () => {
	const [location, navigate] = useNav();
	const [content, setContent] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const [year, slug] = location.split("/").slice(-2);
	const article = blog[year]?.[slug];

	const [next, prev] = nextAndPrev(year, slug);

	useEffect(() => {
		async function query() {
			setLoading(true);

			const path = getBlogPath(article) + ".md";
			const res = await fetch(path);
			console.log(res.status);
			// not success and not a cached response
			if (res.status > 299 && res.status !== 304) {
				if (res.status > 399) {
					const err = await res.text().catch(() => "Unknown error");
					return setError(err);
				} else return setError("Unexpected redirect");
			}

			const content = await res.text();

			setContent(content.split("---").slice(2).join("---"));
			setLoading(false);
		}

		query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	if (loading) return <div>Loading...</div>;

	if (!article || error) return <div>{error || "Unknown error occurred"}</div>;

	const featured = rewriteExtn(
		"/blog/assets/gen/" + article["featured-img"],
		"",
	);

	return (
		<>
			<Close
				role="button"
				onClick={navigate("/blog")}
				className={css`
					min-height: 1rem;
					min-width: 1rem;
					cursor: pointer;
					align-self: flex-end;
				`}
			/>
			<div
				className={css`
					width: 100%;
					max-height: 25rem;
				`}>
				<picture>
					{[
						[480, "avif", 600],
						[800, "avif"],
						[480, "webp", 600],
						[800, "webp"],
						[480, "jpg", 600],
						[800, "jpg"],
					].map(([size, format, query]) => {
						return (
							<source
								key={`${size}-${format}-${query || ""}`}
								srcSet={`${featured}${size}.${format} ${size}w`}
								type={`image/${format}`}
								{...(query && { media: `(max-width: ${query}px)` })}
							/>
						);
					})}
					<img
						className={css`
							max-width: 100%;
							height: 100%;
							border-radius: 0.5rem;
						`}
						src={featured + "800.jpg"}
						alt="featured"
					/>
				</picture>
			</div>
			<h1
				className={css`
					font-size: 2.2rem;
				`}>
				{article.title}
			</h1>
			<ArticleSubHeader article={article} />
			<Markdown content={content} />
			<div
				className={css`
					display: inline-flex;
					justify-content: flex-end;
					gap: 1rem;
					position: relative;

					& .btn-holder:hover .preview {
						opacity: 100;
						pointer-events: all;
					}
				`}>
				{prev && (
					<span className="btn-holder">
						<Preview article={prev} />
						<button className={btn} onClick={navigate(getBlogPath(prev))}>
							<Arrow
								className={css`
									transform: rotate(180deg);
								`}
							/>
							{!next ? <span>Previous</span> : ""}
						</button>
					</span>
				)}
				{next && (
					<span className="btn-holder">
						<Preview article={next} />
						<button className={btn} onClick={navigate(getBlogPath(next))}>
							<span
								className={css`
									padding-bottom: 0.1em;
								`}>
								Next
							</span>
							<Arrow />
						</button>
					</span>
				)}
			</div>
		</>
	);
};
