import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/lib/index.ts', 'src/bin/cli.ts', 'src/bin/start.ts'],
    format: ['esm', 'cjs'],
    minify: true,
    sourcemap: true,
});
