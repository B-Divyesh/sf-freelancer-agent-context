import { defineConfig } from 'vite';

export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
  build: {
    outDir: 'dist/site',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    rollupOptions: { output: { assetFileNames: 'assets/[name]-[hash][extname]' } }
  }
});
