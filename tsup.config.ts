import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
    'adapters/vitest': 'adapters/vitest/index.ts',
  },
  format: ['esm'],
  dts: true,
  shims: true,
  clean: true,
});
