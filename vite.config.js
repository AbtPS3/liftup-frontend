import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  runtimeCompiler: false,
  build: {
    chunkSizeWarningLimit: 1600,
    // assetsDir: "liftup/assets",
    // publicPath: "./",
  },
  base: "/liftup/",
});
