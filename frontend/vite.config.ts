/// <reference types="vitest/config" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export const configObject = {
	resolve: {
		alias: {
			"@/": path.resolve(__dirname, "./"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@context": path.resolve(__dirname, "./src/context"),
			"@modules": path.resolve(__dirname, "./src/modules"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@types": path.resolve(__dirname, "./src/types"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:5174",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
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
};

// https://vitejs.dev/config/
export default defineConfig(configObject);
