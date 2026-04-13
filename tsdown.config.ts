import { defineConfig } from 'tsdown';

export default defineConfig({
    dts: true,
    entry: ['src/lib/index.ts', 'src/bin/cli.ts', 'src/bin/start.ts'],
    format: ['esm', 'cjs'],
    minify: true,
    sourcemap: true,
});
