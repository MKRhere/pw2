import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";

// https://vitejs.dev/config/
export default defineConfig({
	server: { port: 3000 },
	plugins: [react(), Object.assign(svgr({ ref: true, svgo: false }), { enforce: "pre" } as const)],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				blog: resolve(__dirname, "blog.html"),
			},
		},
	},
});
