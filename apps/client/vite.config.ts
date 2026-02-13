import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import path from "path";

export default defineConfig({
  plugins: [devtools(), solidPlugin()],
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
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@rei-design/solid": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        // loadPaths: [path.resolve(__dirname, "./src/styles")],
        includePaths: [path.resolve(__dirname, "./src/styles")],
      },
    },
  },
});
