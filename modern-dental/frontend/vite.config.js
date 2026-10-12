import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { open: true, proxy: { '/api': 'http://localhost:5000' } },
  build: { rollupOptions: { output: { manualChunks: { three: ['three'], r3f: ['@react-three/fiber', '@react-three/drei'] } } } },
});
