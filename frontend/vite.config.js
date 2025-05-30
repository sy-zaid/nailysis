import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/static/", // Important - matches Django's STATIC_URL
  build: {
    outDir: "../frontend/dist", // Where Django expects the files
    emptyOutDir: true,
    manifest: true, // Helps with cache busting
  },
});
