import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";
import { visualizer as visualiser } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
	server: { port: 10000 },
	plugins: [
		react(),
		Object.assign(svgr({ ref: true, svgo: false }), {
			enforce: "pre",
		} as const),
		visualiser(),
	],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
});
