import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 12000,
	},
	plugins: [react(), Object.assign(svgr({ ref: true, svgo: false }), { enforce: "pre" } as const)],
});
