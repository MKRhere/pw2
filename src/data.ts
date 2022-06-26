import json from "./blog.json";

export type Article = {
	"title": string;
	"category": string;
	"snippet": string;
	"slug": string;
	"published": string;
	"featured-img": string;
};

export const blog = json as Record<string, Record<string, Article>>;

export const articles = Object.values(blog)
	.flatMap(year => Object.values(year))
	.sort(
		(a, b) => new Date(b.published).valueOf() - new Date(a.published).valueOf(),
	);

export const nextAndPrev = (
	year: string,
	slug: string,
): [Article | undefined, Article | undefined] => {
	const idx = articles.findIndex(
		article =>
			String(new Date(article.published).getFullYear()) === year &&
			article.slug === slug,
	);

	return [articles[idx - 1], articles[idx + 1]];
};

export const getBlogPath = (article: Article) =>
	`/blog/${new Date(article.published).getFullYear()}/${article.slug}`;
