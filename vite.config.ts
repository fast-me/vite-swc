/// <reference types="vitest" />
import { UserConfigExport, defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
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
    viteStaticCopy({
      targets: [
        {
          src: 'README.md',
          dest: '.',
        },
        {
          src: 'package.json',
          dest: '.',
        },
      ],
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),

      name: 'vite-swc',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@swc/core'],
    },
  },
};

export default defineConfig(Object.assign(cfg, { test }));
