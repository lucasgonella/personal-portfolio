import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    assetsDir: 'gonella-portfolio-v1',
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 650,
  },
})
