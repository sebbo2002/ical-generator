import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    entry: [
        'src/index.ts'
    ],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    minify: true
});
