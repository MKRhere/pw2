// @ts-check

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { renderPreviewImg } from "imagen";

const toplevel = (await readdir("public/blog")).filter(x => x !== "assets");

const removeExtn = path => {
	const parts = path.split(".");
	parts.splice(parts.length - 1);
	return parts.join(".");
};

const parseMetadata = (slug, contents) => {
	return Object.fromEntries(
		contents
			.split("---")[1]
			.trim()
			.split("\n")
			.map(line => {
				const [name, value] = line.split(/:(.*)/).map(x => x.trim());
				return [name, value];
			})
			.concat([["slug", slug]]),
	);
};

/**
 * @type {import("./blog.types").Data}
 */
const data = Object.fromEntries(
	await Promise.all(
		toplevel.map(year =>
			readdir("public/blog/" + year).then(slugs =>
				Promise.all(
					slugs.map(async slug => {
						const path = `public/blog/${year}/${slug}`;
						const contents = await readFile(path, "utf-8");
						return parseMetadata(removeExtn(slug), contents);
					}),
				)
					.then(list =>
						list
							.sort(
								(a, b) =>
									new Date(a["featured-img"]).valueOf() -
									new Date(b["featured-img"]).valueOf(),
							)
							.map(x => [x.slug, x]),
					)
					.then(list => Object.fromEntries(list))
					.then(cont => [year, cont]),
			),
		),
	),
);

function rewriteExtn(filename, extn) {
	const split = filename.split(".");
	split[split.length - 1] = extn;
	return split.join(".");
}

/**
 *
 * @param {import("./blog.types").Data} data
 */
export async function generateFeaturedImages(data) {
	for (const year in data) {
		const yearData = data[year];
		for (const slug in yearData) {
			const article = yearData[slug];
			await renderPreviewImg(
				[1920, 1080],
				"public/blog/assets/" + article["featured-img"],
				article.title,
				["MKRhere", article.category, article.published].join(" · "),
				"public/blog/assets/featured/" +
					rewriteExtn(article["featured-img"], "jpg"),
			);
		}
	}
}

writeFile("src/blog.json", JSON.stringify(data, null, "\t"), "utf-8").then(() =>
	console.log("Done"),
);

mkdir("public/blog/assets/featured", { recursive: true }).then(() =>
	generateFeaturedImages(data),
);
