/// <reference types="vitest" />
import { resolve } from 'path';
import { UserConfigExport, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { InlineConfig } from 'vitest';

const test: InlineConfig = {
  globals: true,
  cache: {
    dir: '.vitest',
  },
  environment: 'node',
  include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
};

const cfg: UserConfigExport = {
  cacheDir: '.vite',

  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: __dirname + '/tsconfig.lib.json',
      skipDiagnostics: true,
    }),
  ],

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),

      name: 'vite-swc',
      fileName: 'index',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['@swc/core'],
    },
  },
};

export default defineConfig(Object.assign(cfg, { test }));
