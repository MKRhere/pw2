import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "@svgr/rollup";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 12000,
		hmr: {
			port: 12000,
		},
	},
	plugins: [
		reactRefresh(),
		Object.assign(
			svgr({
				ref: true,
				svgo: false,
			}),
			{ enforce: "pre" } as const,
		),
	],
});
