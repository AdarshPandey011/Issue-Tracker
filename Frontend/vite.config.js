import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Proxy configuration
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Flask server URL
        changeOrigin: true,              // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional: remove "/api" prefix
      },
    },
  },
});
