/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite';

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
});
