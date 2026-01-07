import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import path from "path";

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss()],
  server: {
    port: 3007,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@stores": path.resolve(__dirname, "./src/shared/stores"),
      "@services": path.resolve(__dirname, "./src/shared/services"),
      "@types": path.resolve(__dirname, "./src/shared/types"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // loadPaths: [path.resolve(__dirname, "./src/styles")],
        includePaths: [path.resolve(__dirname, "./src/styles")],
      },
    },
  },
});
