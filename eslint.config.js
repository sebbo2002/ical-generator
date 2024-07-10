import eslint from '@eslint/js';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
    {
        files: [
            'test/**/*.ts'
        ],
        rules: {
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/ban-ts-comment': 'off'
        }
    },
    {
        rules: {
            semi: 'error',
            quotes: [
                'error',
                'single'
            ],
            indent: [
                'error',
                4
            ],
            'jsonc/sort-keys': 'error'
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es6,
                ...globals.mocha
            }
        }
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'docs/**',
            'package-lock.json',
            '.nyc_output/**'
        ]
    }
];
