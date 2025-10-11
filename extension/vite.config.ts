import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-manifest",
      closeBundle() {
        copyFileSync("public/manifest.json", "dist/manifest.json");
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        injectWidget: resolve(__dirname, "src/content/injectWidget.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") return "background/[name].js";
          if (chunkInfo.name === "injectWidget") return "content/[name].js";
          return "assets/[name]-[hash].js";
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
});
