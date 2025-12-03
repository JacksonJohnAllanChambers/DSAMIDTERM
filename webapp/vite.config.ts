import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // Change 'DSAMIDTERM' to your actual repository name
  base: process.env.NODE_ENV === 'production' ? '/DSAMIDTERM/' : '/',
  server: {
    proxy: {
      // Forward API calls during development to the Express server
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      }
    }
  }
})
