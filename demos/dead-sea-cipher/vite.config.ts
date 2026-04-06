import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dead-sea-cipher/',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  test: {
    globals: true,
    environment: 'node',
  },
} as any);
