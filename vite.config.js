import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    proxy: {
      "/api": {
        target: "https://movieapp-tu5n.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
