import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://trackon-web-backend.onrender.com',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://trackon-web-backend.onrender.com',
        ws: true,
      }
    }
  }
});
