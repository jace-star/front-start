import path from "node:path";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import layouts from "vite-plugin-vue-layouts";
import router from "vue-router/vite";

export default defineConfig({
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:9110",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    router({
      routesFolder: "src/pages",
      routeBlockLang: "yaml",
      exclude: ["**/_components/**"],
      dts: "typed-router.d.ts",
    }),
    layouts(),
    UnoCSS(),
  ],
});
