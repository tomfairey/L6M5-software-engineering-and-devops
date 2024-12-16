import {defineConfig} from 'vitest/config';
import tsconfigPaths from 'vitest-tsconfig-paths';

// Set the secret pepper to a known value for testing
process.env.SECRET_B64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

export default defineConfig({
	plugins: [tsconfigPaths()],
});
