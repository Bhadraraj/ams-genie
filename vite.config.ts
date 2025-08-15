// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],  
  },
  server: {
    proxy: {
      '/api/errors': {  
        target: 'https://api-config.amsgenius.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/errors/, '/api/errors'),
      },
      '/api/images': {  
        target: 'https://api-config.amsgenius.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/images/, '/api/images'),
      },
    },
  },
});