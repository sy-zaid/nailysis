import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/static/", // This is critical for Django
  build: {
    outDir: './dist', // Build directly into Django's staticfiles
    emptyOutDir: true,
    manifest: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://nailysis.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api if backend expects clean paths
      },
    },
  },
});
