import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/static/',  // This is critical for Django
  build: {
    outDir: '../backend/staticfiles',  // Build directly into Django's staticfiles
    emptyOutDir: true,
    manifest: true,
  }
})