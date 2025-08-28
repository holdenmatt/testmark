import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/cli.ts", "src/adapters/vitest.ts"],
	format: ["esm"],
	dts: true,
	shims: true,
	clean: true,
});
