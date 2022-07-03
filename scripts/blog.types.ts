export type Article = {
	"title": string;
	"category": string;
	"snippet": string;
	"slug": string;
	"published": string;
	"featured-img": string;
};

export type Data = Record<string, Record<string, Article>>;
