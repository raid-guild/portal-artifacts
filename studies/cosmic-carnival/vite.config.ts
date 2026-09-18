import { defineConfig } from "vite";

export default defineConfig({
  base: "/cosmic-carnival/",
  build: {
    outDir: "../../public/cosmic-carnival",
    emptyOutDir: true,
    sourcemap: true,
  },
});
