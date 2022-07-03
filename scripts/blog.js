// @ts-check

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { renderPreviewImg } from "imagen";
import GM from "gm";

function rewriteExtn(filename, extn) {
	const split = filename.split(".");
	split[split.length - 1] = extn;
	return split.join(".");
}

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

writeFile("src/blog.json", JSON.stringify(data, null, "\t"), "utf-8").then(() =>
	console.log("Done"),
);

/**
 *
 * @param {import("./blog.types").Data} data
 */
async function generateFeaturedImages(data) {
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

mkdir("public/blog/assets/featured", { recursive: true }).then(() =>
	generateFeaturedImages(data),
);

const convert = (gm, img, size, fmt) =>
	new Promise((resolve, reject) =>
		gm("public/blog/assets/" + img)
			.resize(size)
			.noProfile()
			.write(
				"public/blog/assets/gen/" + rewriteExtn(img, size + "." + fmt),
				err => {
					if (err) return reject(err);
					else resolve(true);
				},
			),
	);

async function generateOptimisedImages() {
	await mkdir("public/blog/assets/gen/", { recursive: true });

	const imgs = await readdir("public/blog/assets");
	for (const img of imgs) {
		if (!(await stat("public/blog/assets/" + img)).isFile()) continue;
		const gm = GM.subClass({ imageMagick: true });
		for (const size of [480, 800])
			for (const fmt of ["jpg", "webp", "avif"])
				await convert(gm, img, size, fmt);
	}
}

generateOptimisedImages();
