import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }]
        ]
      }
    }),tailwindcss(),],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './core'),
      '@shared': path.resolve(__dirname, './core/shared'),
      '@adapter': path.resolve(__dirname, './adapter')
    }
  },
  build: {
    minify: true,
    sourcemap: true, // Pour faciliter le debugging en prod
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // autres chunks si nécessaire
        }
      }
    }
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/zip',
    },
  }
});
