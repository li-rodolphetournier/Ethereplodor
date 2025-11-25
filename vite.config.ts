import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es', // Pour Web Workers
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-vendor': ['react', 'react-dom'],
          'r3f': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});

