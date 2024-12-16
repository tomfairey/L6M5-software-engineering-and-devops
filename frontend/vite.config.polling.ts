/// <reference types="vitest/config" />

import { defineConfig, type UserConfig } from "vite";
import { configObject } from "./vite.config";

const extendedConfig: UserConfig = configObject;

extendedConfig.server = extendedConfig?.server || {};
extendedConfig.server.watch = extendedConfig.server?.watch || {};
extendedConfig.server.watch.usePolling = true;

// https://vitejs.dev/config/
export default defineConfig(extendedConfig);
