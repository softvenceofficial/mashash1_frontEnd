import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/media': {
        target: 'https://api.serverforaibook.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/api': {
        target: 'https://api.serverforaibook.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['react-apexcharts', 'apexcharts'],
    exclude: []
  },
});
