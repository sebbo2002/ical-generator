import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
    eslintConfigPrettier,
    perfectionist.configs['recommended-natural'],
    {
        files: ['test/**/*.ts'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/ban-ts-ignore': 'off',
        },
    },
    {
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
                ...globals.es6,
                ...globals.mocha,
            },
            sourceType: 'module',
        },
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'docs/**',
            'package-lock.json',
            '.nyc_output/**',
        ],
    },
];
