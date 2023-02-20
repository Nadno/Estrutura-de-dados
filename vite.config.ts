/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite';

import tsConfig from './tsconfig.json';

import { parseAliasesFromTsConfig } from './utils/parseAliasesFromTsConfig';

export default defineConfig({
  test: {
    include: ['./src/__tests__/**/*.{test,spec}.ts'],
  },
  build: {
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src', 'main.ts'),
      name: 'ds',
      fileName: 'data-structures',
    },
  },
  resolve: {
    alias: {
      ...parseAliasesFromTsConfig(tsConfig.compilerOptions.paths),
    },
  },
});
