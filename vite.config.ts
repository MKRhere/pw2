import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "@svgr/rollup";
import reactJsx from "vite-react-jsx";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 10000,
		hmr: {
			port: 10000,
		},
	},
	plugins: [
		reactJsx(),
		reactRefresh(),
		Object.assign(
			svgr({
				// memo: true,
				// icon: true,
				ref: true,
				svgo: false,
			}),
			{ enforce: "pre" } as const,
		),
	],
});
