/// <reference types="vitest/config" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), legacy()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
		server: {
			deps: {
				inline: ["vitest-canvas-mock"],
			},
		},

		// For this config, check https://github.com/vitest-dev/vitest/issues/740
		threads: false,
		environmentOptions: {
			jsdom: {
				resources: "usable",
			},
		},
	},
});
