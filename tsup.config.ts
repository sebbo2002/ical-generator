import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    entry: [
        'src/lib/index.ts',
        'src/bin/cli.ts',
        'src/bin/start.ts'
    ],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    minify: true
});
