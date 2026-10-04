import { defineConfig } from 'vite';
export default defineConfig({ base: '/raid-survivor/', build: { outDir: '../../public/raid-survivor', emptyOutDir: true, rollupOptions:{input:{game:'index.html',music:'realm-music.html'}} } });
