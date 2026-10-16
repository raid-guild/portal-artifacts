import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  base: '/puddle-study/',
  server: {proxy: process.env.PUDDLE_COMMUNITY_API_TARGET?{
    '/leaderboard-api': {target:process.env.PUDDLE_COMMUNITY_API_TARGET,changeOrigin:true},
  }:{}},
  build: {
    target: 'esnext',
    outDir: '../../public/puddle-study',
    emptyOutDir: true,
    rollupOptions: {input: {
      game: fileURLToPath(new URL('./index.html',import.meta.url)),
      editor: fileURLToPath(new URL('./editor.html',import.meta.url)),
      music: fileURLToPath(new URL('./music-source/index.html',import.meta.url)),
    }},
  },
});
