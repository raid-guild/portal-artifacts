import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/chance-pint/',
  build: { outDir: resolve(import.meta.dirname, '../../public/chance-pint'), emptyOutDir: true },
});
