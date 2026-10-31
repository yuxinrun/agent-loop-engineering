import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Fonts are small enough to inline, keeping dist/index.html fully self-contained.
    assetsInlineLimit: 120 * 1024,
  },
});
