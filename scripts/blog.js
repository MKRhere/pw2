import { readdir, readFile, writeFile } from "node:fs/promises";

const toplevel = (await readdir("blog")).filter(x => x !== "assets");

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
							.sort((a, b) => new Date(a).valueOf() - new Date(b).valueOf())
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
